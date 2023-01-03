<template>
  <van-overlay :show="dislogShow" class="custom-overlay">
    <div class="miners">
      <div class="miners-header">
        <span>{{ t("createExchange.pledgeRed") }}</span>
      </div>
      <div class="miners-container flex column between">
        <div class="miners-container-item">
          <div class="bourse-container-meaning bt">
            <span class="c1"> {{ t("minerspledge.address") }} </span>
            <el-tooltip
              popper-class="tooltip2"
              class="box-item"
              effect="dark"
              :content="t('minerspledge.addr_tip')"
              placement="right"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange add-box">{{ accountInfo.address }}</div>
          </div>
          <div class="bourse-container-meaning bt">
            <span class="c1">{{ t("createminerspledge.stake") }} </span>
            <el-tooltip
              popper-class="tooltip2"
              class="box-item"
              effect="dark"
              :content="t('createminerspledge.stakeTip')"
              placement="right"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange">
              {{ amount }} ERB(≈${{ toUsd(amount, 2) }})
            </div>
          </div>
          <!-- Historical total income -->

          <div class="bourse-container-meaning bt">
            <span class="c1">{{ t("minerspledge.redemingAmount") }} </span>
            <el-tooltip
              popper-class="tooltip2"
              class="box-item"
              effect="dark"
              :content="t('minerspledge.redemingAmountTip')"
              placement="right"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange">
              {{ minusNumber }} ERB(≈${{ toUsd(minusNumber, 2) }})
            </div>
          </div>
          <div class="bourse-container-meaning bt">
            <span class="c1">{{ t("bourse.hsitoryReturn") }} </span>
            <el-tooltip
              popper-class="tooltip2"
              class="box-item"
              effect="dark"
              :content="t('bourse.tip6')"
              placement="right"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange">≈{{ historyProfit }} ERB(≈ $ {{toUsd(historyProfit,5)}})</div>
          </div>
          <!-- <div class="bourse-container-meaning bt">
            <span class="c1">{{ t("minerspledge.stackingIncome") }} </span>
            <el-tooltip
              popper-class="tooltip2"
              class="box-item"
              effect="dark"
              :content="t('minerspledge.stackingTip')"
              placement="right"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange">≈{{ myprofit }} ERB</div>
          </div> -->

          <div class="">
            <span class="c1">{{ t("transactionDetails.gasfee") }} </span>
            <el-tooltip
              popper-class="tooltip2"
              class="box-item"
              effect="dark"
              :content="t('common.gasFee')"
              placement="right"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip>
            <div class="exchange exchange-z">
              <span>≈ </span>
              <span class="c2"> {{ gasFee }} ERB(≈$1)</span>
            </div>
          </div>
        </div>
        <div class="tip">{{ t("bourse.tip8") }}</div>
        <div class="container-btn flex center column">
          <div>
            <van-button
              color="#000000"
              class="btn"
              plain
              @click="dislogShow = false"
              >{{ t("common.cancel") }}</van-button
            >
            <van-button
              type="primary"
              class="btn"
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
import { ref, SetupContext, computed, nextTick, watch, Ref } from "vue";
import { ethers, utils } from "ethers";
import { formatEther, toUsd, transactionStatus } from "@/utils/filters";
import { useI18n } from "vue-i18n";
import { ElTooltip } from "element-plus";
import store from "@/store";
import { useStore } from "vuex";
import { toHex } from "@/utils/utils";
import {
  getWallet,
  handleGetTranactionReceipt,
  TransactionTypes,
  getGasFee,
  clone
} from "@/store/modules/account";
import { BigNumber } from "bignumber.js";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";
import { useRouter } from "vue-router";
import { web3 } from "@/utils/web3";
import { getAccountAddr } from '@/http/modules/common';

export default {
  name: "minus-stack-dialog",
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Field.name]: Field,
    ElTooltip,
    [Icon.name]: Icon,
  },
  props: ["show", "minusNumber"],
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const store = useStore();
    const router = useRouter();
    const { dispatch, state, commit } = store;
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const { $tradeConfirm } = useTradeConfirm();
    const { emit }: any = context;
    const str = `wormholes:{"type":10,"version":"v0.0.1"}`;
    let dislogShow = computed({
      get: () => props.show,
      set: (v) => emit("update:show", v),
    });
    const submit = async () => {
      dislogShow.value = false;
      $tradeConfirm.open({
        approveMessage: t("minerspledge.minus_approve"),
        successMessage: t("minerspledge.minus_waiting"),
        wattingMessage: t("minerspledge.minus_success"),
        failMessage: t("minerspledge.minus_wrong"),
        callBack: () => {
          router.replace({ name: "wallet" });
        },
        failBack: () => {
          router.replace({ name: "wallet" });
        },
      });
      try {
        const amount = props.minusNumber;

        const { address } = accountInfo.value;
        const data = toHex(str);
        const tx1 = {
          from: address,
          to: address,
          value: amount + '',
          data: `0x${data}`,
          transitionType: '10'
        };
        const data1: any = await store.dispatch('account/transaction', tx1)
        $tradeConfirm.update({ status: "approve" });
        const receipt1 = await data1.wallet.provider.waitForTransaction(data1.hash, null, 60000);
        dispatch("account/waitTxQueueResponse");
        if (receipt1.status == 1) {
          $tradeConfirm.update({ status: "success" });
        } else {
          $tradeConfirm.update({ status: "fail" });
        }
        dispatch("account/updateAllBalance");
      } catch (err: any) {
        console.error('err', err)
        if(err.toString().indexOf('timeout') > -1) {
        $tradeConfirm.update({status:"warn",failMessage: t('error.timeout')})
      } else {
        $tradeConfirm.update({status:"fail",failMessage: err.reason})
      }
      }
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
    const gasPrice = ref("");
    const gasLimit = ref("");
    const accountInfo = computed(() => store.state.account.accountInfo);
    const gasFee: Ref<any> = ref("");
    watch(
      () => props.show,
      async (n) => {
        if (n) {
          const data3 = toHex(str);
          const tx1 = {
            to: accountInfo.value.address,
            value: ethers.utils.parseEther(props.minusNumber + ""),
            data: `0x${data3}`,
          };
          try {
            gasFee.value = await getGasFee(tx1)
          } catch (err: any) {
            console.error(err);
          }
          calcProfit();
        }
      }
    );

    const myprofit = ref("");
    const historyProfit = ref("");
    const calcProfit = async () => {
      const wallet = await getWallet();
      const blockNumber = await wallet.provider.getBlockNumber();

      const blockn = web3.utils.toHex(blockNumber.toString());
      const data = await wallet.provider.send("eth_getValidator", [blockn]);
      // const data2 = await getAccount(accountInfo.value.address)
      let total = new BigNumber(0);
      if(data.Validators) {
        data.Validators.forEach((item: any) => {
        total = total.plus(item.Balance);
      });
      }
      const totalStr = total.div(1000000000000000000).toFixed(6);
      const totalprofit = store.state.account.minerTotalProfit;
      const addressInfo = await getAccountAddr(wallet.address)
      const {rewardCoinCount} = addressInfo
      historyProfit.value = new BigNumber(rewardCoinCount).multipliedBy(0.11).toString()
      const totalPledge = new BigNumber(props.minusNumber);
      myprofit.value = new BigNumber(totalprofit)
        .multipliedBy(totalPledge.div(totalStr))
        .toFixed(6);
    };
    return {
      t,
      Time,
      dislogShow,
      submit,
      myprofit,
      historyProfit,
      currentNetwork,
      toUsd,
      accountInfo,
      gasFee,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-box {
}
.tip {
  margin: 12px 13px 0;
  color: #037cd6;
  font-size: 12px;
  line-height: 16px;
}
.custom-overlay {
  display: flex;

  .miners {
    width: 341px;
    min-height: 560px;
    padding-bottom: 30px;
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
      border-bottom: 1px solid #f2f4f5;
      span {
        font-size: 15px;
      }
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
        margin-top: 20px;
        .btn {
          width: 104px;
          height: 45px;
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
  span {
    color: #3aae55;
  }
}
.c2 {
  color: #3aae55;
}
</style>