
<template>
  <van-dialog
    v-model:show="show"
    show-cancel-button
    class="minus-pledge-dialog"
    teleport="#page-box"
    :showConfirmButton="false"
    closeOnClickOverlay
  >
    <div class="sheet-header van-hairline--bottom">
      {{ t("createExchange.pledgeRed") }}
    </div>
    <div class="account-container">
      <div class="card pt-18">
        <div class="tit">
          {{ t("minerspledge.redemingAmount") }}
          <van-popover
            v-model:show="showPopover"
            theme="dark"
            placement="bottom"
            trigger="manual"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
              {{ t("createExchange.redeem") }}
            </div>
            <template #reference>
              <van-icon
                @mouseenter="showPopover = true"
                @mouseout="showPopover = false"
                name="question hover"
              />
            </template>
          </van-popover>
          <!-- <el-tooltip
              popper-class="tooltip2-abc"
              class="box-item"
              effect="dark"
              :content="t('createExchange.redeem')"
              placement="top"
              trigger="hover"
            >
              <van-icon name="question" color="#9A9A9A" />
            </el-tooltip> -->
        </div>
        <div class="mt-12">
          <el-slider
            :min="0"
            :max="max"
            :marks="marks"
            v-model="sliderValue"
            @input="handleInput"
          ></el-slider>
          <div class="ipt-box">
            <van-field
            type="number"
            class="mt-14"
            @blur="handleBlur"
            v-model="value"
          />
          <span class="erb">ERB</span>
          </div>
        </div>
      </div>
      <div class="tips flex">
        <div class="flex center tips-icon"><van-icon name="question" /></div>
        <div class="lh-16">{{ t("minerspledge.tip7") }}</div>
      </div>
    </div>
    <div class="flex between btn-box">
      <van-button block plain class="mr-30" @click="handleCancel">{{
        t("common.cancel")
      }}</van-button>
      <van-button
        block
        type="primary"
        :disabled="countDown != 0 ? true : false"
        @click="submit"
        >{{
          countDown != 0 ? countDown + "S" : t("closeexchange.yes")
        }}</van-button
      >
    </div>
  </van-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  watch,
  SetupContext,
  computed,
  nextTick,
  VNode,
  reactive,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon, Dialog, Button, Loading, Field,Popover } from "vant";
import { ElSlider,ElTooltip } from "element-plus";
import { decimal } from "@/utils/filters";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import BigNumber from "bignumber.js";
import MinusStackDialog from "@/views/account/miners/miuns-stack-dialog.vue";
import { useToast } from "@/plugins/toast";
export default defineComponent({
  name: "modifPledgeModal",
  components: {
    [Icon.name]: Icon,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Loading.name]: Loading,
    [Popover.name]:Popover,
    [Field.name]: Field,
    ElSlider,
    ElTooltip,
    MinusStackDialog,
  },
  emits: ["confirm", "update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 100,
    },
    defaultValue: {
      type: Number,
      default: 70000,
    },
  },
  setup(props: any, context: SetupContext) {
    let countDown = ref(3);

    const { emit }: any = context;
    const store = useStore();
    const { dispatch, state, commit } = store;
    const { t } = useI18n();
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);

    const show = ref(false);

    const handleCountDown = () => {
      let time = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value = countDown.value - 1;
        } else {
          clearInterval(time);
        }
      }, 1000);
    };

    watch(
      () => props.modelValue,
      (n: boolean) => {
        show.value = n;
        if (n) {
          countDown.value = 3;
          handleCountDown();
        }
      }
    );
    watch(
      () => show.value,
      (n) => {
        emit("update:modelValue", n);
      }
    );
    const handleCancel = () => {
      show.value = false;
    };
    const { $wtoast } = useToast();
    const key = computed(() =>
      new BigNumber(props.max).minus(props.defaultValue).toString()
    );

    const marks = computed(() => {
      return {
        [key.value]: key.value,
      };
    });

    const value = ref();
    const sliderValue = ref();

    const handleInput = (v: number) => {
      const maxBigInt = new BigNumber(key.value);
      if (maxBigInt.lt(v)) {
        nextTick(() => {
          sliderValue.value = props.max;
          value.value = props.max;
        });
      } else {
        value.value = sliderValue.value;
      }
    };
    const handleBlur = () => {
      const maxBigInt = new BigNumber(key.value);
      if (maxBigInt.lt(value.value)) {
        nextTick(() => {
          sliderValue.value = props.max;
          value.value = props.max;
        });
      } else {
        sliderValue.value = parseInt(value.value);
      }
    };

    const submit = async () => {
      if (value.value <= 0) {
        $wtoast.warn(t("sendto.no"));
        return;
      }
      nextTick(() => {
        show.value = false;
        emit("confirm", value.value);
      });
    };

    const showPopover = ref(false)
    return {
      t,
      submit,
      value,
      handleInput,
      showPopover,
      handleBlur,
      sliderValue,
      currentNetwork,
      handleCancel,
      decimal,
      accountInfo,
      show,
      marks,
      countDown,
    };
  },
});
</script>
<style lang="scss" scoped>
  .ipt-box {
    position: relative;
    .erb {
      position: absolute;
      right: 10px;
      top: 16px;
      font-weight: bold;
    }
  }
.tit {
  color: #848484;
}
.btn-box {
  padding: 12px 45px 25px;
}
.tips-icon {
  i {
    font-size: 18px;
    color: #9F54BA;
    margin-right: 9px;
  }
}

.account-container {
  .card,
  .tips {
    margin: 0 15px;
    overflow: inherit;
  }
  .tips {
    margin-top: 15px;
  }
}
.tips {
  padding: 11px 15px;
  background: #F8F3F9;
  border-radius: 7px;
  margin: 15px 0;
}
:deep() {
  .slider-ipt {
    padding: 0;
    margin-bottom: 11px;
  }
  .van-field__value {
    overflow: inherit;
  }

  .el-slider__runway {
    height: 3px;
    background: #f1f3f4;
  }

  .el-slider__bar {
    height: 3px;
    background-color: #85e19b;
  }

  .el-slider__button {
    width: 20px;
    height: 20px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
    border: none;
  }

  .el-slider__stop {
    height: 7px;
    width: 7px;
    background-color: #3aae55;
    margin-top: -2px;
    border-radius: 3.5px;
  }
  .el-slider__marks-text {
    z-index: 9999;
    margin-top: -26px;
    line-height: 18px;
    border-radius: 4px;
    background: #85e19b;
    color: #fff;
    padding: 0 5px;
    font-size: 12px;
  }

  .van-cell {
    padding: 0;
    overflow: inherit;
  }
  .el-slider__marks-text {
    text-align: center;
    &::after {
      display: block;
      content: "";
      width: 0;
      margin: 0 auto -9px;
      height: 0;
      border: 6px solid transparent;
      border-top: 6px solid #85e19b;
    }
  }
}

.sheet-header {
  height: 60px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  background: #FBF8FB;
  font-size: 15px;
  font-weight: bold;
}
</style>