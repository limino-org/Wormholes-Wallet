<template>
  <van-sticky>
    <NavHeader title="Close" :hasRight="false" :hasLeft="true"  cancelRouteName="wallet">
      <template v-slot:left>
       <span class="back hover f-12" @click="appProvide.back">{{t('createAccountpage.back')}}</span>
      </template>
      <template v-slot:title>
        <div class="flex center title">{{t('receive.receive')}}</div>
      </template>
    </NavHeader>
  </van-sticky>
  <div class="page-send-link">
    <div class="link-bg">
      <div class="flex center icon-con mb-14">
        <i class="iconfont icon-fenxiang1 f-28"></i>
      </div>
      <div class="text-center link-title">{{ t("receive.sendLink") }}</div>
    <div class="send-tip">
      {{ t("receive.sendTip") }}
    </div>
    </div>
    <div>
      <div class="pl-20 pr-20">
        <a
          class="send-link-a"
          :href="sendLink"
          target="_blank"
          rel="noopener noreferrer"
          >{{ sendLink }}</a
        >
      </div>
    </div>
  </div>
  <div class="btn-group">
    <div class="container pl-24 pr-24">
      <van-button  plain  block @click="copy">
      <i class="iconfont icon-copy"></i>
      {{
        t("receive.copyTip")
      }}</van-button>
    </div>
  </div>
  <div class="code-inner">
    <transition name="fade">
      <div
        class="code-mask flex center"
        v-if="codeShow"
        @click="codeShow = false"
      >
        <div class="code-box">
          <div class="text-center tit flex center">
            {{ t("receive.reqecode")
            }}<van-icon name="cross" class="ml-4" @click="codeShow = false" />
          </div>
          <div class="code-ele flex center">
            <qrcode-vue
              :value="codeData"
              class="code"
              :size="230"
              level="L"
              ref="coderef"
            ></qrcode-vue>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <dialog-warning
    v-model:isWarning="isWarning"
    :text="t('receive.copyTip')"
    iconName="checked"
    color="#3AAE55"
  >
  </dialog-warning>
</template>
<script setup lang="ts">
import {
  Button as vanButton,
  Icon as vanIcon,
  Field as vanField,
  Toast,
  Dialog as vanDialog,
  Sticky as vanSticky
} from "vant";
import QrcodeVue from "qrcode.vue";
import dialogWarning from "@/components/dialogWarning/message.vue";
import useClipboard from "vue-clipboard3";
import NavHeader from '@/components/navHeader/index.vue'
import { useI18n } from "vue-i18n";
import { ref, Ref } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { computed } from "@vue/runtime-core";
import { inject } from 'vue'

import { AppProvide } from "@/provides/app";

const query = useRoute().query;
const { t } = useI18n();
const appProvide: any = inject('appProvide')
const { toClipboard } = useClipboard();
const copy = async () => {
  try {
    await toClipboard(`${sendLink.value}`);
    isWarning.value = true;
  } catch (err: any) {
    Toast(err.toString());
  }
};
const coderef = ref(null);

const codeShow: Ref<boolean> = ref(false);
const codeData = ref(query.code?.toString());
const code: any = ref(JSON.parse(query.code?.toString() || "{}"));
const amount = ref(code.value.data.value);
const symbol = ref(code.value.data.symbol);
const tokenContractAddress = ref(code.value.data.tokenContractAddress);
const address = ref(code.value.data.address);
const handlerQRcode = () => {
  codeShow.value = true;
};
const sendLink = computed(() => {
  return `${location.origin}${location.pathname}/#/transferAccount/send?value=${amount.value}&tokenContractAddress=${tokenContractAddress.value}&address=${address.value}&action=transfer`;
});
const isWarning = ref(false);
</script>
<style lang="scss">
.title {
    font-size: 16px;
    color: #000;
    font-weight: bold;
}
.link-bg {
  background: #F4FAFF;
  height: 150px;
  padding-top: 25px;
  .icon-con {
    i {
      color: #037cd6;
      font-size: 28px;
    }
  }
}
.page-send-link {
  
}
.send-tip {
  margin: 0 auto;
  width: 50%;
  font-size: 12px;
  color: #888d94;
  text-align: center;
}
.send-link-a {
  color: #037cd6;
  font-size: 12px;
  margin-top: 22px;
  text-align: center;
  display: block;
  width: 100%;
  line-height: 16px;
  word-break: break-all;
  &:hover {
    text-decoration: underline;
  }
}
.btn-group {
  position: fixed;
  bottom: 25px;
  left: 0;
  right: 0;
}
.link-title {
  font-size: 14px;
  margin-bottom: 15px;
  font-weight: 600;
}
.code-mask {
  background: rgba($color: #000000, $alpha: 0.5);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2003;
  .code-box {
    width: 322px;
    height: 332px;
    background: #fff;
    padding: 20px 30px 23px;
    border-radius: 15px;
    .tit {
      font-size: 13px;
      i {
        font-size: 18px;
        color: #0287db;
      }
    }
    .code-ele {
      border-radius: 4px;
      border: 1px solid #e4e3e3;
      height: 263px;
      width: 263px;
      margin: 12px auto 0;
    }
  }
}
</style>