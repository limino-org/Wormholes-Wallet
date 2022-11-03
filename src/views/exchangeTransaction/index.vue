<template>
    <NavHeader :hasRight="false">
      <template v-slot:left>
        <div class="flex center cancel" @click="clickLeft">
          {{ t("common.back") }}
        </div>
      </template>
    </NavHeader>
  <div class="page-container">
    <div class="userinfo">
      <div class="from mb-10 mt-20">
        <div class="userfrom flex center">{{ t("sendto.from") }}:</div>
        <div class="information van-hairline--surround flex center-v">
          <div class="flex center-v">
            <div class="avatar flex center ml-10">
              <AccountIcon :data="accountInfo.icon" size="mini" />
            </div>
            <div class="flex column userinformation ml-10 between">
              <div class="username">{{ accountInfo.name }}</div>
              <div class="userbalance">
                {{ t("sendto.balance") }}:{{ decimal(accountInfo.amount) }}
                {{ currentNetwork.currencySymbol }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="to from mb-10">
        <div class="sendto flex center">{{ t("sendto.to") }} :</div>
        <div class="information van-hairline--surround flex center-v">
          <div class="flex center-v">
            <div class="avatar flex center ml-10">
              <AccountIcon :data="toAccount.data.icon" size="mini" />
            </div>
            <div class="flex center-v userinformation ml-10">
              <!-- <div class="username">to</div> -->
              <div class="userbalance">
                {{ toAddress }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="btn-groups">
    <div class="container pl-28 pr-28">
      <van-button type="primary" @click="gonext" block>{{
        t("sendto.next")
      }}</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  reactive,
  ref,
  computed,
  Ref,
  onActivated,
  onMounted,
  onBeforeMount,
  nextTick,
} from "vue";
import { Icon, Toast, Button, Sticky, Field } from "vant";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import NavHeader from "@/components/navHeader/index.vue";
import AccountIcon from "@/components/accountIcon/index.vue";
import TransactionConfirm from "@/views/account/components/transactionConfirm/index.vue";
import { addressMask, getestimateGas, decimal } from "@/utils/filters";
import { ethers, utils } from "ethers";
import { web3 } from "@/utils/web3";
import { getWallet,clone, TransactionTypes } from "@/store/modules/account";
import { useI18n } from "vue-i18n";
import { getRandomIcon } from "@/utils/index";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";
import { decode } from 'js-base64';

export default {
  name: "pageSendComfirm",
  components: {
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Field.name]: Field,
    NavHeader,
    AccountIcon,
    TransactionConfirm,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const { t } = useI18n();
    const { dispatch } = store;
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const route = useRoute();
    const { query } = route;
    const { from, to, data, value }: any = query.tx
      ? JSON.parse(query.tx.toString())
      : {};
    const { backUrl }: any = query;
    const clickRight = () => {
      router.replace({ name: "wallet" });
    };
    const clickLeft = () => {
      router.replace({ name: "wallet" });
    };
    const toAccount: any = reactive({
      data: {
        icon: getRandomIcon(),
      },
    });
    const toAddress: Ref<string> = ref(to || "");
    const { $tradeConfirm } = useTradeConfirm();
    const gonext = async () => {
      $tradeConfirm.open();
      const tx1 = {
        data,
        to,
        from,
        value,
        callBack: () => {
          $tradeConfirm.update({
            status: "approve",
          });
        },
      };
      try {
        // @ts-ignore
        const network = clone(store.state.account.currentNetwork)
        const receipt = await dispatch("account/sendTransaction", tx1);
        const { from, gasLimit, gasPrice, hash, nonce, to, type, value,error } = receipt;
        store.commit("account/PUSH_TXQUEUE", {
          hash,
          from,
          gasLimit,
          gasPrice,
          nonce,
          to,
          type,
          value,
          txType: TransactionTypes.default,
          transitionType: null,
          network
        });
        const back = decode(backUrl)
        const newBack =`${back}${back.indexOf('?') > -1 ? '&' : '?'}` 
        $tradeConfirm.update({
          status: "success",
          callBack: () => {
            location.href = `${newBack}action=sendTransaction&data=${encodeURIComponent(
              JSON.stringify({
                receipt,
              })
            )}`;
          },
        });
      } catch (err: any) {
        console.error(err);
        $tradeConfirm.update({
          status: "fail",
          failBack: () => {
            location.href = `${decode(backUrl?.toString() || '')}?action=sendTransaction&data=${encodeURIComponent(
              JSON.stringify({
                status: 0,
              })
            )}`;
          },
        });
      } finally {
      }
    };

    return {
      t,
      clickRight,
      clickLeft,
      gonext,
      accountInfo,
      toAddress,
      toAccount,
      addressMask,
      decimal,
      currentNetwork,
    };
  },
};
</script>

<style lang="scss" scoped>
.cancel {
  font-size: 11px;
  color: #037cd6;
}
.btn-group {
  padding: 0 15px;
}
.userinfo {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-bottom: 1px solid rgba(216, 216, 216, 1);
}

.from {
  display: flex;
  justify-content: space-around;

  .userfrom {
    font-size: 12px;
    width: 76px;
    text-align: center;
  }
  .information {
    border-collapse: collapse;
    width: 100%;
    height: 50px;
    margin-right: 13px;
    position: relative;
    .closeIcon {
      position: absolute;
      right: 10px;
      top: 14px;
      font-size: 18px;
      color: #6a737d;
    }
    &::after {
      border-radius: 10px;
    }
    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid rgba(3, 125, 214, 1);
    }
    .userinformation {
      height: 34px;
      .username {
        font-size: 12px;
      }
      .userbalance {
        font-size: 10px;
        color: rgba(132, 140, 150, 1);
      }
    }
  }
}
.to {
  display: flex;
  justify-content: space-between;
  padding-right: 0;
  .sendto {
    font-size: 12px;
    width: 76px;
    text-align: center;
  }
  .add-ipt {
    width: 100%;
    margin-right: 13px;
    height: 45px;
    &::after {
      border-radius: 10px;
    }
  }
  .receiver {
    font-size: 12px;
    text-align: center;
    line-height: 46px;
    width: 286px;
    height: 46px;
    border-radius: 10px;
    border: 1px solid rgba(209, 212, 215, 1);
  }
}
.transfer {
  height: 40px;
  line-height: 40px;
  margin-left: 15px;
  font-size: 12px;
  color: rgba(7, 118, 211, 1);
}
.useravatar {
  width: 30px;
  height: 30px;
  background-color: green;
}
.recent {
  .text {
    width: 100%;
    background-color: rgba(241, 243, 244, 1);
    border: 1px solid rgba(216, 216, 216, 1);
    height: 28px;
    line-height: 28px;
    font-size: 10px;
    color: rgba(121, 121, 121, 1);
    padding-left: 15px;
  }
  .recent-user-information {
    height: 59px;
    border-bottom: 1px solid rgba(216, 216, 216, 1);

    .recent-avatar {
      margin: 15px 11px 330px 15px;
      width: 30px;
      height: 30px;
      background-color: pink;
      border-radius: 50%;
    }
    .recent-name {
      margin-top: 15px;
      font-size: 12px;
      letter-spacing: 1.5px;
    }
    .recent-address {
      margin-top: 5px;
      font-size: 10px;
    }
  }
}
.myself {
  .text {
    width: 100%;
    background-color: rgba(241, 243, 244, 1);
    border: 1px solid rgba(216, 216, 216, 1);
    height: 28px;
    line-height: 28px;
    font-size: 10px;
    color: rgba(121, 121, 121, 1);
    padding-left: 15px;
  }
  .myself-information {
    height: 59px;
    border-bottom: 1px solid rgba(216, 216, 216, 1);

    .myself-avatar {
      margin: 15px 11px 330px 15px;
      width: 30px;
      height: 30px;
      background-color: pink;
      border-radius: 50%;
    }
    .myself-name {
      margin-top: 15px;
      font-size: 12px;
      letter-spacing: 1.5px;
    }
    .myself-address {
      margin-top: 5px;
      font-size: 10px;
    }
  }
}
.next {
  position: absolute;
  left: 25px;
  top: 600px;
  width: 325px;
  height: 45px;
}
</style>