<template>
  <van-overlay :show="dislogShow" :z-index="2" class="custom-overlay">
    <div class="miners">
      <div class="miners-header">
        <span>{{$t('closeexchange.minerspledge')}}</span>
      </div>
      <div class="flex center">
        <img
          class="exchange-welcome-icon"
          src="@/assets/exchange/SketchPng6487f59e1a3e4adec886c6b63f8c41c4aa0d61ebfe43fcaad735b3ff5ca97e8d.png"
        />
      </div>
      <div class="flex center">
        <span class="text-s">{{$t('minerspledge.congratulations')}}</span>
      </div>
      <div class="miners-container flex column between">
        <div class="contaienr-top-ipt flex column">
          <div class="text-a">
            <span>{{$t('closeexchange.accessExchange')}}</span>
          </div>
          <span class="text-b block">http//:sdjkfhsbsdvhsioesns...slfslfnskdfnlksdffslnas</span>
          <div class="text-a">
            <span>{{$t('closeexchange.accessCMS')}}</span>
          </div>
          <span class="text-b">http//:sdjkfhsbsdvhsioesns...slfslfnskdfnlksdffslnas</span>
        </div>
        <div class="flex center conditions">
          <span class="text-a m-r-5">{{$t('closeexchange.confirmationof')}}</span>
          <span class="text-b">{{$t('closeexchange.termsAndConditions')}}</span>
        </div>
        <div class="container-btn flex center">
          <van-button type="primary" class="btn" round @click="dislogShow = false">{{$t('closeexchange.gohome')}}</van-button>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script lang="ts">
import { Button, Overlay, Field } from 'vant'
import { ref, SetupContext, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'PledgeView',
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
      money.value = amount.value
      dislogShow.value = false
    }
    return {
      t,
      amount,
      money,
      moneyMin,
      moneyMax,
      dislogShow,
      submit
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-overlay {
  display: flex;

  .miners {
    width: 341px;
    height: 423px;
    background: #fff;
    margin: auto;
    border-radius: 8px;
    .text-s {
      margin-bottom: 17px;
      font-size: 14px;
      color: #0f0f0f;
    }
    .exchange-welcome-icon {
      width: 41px;
      height: 41px;
      margin: 20px 0 16px 0;
    }
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
        height: 115px;
        margin: auto;
        padding: 11px 15px;
        box-sizing: border-box;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #e4e7e8;
      }
      .conditions {
        margin: 20px 0 0px 0;
      }
      .text-a {
        height: 17px;
        line-height: 14px;
        font-size: 12px;
        color: #8f8f8f;
      }
      .m-r-5 {
        margin-right: 5px;
      }
      .text-b {
        text-decoration: underline;
        font-size: 12px;
        color: #0287db;
      }
      .block {
        display: inline-block;
        padding-bottom: 12px;
        margin-bottom: 11px;
        border-bottom: 1px solid #ecedef;
      }
      .container-btn {
        .btn {
          width: 104px;
          height: 45px;
          margin-top: 21px;
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