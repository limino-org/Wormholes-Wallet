<template>
  <van-overlay :show="dislogShow" z-index="100" class="custom-overlay">
    <div class="miners">
      <div class="miners-header">
        <span>{{ t("bourse.dialogTitle") }}</span>
      </div>
      <div class="miners-container flex column between">
        <div class="miners-container-item">
          <!-- <div class="bourse-container-meaning bt">
            <span class="c1">{{ t("bourse.marketName") }} </span>
            <el-tooltip
              popper-class="tooltip2-abc"
              class="box-item"
              style="z-index: 10000"
              effect="dark"
              :content="t('bourse.tip1')"
              placement="bottom"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange">{{ name }}</div>
          </div> -->
          <!-- <div class="bourse-container-meaning bt">
            <span class="c1">{{ t("bourse.marketCom") }} </span>
            <el-tooltip
              popper-class="tooltip2-abc"
              class="box-item"
              effect="dark"
              :content="t('bourse.tip2')"
              placement="bottom"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange">{{ money }}%</div>
          </div> -->
          <div class="bourse-container-meaning bt">
            <span class="c1">{{ t("bourse.stakingFee") }} </span>
            <el-tooltip
              popper-class="tooltip2-abc"
              class="box-item"
              effect="dark"
              :content="t('bourse.tip3')"
              placement="bottom"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <!-- <div class="exchange">{{money * 10}} ERB(≈$20)</div> -->
            <div class="exchange">700 ERB</div>
          </div>
          <!-- <div class="bourse-container-meaning bt">
            <span class="c1">{{ t("bourse.marketServer") }} </span>
            <el-tooltip
              popper-class="tooltip2-abc"
              class="box-item"
              effect="dark"
              :content="t('bourse.tip4')"
              placement="bottom"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange">
              {{ serverIndex === 0 ? 0 : 200 }} ERB(≈${{
                serverIndex != 0 ? toUsd(200, 0) : 0
              }})
            </div>
          </div> -->
          <!-- <div
            class="bourse-container-meaning bt"
            v-if="!exchangeStatus.exchanger_flag && exchangeStatus.status == 0"
          >
            <span class="c1">{{ t("bourse.totalAmount") }} </span>
            <el-tooltip
              popper-class="tooltip2-abc"
              class="box-item"
              effect="dark"
              :content="t('bourse.totalAmount')"
              placement="bottom"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange">
              {{ serverIndex == 0 ? 700 : 900 }} ERB(≈${{
                toUsd(serverIndex == 0 ? 700 : 900, 0)
              }})
            </div>
          </div> -->
          <div class="">
            <span class="c1">{{ t("bourse.gasFee") }} </span>
            <el-tooltip
              popper-class="tooltip2-abc"
              class="box-item"
              effect="dark"
              :content="t('common.gasFee')"
              placement="bottom"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange exchange-z">
              <span class="c2">≈ </span>
              <span class="gasfee">
                {{ totalGas }} ERB</span
              >
            </div>
          </div>
        </div>
        <div class="container-btn flex center column">
          <div>
            <van-button class="mr-10" round plain @click="dislogShow = false">{{
              t("common.cancel")
            }}</van-button>
            <van-button
              type="primary"
              :disabled="Time !== 0"
              round
              @click="submit"
              >{{ t("common.confirm")
              }}{{ Time === 0 ? "" : `(${Time}s)` }}</van-button
            >
          </div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script lang="ts">
import { Button, Overlay, Field, Toast, Icon } from "vant";
import { ref, SetupContext, computed, nextTick, watch } from "vue";
import { ethers, utils } from "ethers";
import { useI18n } from "vue-i18n";
import { ElTooltip } from "element-plus";
import { useStore } from "vuex";
import { getGasFee, getWallet } from "@/store/modules/account";
import { toHex, useExchanges } from "@/hooks/useExchanges";
import { encode } from "punycode";
import BigNumber from "bignumber.js";

export default {
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Field.name]: Field,
    ElTooltip,
    [Icon.name]: Icon,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: false,
    },
    money: {
      type: Number || String,
      default: 0,
    },
    serverIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const store = useStore();
    const { state } = store;
    const { emit }: any = context;
    let amount = ref(props.minersMoney);
    let moneyMin = ref(100000);
    let moneyMax = ref(10000000);
    const { getContract } = useExchanges();
    let dislogShow = computed({
      get: () => props.show,
      set: (v) => emit("update:show", v),
    });
    const totalGas = ref();
    watch(
      () => props.show,
      async (n) => {
        if (n) {
          const gasFee = ref();
          const { address } = state.account.accountInfo;
          const baseName = encode(props.name);
          const str = `wormholes:{"version": "0","type": 11,"fee_rate": 100,"name":"${baseName}","url":""}`;
          const data3 = toHex(str);
          const tx1 = {
            from: address,
            to: address,
            value: ethers.utils.parseEther(700 + ""),
            data: `0x${data3}`,
          };

          gasFee.value = await getGasFee(tx1);
          debugger
          const gas2 = ref();
          if (props.serverIndex == 1) {
            const contract = await getContract();
            const gasPrice = await contract.provider.getGasPrice();
            const gasLimit = await contract.estimateGas.payForRenew({
              value: ethers.utils.parseEther(200 + ""),
            });

            gas2.value = new BigNumber(ethers.utils.formatEther(gasLimit))
              .dividedBy(ethers.utils.formatEther(gasPrice))
              .toFixed(9);
              debugger
          }
          totalGas.value = new BigNumber(gasFee.value)
            .plus(gas2.value || 0)
            .toFixed(8);
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const submit = () => {
      emit("update:show", false);
      emit("open");
    };
    let screentNumber = () => {
      return Number(utils.formatEther(amount.value + "")).toFixed(2);
    };
    let Time = ref(3);
    nextTick(() => {
      let setIntervalValue = setInterval(() => {
        Time.value -= 1;
        if (Time.value === 0) {
          clearInterval(setIntervalValue);
        }
      }, 1000);
    });

    const exchangeStatus = computed(() => store.state.account.exchangeStatus);
    return {
      t,
      Time,
      amount,
      // money,
      moneyMin,
      moneyMax,
      dislogShow,
      submit,
      screentNumber,
      exchangeStatus,
      totalGas,
    };
  },
};
</script>

<style lang="scss" scoped>
.gasfee {
  color: #3aae55;
}
.custom-overlay {
  display: flex;

  .miners {
    width: 341px;
    padding-bottom: 20px;
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
      font-size: 15px;
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
        button {
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
.miners-container-item {
  margin: 25px 12.5px 0 12.5px;
  padding: 17px 15px 0 15px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #e4e7e8;
}
.c1 {
  color: #8f8f8f;
}
.exchange {
  margin-top: 7px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7e8;
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
</style>

<style>
.tooltip2-abc {
  z-index: 10000 !important;
}
</style>