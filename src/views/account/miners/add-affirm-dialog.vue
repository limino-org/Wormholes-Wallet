<template>
  <van-dialog v-model:show="dislogShow" teleport="#page-box" :lockScroll="false" :showConfirmButton="false" class="minerAdditionalModal" :showCancelButton="false" closeOnClickOverlay>
    <div class="custom-overlay">
      <div class="miners">
        <div class="miners-header">
          <span>{{ t("minerspledge.addzhiya") }}</span>
        </div>
        <div class="miners-container flex column between">
          <div class="miners-container-item scrollBar">
            <div class="bourse-container-meaning bt">
              <span class="c1"> {{ t("minerspledge.address") }} </span>
              <el-tooltip popper-class="tooltip2" class="box-item" effect="dark" :content="t('minerspledge.addr_tip')" placement="top" trigger="hover">
                <van-icon name="question" color="#9A9A9A" />
              </el-tooltip>
              <div class="exchange add-box">{{ address }}</div>
            </div>
            <div class="bourse-container-meaning bt">
              <span class="c1">{{ t("bourse.addTit") }} </span>
              <el-tooltip popper-class="tooltip2" class="box-item" effect="dark" :content="t('minerspledge.addTip')" placement="top" trigger="hover">
                <van-icon name="question" color="#9A9A9A" />
              </el-tooltip>
              <div class="exchange">
                {{ addNumber }} ERB
              </div>
            </div>
            <div class="bourse-container-meaning bt">
              <span class="c1">{{ t("createminerspledge.addStake") }} </span>
              <el-tooltip popper-class="tooltip2" class="box-item" effect="dark" :content="t('createminerspledge.addStakeTip')" placement="top" trigger="hover">
                <van-icon name="question" color="#9A9A9A" />
              </el-tooltip>
              <div class="exchange">
                {{ addprofit }} ERB
              </div>
            </div>
            <div class="bourse-container-meaning bt">
              <span class="c1">{{ t("bourse.hsitoryReturn") }} </span>
              <el-tooltip popper-class="tooltip2" class="box-item" effect="dark" :content="t('bourse.tip6')" placement="top" trigger="hover">
                <van-icon name="question" color="#9A9A9A" />
              </el-tooltip>
              <div class="exchange">≈{{ historyProfit }} ERB</div>
            </div>
            <div class="bourse-container-meaning bt">
              <span class="c1">{{ t("bourse.income") }} </span>
              <el-tooltip popper-class="tooltip2" class="box-item" effect="dark" :content="t('minerspledge.stackingTip')" placement="top" trigger="hover">
                <van-icon name="question" color="#9A9A9A" />
              </el-tooltip>
              <div class="exchange">≈{{ myprofit }} ERB</div>
            </div>

            <div class="">
              <span class="c1">{{ t("transactionDetails.gasfee") }} </span>
              <el-tooltip popper-class="tooltip2" class="box-item" effect="dark" :content="t('common.gasFee')" placement="top" trigger="hover">
                <van-icon name="question" color="#9A9A9A" />
              </el-tooltip>
              <div class="exchange exchange-z">
                <span>≈ </span>
                <span class="c2"> {{ gasFee }} ERB</span>
              </div>
            </div>
          </div>
          <div class="tip">{{ t("bourse.tip3") }}</div>
          <div class="container-btn flex center column">
            <div>
              <van-button color="#000000" class="btn" plain @click="dislogShow = false">{{ t("common.cancel") }}</van-button>
              <van-button type="primary" class="btn" :disabled="Time !== 0" round @click="submit">{{ t("common.confirm")
              }}{{ Time === 0 ? "" : `(${Time}s)` }}</van-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-dialog>
</template>

<script lang="ts">
import { Button, Overlay, Field, Toast, Icon, Dialog } from "vant";
import { ref, SetupContext, computed, nextTick, watch } from "vue";
import { ethers, utils } from "ethers";
import { useI18n } from "vue-i18n";
import { ElTooltip } from "element-plus";
import store from "@/store";
import { useStore } from "vuex";
import { toHex } from "@/utils/utils";
import { getWallet, getGasFee } from "@/store/modules/account";
import { BigNumber } from "bignumber.js";
import { web3 } from "@/utils/web3";
import { getAccount } from "@/http/modules/nft";
import { getAccountAddr } from '@/http/modules/common';

export default {
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Field.name]: Field,
    ElTooltip,
    [Icon.name]: Icon,
    [Dialog.Component.name]: Dialog.Component
  },
  emits: ['open', 'error'],
  props: ["show", "name", "address", "addNumber", "amount", "to"],
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const store = useStore();
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const { emit }: any = context;

    let dislogShow = computed({
      get: () => props.show,
      set: (v) => emit("update:show", v),
    });
    const submit = () => {
      emit("update:show", false);
      emit("open");
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
    const gasFee = ref("");

    watch(
      () => props.show,
      async (n) => {
        if (n) {
          const str = `wormholes:${JSON.stringify({ type: 9, proxy_address: accountInfo.value.address, "fee_rate": 1000, "name": "", "url": "", "version": "0.0.1" })}`;
          const data3 = web3.utils.fromUtf8(str)
          const tx1 = {
            to: props.to,
            value: ethers.utils.parseEther(props.addNumber + ""),
            data: data3,
          };
          try {
            gasFee.value = await getGasFee(tx1)
          } catch (err: any) {
            console.error(err);
            emit('error', err)
          }
          calcProfit();
        }
      }
    );

    const myprofit = ref("");
    const historyProfit = ref("");
    const addprofit = ref("")
    const calcProfit = async () => {
      console.warn('calc', props.addNumber, props.amount)
      const { t0, t1, t2, t3 } = store.state.configuration.setting.conversion
      //snft rewards require an average conversion rate
      const average = (t0 + t1 + t2 + t3) / 4
      const totalPledge = new BigNumber(props.addNumber).plus(props.amount)
      const isValidator = totalPledge.gte(70000)
      // Two algorithms
      // 1：The miner calculates the total amount pledged by the miner
      // 2：staker is calculated according to the total staker pledge
      const wallet = await getWallet();
      const blockNumber = await wallet.provider.getBlockNumber();
      const addressInfo = await getAccountAddr(wallet.address)
      const { rewardCoinCount, rewardSNFTCount } = addressInfo
      // addNumber + If the pledged amount is greater than or equal to 70,000, use erb reward, and less than 70,000, use snft reward
      const blockn = web3.utils.toHex(blockNumber.toString());
      if (isValidator) {
        historyProfit.value = new BigNumber(rewardCoinCount).multipliedBy(0.16).toString()
        const { Validators } = await wallet.provider.send("eth_getValidator", [blockn]);
        let total = new BigNumber(0);
        // @ts-ignore
        Validators.forEach((item: any) => {
          total = total.plus(new BigNumber(item.Balance).div(1000000000000000000));
        });
        // Total amount of pledge
        const totalStr = total.toFixed(6);
        // Total revenue one year
        const totalprofit = store.state.account.minerTotalProfit;
        myprofit.value = totalPledge.div(totalStr)
          .multipliedBy(totalprofit)
          .toFixed(6);
        addprofit.value = new BigNumber(props.addNumber).div(totalStr)
          .multipliedBy(totalprofit).toFixed(6)
      } else {
        historyProfit.value = new BigNumber(rewardSNFTCount).multipliedBy(average).toString()
        const { Stakers } = await wallet.provider.send("eth_getAllStakers", []);
        // const data2 = await getAccount(accountInfo.value.address)
        let total = new BigNumber(0);
        // @ts-ignore
        Stakers.forEach((item: any) => {
          total = total.plus(new BigNumber(item.Balance).div(1000000000000000000));
        })
        // Total amount of pledge
        const totalStr = total.toFixed(6);
        // Total revenue one year
        const totalprofit = store.state.account.exchangeTotalProfit;
        myprofit.value = totalPledge.div(totalStr)
          .multipliedBy(totalprofit)
          .toFixed(6);
        addprofit.value = new BigNumber(props.addNumber).div(totalStr)
          .multipliedBy(totalprofit).toFixed(6)
      }

    };

    return {
      t,
      Time,
      dislogShow,
      submit,
      currentNetwork,
      gasFee,
      myprofit,
      historyProfit,
      addprofit
    };
  },
};
</script>

<style lang="scss" scoped>
.add-box {}

.tip {
  margin: 12px 13px 0;
  color: #9F54BA;
  font-size: 12px;
  line-height: 16px;
}

.custom-overlay {
  display: flex;

  .miners {
    min-height: 460px;
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
      background: #F8F3F9;
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

        >span {
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

        :deep() {
          .van-cell {
            padding-left: 0px;
          }
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
  max-height: 300px;
  overflow-y: scroll;
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

@media screen and (max-width: 750px) {
  .exchange {
    padding-bottom: 8px;
  }

  .miners {
    padding-bottom: 15px;
  }
}
</style>