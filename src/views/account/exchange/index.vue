<template>
  <van-overlay :show="showCreateExchange" :z-index="2" class="custom-overlay">
    <div class="miners">
      <div class="miners-header">
        <span>{{$t('createExchange.openexchange')}}</span>
      </div>
      <div class="miners-container flex column between">
        <div>
          <div class="contaienr-top-header flex column center">
            <span>{{$t('createExchange.hi')}}</span>
            <span>{{$t('createExchange.welcome')}}</span>
          </div>
          <div class="contaienr-top-ipt">
            <span>{{$t('createExchange.name')}}</span>
            <van-field
              class="user-field"
              v-model="name"
              :placeholder="t('createExchange.stockexchange')"
              :rules="[{ required: true, message: t('createExchange.stockexchange') }]"
            />
            <div class="stake">
              {{$t('createExchange.stake')}}
              <span>({{$t('createExchange.yield')}})</span>
            </div>
            <div class="money flex between center-v">
              <span>{{money}}ERB</span>
              <span @click="customClick">{{$t('createExchange.custom')}}</span>
            </div>
            <div class="ipt-slider">
              <van-slider v-model="money" :min="100" :max="moneyMax" />
            </div>
            <div class="ipt-text-a">{{$t('createExchange.server')}}</div>
            <div class="ipt-text-b">{{serverIndex === 0 ? '0' : '200'}} ERB($30) / {{$t('createExchange.year')}}</div>
            <div class="ipt-server flex between center-v">
              <div :class="['ipt-server-i', serverIndex === 0 ? 'ipt-server-i-active' : '']" @click="changeServerIndex(0)">
                0 ERB
                <span>{{$t('createExchange.none')}}</span> 0$
              </div>
              <div :class="['ipt-server-i', serverIndex === 1 ? 'ipt-server-i-active' : '']" @click="changeServerIndex(1)">
                200 ERB
                <span>{{$t('createExchange.popular')}}</span> 100$
              </div>
            </div>
          </div>
        </div>
        <div class="container-btn flex center column">
          <div class="btn-text">{{$t('createExchange.balance')}}{{Number(accountInfo.amount).toFixed(2)}} ERB($100,100,100e+22)</div>
          <div class="flex center">
            <van-checkbox v-model="checked" shape="square" icon-size="16px"></van-checkbox>
            <span class="text">{{$t('createExchange.confirmationof')}}</span>
            <span class="underline" @click="showAgreement = true">{{$t('createExchange.termsAndConditions')}}</span>
          </div>
          <div>
            <van-button color="#000000" class="btn" plain @click="dislogShow = false">{{$t('createExchange.cancel')}}</van-button>
            <van-button
              type="primary"
              class="btn"
              round
              @click="minersConfirm"
              :disabled="accountInfo.amount == 0"
            >{{$t('createExchange.confirm')}}</van-button>
          </div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script lang="ts">
import { Button, Overlay, Field, Slider, Toast, Checkbox } from 'vant'
import { ref, SetupContext, computed, watch, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExchanges } from '@/hooks/useExchanges'
import { useStore } from 'vuex'
import { getWallet } from '@/store/modules/account'
import { formatEther } from '@/utils/filters'
import { utils } from 'ethers'
export default {
  name: 'MinersView',
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Field.name]: Field,
    [Slider.name]: Slider,
    [Checkbox.name]: Checkbox
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    check: {
      type: Boolean
    },
    minersMoney: {
      type: Number
    }
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n()
    const store = useStore()
    const exchangeStatus: any = computed(() => store.state.account.exchangeStatus)
    const { emit }: any = context

    onBeforeMount(async () => {
      if (exchangeStatus.ExchangerFlag) {
        const wallet = await getWallet()
        const { address } = wallet
        const data = await wallet.provider.send('eth_getAccountInfo', [address, 'latest'])
        console.log(data)
        console.log('==================')
      }
    })

    let name = ref('')
    let moneyMin = ref(0)
    let moneyMax = ref(10000000)
    const accountInfo: any = computed(() => store.state.account.accountInfo)
    // server
    let serverIndex = ref(1)
    console.log(props)
    let checked = computed({
      get: () => props.check,
      set: v => emit('update:check', v)
    })
    const agreement = () => {
      emit('agreement')
    }
    let dislogShow = computed({
      get: () => props.show,
      set: v => emit('update:show', v)
    })
    let money = computed({
      get: () => props.minersMoney,
      set: v => emit('update:minersMoney', v)
    })
    const customClick = () => {
      emit('update:showAcount', true)
    }
    const { createExchanges, showCreateExchange } = useExchanges()
    const toCreate = async (name: string, amount: number) => {
      try {
        await createExchanges(name, Math.floor(amount))
        dislogShow.value = false
        emit('update:showExchange', true)
        console.log('11111111111111')
      } catch (err) {
        console.error(err)
      }
    }
    const minersConfirm = async () => {
      if (!name.value) {
        Toast(t('common.nftname'))
        return
      }
      const reg = /[\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/
      if (reg.test(name.value)) {
        Toast(t('common.emojiTip'))
        return
      }
      if (!checked.value) {
        Toast(t('common.agreementfirst'))
        return
      }
      try {
        // const isServer = serverIndex.value === 1
        await toCreate(name.value, money.value)
        emit('minersConfirm')
      } catch (err) {
        Toast(JSON.stringify(err))
      }
      // emit('minersConfirm')
    }
    // const sliderChange = (value: any) => {
    //   if (value === 200) {
    //     serverIndex.value = 1
    //   } else {
    //     serverIndex.value = 0
    //   }
    // }
    const changeServerIndex = (value: number) => {
      serverIndex.value = value
    }
    watch(
      () => props.show,
      n => {
        console.log(n)
        showCreateExchange.value = n
        // if (!n) {
        //   name.value = "wormholes exchanger"
        //   firstamount.value = 100
        //   emit("close");
        // }
      }
    )
    watch(
      () => props.minersMoney,
      value => {
        console.log(value)
        if (value == 200) {
          serverIndex.value = 1
        } else {
          serverIndex.value = 0
        }
      }
    )

    let formatDateNumber = () => {
      return formatEther(Number(money.value).toFixed(2) + '')
      //       return utils.formatEther(
      //         Number(ethAccountInfo.value.ExchangerBalance ) + ""
      //       );
    }
    return {
      t,
      name,
      money,
      moneyMin,
      moneyMax,
      serverIndex,
      checked,
      dislogShow,
      agreement,
      customClick,
      minersConfirm,
      changeServerIndex,
      showCreateExchange,
      accountInfo,
      formatDateNumber,
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
            width: 35px;
            height: 35px;
            line-height: 35px;
            margin-bottom: 12px;
            text-align: center;
            border-radius: 5px 5px 5px 5px;
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
        height: 303px;
        margin: auto;
        padding: 11px 15px 20px 15px;
        box-sizing: border-box;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #e4e7e8;
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
          padding-left: 0px;
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
</style>