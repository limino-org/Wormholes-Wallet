<template>
  <van-dialog
    v-model:show="show"
    show-cancel-button
    teleport="#page-box"
    :showConfirmButton="false"
    :showCancelButton="false"
    closeOnClickOverlay
  >
    <div class="title text-center">{{ t("common.server") }}</div>
    <div class="form-box">
      <div class="card">
        <div class="label lh-16 mb-2">
          {{ t("bourse.serverFee") }}
          <van-popover
            v-model:show="showpop1"
            theme="dark"
            placement="top"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("createExchange.serveTip1") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showpop1 = true"
                @mouseout="showpop1 = false"
                name="question hover"
              />
            </template>
          </van-popover>
        </div>
        <div class="value lh-16">200 ERB</div>
      </div>
      <div class="card">
        <div class="label lh-16 mb-2">
          {{ t("bourse.period") }}
          <van-popover
            v-model:show="showpop2"
            theme="dark"
            placement="top"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("createExchange.serveTip2") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showpop2 = true"
                @mouseout="showpop2 = false"
                name="question hover"
              />
            </template>
          </van-popover>
        </div>
        <div class="value lh-16">300 days / 1560 hour</div>
      </div>
      <div class="card">
        <div class="label lh-16 mb-2">
          {{ t("bourse.periodAdd") }}
          <van-popover
            v-model:show="showpop3"
            theme="dark"
            placement="top"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("createExchange.serveTip3") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showpop3 = true"
                @mouseout="showpop3 = false"
                name="question hover"
              />
            </template>
          </van-popover>
        </div>
        <div class="value lh-16">365 days</div>
      </div>
      <div class="card">
        <div class="label lh-16 mb-2">
          {{ t("send.gasfee") }}

          <van-popover
            v-model:show="showpop4"
            theme="dark"
            placement="top"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("common.gasFee") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showpop4 = true"
                @mouseout="showpop4 = false"
                name="question hover"
              />
            </template>
          </van-popover>
        </div>
        <div class="value lh-16 gas">
          ≈ {{ gasFee }} ERB (≈ ${{ toUsd(gasFee, 8) }})
        </div>
      </div>
    </div>
    <Tip :message="t('bourse.addServeAmount')" />
    <div class="btn-box flex between">
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
import Bignumber from "bignumber.js";
import { useExchanges } from "@/hooks/useExchanges";
import Tip from "@/components/tip/index.vue";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";

import { useToast } from "@/plugins/toast";
import { useStore } from "vuex";
import { getWallet } from "@/store/modules/account";
import { ethers } from "ethers";
import { utils } from "ethers";

export default defineComponent({
  name: "server-modal",
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Popover.name]: Popover,
    Tip,
  },
  emits: ["update:modelValue", "updateStatus"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    exchangeName: {
      type: String,
      default: "",
    },
  },
  setup(props: any, context: SetupContext) {
    const { emit } = context;
    const show = ref(false);
    const { state } = useStore();
    const { $toast } = useToast();
    const { t } = useI18n();
    const accountInfo = computed(() => state.account.accountInfo);
    const exchangeStatus = computed(() => state.account.exchangeStatus);
    const gasFee = ref("");
    const {
      addExchangeBalance,
      miunsExchangeBalance,
      send2,
      sendTx2,
      getContract,
    } = useExchanges();

    watch(
      () => props.modelValue,
      async (n) => {
        show.value = n;
        if (n) {
          const contract = await getContract();
          const gasPrice = await contract.provider.getGasPrice();
          const gasLimit = await contract.estimateGas.payForRenew({
            value: ethers.utils.parseEther(200 + ""),
          });
          gasFee.value = gasFee.value = new Bignumber(
            ethers.utils.formatEther(gasLimit)
          )
            .dividedBy(ethers.utils.formatEther(gasPrice))
            .toFixed(9);
   
        }
      }
    );
    watch(
      () => show.value,
      async (n) => {
        emit("update:modelValue", n);
      }
    );
    const { $tradeConfirm } = useTradeConfirm();
    const callBack = () => {

            emit("updateStatus");
                         
    }
    const submit = async () => {
      const bigAmount = new Bignumber(accountInfo.value.amount);
      if (bigAmount.lte(201)) {
        $toast.warn(t("wallet.haveNoMoney"));
        return;
      }
      show.value = false;
      if (
        exchangeStatus.value.exchanger_flag &&
        exchangeStatus.value.status == 2
      ) {
        $tradeConfirm.open({
          callBack: callBack,
          failBack: callBack,
        });
        try {
          show.value = false;
          await sendTx2(200, () => {
            $tradeConfirm.update({ status: "approve" });
          });
          $tradeConfirm.update({ status: "success" });
        } catch (err) {
          $tradeConfirm.update({ status: "fail" });
        }
      } else {
        $tradeConfirm.open({
          approveMessage: t("createExchange.create_approve"),
          successMessage: t("createExchange.create_waiting"),
          wattingMessage: t("createExchange.create_success"),
          failMessage: t("createExchange.create_wrong"),
          callBack: callBack,
          failBack: callBack
        });
        send2(200, props.exchangeName,()=>{}, false);
      }
    };
    const showpop4 = ref(false);
    const showpop3 = ref(false);
    const showpop2 = ref(false);
    const showpop1 = ref(false);
    return {
      show,
      showpop4,
      showpop3,
      showpop2,
      showpop1,
      t,
      toUsd,
      submit,
      gasFee,
    };
  },
});
</script>
<style lang="scss" scoped>
.popover-tip {
  max-width: 150px;
}
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
    margin-top: 5px;
    &.gas {
      color: #3aae55;
    }
  }
  &:nth-last-of-type(1) {
    border-bottom: none;
  }
}
.tips {
  margin: 15px;
  padding: 12px 15px;
  background: #f4faff;
  border-radius: 5px;
  .text {
    line-height: 16px;
  }
  i {
    color: #037dd6;
    margin-right: 9px;
  }
}
.btn-box {
  margin: 20px 42px 20px;
}
</style>