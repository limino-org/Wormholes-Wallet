<template>
  <div class="custom-exchange-modal">
    <van-dialog
      v-model:show="showModal"
      teleport="#page-box"
      :showConfirmButton="false"
      :showCancelButton="false"
      closeOnClickOverlay
      :title="''"
    >
      <div class="title text-center f-16 bold van-hairline--bottom">
        {{ t("exchange.setAmount") }}
      </div>
      <div
        class="
          amount-box
          pt-20
          pb-20
          pl-14
          pr-14
          flex
          between
          ml-12
          mr-12
          mt-20
          mb-20
        "
      >
        <div class="flex-6">
          <div class="f-18 amount-ipt flex center-v">
            <van-field
              class="hover"
              type="number"
              :placeholder="t('amountreminder.pleaseenter')"
              v-model="amount"
              @focus="handleFocus"
            />
          </div>
        </div>
        <div
          class="flex-4 transfer flex center-v right pr-6  hover"
          v-if="hasTransferToken"
          @click.stop="handleChooseToken"
        >
          <div class="token-info flex between center-v pl-6  pr-6">
            <div class="xuanwo flex center">
            <img src="@/assets/icon_blue.svg" alt />
          </div>
          <div class="van-ellipsis ml-6 mr-6 token-name lh-14">
            {{ chooseToken.name }}
          </div>
          <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <div class="flex between pb-30 btn-group">
        <van-button @click="reset">{{ t("receive.reset") }}</van-button>
        <van-button type="primary" @click="handleComfirm">{{
          t("receive.confirm")
        }}</van-button>
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
  getCurrentInstance,
  ComponentInternalInstance,
} from "vue";
import { Dialog, Button, Field, NumberKeyboard, Toast, Icon } from "vant";
import { toUsd } from "@/utils/filters";
import { useI18n } from "vue-i18n";
import BigNumber from "bignumber.js";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  name: "custom-exchange-modal",
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Field.name]: Field,
    [NumberKeyboard.name]: NumberKeyboard,
    [Icon.name]: Icon,
  },
  props: {
    title: {
      type: String,
      default: "Set Amount",
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    maxBalance: {
      type: Number,
      default: 100000000000000,
    },
    minBalance: {
      type: Number,
      default: 0,
    },
    defaultAmount: {
      type: Number,
      default: null,
    },
    hasTransferToken: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const { emit }: any = context;
    const router = useRouter();
    const route = useRoute();
    const { state } = useStore();
    const showModal: Ref<boolean> = ref(false);
    const ipt = ref(null);
    const am = Number(props.defaultAmount);
    const amount: Ref<string | null> = ref(am ? am.toString() : null);
    watch(
      () => props.modelValue,
      (n) => {
        showModal.value = n;
        console.log("props", props.defaultAmount);
        const am = Number(props.defaultAmount);

        amount.value = am ? am.toString() : null;
      },
      {
        immediate: true,
      }
    );

    watch(
      () => showModal.value,
      (n) => {
        if (!n) {
          emit("update:modelValue", false);
        }
      }
    );
    const focusIpt = () => {
      if (Number(amount.value) == 0) {
        amount.value = "";
      }
    };
    const reset = () => {
      amount.value = props.minBalance;
    };

    const handleComfirm = () => {
      if (!amount.value) {
        // $toast.warn(t("amountreminder.pleaseenter"));
        return;
      }
      console.log("props---------", props);
      const num = new BigNumber(props.maxBalance);
      if (num.lt(parseFloat(amount.value))) {
        Toast(t("customExchangeModal.exceededmaximumamount"));
        amount.value = props.maxBalance;
        return;
      }
      const num2 = new BigNumber(props.minBalance);
      if (num2.gt(parseFloat(amount.value))) {
        amount.value = props.minBalance;
        Toast(
          t("customExchangeModal.amountcannotbelessthan", {
            props: props.minBalance,
          })
        );
        return;
      }
      emit("handleConfirm", parseFloat(amount.value));
      showModal.value = false;
    };
    const chooseToken = computed(() => {
      const token = state.transfer.chooseToken;
      const name = state.account.currentNetwork.currencySymbol;
      return token
        ? token
        : {
            name,
          };
    });

    const handleFocus = () => {
      if (Number(amount.value) == 0) {
        amount.value = "";
      }
    };
    const { name }: any = route;
    const handleChooseToken = () => {
      router.push({ name: "receive-choose", query: { backUrl: name } });
    };
    return {
      t,
      handleChooseToken,
      chooseToken,
      showModal,
      amount,
      focusIpt,
      reset,
      handleComfirm,
      ipt,
      handleFocus,
      toUsd,
    };
  },
});
</script>
<style lang="scss" scoped>
.btn-group {
  padding: 0 56px 20px;
}
.title {
  color: #b3b3b3;
  line-height: 62px;
  background: #f8fcff;
}
.van-cell:after {
  display: none;
}
.amount-box {
  box-sizing: border-box;
  border-radius: 5px;
  border: 1PX solid #BBC0C5;
}
:deep(.van-button) {
  width: 100px !important;
}
.imitate-input {
  width: auto;
  min-width: 30px;
  outline: none;
  display: inline-block;
}
.imitate-placeholder {
  color: #999;
}
.amount-ipt {
  color: #8f8f8f;
  height: 35px;
  .van-field {
    padding: 0;
    width: 140px;
    display: inline-block;
    :deep(input) {
      font-size: 12px;
      font-weight: bold;
      &::placeholder {
        font-weight: normal;
      }
    }
  }
  // input {
  //   display: inline-block;
  //   width: auto;
  //   border: none;
  //   font-size: 15px;
  // }
  span {
    color: #000;
    display: block;
    font-size: 15px;
  }
}
.token-info {
  height: 35px;
  min-width: 90px;
  max-width: 150px;
  background: #f1f3f4;
  border-radius: 17.5px;
  .xuanwo {
    width: 24px;
    height: 24px;
    border-radius: 10px;
    // background: #0b80d7;
    padding: 2px;
    img {
      display: block;
      width: 100%;
      height: 100%;
      // border-radius: 50%;
    }
  }
  i {
    color: #037cd6;
    font-size: 15px;
  }
  .token-name {
    color: #000;
  }
}
</style>
