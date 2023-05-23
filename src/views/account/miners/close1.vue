<template>
  <van-overlay :show="dislogShow" :z-index="9999" class="custom-overlay">
    <div class="miners">
        <div class="miners-header">
          <span style="color: #000">{{t('minerspledge.stackinglabel')}}</span>
        </div>
        <div class="miners-container flex column between">
          <div style="text-align:center;margin-top:20px">
            <van-icon name="warning" size="30" color="#D73A49" />
          </div>
          <div class="tips">
            {{t('minerspledge.closeTip')}}
            
          </div>
          <div class="container-btn flex center column">
            <div>
              <van-button  color="#000000" class="btn" plain @click="dislogShow = false">{{t('common.cancel')}}</van-button>
              <van-button :disabled="Time !== 0" style="width: 113px;" color="#D73A49" type="primary"  round @click="submit">{{t('common.confirm')}}{{Time === 0 ? '' : `(${Time}s)`}}</van-button>
          </div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script lang="ts">
import { Button, Overlay, Field, Toast, Icon } from 'vant'
import { ref, SetupContext, computed, nextTick } from 'vue'
import { ethers, utils } from "ethers";
import { useI18n } from 'vue-i18n'
import { ElTooltip } from 'element-plus'

export default {
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Field.name]: Field,
    ElTooltip,
    [Icon.name]: Icon
  },
  props: ['show'],
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
      emit('update:show', false)
      emit('affirmClose')
    }
    let screentNumber = () => {
      return Number(utils.formatEther(amount.value + '')).toFixed(2)
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
      t,
      Time,
      amount,
      money,
      moneyMin,
      moneyMax,
      dislogShow,
      submit,
      screentNumber,
      ...props
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-overlay {
  display: flex;

  .miners {
    width: 341px;
    height: 280.5px;
    background: #fff;
    margin: auto;
    border-radius: 8px;
    overflow: hidden;
    .miners-header {
      height: 62px;
      line-height: 62px;
      text-align: center;
      font-weight: bold;
      background: #FBF8FB;
      font-size: 14px;
      color: #B3B3B3;
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
.miners-container-item {
  margin: 25px 12.5px 0 12.5px;
  padding: 17px 15px 0 15px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #E4E7E8;
}
.c1 {
  color: #8F8F8F;
}
.exchange {
  margin-top: 7px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E4E7E8;
}
.bourse-container-meaning {
  margin-bottom: 16px;
}
.exchange-z {
  border: none;
}
.c2 {
  color: #3aae55;
}
.tips {
  text-align: center;
  padding: 20px 70px 10px 70px;
  line-height: 20px;
  font-size: 12px;
  color: #D73A49;
}
</style>