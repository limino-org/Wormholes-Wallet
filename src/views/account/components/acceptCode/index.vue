<template>
  <div class="accept-popup">
    <div class="accept-popup-top van-hairline--top-bottom flex center">
      <div class="short-line"></div>
    </div>
    <div class="text-center accept-popup-tit">{{ t("receive.receive") }}</div>
    <div class="flex center">
      <div class="code">
        <qrcode-vue :value="codeData" class="code" :size="300" level="L" ref="coderef"></qrcode-vue>
      </div>
    </div>
    <div class="text-center scan-code-tit">{{ t("send.sendtitle") }}</div>
    <div class="flex center">
      <div class="flex copy-info center" @click="toCopy">
        <div class="address">{{ addressMask(accountInfo.address) }}</div>
        <!-- <span class="copy-btn" @click="toCopy">{{ t("send.tocopy") }}</span> -->
        <!-- <van-icon name="share-o" /> -->
        <!-- <i class="iconfont icon-fenxiang"></i> -->
      </div>
    </div>
    <div class="request-box">
      <van-button plain block type="primary" @click="toPayment">{{
        t("send.sendbutton")
      }}</van-button>
    </div>
  </div>
      <dialog-warning
      v-model:isWarning="isWarning"
      :text="t('copy.copy')"
      iconName="checked"
      color="#3AAE55"
    >
    </dialog-warning>
</template>

<script lang="ts">
import {
  SetupContext,
  Ref,
  ref,
  reactive,
  defineComponent,
  computed,
} from "vue";
import { Icon, Button, Popup, Toast } from "vant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { addressMask } from "@/utils/filters";
import useClipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";
import QrcodeVue from 'qrcode.vue'
import dialogWarning from "@/components/dialogWarning/message.vue";
import { fa } from "element-plus/es/locale";

export default defineComponent({
  name: "acceptCode",
  components: {
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Button.name]: Button,
    QrcodeVue,
    dialogWarning
  },
  props: {},
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const store = useStore();
    const { emit } = context;
    const accountInfo = computed(() => store.state.account.accountInfo);
    const router = useRouter();
    const coderef = ref(null)
    const toPayment = () => {
      emit("handleToStep1");
      router.push({
        name: "receive-choose",
        query: {
          clickBackUrl:"wallet",
          backUrl:"receive-set-amount"
        }
      });
    };
    const { toClipboard } = useClipboard();
    const isWarning = ref(false)
    const toCopy = async () => {
      try {
        await toClipboard(`${accountInfo.value.address}`);
        isWarning.value = true
      } catch (e) {
        console.error(e);
      }
    };
    const codeData = computed(() => {
      return JSON.stringify({
        data: accountInfo.value.address,
        type: 'address'
      })
    })
    return {
      t,
      toPayment,
      accountInfo,
      addressMask,
      toCopy,
      codeData,
      coderef,
      isWarning
    };
  },
});
</script>

<style lang="scss" >
.accept-popup {
  height: 450px;
  .short-line {
    width: 45px;
    height: 5px;
    background: #c1c5ca;
    border-radius: 2.5px;
  }
  &-top {
    height: 28px;
  }
  &-tit {
    line-height: 21px;
    font-size: 15px;
    margin: 13px 0 10px 0;
  }
  .code {
    width: 185px !important;
    height: 185px !important;
    background: lightcyan;
  }
  .scan-code-tit {
    line-height: 17px;
    font-size: 12px;
    color: #757780;
    margin: 21px 0 21px;
  }
  .copy-info {
    width: 112px;
    background: #F1F3F4;
    font-size: 12px;
    height: 25px;
    border-radius: 12.5px;
    line-height: 25px;
    text-align: center;
    padding: 0 10px;
    .address {
      color: #757780;
    }

  }
  .request-box {
    padding: 0 25px;
    margin-top: 25px;
  }
}
</style>
