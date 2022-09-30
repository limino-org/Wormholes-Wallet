<template>
  <div class="send-link flex column between page-container">
    <div class="link-info text-center">
      <div class="send-link">{{t('send.sendlink')}}</div>
      <p class="tit2">{{t('send.sendLinktltle')}}</p>
      <p class="tit3">
        {{t('send.sendtofriends')}}
        <br />
        <!-- <strong>88088 ETH</strong> -->
      </p>
      <a :href="link" target="__blank">{{ link }}</a>
    </div>
    <van-dialog v-model:show="showQrCode" title :showCancelButton="false" :showConfirmButton="false" closeOnClickOverlay>
      <div class="code-box">
        <div class="code-box-tit text-center flex center">
          {{t('send.paymentrequestQRcode')}}    
          <van-icon class="close-btn" @click="showQrCode = false" name="cross" />
        </div>
        <div class="flex center">
          <div class="flex center code-box-con van-hairline--surround">
            <div class="qr-code"></div>
          </div>
        </div>
      </div>
    </van-dialog>
    <div class="btn-groups">
      <van-button plain block type="primary" @click="toCopy">
        <van-icon name="orders-o" />{{t('send.copy')}}
      </van-button>
      <van-button plain block type="primary" @click="handleQrCode">{{t('send.QRcode')}}</van-button>
      <van-button block type="primary">{{t('send.sendlink')}}</van-button>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref } from 'vue'
import { Button, Icon, Toast, Dialog } from 'vant'
import useClipboard from 'vue-clipboard3'
import { useI18n } from 'vue-i18n'
export default {
  name: 'paymentSendLink',
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Dialog.Component.name]: Dialog.Component
  },
  setup() {
    const{t}=useI18n()
    const link: Ref<string> = ref(
      'https://metamask.app.link/send/ 0xcD6fg77755dfrgddfgdfgdgdhfdhdfhfhdfhdhdhs 5dfgdfgdgdfghdfggdgdfgdf.gdgdgd'
    )

    const { toClipboard } = useClipboard()
    const toCopy = async () => {
      try {
        await toClipboard(`${link.value}`)
        console.log(link.value)
        Toast.success(t('copy.title'))
      } catch (e) {
        console.error(e)
      }
    }
    const showQrCode: Ref<boolean> = ref(false)
    const handleQrCode = () => {
      showQrCode.value = true
    }
    return {
      t,
      link,
      toCopy,
      showQrCode,
      handleQrCode
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>