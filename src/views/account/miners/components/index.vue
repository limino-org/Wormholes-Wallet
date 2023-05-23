<template>
  <van-overlay :show="dislogShow" :z-index="2" class="custom-overlay">
    <div class="miners">
      <div class="miners-header">
        <span>{{$t('createminerspledge.openexchange')}}</span>
      </div>
      <div class="miners-container flex column between">
        <div>
          <div class="contaienr-top-header flex column center">
            <span>{{$t('createminerspledge.hi')}}</span>
            <span>{{$t('createminerspledge.welcome')}}</span>
          </div>
          <div class="contaienr-top-ipt" style="font-size: 12px">
            <span>{{$t('createminerspledge.node')}}</span>
            <van-field class="user-field" :placeholder="nodeValue" :disabled="true" />
            <span class="mb-s-10">{{$t('createminerspledge.walletAddress')}}</span>
            <van-field class="user-field" :placeholder="address" :disabled="true" />
            <div class="stake">
              {{$t('createminerspledge.stake')}}
              <span>
                (
                {{$t('createminerspledge.yield')}}
                )
              </span>
            </div>
            <div class="money flex between center-v">
              <span>{{money}}ERB $({{ utils.formatEther(Math.abs(money) + '')}})</span>
              <span @click="customClick">{{$t('createminerspledge.custom')}}</span>
            </div>
            <div class="ipt-slider">
              <van-slider v-model="money" :min="100000" :max="balance" />
            </div>
          </div>
        </div>
        <div class="container-btn flex center column">
          <div class="btn-text">{{$t('createminerspledge.balance')}}{{Number(balance).toFixed(2)}} ERB($100,100,100e+22)</div>
          <div class="btn-warning">
            <van-icon color="#DB3849" size="22" name="warning" />
            <div>{{$t('createminerspledge.congratulations')}}</div>
          </div>
          <div class="flex center">
            <van-checkbox v-model="checked" shape="square" icon-size="16px"></van-checkbox>
            <span class="text">{{$t('createminerspledge.confirmationof')}}</span>
            <span class="underline" @click="showAgreement = true">{{$t('createminerspledge.termsAndConditions')}}</span>
          </div>
          <div>
            <van-button color="#000000" class="btn" plain @click="dislogShow = false">{{$t('createminerspledge.cancel')}}</van-button>
            <van-button type="primary" :loading="isLoading" class="btn" round @click="minersConfirm">{{$t('createminerspledge.confirm')}}</van-button>
          </div>
        </div>
      </div>
    </div>
    <amount-view v-if="showAcountIndex" :isPladge="true" :moneyMax="balance" v-model:show="showAcountIndex" v-model:minersMoney="money"></amount-view>
    <agreement-view v-model:check="checked" v-if="showAgreement" v-model:show="showAgreement" @submitCheck="submitCheck"></agreement-view>
  </van-overlay>
</template>

<script lang="ts">
import { Button, Overlay, Field, Slider, Toast, Checkbox, Icon } from 'vant'
import { ref, SetupContext, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExchanges } from '@/hooks/useExchanges'
import { useStore } from 'vuex'
import { getWallet } from '@/store/modules/account'
import AmountView from '@/views/account/exchange/amount.vue'
import AgreementView from '@/views/account/exchange/agreement.vue'
import { utils } from 'ethers'
export default {
  name: 'IndexDialog',
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Field.name]: Field,
    [Slider.name]: Slider,
    [Checkbox.name]: Checkbox,
    [Icon.name]: Icon,
    [AmountView.name]: AmountView,
    [AgreementView.name]: AgreementView
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    balance: {
      type: Number
    },
    nodeValue: {
      type: String
    }
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n()
    const store = useStore()
    const { emit }: any = context
    const accountInfo = computed(() => store.state.account.accountInfo)
    let address = accountInfo.value.address
    let showAgreement = ref(false)
    let name = ref('https://api.wormholestest.com/')
    let isLoading = ref(false)
    let checked = ref(false)
    let showAcountIndex = ref(false)
    let dislogShow = computed({
      get: () => props.show,
      set: v => emit('update:show', v)
    })
    const customClick = () => {
      showAcountIndex.value = true
    }
    console.log(props.balance)
    console.log("===========props")
    let money = ref(100000)
    const { sendToPledge, ready } = useExchanges()
    const toCreate = async (name: string, amount: number, isServer: boolean) => {
      try {
        const dealMoney = Math.floor(amount) === Number(Number(accountInfo.value.amount).toFixed(2)) ? Math.floor(amount) - 1 : Math.floor(amount)
        await sendToPledge( dealMoney)
      } catch (err) {
        console.error(err)
      }
    }
    const submitCheck = (type: string, flag: Boolean) => {
      if (type === 'check' && flag) {
        checked.value = true
      } else {
        checked.value = false
      }
    }
    const minersConfirm = async () => {
      if (!checked.value) {
        Toast(t('common.agreementfirst'))
        return
      }

      try {
        isLoading.value = true
        // const isServer = serverIndex.value === 1
        await toCreate(props.nodeValue, money.value, false)
        emit('minersConfirm')
      } catch (err) {
        Toast(JSON.stringify(err))
      }
      // emit('minersConfirm')
    }
    let agreement = () => {
      emit('changeAgreementShow')
    }
    watch(
      () => ready.value,
      async n => {
        console.log(n)
        if (n) {
          let time = setTimeout(() => {
          // nextTick(()=>{
          //   dislogShow.value = false
          //   emit('success')
          // })
          //  nextTick(()=>{
            dislogShow.value = false
            emit('success')
          // })
          clearTimeout(time)
          },300)
        }
      }
    )
    console.log(props.nodeValue)
    console.log('++++++++++1212++++++++++++++++')
    return {
      t,
      name,
      submitCheck,
      showAgreement,
      dislogShow,
      minersConfirm,
      money,
      utils,
      agreement,
      isLoading,
      customClick,
      showAcountIndex,
      address,
      ...props,
      checked
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-overlay {
  display: flex;

  .miners {
    width: 341px;
    height: 646px;
    background: #fff;
    margin: auto;
    border-radius: 8px;
    .miners-header {
      height: 62px;
      line-height: 62px;
      text-align: center;
      font-weight: bold;
      background: #FBF8FB;
      font-size: 14px;
      color: #0f0f0f;
    }
    .miners-container {
      ::-webkit-input-placeholder {
        color: #232323;
        font-size: 12px;
      }
      :-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #232323;
        font-size: 12px;
      }
      ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #232323;
        font-size: 12px;
      }
      :-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #232323;
        font-size: 12px;
      }

      .contaienr-top-header {
        margin: 28px 0 21px 0;
        span {
          &:first-child {
            display: inline-block;
            height: 35px;
            width: 35px;
            line-height: 35px;
            margin-bottom: 12px;
            text-align: center;
            border-radius: 5px 5px 5px 5px;
            font-size: 16px;
            font-weight: bold;
            opacity: 1;
            color: #0287db;
            border: 3px solid #0287db;
          }
          &:last-child {
            font-weight: bold;
            font-size: 14px;
            color: #0f0f0f;
          }
        }
      }
      .contaienr-top-ipt {
        width: 315px;
        height: 230px;
        margin: auto;
        padding: 11px 15px 20px 15px;
        box-sizing: border-box;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #e4e7e8;
        ::v-deep .van-field__control:disabled {
          color: #232323 !important;
          -webkit-text-fill-color: #232323 !important;
        }
        ::v-deep .van-field__control {
          font-size: 12px !important;
        }
        ::-webkit-input-placeholder {
          color: #232323;
          font-size: 12px;
        }
        :-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #232323;
          font-size: 12px;
        }
        ::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #232323;
          font-size: 12px;
        }
        :-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: #232323;
          font-size: 12px;
        }
        .user-field {
          font-size: 12px;
          border-bottom: 1px solid #ecedef;
        }
        > span {
          font-size: 12px;
          color: #8f8f8f;
        }
        .ipt-text-a {
          padding-top: 20px;
          margin-top: 30px;
          border-top: 1px solid #ecedef;
          font-size: 12px;
          color: #8f8f8f;
        }
        .ipt-text-b {
          margin: 5px 0 9px 0;
          color: #000;
          font-size: 12px;
          font-weight: bold;
        }
        .ipt-server {
          font-size: 12px;
          color: #8f8f8f;
          font-weight: bold;
          span {
            font-weight: 400;
            color: #000000;
          }
          .ipt-server-i {
            width: 133px;
            height: 30px;
            padding: 0 2px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #F8F3F9;
            border-radius: 7px 7px 7px 7px;
            &:first-child {
              padding: 0 18px;
            }
          }
          .ipt-server-i-active {
            color: #0287db;
            background: #F8F3F9;
            border: 1px solid #9F54BA;
            span {
              color: #0287db;
            }
          }
        }
        .money {
          margin: 10px 0 20px 0;
          font-size: 12px;
          font-weight: bold;
          span {
            &:first-child {
              color: #000000;
            }
            &:last-child {
              color: #0287db;
            }
          }
        }
        .ipt-slider {
          margin-left: 5px;
        }
        .stake {
          margin: 20px 0 5px 0;
          font-size: 12px;
          color: #8f8f8f;
          span {
            color: #3aae55;
          }
        }
        ::v-deep .van-cell {
          padding: 5px 0;
        }
      }
      .container-btn {
        margin-bottom: 30px;
        .btn {
          width: 104px;
          height: 45px;
          margin-top: 21px;
          &:first-child {
            margin-right: 35px;
          }
        }
        span {
          font-size: 12px;
          &:first-child {
            margin: 0 5px 0 10px;
            color: #8f8f8f;
          }
          &:last-child {
            color: #0287db;
          }
        }
        .btn-text {
          margin: 15px 0 20px 0;
          font-size: 12px;
          color: #8f8f8f;
        }
        .underline {
          text-decoration: underline;
        }
        .text {
          margin: 0 5px 0 10px;
        }
      }
      ::v-deep .van-cell {
        &:after {
          display: none;
        }
      }
    }
  }
}
.btn-warning {
  display: flex;
  width: 285px;
  padding: 10px 5px 10px 15px;

  font-size: 12px;
  color: #000000 !important;
  background: #fcf0f5;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  margin: 0 auto;
  margin-bottom: 23px;
  div {
    margin-left: 10px;
  }
}
.mb-s-10 {
  margin-top: 10px;
  display: block;
}
</style>