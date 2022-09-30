<template>
  <div class="qrcode-modal">
    <van-dialog
      v-model:show="showModal"
      teleport="#page-box"
      :showConfirmButton="false"
      :showCancelButton="false"
      closeOnClickOverlay
      :title="''"
    >
      <div class="title text-center text-bold van-hairline--bottom">{{ $t('mnemonic.backup') }}</div>
      <div class="tip f-12 lh-16 text-center pl-24 pr-24 mt-12 mb-12">{{ $t('mnemonic.backupyourQRcodeinasafeenvironment') }}</div>
      <div id="qrcode" class="flex center mb-24">
        <div class="code-box flex center">
          <qrcode-vue :value="code" class="code" :size="size" :level="level" ref="coderef"></qrcode-vue>
        </div>
      </div>
      <div class="flex center pb-30">
        <div class="clickActive savebtn lh-30 text-center" @click="download">
          {{ $t('mnemonic.saveQRcode') }}
          <i class="iconfont icon-all_download"></i>
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, watch, SetupContext, reactive, computed } from 'vue'
import { Dialog } from 'vant'
import QrcodeVue from 'qrcode.vue'
import { downloadBase64Img } from '@/utils/utils'
export default defineComponent({
  name: 'qrcode-modal',
  components: {
    [Dialog.Component.name]: Dialog.Component,
    QrcodeVue
  },
  props: {
    title: {
      type: String,
      default: 'Back up QR code'
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    // qrcode data
    data: {
      type: String || Number,
      default: ''
    },
    // complexity
    level: {
      type: String,
      default: 'L'
    },
    // size
    size: {
      type: Number,
      default: 300
    },
    // Describe the copy
    desc: {
      type: String,
      default: 'Please back up your QR code in a safe environment Screenshot is not advised'
    },
    // Download button copy
    downloadText: {
      type: String,
      default: 'Save QR Code to Photos'
    }
  },
  setup(props: any, context: SetupContext) {
    const { emit }: any = context
    const coderef = reactive({})
    const showModal: Ref<boolean> = ref(false)
    watch(
      () => props.modelValue,
      n => {
        showModal.value = n
      },
      {
        immediate: true
      }
    )

    watch(
      () => showModal.value,
      n => {
        if (!n) {
          emit('update:modelValue', false)
        }
      }
    )
    // qr code page
    const code = computed(() => {
      return JSON.stringify({
        type: 'mnemonic',
        data: props.data
      })
    })
    const download = () => {
      downloadBase64Img()
    }
    return {
      showModal,
      download,
      coderef,
      code
    }
  }
})
</script>
<style lang="scss" scoped>
.title {
  color: #000;
  font-size: 15px;
  line-height: 62px;
  background: #f8fcff;
}
.savebtn {
  width: 250px;
  background: #f4faff;
  border-radius: 30px;
  color: #037cd6;
  i {
    font-size: 12px;
  }
  &:hover {
    background: #dcecf9;
  }
}
.code {
  width: 190px !important;
  height: 190px !important;
}
.code-box {
  width: 210px;
  height: 210px;
  border: 7px solid #000;
  padding: 1px;
}
</style>
