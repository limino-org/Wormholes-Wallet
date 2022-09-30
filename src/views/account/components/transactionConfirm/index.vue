<template>
  <div class="transactionConfirmComponent">
    <div class="text-center tit">AMOUNT</div>
    <div :class="`balance text-center ${loading ? 'loading' : ''}`">
      <van-skeleton row-width="100%" :loading="loading" :row="1">{{data.deposit}} {{currentNetwork.currencySymbol}}</van-skeleton>
    </div>
    <div class="flex center">
      <div :class="`transactionConfirmComponent-con van-hairline--surround`">
        <div class="card-top">
          <div class="flex between gasfree">
            <div class="label">
              <van-skeleton :loading="loading" class="load" :row="1">
                Estimated gass free
                <van-icon name="info" />
              </van-skeleton>
            </div>
            <div class="value text-right tip">
              <van-skeleton
                :loading="loading"
                class="load"
                :row="1"
              >{{decimal(ethTractionPrice(data.gas, data.gasPrice))}} {{currentNetwork.currencySymbol}}</van-skeleton>
            </div>
          </div>
          <div class="flex between maxfee">
            <div class="label">
              <van-skeleton :loading="loading" class="load" :row="1">Like in 30 Secnds</van-skeleton>
            </div>
            <div class="value text-right">
              <van-skeleton
                :loading="loading"
                class="load"
                :row="1"
              >Max fee: {{decimal(ethTractionPrice(data.gas, data.gasPrice))}} {{currentNetwork.currencySymbol}}</van-skeleton>
            </div>
          </div>
        </div>
        <div class="van-hairline--bottom"></div>
        <div class="card-bottom">
          <div class="label center-v">
            <span>Total</span>
          </div>
          <div class="text-right info">
            <div class="value">
              <van-skeleton
                :loading="loading"
                class="load"
                :row="1"
              >{{gasTotal(data.deposit, ethTractionPrice(data.gas, data.gasPrice))}} {{currentNetwork.currencySymbol}}</van-skeleton>
            </div>
            <div class="maxacc">
              <van-skeleton
                :loading="loading"
                class="load"
                :row="1"
              >Max Account: {{gasTotal(data.deposit, ethTractionPrice(data.gas, data.gasPrice))}} {{currentNetwork.currencySymbol}}</van-skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, SetupContext, Ref, ref, computed, toRaw } from 'vue'
import { Skeleton, Icon } from 'vant'
import { utils, BigNumber } from 'ethers'
import { ethTractionPrice, getestimateGas, gasTotal, decimal } from '@/utils/filters'
import { Computed, useStore } from 'vuex'
export default defineComponent({
  name: 'transactionConfirmComponent',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: {
        gas: '0',
        gasPrice: '0',
        deposit: '0',
        maxGas: '0'
      }
    }
  },
  components: {
    [Skeleton.name]: Skeleton,
    [Icon.name]: Icon
  },
  setup(props: any, context: SetupContext) {
    const store = useStore()
    const currentNetwork = computed(() => store.state.account.currentNetwork)
    return {
      utils,
      ethTractionPrice,
      gasTotal,
      decimal,
      currentNetwork
    }
  }
})
</script>
<style lang="scss" scoped>
.transactionConfirmComponent {
  :deep(.van-skeleton__row) {
    width: 100% !important;
  }

  .tit {
    color: #797979;
    font-size: 10px;
    margin-top: 16px;
  }
  .balance {
    font-size: 36px;
    margin: 20px auto 24px;
    &.loading {
      width: 60%;
    }
  }
  &-con {
    min-height: 128px;
    font-size: 12px;
    padding: 16px;
    max-width: 700px;
    &.loading {
      padding: 0;
    }
    box-sizing: border-box;
    &:after {
      border-radius: 20px;
    }
    .card-top {
      .gasfree {
        margin-bottom: 7px;
        .label {
          color: #000;
          font-weight: bold;
          min-width: 100%;
          i {
            color: #656671;
          }
        }
        .value {
          color: rgba(3, 124, 214, 1);
          // min-width: 30vw;
        }
      }
      .maxfee {
        margin-bottom: 12px;
        .label {
          color: rgba(40, 167, 69, 1);
          min-width: 26;
        }
        .value {
          color: rgba(101, 102, 113, 1);
          font-size: 10px;
          min-width: 20vw;
        }
      }
      .label,
      .value {
        line-height: 16px;
      }
      .tip {
        margin-left: -50px;
      }
      .label {
      }
      .value {
      }
    }
    .card-bottom {
      padding-top: 12px;
      .maxacc {
        color: rgba(90, 91, 102, 1);
      }
      .label {
        font-weight: bold;
        min-width: 100px;
      }
      .info {
        div {
          line-height: 16px;
          margin-bottom: 4px;
          min-width: 36vw;
        }
        div:nth-of-type(2) {
          font-size: 10px;
          min-width: 32vw;
        }
      }
    }
  }
}
</style>