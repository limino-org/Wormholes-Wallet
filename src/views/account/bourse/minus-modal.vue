<template>
  <van-dialog
    v-model:show="show"
    show-cancel-button
    teleport="#page-box"
    :showConfirmButton="false"
    :showCancelButton="false"
    closeOnClickOverlay
  >
    <div class="title text-center">{{ t("bourse.minusTit") }}</div>
    <div class="form-box">
      <!-- <div class="card">
        <div class="label lh-16 mb-2">
          {{ t("createExchange.name") }}

          <van-popover
            v-model:show="showTip1"
            theme="dark"
            placement="top"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("bourse.tipname") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showTip1 = true"
                @mouseout="showTip1 = false"
                name="question hover"
              />
            </template>
          </van-popover>
        </div>
        <div class="value lh-16">{{ name }}</div>
      </div> -->
      <div class="card">
        <div class="label lh-16 mb-2">
          {{ t("bourse.stakingFee") }}

          <van-popover
            v-model:show="showTip2"
            theme="dark"
            placement="top"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("bourse.tipstake") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showTip2 = true"
                @mouseout="showTip2 = false"
                name="question hover"
              />
            </template>
          </van-popover>
        </div>
        <div class="value lh-16">{{ fee }} ERB(${{ toUsd(fee, 2) }})</div>
      </div>
      <div class="card">
        <div class="label lh-16 mb-2">
          {{ t("minerspledge.redemingAmount") }}

          <van-popover
            v-model:show="showTip3"
            theme="dark"
            placement="top"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("bourse.tipre") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showTip3 = true"
                @mouseout="showTip3 = false"
                name="question hover"
              />
            </template>
          </van-popover>
        </div>
        <div class="value lh-16">{{ amount }} ERB</div>
      </div>
      <div class="card">
        <div class="label lh-16 mb-2">
          {{ t("bourse.hsitoryReturn") }}

          <van-popover
            v-model:show="showTip4"
            theme="dark"
            placement="top"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("bourse.tipprofit") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showTip4 = true"
                @mouseout="showTip4 = false"
                name="question hover"
              />
            </template>
          </van-popover>
        </div>
        <div class="value lh-16">≈{{ historyProfit }} ERB</div>
      </div>
      <!-- <div class="card">
        <div class="label lh-16 mb-2">
          {{ t("bourse.income") }}

          <van-popover
            v-model:show="showTip5"
            theme="dark"
            placement="top"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("bourse.tipincome") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showTip5 = true"
                @mouseout="showTip5 = false"
                name="question hover"
              />
            </template>
          </van-popover>
        </div>
        <div class="value lh-16">≈{{ myprofit }} ERB</div>
      </div> -->
      <div class="card">
        <div class="label lh-16 mb-2">
          {{ t("bourse.gasFee") }}

          <van-popover
            v-model:show="showTip6"
            theme="dark"
            placement="top"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("common.gasFee") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showTip6 = true"
                @mouseout="showTip6 = false"
                name="question hover"
              />
            </template>
          </van-popover>
        </div>
        <div class="value lh-16 gasFee">≈{{ gasFee }} ERB</div>
      </div>
    </div>
    <Tip :message="t('bourse.minusStaking')" />
    <div class="btn-box flex between pb-20">
      <van-button block class="mr-10" @click="show = false">{{
        t("common.cancel")
      }}</van-button>
      <van-button block type="primary" @click="submit">{{
        t("common.confirm")
      }}</van-button>
    </div>
  </van-dialog>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  SetupContext,
} from "@vue/runtime-core";
import { watch } from "vue";
import { Dialog, Icon, Button, Popover } from "vant";
import { useI18n } from "vue-i18n";
import { toUsd } from "@/utils/filters";
import Bignumber, { BigNumber } from "bignumber.js";
import { toHex, useExchanges } from "@/hooks/useExchanges";
import { useStore } from "vuex";
import Tip from "@/components/tip/index.vue";
import { getGasFee, getWallet } from "@/store/modules/account";

import { ethers } from "ethers";
import { web3 } from "@/utils/web3";

export default defineComponent({
  name: "minus-modal",
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Icon.name]: Icon,
    [Popover.name]: Popover,
    [Button.name]: Button,
    Tip,
  },
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "Exchanger Name",
    },
    fee: {
      type: String,
      default: 0,
    },
    return: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  setup(props: any, context: SetupContext) {
    const { emit } = context;
    const show = ref(false);
    const { t } = useI18n();
    const store = useStore();
    const { state } = store;
    const gasFee = ref();

    const { addExchangeBalance, miunsExchangeBalance, closeExchanges } =
      useExchanges();
    watch(
      () => props.modelValue,
      async (n) => {
        show.value = n;
        if (n) {
          const bigAmount = new Bignumber(props.amount);
          const { address } = state.account.accountInfo;
          const str = bigAmount.gte(props.fee)
            ? `wormholes:{"version":"0.0.1","type":12}`
            : `wormholes:{"type":22,"version":"v0.0.1"}`;
          const realAm = bigAmount.gte(props.fee) ? 0 : props.amount;
          const data3 = toHex(str);
          const tx1 = {
            from: address,
            to: address,
            value: ethers.utils.parseEther(realAm + ""),
            data: `0x${data3}`,
          };

          gasFee.value = await getGasFee(tx1);
          calcProfit();
        }
      }
    );
    watch(
      () => show.value,
      (n) => {
        emit("update:modelValue", n);
      }
    );
    const accountInfo = computed(() => store.state.account.accountInfo);
    const submit = () => {
      const bigAmount = new Bignumber(props.amount);
      if (bigAmount.gte(props.fee)) {
        closeExchanges();
      } else {
        miunsExchangeBalance(props.amount);
      }
      show.value = false;
    };

    const myprofit = ref("");
    const historyProfit = ref("");
    const calcProfit = async () => {
      const wallet = await getWallet();
      const blockNumber = await wallet.provider.getBlockNumber();

      const blockn = web3.utils.toHex(blockNumber.toString());
      const data = await wallet.provider.send("eth_getValidator", [blockn]);
      // const data2 = await getAccount(accountInfo.value.address)
      let total = new BigNumber(0);
      data.Validators.forEach((item: any) => {
        total = total.plus(item.Balance);
      });
      // Total amount of pledge
      const totalStr = total.div(1000000000000000000).toFixed(6);

      // total revenue
      const totalprofit = state.account.exchangeTotalProfit;
      const totalPledge = new BigNumber(props.amount);
      myprofit.value = new BigNumber(totalprofit)
        .multipliedBy(
          totalPledge.div(new BigNumber(totalStr).div(7).multipliedBy(4))
        )
        .toFixed(6);
      historyProfit.value = new BigNumber(totalprofit)
        .multipliedBy(
          new BigNumber(props.fee).div(
            new BigNumber(totalStr).div(7).multipliedBy(4)
          )
        )
        .toFixed(6);
    };
    const showTip1 = ref(false);
    const showTip2 = ref(false);
    const showTip3 = ref(false);
    const showTip4 = ref(false);
    const showTip5 = ref(false);
    const showTip6 = ref(false);
    return {
      myprofit,
      historyProfit,
      showTip1,
      showTip2,
      showTip3,
      showTip4,
      showTip5,
      showTip6,
      show,
      accountInfo,
      t,
      toUsd,
      submit,
      gasFee,
    };
  },
});
</script>
<style lang="scss" scoped>
.title {
  font-size: 15px;
  font-weight: bold;
  color: #000000;
  line-height: 60px;
  background: #f8fcff;
}
.form-box {
  border-radius: 10px;
  border: 1px solid #e4e7e8;
  margin: 27px 15px 15px;
  padding: 12px 15px 0;
}
.card {
  border-bottom: 1px solid #e4e7e8;
  padding: 11px 0;
  .label {
    color: #8f8f8f;
  }
  .value {
    color: #000000;
    &.gasFee {
      color: #3aae55;
    }
  }
  &:nth-last-of-type(1) {
    border-bottom: none;
  }
}

.btn-box {
  padding: 0 42px 20px;
}
</style>