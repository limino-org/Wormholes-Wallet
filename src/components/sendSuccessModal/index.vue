<template>
  <div class="send-success-modal">
    <van-dialog
      v-model:show="showModal"
      teleport="#page-box"
      :showConfirmButton="false"
      :showCancelButton="false"
      :title="''"
    >
      <!-- <div class="title text-center f-16 bold van-hairline--bottom">
        {{ title }}
      </div>-->
      <div class="flex center modal-box">
        <div class="icon-bg flex center">
          <i class="iconfont icon-duihao"></i>
        </div>
      </div>
      <div class="text-center msg mt-10 mb-20">{{$t('sendNFT.success')}}</div>

      <div class="flex center p-24 ml-24 mr-24">
        <van-button type="primary" :disabled="disabled" block @click="toHome">{{$t('sendNFT.backHome')}} ({{downTime}}s)</van-button>
      </div>
    </van-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, watch, SetupContext, reactive, computed } from 'vue'
import { Dialog, Toast, Button } from 'vant'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import router from '@/router'

export default defineComponent({
  name: 'send-success-modal',
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button
  },
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Send operation was successful'
    },
    btnText: {
      type: String,
      default: 'Back Home'
    },
    // Route to hop after success
    toName: {
      type: String,
      default: 'wallet'
    }
  },
  setup(props: any, context: SetupContext) {
    const { emit }: any = context
    const showModal: Ref<boolean> = ref(false)
    const { t } = useI18n()
    const downTime = ref(3)
    watch(
      () => props.modelValue,
      n => {
        showModal.value = n
        if (n) {
          downTime.value = 3
          let time = setInterval(() => {
            if (downTime.value == 0) {
              router.replace({ name: 'wallet' })
              clearInterval(time)
              return
            }
            downTime.value = downTime.value - 1
          }, 1000)
        }
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
    const toHome = () => {
      router.replace({ name: props.toName })
    }
    const disabled = computed(() => {
      if(downTime.value !=0){
        return true
      }
      return false
    })
    return {
      t,
      showModal,
      downTime,
      toHome,
      disabled
    }
  }
})
</script>
<style lang="scss" scoped>
.title {
  color: #b3b3b3;
  line-height: 62px;
  background: #F8F3F9;
  font-weight: bold;

}
.send-success-modal {
}
.modal-box {
  padding-top: 50px;
}
.icon-bg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3aae55;
  color: #fff;
  i {
    font-size: 28px;
  }
}
.msg {
  font-size: 15px;
  line-height: 21px;
}
</style>
