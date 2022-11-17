<template>
  <div class="gas-fee-page">
    <div class="pl-14 pr-14 userinfo-box">
      <van-skeleton title :row="5" :loading="loading">
        <div
          class="
            userinfo
            border-round
            slider-box
            amount-info
            pt-20
            pb-20
            pl-14
            pr-14
          "
        >
          <div class="flex between">
            <div>
              <!-- gas price -->
              <div class="label text-left">
                {{ t("sendto.gasprice") }}
                <van-popover
                  v-model:show="gasPriceModal"
                  theme="dark"
                  placement="right"
                >
                  <p class="pl-10 pr-10 f-12">{{ t("sendto.gastit") }}</p>
                  <template #reference>
                    <van-icon
                      name="question hover"
                      @mouseover="gasPriceModal = true"
                      @mouseleave="gasPriceModal = false"
                    />
                  </template>
                </van-popover>
              </div>
              <div class="value">
                <span class="text-bold">≈ {{ gasData[gasFee] }} Gwei,</span>
                <span class="second pl-6"
                  >≈ {{ second }} {{ t("sendto.second") }}</span
                >
              </div>
            </div>
          </div>

          <div class="slider-container pl-10 pr-10 mt-14 mb-12">
            <van-slider
              v-model="gasFee"
              :min="0"
              :max="2"
              :step="1"
              bar-height="2.5px"
              active-color="#85E19B"
            />
          </div>
          <div class="slider-dian">
            <span
              :class="`slider-icon slider-l ${
                gasFee == 1 || gasFee == 2 ? 'active' : ''
              }`"
            ></span>
            <span
              :class="`slider-icon slider-c ${gasFee == 2 ? 'active' : ''}`"
            ></span>
            <span class="slider-icon slider-r"></span>
            <div class="speed-label speed-l">{{ t("sendto.slow") }}</div>
            <div class="speed-label speed-c">{{ t("sendto.standard") }}</div>
            <div class="speed-label speed-r">{{ t("sendto.fastest") }}</div>
          </div>
          <!-- Line -->
          <div class="van-hairline--bottom mt-20 mb-20"></div>
          <!-- gas limit -->
          <div class="label mb-10 pt-20 text-left">
            {{ t("sendto.gasLimit") }}
            <van-popover
              v-model:show="gasLimitModal"
              theme="dark"
              placement="right"
            >
              <p class="pl-10 pr-10">{{ t("sendto.gasLimittit") }}</p>
              <template #reference>
                <van-icon
                  name="question hover"
                  @mouseover="gasLimitModal = true"
                  @mouseleave="gasLimitModal = false"
                />
              </template>
            </van-popover>
          </div>

          <div class="limit-box flex between center-v pl-16 pr-16">
            <div
              class="action flex center clickActive"
              @click="handleLimit(-1)"
              v-show="!minusDisabled"
            >
              <van-icon name="minus" />
            </div>
            <div class="action flex center disabled" v-show="minusDisabled">
              <van-icon name="minus" />
            </div>
            <div class="ipt-box flex center">
              <van-field
                v-model="gasLimit"
                type="number"
                @blur="limitBlur"
                placeholder="21000"
              ></van-field>
            </div>
            <div class="action flex center clickActive" @click="handleLimit(1)">
              <van-icon name="plus" />
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, onActivated, watch, SetupContext } from "vue";
import { getWallet } from "@/store/modules/account";
import { utils } from "ethers";
import BigNumber from "bignumber.js";
import { computed, defineComponent, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import NavHeader from "@/components/navHeader/index.vue";
import { web3 } from "@/utils/web3";
import {
  Icon,
  Toast,
  Button,
  Sticky,
  Field,
  Slider,
  Popover,
  Skeleton,
} from "vant";
import store from "@/store";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { toUsd } from "@/utils/filters";

export default defineComponent({
  name: "gass-fee-page",
  components: {
    [Icon.name]: Icon,
    [Popover.name]: Popover,
    [Toast.name]: Toast,
    [Button.name]: Button,
    [Field.name]: Field,
    [Slider.name]: Slider,
    [Skeleton.name]: Skeleton,
    NavHeader,
  },
  props: {
    to: {
      type: String,
      default: "",
    },
    amount: {
      type: String,
      default: "0",
    },
    show: {
      type: Boolean,
      default: false,
    },
    gasPrice: {
      type: Object,
      default: {},
    },
    gasLimit: {
      type: Object,
      default: {},
    },
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const { to, amount }: any = props;
    const loading = ref(true);
    const gasPriceModal = ref(false);
    const gasLimitModal = ref(false);
    const { state, dispatch } = useStore();
    // Custom gas, change events
    const gasFee = ref(0);
    const toAddress = ref(to);
    const accountInfo = computed(() => state.account.accountInfo);
    // Estimated transaction sending time
    const second = computed(() => {
      let secondTime = 0;
      const random = Math.random() * (1 - 0 + 1);
      switch (gasFee.value) {
        case 0:
          secondTime = 14 + random;
          break;
        case 1:
          secondTime = 11 + random;
          break;
        case 2:
          secondTime = 8 + random;
          break;
      }
      return secondTime.toFixed(2);
    });
    // Get the three highest, lowest and average gas fees
    const gasData: any = ref([]);
    const initGas = async () => {
      try {
        gasLimit.value = utils.formatUnits(props.gasLimit, "wei")
        console.warn('gasLimit.value', gasLimit.value)
        let gas = props.gasPrice || "0";
        if (!Number(gas)) {
          const wallet = await getWallet();
          gas = await wallet.provider.getGasPrice();
        }
        console.log("gasPrice", utils.formatUnits(gas, "wei"));
        const bigGas = new BigNumber(
          utils.formatUnits(gas || "0.0000000012", "wei")
        );
        const bigGasDiv = bigGas.multipliedBy(0.5);
        const bigGasDiv2 = bigGas.multipliedBy(0.4);
        const bigGasDiv3 = bigGas.multipliedBy(0.3);
        const max = bigGas.plus(bigGasDiv).dividedBy(1000000000).toString();
        const min = bigGas.plus(bigGasDiv3).dividedBy(1000000000).toString();
        const average = bigGas
          .plus(bigGasDiv2)
          .dividedBy(1000000000)
          .toString();
        gasData.value = [min, average, max];

        context.emit("change", {
          gasLimit: gasLimit.value,
          gasPrice: gasData.value[gasFee.value],
        });
      } catch (err) {
        console.error("getGasPrice:error", err);
      } finally {
        loading.value = false;
      }
    };
    const newLimit = new BigNumber(utils.formatEther(props.gasLimit))
      .multipliedBy(1000000000000000000)
      .toNumber();
    console.warn("newLimit", newLimit);
    const gasLimit = ref(newLimit < 21000 ? 21000 : newLimit);
    watch(
      [() => gasFee.value, () => gasLimit.value],
      (newVal, oldVal) => {
        const [idx, limit] = newVal;
        console.log('change',gasData.value, idx, limit)
        context.emit("change", {
          gasLimit: limit,
          gasPrice: gasData.value[idx],
        });
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.show,
      (n) => {
        if (n) {
          loading.value = true;
          initGas();

        }
      },
      {
        immediate: true,
      }
    );

    // gasPrice  Exchange for us dollars
    const gasPriceUsd = computed(() => {
      const usd: any = toUsd(
        new BigNumber(gasData.value[gasFee.value])
          .dividedBy(1000000000)
          .toFixed(10),
        10
      );
      return usd && !isNaN(usd) ? usd : "0";
    });

    // Minus button disabled
    const minusDisabled = computed(() => {
      const biglimit = new BigNumber(gasLimit.value);
      return biglimit.lte(21000);
    });
    // gas limit Out of focus event
    const limitBlur = () => {
      const biglimit = new BigNumber(gasLimit.value);
      if (biglimit.lt(21000)) {
        gasLimit.value = 21000;
      }
    };
    // gasLimit Minimum gas usage control
    const handleLimit = (v: number) => {
      const bigLimit = new BigNumber(gasLimit.value);
      if (v == -1) {
        // minus
        // Not less than 1000
        if (bigLimit.lt(21000)) {
          Toast(t("sendto.lessthan"));
          return;
        }
        // If minus 1000 is less than 21000, rewrite it directly as 21000
        if (bigLimit.minus(1000).lt(21000)) {
          gasLimit.value = 21000;
        } else {
          gasLimit.value = bigLimit.minus(1000).toNumber();
        }
      } else {
        // plus
        gasLimit.value = bigLimit.plus(1000).toNumber();
      }
    };
    onMounted(() => {});

    return {
      gasPriceModal,
      gasLimitModal,
      gasData,
      second,
      gasFee,
      accountInfo,
      gasPriceUsd,
      minusDisabled,
      gasLimit,
      limitBlur,
      handleLimit,
      loading,
      t,
    };
  },
});
</script>
<style lang="scss" scoped>
.userinfo-box {
  height: 248px;
}
.back {
  color: #037cd6;
  font-size: 12px;
}
.slider-box {
  &:hover {
    border: 1px solid #037cd6 !important;
    .van-hairline--bottom {
      &:after {
        border-color: #037cd6;
      }
    }
  }
}
.title {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}
:deep() {
  .van-field__body {
    border: none;
  }
}
:deep(.van-slider .van-slider__button) {
  z-index: 100;
  width: 20px;
  height: 20px;
}
:deep(.van-slider .van-slider__bar) {
  z-index: 1000;
}
:deep(.van-slider) {
  z-index: 1000;
}
.gas-fee-page {
  font-size: 12px;
  .text-bold {
    color: #000;
  }
  .amount-info {
    .van-cell {
      background: none;
      padding: 0;
    }

    .label,
    .value {
      font-size: 12px;
      color: #9a9a9a;
      line-height: 18px;
      &.equal {
        color: #000;
      }
    }
    .second {
      color: #3aae55;
    }
  }
  .userinfo {
    border-radius: 5px;
  }
  .slider-dian {
    height: 30px;
    position: relative;
    .slider-icon {
      width: 7.5px;
      position: absolute;
      display: block;
      height: 7.5px;
      border-radius: 50%;
      background: #f1f3f4;
      z-index: 1;
      &.active {
        background: #85e19b;
      }
    }

    .slider-l {
      left: 8px;
      top: -17px;
      display: none;
    }
    .slider-c {
      left: 50%;
      margin-left: -3.75px;
      top: -17px;
    }
    .slider-r {
      right: 8px;
      top: -17px;
      display: none;
    }
    // speed
    .speed-label {
      font-size: 12px;
      color: #9a9a9a;
      line-height: 18px;
      position: absolute;
      top: 2px;
      &.speed-l {
        left: 0;
      }
      &.speed-c {
        left: 50%;
        width: 48px;
        margin-left: -24px;
        text-align: center;
      }
      &.speed-r {
        right: 0;
      }
    }
  }
  .limit-box {
    height: 44px;
    background: #f1f3f4;
    border-radius: 22px;
    .ipt-box {
      width: 60px;
      background: none;
      .van-cell {
        background: none;
        padding: 0;
      }
      :deep(.van-field input) {
        text-align: center;
        background: none;
        color: #000;
        font-weight: bold;
      }
    }
    .action {
      width: 17.5px;
      height: 17.5px;
      border-radius: 50%;
      border: 1px solid #037cd6;
      cursor: pointer;
      &.disabled {
        border: 1px solid #ccc;
        cursor: no-drop;
        i {
          color: #ccc;
        }
      }
      i {
        font-size: 12px;
        color: #037cd6;
        font-weight: bold;
      }
    }
  }
}
</style>