<template>
  <div class="transaction-detail">
    <div class="title f-16 text-center">
      {{ title }}
    </div>
    <div class="tran-form mt-20">
      <div class="form-box ml-14 mr-14">
        <div class="card flex between card-border">
          <div class="label flex between label-full">
            <span>{{ t("transactionDetails.status") }}</span>
            <div class="speed-box" v-if="data.sendStatus == 'pendding'">
              <span @click="handleSpeed">{{ t("common.speedUp") }}</span>
              <span @click="handleCancel">{{ t("common.cancel") }}</span>
            </div>
          </div>
          <div
            :class="`value flex right center-v status ${transactionStatusClass(
              data
            )}`"
          >
            <span>{{ transactionStatus(data) }}</span>
          </div>
        </div>
        <div class="card flex between card-border">
          <div class="label">{{ t("transactionDetails.date") }}</div>
          <div class="value">
            {{ formatTxDate(data) }}
          </div>
        </div>
        <div class="card flex between smallpad">
          <div class="label">{{ t("transactionDetails.from") }}</div>
          <div class="value">{{ addressMask(data.from) }}</div>
        </div>
        <div class="card flex between card-border smallpad2">
          <div class="label">{{ t("transactionDetails.to") }}</div>
          <div class="value">{{ addressMask(data.to) }}</div>
        </div>
        <div class="card flex between card-border">
          <div class="label">{{ t("transactionDetails.nonce") }}</div>
          <div class="value">#{{ data.nonce }}</div>
        </div>
        <div class="card flex between card-sml pt-10">
          <div class="label">
            {{
              data.transitionType == "6"
                ? t("common.convertAmount")
                : t("transactionDetails.transferAmount")
            }}
          </div>
          <div class="value">{{ transferAmountText(data) }} {{ currentNetwork.currencySymbol }}</div>
        </div>
        <div class="card flex between card-sml">
          <div class="label">
            {{ t("transactionDetails.gasfee") }}
            <van-popover
              v-model:show="showPopover"
              theme="dark"
              placement="top-start"
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
            {{ gasFee }} {{ currentNetwork.currencySymbol }}
          </div>
        </div>
        <div class="card flex between card-sml pb-10">
          <div class="label">{{ t("transactionDetails.totalAmount") }}</div>
          <div class="value">
            {{ totalAmount }} {{ currentNetwork.currencySymbol }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex pb-24 mt-22 btn-box">
      <van-button block @click="cancel" class="mr-24">{{
        t("transactionDetails.cancel")
      }}</van-button>
      <van-button block type="primary" @click="view">{{
        t("transactionDetails.viewDetails")
      }}</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  SetupContext,
  Ref,
  ref,
  reactive,
  onMounted,
  defineComponent,
  computed,
} from "vue";
import { Icon, Toast, Button, Popover } from "vant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { utils } from "ethers";
import { copy } from "@/utils/utils";
import { useI18n } from "vue-i18n";
import BigNumber from "bignumber.js";
import { useToast } from "@/plugins/toast";
import { VUE_APP_SCAN_URL } from "@/enum/env";
import {
  transactionTarget,
  formatDate,
  addressMask,
  toUsdSymbol,
  transactionStatus,
  formatEther,
  parseEther,
  transactiontxType,
  transferAmountText,
  handleSendStatus,
  txTypeToIcon,
  handleTxType,
  transactionStatusClass,
  formatTxDate,
} from "@/utils/filters";
export default defineComponent({
  name: "transactionDetail",
  emits: ["handleClose", "handleSpeed", "handleCancel"],
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Popover.name]: Popover,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const { emit } = context;
    const store = useStore();
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const { $wtoast } = useToast();
    const handleClose = () => {
      emit("handleClose");
    };
    const toCopy = () => {
      copy(props.data.hash).then((res) => {
        Toast.success(t("copy.titlehash"));
      });
    };
    const tolink = () => {
      console.log(currentNetwork.value.browser);
    };
    const showPopover = ref(false);
    // aggregate amount
    const totalAmount = computed(() => {
      const { amount, value, tokenAddress } = props.data;
      if (!tokenAddress) {
        const am = gasFee.value.plus(utils.formatEther(value)).toString();
        return am;
      } else {
        return gasFee.value.plus(amount);
      }
    });

    // gas= gasLimit * gasPrice
    const gasFee = computed(() => {
      const { status, gasPrice, gasUsed, sendStatus } = props.data;
      if(sendStatus && sendStatus === 'pendding') {
        return new BigNumber('0')
      }
      const bigP = new BigNumber(gasPrice).div(1000000000);
      const bigU = new BigNumber(gasUsed).div(1000000000);
      return bigP.multipliedBy(bigU);
    });
    const title = computed(() => {
      return handleTxType(props.data)
    })

    const view = () => {
      window.open(`${VUE_APP_SCAN_URL}TradeDetail/${props.data.hash}`);
    };
    const cancel = () => {
      emit("handleClose");
    };

    const handleSpeed = () => {
      emit("handleSpeed", props.data);
    };
    const handleCancel = () => {
      emit("handleCancel", props.data);
    };
    return {
      handleSpeed,
      handleCancel,
      t,
      cancel,
      title,
      view,
      handleClose,
      transactionTarget,
      formatDate,
      addressMask,
      accountInfo,
      formatEther,
      parseEther,
      toCopy,
      utils,
      showPopover,
      currentNetwork,
      tolink,
      totalAmount,
      transactionStatus,
      formatTxDate,
      gasFee,
      transactiontxType,
      transferAmountText,
      handleSendStatus,
      txTypeToIcon,
      handleTxType,
      transactionStatusClass,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
