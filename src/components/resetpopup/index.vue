<template>
  <div class="resetpopup">
    <van-dialog
      v-model:show="showModal"
      teleport="#page-box"
      :showConfirmButton="false"
      :showCancelButton="false"
      closeOnClickOverlay
      :title="''"
    >
      <div class="title text-center f-16 bold van-hairline--bottom">{{ $t('restWallet.restWallet') }}</div>
      <div class="text-center">
        <div class="warn">
          <van-icon name="fail" />
        </div>
        <div class="content">
          <div class="tosure">
            <div>{{$t('restWallet.areyousure')}}</div>
            <div>{{$t('restWallet.eraseyourwallet')}}</div>
          </div>
          <div class="notice">
            <div>{{$t('restWallet.yourcurrentwallet')}}</div>
            <div>{{$t('restWallet.accountsandassetswillbe')}}</div>
            <div class="ft-big">{{$t('restWallet.removedfromthisapppermanently')}}</div>
            <div>{{$t('restWallet.thisactioncannotbeundone')}}</div>
          </div>
          <!-- <div class="notice">
            <div class="f-15">{{$t('restWallet.youcanONLYrecoverthiswallet')}}</div>
            <div class="f-15">
              {{$t('restWallet.withyour')}}
              <span class="ft-big">{{$t('restWallet.secretRecoveryPhrase')}}</span>
            </div>
            <div class="f-15">{{$t('restWallet.metaMaskdoesnothave')}}</div>
            <div class="f-15">{{$t('restWallet.yourSecretRecoveryPhrase')}}</div>
          </div>-->
        </div>
      </div>
      <div class="flex evenly pt-30 pb-30 pl-16 pr-16 btn-box">
        <van-button @click="cancel">{{$t('restWallet.cancel')}}</van-button>
          <van-button 
              color="#D73A49" 
              @click="handleComfirm" 
              :disabled="Time !== 0"
              >
              {{$t('restWallet.confirm')}}{{Time === 0 ? '' : `(${Time}s)`}}
          </van-button>
      </div>
    </van-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, watch, SetupContext, reactive,nextTick } from 'vue'
import { Dialog, Button, Field, NumberKeyboard, Toast, Icon } from 'vant'
import BigNumber from 'bignumber.js'
import localforage from 'localforage';

export default defineComponent({
  name: 'resetpopup',
  emits: ['cancel'],
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Field.name]: Field,
    [NumberKeyboard.name]: NumberKeyboard,
    [Icon.name]: Icon
  },
  props: {
    title: {
      type: String,
      default: 'Rest Wallet'
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any, context: SetupContext) {
    const { emit }: any = context
    const showModal: Ref<boolean> = ref(false)
    const ipt = ref(null)
    const amount: Ref<string> = ref('0.0')
    watch(
      () => props.modelValue,
      n => {
        showModal.value = n
        console.log('props', props.defaultAmount)
        amount.value = props.defaultAmount
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
    watch(
      () => props.show,
      (now:any) => {
        if (now) {
          btnDisabled.value=true;
          countdown();
        }
      }
    )
     let timer: any = null;
     function countdown() {
      if (count.value != 0) {
        clearInterval(timer)
        timer = setInterval(() => {
          count.value = count.value - 1;
          if (count.value <= 0) {
            clearInterval(timer);
            timer = null; 
          }
        }, 3000);
      }
    }
    let count = ref(1);
    const cancel = () => {
      showModal.value = false
    }
    const btnDisabled = ref(true)
    const handleComfirm = () => {
          localforage.clear()
          location.reload()

    }
    let Time = ref(3)
    nextTick(() => {
      let setIntervalValue = setInterval(() => {
        Time.value -= 1
        if (Time.value === 0) {
          clearInterval(setIntervalValue)
        }
      }, 1000)
    })
    return {
      showModal,
      Time,
      amount,
      ipt,
      cancel,
      handleComfirm
    }
  }
})
</script>
<style lang="scss" scoped>
.btn-box {
  button {
    width: 100px;
  }
}
.title {
font-weight: bold;
  line-height: 62px;
  background: #f8fcff;
}
.warn {
  margin: 26px auto 8px;
  width: 40px;
  height: 40px;
  background-color: #d73a49;
  border-radius: 50%;
  color: #ffffff;
  font-size: 38px;
}
.content {
  padding: 0 37px;
  font-size: 15px;
  .tosure {
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 22px;
  }
  .notice {
    margin-bottom: 20px;
    line-height: 20px;
    .ft-big {
      font-weight: 700;
    }
  }
}
</style>
