<template>
  <div class="send-confirm-modal">
    <van-dialog
      v-model:show="showModal"
      teleport="#page-box"
      :showConfirmButton="false"
      :showCancelButton="false"
      closeOnClickOverlay
      :title="''"
    >
      <div class="title text-center f-16 bold van-hairline--bottom">
        {{ $t("send.sendConfirm") }}
      </div>
      <div class="ml-12 mr-12 p-12 content mt-24">
        <div class="flex between">
          <div class="label">{{ t("sendto.from") }}</div>
          <div class="value">{{ addressMask(accountInfo.address) }}</div>
        </div>
        <div class="flex between">
          <div class="label">{{ t("sendto.to") }}</div>
          <div class="value">{{ addressMask(data.to) }}</div>
        </div>
        <div class="mt-10 pt-10 border-top"></div>
        <div class="flex between">
          <div class="label">{{ t("transactiondetails.transferAmount") }}</div>
          <div class="value">
            {{ data.amount ? data.amount : data.value }}
            {{ currentNetwork.currencySymbol }}
          </div>
        </div>
        <div class="flex between">
          <div class="label">
            {{ t("transactiondetails.gasfee") }}
            <van-popover
              v-model:show="showPopover"
              theme="dark"
              placement="top"
            >
              <div
                class="f-12 pl-10 pr-10 pt-10 pb-10"
                @click="showPopover = false"
              >
                {{ t("common.gasFee") }}
              </div>
              <template #reference>
                <van-icon
                  name="question hover"
                  @mouseover="showPopover = true"
                  @mouseout="showPopover = false"
                />
              </template>
            </van-popover>
          </div>
          <div class="value green">
            ≈ {{ gasFee }} {{ currentNetwork.currencySymbol }}
          </div>
        </div>
        <div class="flex between">
          <div class="label">{{ t("transactiondetails.totalAmount") }}</div>
          <div class="value">
            ≈ {{ totalAmount }} {{ currentNetwork.currencySymbol }}
          </div>
        </div>
      </div>
      <div class="flex between pb-30 pl-16 pr-16 mt-20 btn-box">
        <van-button @click="cencel">{{ t("sendto.cancel") }}</van-button>
        <van-button
          type="primary"
          :loading="nextLoading"
          :disabled="!finishCount ? true : false"
          @click="handleComfirm"
          >{{ t("sendto.send") }}
          {{ !finishCount ? `(${current.seconds}S)` : "" }}</van-button
        >
      </div>
    </van-dialog>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  watch,
  SetupContext,
  reactive,
  computed,
  onUnmounted,
} from "vue";
import {
  Dialog,
  Button,
  Field,
  NumberKeyboard,
  Toast,
  Icon,
  Popover,
} from "vant";
import { addressMask, decimal } from "@//utils/filters";
import { ethers, utils } from "ethers";
import { useI18n } from "vue-i18n";
import BigNumber from "bignumber.js";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useCountDown } from "@vant/use";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";
import { clone } from "@/store/modules/account";
import { TradeStatus } from "@/plugins/tradeConfirmationsModal/tradeConfirm";
import { useToast } from "@/plugins/toast";
import eventBus from "@/utils/bus";

export default defineComponent({
  name: "send-confirm-modal",
  components: {
    [Icon.name]: Icon,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Field.name]: Field,
    [NumberKeyboard.name]: NumberKeyboard,
    [Popover.name]: Popover,
  },
  props: {
    title: {
      type: String,
      default: "send comfirm",
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: {},
    },
  },
  setup(props: any, context: SetupContext) {
    const { $tradeConfirm } = useTradeConfirm();
    const { t } = useI18n();
    const { emit }: any = context;
    const store = useStore();
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const showModal: Ref<boolean> = ref(false);
    const { $wtoast } = useToast();
    const gasFee = ref("0");
    const showPopover = ref(false);
    watch(
      () => props.modelValue,
      (n) => {
        showModal.value = n;
        console.log("props.data", props.data);
      },
      {
        immediate: true,
      }
    );

    watch(
      () => showModal.value,
      async (n) => {
        if (!n) {
          emit("update:modelValue", false);
        } else {
          // Determine whether it is a contract or an ordinary transaction, and then calculate gas
          const { value, amount, to, address, gasPrice, token, gasLimit } =
            props.data;
          if (!address) {
            try {
              const num = gasLimit;
              // Dynamic calculation of gas fee
              gasFee.value = new BigNumber(utils.formatEther(num))
                .multipliedBy(gasPrice)
                .multipliedBy(1000000000)
                .toString();
            } catch (err) {
              console.error(err);
            }
          } else {
            try {
              //Get contract token instance object to estimate contract transfer gas
              gasFee.value = new BigNumber(utils.formatEther(gasLimit))
                .multipliedBy(gasPrice)
                .multipliedBy(1000000000)
                .toString();
            } catch (err) {
              console.error(err);
            }
          }
          countDown.start();
        }
      }
    );

    const cencel = () => {
      showModal.value = false;
    };
    const router = useRouter();
    const nextLoading = ref(false);

    let waitTime: any = ref(null);
    const handleComfirm = async () => {
      showModal.value = false;
      const { value } = props.data;
      // !value ? token Transaction: ordinary transaction
      const callBack = () => {
        router.replace({ name: "wallet" });
      };
      const params = {
        ...props.data,
      };
      nextLoading.value = true;
      $tradeConfirm.open({
        disabled: [TradeStatus.pendding],
      });
      try {
        const txData = await store.dispatch(
          value ? "account/transaction" : "account/tokenTransaction",
          params
        );
        $tradeConfirm.update({ status: "approve" });
        eventBus.emit('sendComfirm')
        const receipt = await txData.wallet.provider.waitForTransaction(txData.hash, null, 60000)
        await store.dispatch("account/waitTxQueueResponse", {
          callback(e: any) {
            waitTime.value = e;
          },
        });
        if(receipt.status) {
          $tradeConfirm.update({ status: "success", hash:txData.hash });
        } else {
          $tradeConfirm.update({ status: "fail", hash:txData.hash });
        }
      } catch (err: any) {
        console.warn('idx', err.toString().indexOf("timeout"))
        console.log('err:===', err)
        console.log('t("error.timeout")', t("error.timeout"))
        if (err.toString().indexOf("timeout") > -1) {
          $tradeConfirm.update({
            status: "warn",
            failMessage: t("error.timeout"),
          });
        } else {
          $tradeConfirm.update({
            status: "fail",
            failMessage: err.reason,
          });
        }
      } finally {
        nextLoading.value = false;
      }
    };
    onUnmounted(() => {
      if (waitTime.value) {
        clearInterval(waitTime.value);
      }
    });
    const totalAmount = computed(() => {
      const { amount, value, gasPrice } = props.data;
      const am = amount ? amount : value;
      return new BigNumber(am).plus(gasFee.value);
    });
    const finishCount = ref(false);
    const countDown = useCountDown({
      time: 4000,
      onFinish() {
        finishCount.value = true;
      },
    });

    return {
      t,
      showModal,
      gasFee,
      cencel,
      totalAmount,
      handleComfirm,
      currentNetwork,
      accountInfo,
      addressMask,
      nextLoading,
      ethers,
      showPopover,
      current: countDown.current,
      finishCount,
    };
  },
});
</script>
<style lang="scss" scoped>
.btn-box {
  padding: 0 52px 20px;
}
.green {
  color: #3aae55;
}
.border-top {
  border-top: 1px solid #e4e7e8;
  padding-top: 9px;
}
.title {
  color: #000;
  font-size: 15px;
  line-height: 62px;
  background: #f8fcff;
  font-weight: bold;
}

:deep(.van-button) {
  width: 100px !important;
}
.send-confirm-modal {
}
.icon-box {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid #000;
  i {
    font-size: 20px;
  }
}
.content {
  border: 1px solid #e4e7e8;
  border-radius: 5px;
  .label {
    color: #8f8f8f;
  }
  .label,
  .value {
    line-height: 16px;
    padding: 6px 0;
  }
}
</style>
