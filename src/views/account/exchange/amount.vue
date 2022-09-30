<template>
  <van-overlay :show="dislogShow" class="custom-overlay" z-index="100">
    <div class="miners">
        <div class="miners-header">
          <span>{{$t('minerspledge.setamount')}}</span>
        </div>
        <div class="miners-container flex column between">
          <div class="contaienr-top-ipt">
            <div class="flex column between">
              <div class="ipt flex center-v">
                <van-field
                  type="number"
                  class="user-field"
                  v-model="amount"
                  placeholder="0.00"
                />
                <span>ERB</span>
              </div>
              <span class="text">${{Number(toUsd(amount)).toFixed(2)}}</span>  
            </div>
          </div>
          <div class="container-btn flex center column">
            <div>
              <van-button  color="#000000" class="btn" plain @click="dislogShow = false">{{$t('minerspledge.reset')}}</van-button>
              <van-button type="primary" class="btn" round @click="submit">{{$t('minerspledge.confirm')}}</van-button>
          </div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script lang="ts">
import { Button, Overlay, Field, Toast } from 'vant'
import { ref, SetupContext, computed } from 'vue'
import { ethers, utils } from "ethers";
import {formatEther,toUsd} from "@/utils/filters";
import { useI18n } from 'vue-i18n'
export default {
  name: 'AmountView',
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Field.name]: Field
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    check: {
      type: String,
      default: ''
    },
    checkNumber: {
      type: Number
    },
    minersMoney: {
      type: Number
    },
    moneyMax: {
      type: Number
    },
    isPladge: {
      type: Boolean,
      default: false
    },
    moneyMinF: {
      type: Number
    }
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n()

    const { emit }: any = context
    let amount = ref(props.minersMoney)
    let moneyMin = ref(100000)
    let moneyMax = ref(10000000)

    let dislogShow = computed({
      get: () => props.show,
      set: v => emit('update:show', v)
    })
    let money = computed({
      get: () => props.minersMoney,
      set: v => emit('update:minersMoney', v)
    })
    const submit = () => {
      debugger
      if (amount.value) {
          if (amount.value > Number(props.moneyMax)) {
            Toast(t('amountreminder.my'))
            return
          }
          if (props.isPladge && amount.value < 100000) {
            Toast(t('amountreminder.maximum'))
            return
          }
          if (!props.isPladge && amount.value < Number(props.moneyMinF)) {
            Toast(t('amountreminder.minimum', {data: props.moneyMinF}))
            return
          }
        money.value = amount.value
        dislogShow.value = false
      } else {
        Toast(t('amountreminder.pleaseenter'))
      }
    }
    let screentNumber = () => {
      return Number(utils.formatEther(amount.value + '')).toFixed(2)
    }
    return {
      t,
      amount,
      money,
      moneyMin,
      moneyMax,
      dislogShow,
      submit,
      screentNumber,
      toUsd
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-overlay {
  display: flex;

  .miners {
    width: 341px;
    height: 260px;
    background: #fff;
    margin: auto;
    border-radius: 8px;
    overflow: hidden;
    .miners-header {
      height: 62px;
      line-height: 62px;
      text-align: center;
      font-weight: bold;
      background: #f8fcff;
      font-size: 14px;
      color: #0f0f0f;
    }
    .miners-container {
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
        height: 90px;
        margin: auto;
        padding: 11px 15px 20px 15px;
        box-sizing: border-box;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #e4e7e8;
        .ipt {
          width: 280px;
          span {
            font-size: 16px;
            font-weight: bold;
          }
        }
        .text {
          font-size: 14px;
        }
        .user-field {
          font-size: 12px;
        }
        > span {
          font-size: 12px;
          color: #8f8f8f;
        }
        .ipt-text-a {
          padding-top: 20px;
          margin-top: 30px;
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
          font-size: 10px;
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
            background: #f4faff;
            border-radius: 7px 7px 7px 7px;
            &:first-child {
              padding: 0 18px;
            }
          }
          .ipt-server-i-active {
            color: #0287db;
            background: #f4faff;
            border: 1px solid #037cd6;
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
        .van-cell:after {
          display: none;
        }
      }
      .container-btn {
        margin-top: 10px;
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
          margin: 15px 0 10px 0;
          font-size: 12px;
          color: #8f8f8f;
        }
        .underline {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>