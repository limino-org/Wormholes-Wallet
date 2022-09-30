<template>
  <div class="receive-page">
    <div class="card card1">
      <div class="card-tit ctit1">
        <img src="./../imgs/left-top.png" class="bg" alt="" />
        <img v-if="locale == 'en'" src="./../imgs/tit1.png" alt="" />
        <img v-else src="./../imgs/tit1_cn.png" alt="" />
      </div>

      <div class="list">
      <div class="receive-addr ml-20 mr-20 pb-12">
        <div class="addr-tit flex between center-v">
          <span class="f-14 lh-20 text-bold ">{{t('receiveRewards.addrTit')}}</span> <span class="copy-box"><i class="iconfont icon-copy hover" @click="copyAddr"></i></span>
          </div>
        <div class="addr-value f-12 lh-16 mt-6">{{address}}</div>
      </div>
        <div class="list-card flex between">
          <div class="info flex">
            <div class="icon-box flex center">
              <img src="./../imgs/icon1.png" alt="" />
            </div>
            <div class="text-info flex between column">
              <div class="text-info-tit">{{ t("receiveRewards.snfttit") }}</div>
              <div class="text-info-text">
                {{ t("receiveRewards.snftext", { num: userInfo.snft || 0 }) }}
              </div>
            </div>
          </div>
          <div class="flex center btn-box">
            <div :class="`btn ${disabled1 ? 'disabled' : ''} `" @click="send1">
              {{
                disabled1
                  ? t("receiveRewards.hasBrought")
                  : t("receiveRewards.toReceive")
              }}
            </div>
          </div>
        </div>
        <div class="list-card flex between">
          <div class="info flex">
            <div class="icon-box flex center">
              <img src="./../imgs/icon2.png" alt="" />
            </div>
            <div class="text-info flex between column">
              <div class="text-info-tit">
                {{ t("receiveRewards.exchangetit") }}
              </div>
              <div class="text-info-text">
                {{
                  t("receiveRewards.exchangetext", { num: userInfo.exchange || 0 })
                }}
              </div>
            </div>
          </div>
          <div class="flex center btn-box">
            <div :class="`btn ${disabled2 ? 'disabled' : ''}`" @click="send2">
              {{
                disabled2
                  ? t("receiveRewards.hasBrought")
                  : t("receiveRewards.toReceive")
              }}
            </div>
          </div>
        </div>
        <div class="list-card flex between">
          <div class="info flex">
            <div class="icon-box flex center">
              <img src="./../imgs/icon3.png" alt="" />
            </div>
            <div class="text-info flex between column">
              <div class="text-info-tit">{{ t("receiveRewards.erbtit") }}</div>
              <div class="text-info-text">
                {{ t("receiveRewards.erbtext", { num: userInfo.erb || 0 }) }}
              </div>
            </div>
          </div>
          <div class="flex center btn-box">
            <div :class="`btn ${disabled3 ? 'disabled' : ''}`" @click="send3">
              {{
                disabled3
                  ? t("receiveRewards.hasBrought")
                  : t("receiveRewards.toReceive")
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card card2">
      <div class="card-tit ctit2">
        <img src="./../imgs/left-top2.png" class="bg" alt="" />

        <img v-if="locale == 'en'" src="./../imgs/tit2.png" alt="" />
        <img v-else src="./../imgs/tit2_cn.png" alt="" />
      </div>
      <div class="list">
        <div class="info-card">
          <div class="info-card-tit">{{ t("receiveRewards.tiptit1") }}</div>
          <div class="info-card-text">
             <i18n-t keypath="receiveRewards.tip1" tag="div">
              <template v-slot:br>
                <br /><br />
              </template>
            </i18n-t>
          </div>
        </div>
        <div class="info-card">
          <div class="info-card-tit">{{ t("receiveRewards.tiptit2") }}</div>
          <div class="info-card-text">
            <i18n-t keypath="receiveRewards.tip2" tag="div">
              <template v-slot:br>
                <br /><br />
              </template>
            </i18n-t>
            
          </div>
        </div>
        <div class="info-card">
          <div class="info-card-tit">{{ t("receiveRewards.tiptit3") }}</div>
          <div class="info-card-text">
            {{ t("receiveRewards.tip3") }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="btn-groups">
    <div class="container flex between pl-14 pr-14">
      <div class="btn-ele btn1 hover" @click="toWallet">{{t('receiveRewards.toWallet')}}</div>
      <div class="btn-ele btn2 hover" @click="toExchange">{{t('receiveRewards.toExchange')}}</div>
    </div>
  </div>
  <!-- dialog -->
  <transition name="fade">
    <div v-if="successModal" class="mask flex center">
      <div class="modal-container">
        <div class="modal-container-header"></div>
        <div class="modal-container-icon flex center">
          <div class="icon flex center">
            <img src="./../imgs/btnright.png" alt="" />
          </div>
        </div>
        <div class="msg text-center">{{ t("receiveRewards.success") }}</div>
        <div class="btn-box flex center">
          <div class="btn-done text-center hover" @click="successModal = false">
            {{ t("receiveRewards.confirm") }}
          </div>
        </div>
      </div>
    </div>
  </transition>
  <transition name="fade">
    <div v-if="failModal" class="mask flex center">
      <div class="modal-container">
        <div class="modal-container-header"></div>
        <div class="modal-container-icon flex center">
          <div class="icon flex center">
            <van-icon name="fail" />
          </div>
        </div>
        <div class="msg text-center">{{ t("receiveRewards.fail") }}</div>
        <div class="btn-box flex center">
          <div class="btn-done text-center hover" @click="failModal = false">
            {{ t("receiveRewards.confirm") }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { queryuseraward, receiveuseraward } from "@/http/modules/common";
import { computed, onMounted, Ref, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { getWallet } from "@/store/modules/account";
import { Icon as vanIcon, Toast } from "vant";

import { useRoute } from "vue-router";
import { ethers } from "ethers";
import useClipboard from 'vue-clipboard3'
import { useToast } from "@/plugins/toast";
// import router from "@/router";
import { useRouter } from "vue-router";
import { VUE_APP_EXCHANGES_URL } from "@/enum/env";
const { state } = useStore();
const wallet: Ref<any> = ref(null);
const address = state.account.accountInfo.address;

const router = useRouter()
const toHex = (num: number) => {
  return "0x" + num.toString(16);
};

const { toClipboard } = useClipboard()


// snft exchange erb
const { t, locale } = useI18n();
const receiveAward = async (award_type: string) => {
  const params = {
    user_addr: address,
    award_type,
    period: userInfo.value.period.toString(),
  };
  Toast.loading({
    message: t("wallet.loading"),
    forbidClick: true,
    duration: 0,
  });
  try {
 
  } catch (err: any) {
    if (!window.ethereum) {
      Toast(t('common.installMetaMask'));
    } else {
      Toast(err.toString());
    }
    return;
  }
  try {
    await receiveuseraward({ ...params });
    successModal.value = true;
  } catch (err: any) {
    console.log(err.msg);
    failModal.value = true;
  } finally {
    Toast.clear();
    getAwardInfo();
  }
};
const getAwardInfo = async () => {
  try {
    const { data } = await queryuseraward(address.toString());
    const [d] = data;
    userInfo.value = d || {};
    console.warn("d", d);
  } catch (err: any) {
    console.log(err.msg);
  }
};
const disabled1 = computed(() => {
  return !userInfo.value.snft || userInfo.value.snfttime;
});
const disabled2 = computed(() => {
  return (
    !userInfo.value.exchange ||
    userInfo.value.exchange == 0 ||
    userInfo.value.exchangetime
  );
});
const disabled3 = computed(() => {
  return !userInfo.value.erb || userInfo.value.erbtime;
});

const send1 = async () => {
  console.log("Receive SNFT");
  if (disabled1.value) {
    return;
  }
  await receiveAward("snft");
};
const send2 = async () => {
  console.log("Gift Exchange");
  if (disabled2.value) {
    return;
  }
  await receiveAward("exchange");
};
const send3 = async () => {
  console.log("Get The ERB");
  if (disabled3.value) {
    return;
  }
  await receiveAward("erb");
};
const userInfo: Ref<any> = ref({});
const successModal = ref(false);
const failModal = ref(false);
const {$toast} = useToast()
const copyAddr = async() => {
  try {
    await toClipboard(address.toString() || '')
    $toast.success(t('copy.copy'))
  }catch(err){
    console.error(err)
  }
}
const toExchange = () => {
  window.open(`${VUE_APP_EXCHANGES_URL}/c${address.toLowerCase()}/#/`)
}
const toWallet = () => {
  router.replace({name:"wallet"})
}
onMounted(async () => {
  wallet.value = await getWallet();
  getAwardInfo();
});
</script>
<style lang="scss" scoped>
.receive-addr {
  border-bottom: 1px solid #fff;
  .copy-box {
    i {
      font-size: 19px;
      font-weight: bold;
    }
  }
}
.receive-page {
  background: url(./../imgs/bg.png) no-repeat;
  background-size: cover;
  min-height: 100vh;
  padding: 380px 15px 100px;
}
.ctit1 {
  position: relative;
  .bg {
    margin: 0;
    position: absolute;
    left: -2px;
    top: -2px;
    height: 42px;
    z-index: 1;
  }
}
.ctit2 {
  position: relative;
  .bg {
    margin: 0;
    position: absolute;
    left: -2px;
    top: -2px;
    height: 42px;
    z-index: 1;
  }
}
.card1 {
  background-image: linear-gradient(90deg, #fceafc 40%, #fefcfe 100%);
  min-height: 280px;
  margin: 0 auto 20px;
  border-radius: 10px;
  border: 2px solid #fff;
  .list {
    margin-top: 50px;
  }
}
.card2 {
  background-image: linear-gradient(90deg, #effcfd 60%, #ffffff 100%);
  border-radius: 10px;
  min-height: 330px;
  margin: 0 auto 20px;
  border: 2px solid #fff;
  .list {
    margin-top: 60px;
  }
}
.card-tit {
  img {
    position: absolute;
    height: 22px;
    left: 10px;
    top: 4px;
    z-index: 1;
  }
}
.card2 {
  margin-bottom: 0;
}
.list-card {
  padding-bottom: 14px;
  padding-top: 14px;
  margin-left: 20px;
  margin-right: 20px;
  border-bottom: 1px solid #fff;
  &:nth-last-of-type(1) {
    border-bottom: none;
  }
  img {
    width: 42px;
    height: 42px;
  }
  .text-info {
    margin-left: 11px;
    padding: 3px 0;
    &-tit {
      font-size: 14px;
      font-weight: bold;
    }
    &-text {
      font-size: 12px;
    }
  }
  .btn {
    width: 87px;
    height: 25px;
    line-height: 25px;
    border-radius: 12.5px;
    background: url(./../imgs/btn-bg.png) no-repeat;
    background-size: cover;
    color: #fff;
    text-align: center;
    cursor: pointer;
    font-size: 12px;
    &.disabled {
      background: #d9d9d9;
      cursor: not-allowed;
      color: #8c8c8c;
    }
  }
}
.info-card {
  font-size: 12px;
  padding: 0 12px 0 20px;
  &:nth-of-type(1) {
    margin-top: 35px;
  }
  &-tit {
    line-height: 20px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  &-text {
    margin-bottom: 15px;
    font-size: 12px;
    line-height: 15px;
  }
}
.mask {
  background: rgba($color: #000000, $alpha: 0.6);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  z-index: 100;
  .modal-container {
    width: 250px;
    min-height: 200px;
    padding-bottom: 27px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    &-header {
      height: 43px;
      background: linear-gradient(90deg, #34f3ff 0%, #ff9de9 100%);
    }
    &-icon {
      .icon {
        background: linear-gradient(
          178deg,
          #7bffcf 0%,
          #ff53f8 91%,
          #ff85cc 91%
        );
        width: 41px;
        height: 41px;
        border-radius: 50%;
        position: relative;
        margin-top: 23px;
        img {
          width: 100%;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
        i {
          color: #fff;
          font-size: 30px;
        }
      }
    }
    .msg {
      margin-top: 13px;
      line-height: 14px;
      color: #0f0f0f;
      padding: 0 20px;
      // font-size: 12px;
    }
    .btn-done {
      line-height: 31px;
      background: linear-gradient(90deg, #34f3ff 0%, #ff9de9 100%);
      border-radius: 15px;
      width: 104px;
      color: #fff;
      margin-top: 13px;
      // font-size: 12px;
    }
  }
}
.btn-groups {
  position: fixed;
  bottom: 20px;
  z-index: 1000;
  left: 0;
   right: 0;
   .btn-ele {
    width: 164px;
    line-height: 54px;
    height: 54px;
    border-radius: 28px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    transition: ease .3s;
    &:hover {
      box-shadow:1px 5px 10px rgb(135 134 134 / 50%);
    }
   }
   .btn-ele.btn1 {
    background: linear-gradient(to right, #5ae5f8 0%, #a8c3f4 50%, #eea3eb 100%);
   }
  .btn-ele.btn2 {
    background: linear-gradient(to right, #fca7f5 0%, #fdcfe6 50%, #fff3da 100%);
   }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>