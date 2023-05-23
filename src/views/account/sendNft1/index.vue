<template>
  <div class="send-nft1">
    <van-sticky>
      <NavHeader>
        <template v-slot:left>
          <van-icon name="arrow-left" class="back" @click="handleLeft" />
        </template>
        <template v-slot:right>
          <span @click="hanndleClose" class="close">
            {{ t("sendNft.cancel") }}
          </span>
        </template>
      </NavHeader>
    </van-sticky>

    <van-form @submit="onSubmit" @failed="failed" ref="form">
      <van-sticky position="top" offset-top="48px">
        <div class="code-box">
          <div class="code van-hairline--surround">
            <div class="code-t flex between" @click="handleShowAccountModal">
              <div class="info flex center-v">
                <div class="icon">
                  <AccountIcon :data="accountInfo.icon" size="mini" />
                </div>
                <div class="desc flex column between">
                  <div class="name">{{ accountInfo.name }}</div>
                  <div class="add">{{ addressMask(accountInfo.address) }}</div>
                </div>
              </div>
              <div class="select flex center">
                <van-icon name="arrow-down" v-show="!showModal" />
                <van-icon name="arrow-up" v-show="showModal" />
              </div>
            </div>
            <div class="line">
              <div class="van-hairline--top l-div"></div>
              <span> {{ t("sendNft1.to") }}</span>
            </div>
            <div class="code-b">
              <van-field
                v-model="toAddress"
                :placeholder="$t('sendNft1.add')"
                :rules="[
                  { required: true, message: '' },
                  { validator: asyncaddress },
                ]"
              />
              <van-icon
                name="cross"
                @click="toAddress = ''"
                v-show="checkAdd && toAddress"
              />
            </div>
          </div>
          <!-- <div class="select flex center">
            <van-icon name="arrow-down" v-show="!showModal" />
            <van-icon name="arrow-up" v-show="showModal" />
          </div> -->
        </div>
        <!-- <div class="line">
          <div class="van-hairline--top l-div"></div>
          <span>
          {{t('sendNft.to')}}
          </span>
        </div>
        <div class="code-b">
          <van-field
            v-model="toAddress"
            placeholder="Add to Input"
            :rules="[
              { required: true, message: '' },
              { validator: asyncaddress },
            ]"
          />
          <van-icon
            name="cross"
            @click="toAddress = ''"
            v-show="checkAdd && toAddress"
          />
        </div> -->
      </van-sticky>

      <div class="add-error flex" v-show="!checkAdd">
        <div class="icon-box flex center">
          <van-icon name="info" />
        </div>
        <div class="text">
          {{ t("sendNft.title") }}
        </div>
      </div>
      <van-tabs v-model:active="active" sticky shrink offset-top="228px">
        <van-tab name="1" :title="$t('sendNft1.my')">
          <AccountList @handleClick="handleClickAccount" />
        </van-tab>
        <van-tab name="2" :title="$t('sendNft1.recent')"></van-tab>
        <van-tab name="3" :title="$t('sendNft1.contacts')"></van-tab>
      </van-tabs>

      <van-sticky offset-bottom="30px" position="bottom">
        <div class="btn-box">
          <van-button
            type="primary"
            :loading="loading"
            block
            native-type="submit"
          >
            {{ t("sendNft.send") }}
          </van-button>
        </div>
      </van-sticky>
    </van-form>
  </div>

  <AccountModal v-model:show="showModal" @close="closeModal" />
</template>
<script lang="ts">
import { showSlider, show } from "@/components/navHeader/hooks/slider";
import AccountModal from "@/components/accountModal/index.vue";
import {
  Tab,
  Tabs,
  Popup,
  Icon,
  Dialog,
  Sticky,
  Toast,
  Loading,
  Empty,
  Form,
  Field,
  Button,
} from "vant";
import {
  ref,
  Ref,
  reactive,
  onMounted,
  computed,
  toRefs,
  watch,
  onBeforeMount,
} from "vue";
import { AccountInfo } from "@/store/modules/account";
import AccountIcon from "@/components/accountIcon/index.vue";
import NavHeader from "@/components/navHeader/index.vue";
import AccountList from "@/views/account/components/accountList/index.vue";
import { getWallet } from "@/store/modules/account";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { addressMask, decimal } from "@/utils/filters";
import { utils, ethers } from "ethers";
import { toHex } from "@/utils/utils";
import { WASI } from "wasi";
import { useI18n } from "vue-i18n";
export default {
  components: {
    NavHeader,
    [Icon.name]: Icon,
    [Sticky.name]: Sticky,
    [Field.name]: Field,
    [Form.name]: Form,
    [Button.name]: Button,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    AccountIcon,
    AccountList,
    AccountModal,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const { query } = route;
    const store = useStore();
    const { dispatch } = store;
    const { nft_address }: any = query;
    const accountInfo = computed(() => store.state.account.accountInfo);
    const toAddress = ref("");
    const checkAdd = ref(true);

    const active = ref("");
    const loading = ref(false);
    const handleLeft = () => {
      router.back();
    };
    const onSubmit = async () => {
      loading.value = true;
      const { address } = query;
      const wallet = await getWallet();
      const str = `wormholes:{"version": "v0.0.1","type": 1,"nft_address":"${address}"}`;
      const data = toHex(str);
      const tx1 = {
        from: wallet.address,
        to: toAddress.value,
        data: `0x${data}`,
      };
      console.log("tx1", tx1);
      wallet
        .sendTransaction(tx1)
        .then(({ hash }: any) => {
          wallet.provider.waitForTransaction(hash, null, 60000).then((receipt: any) => {
            const { status } = receipt;
            if (status == 0) {
              Toast(t("sendNft.transferfailed"));
              loading.value = false;
              return;
            }
            Toast(t("sendNft.transfersucceeded"));
            loading.value = false;
            router.replace({ name: "wallet" });
          });
        })
        .catch((err: any) => {
          Toast(err.reason);
          loading.value = false;
        });
    };
    // The click account event triggered by the child component
    const handleClickAccount = (item: AccountInfo) => {
      toAddress.value = item.address;
      dispatch("common/scrollTop");
    };
    const asyncaddress = (val: string) => {
      try {
        checkAdd.value = true;
        utils.getAddress(val);
      } catch {
        checkAdd.value = false;
        return "";
      }
    };
    const hanndleClose = () => {
      router.replace({ name: "wallet" });
    };
    const showModal: Ref<boolean> = ref(false);
    const handleShowAccountModal = () => {
      showModal.value = true;
    };
    const closeModal = () => {
      showModal.value = false;
    };
    const failed = (e: any) => {
      // debugger;
    };
    return {
      t,
      handleLeft,
      hanndleClose,
      accountInfo,
      checkAdd,
      showModal,
      handleShowAccountModal,
      closeModal,
      toAddress,
      asyncaddress,
      onSubmit,
      active,
      addressMask,
      handleClickAccount,
      loading,
      failed,
    };
  },
};
</script>
<style lang="scss" scoped>
.send-nft1 {
  .back {
    font-size: 18px;
    color: #9F54BA;
  }
  .close {
    color: #9F54BA;
    font-size: 12px;
  }
  .code-box {
    padding: 15px;
    box-sizing: border-box;
    background: #fff;
  }
  .code {
    height: 150px;
    box-sizing: border-box;
    border-radius: 7px;
    padding: 15px;
    box-sizing: border-box;
    &:after {
      border-radius: 5px;
    }
    .line {
      height: 24px;
      position: relative;
      .l-div {
        position: absolute;
        left: 15px;
        right: 15px;
        top: 12px;
      }
      //   &:after {
      //     content: "";
      //     display: block;
      //     position: absolute;
      //     height: 0px;
      //     right: 15px;
      //     left: 15px;
      //     top: 12px;
      //   }
      span {
        font-size: 12px;
        position: absolute;
        display: inline-block;
        line-height: 24px;
        width: 40px;
        left: 50%;
        margin-left: -20px;
        z-index: 9;
        text-align: center;
        background: #fff;
        margin-right: 0;
      }
    }
    .code-t {
      .info {
        .icon {
          margin-left: 11px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #9F54BA;
        }
        .desc {
          padding: 6px 0;
          margin-left: 5px;
          max-width: 250px;
          font-size: 12px;
          & > div {
            line-height: 17px;
          }
          .add {
            color: rgba(154, 154, 154, 1);
          }
        }
      }
      .select {
        color: #9F54BA;
        font-size: 18px;
      }
    }
    .code-b {
      position: relative;
      :deep(.van-field__control) {
        text-overflow: ellipsis;
      }
      .van-form {
        margin-right: 20px;
      }
      i {
        color: #9F54BA;
        position: absolute;
        right: 0;
        top: 14px;
        font-size: 18px;
      }
    }
  }
  .add-error {
    padding: 12px 15px;
    width: 345px;
    background: #fbf2f3;
    border-radius: 7px;
    margin: 10px 15px;
    line-height: 20px;
    box-sizing: border-box;
    font-size: 12px;
    .icon-box {
      padding: 0 8px 0 0;
      i {
        font-size: 20px;
        color: rgba(255, 0, 0, 0.76);
      }
    }
    .text {
    }
  }
  :deep(.van-tab--active) {
    color: #9F54BA;
  }
  :deep(.van-tabs__line) {
    display: none;
  }
  .btn-box {
    padding: 0 15px;
  }
  .van-tabs {
    margin-bottom: 50px;
  }
}
</style>