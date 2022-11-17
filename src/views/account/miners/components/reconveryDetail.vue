<template>
  <div class="components-box text-left">
    <div class="recovery-detail">
      <div class="card border-bottom">
        <div class="card-tit">{{t('sendto.address')}}</div>
        <div class="card-val">{{ data.address }}</div>
      </div>
      <div class="card border-bottom">
        <div class="card-tit">{{t('minerspledge.upCredibility')}}</div>
        <div class="card-val">{{ data.Coefficient }} to 7</div>
      </div>
      <div class="card border-bottom">
        <div class="card-tit">{{t('receive.amount')}}</div>
        <div class="card-val">{{ data.amount }} ERB</div>
      </div>
      <div class="card">
        <div class="card-tit">{{t('transactionDetails.gasfee')}}</div>
        <div class="card-val gasFee">{{data.gasFee}} ERB(≈ ${{toUsd(data.gasFee, 6)}})</div>
      </div>
    </div>
    <Tip
      message="Tips：Here is the description，here is the description，here is the description，Here is the description…"
    />
    <div class="flex evenly btn-box">
      <van-button plain @click="handleCancel">{{
        t("common.cancel")
      }}</van-button>
      <van-button type="primary" @click="handleConfirm">{{
        t("common.confirm")
      }}</van-button>
    </div>
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
} from "vue";
import { Dialog, Toast, Button } from "vant";
import { useI18n } from "vue-i18n";
import Tip from "@/components/tip/index.vue";
import { toUsd } from "@/utils/filters";
export default defineComponent({
  name: "common-modal",
  emits: ["cancel", "confirm"],
  components: {
    [Button.name]: Button,
    Tip,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  setup(props: any, context: SetupContext) {
    const { emit }: any = context;
    const { t } = useI18n();
    const handleCancel = () => {
      emit("cancel");
    };
    const handleConfirm = () => {
      emit("confirm");
    };
    return {
      t,
      handleCancel,
      handleConfirm,
      toUsd
    };
  },
});
</script>
  <style lang="scss" scoped>
.components-box {
  padding: 15px;
  .recovery-detail {
    border: 1px solid #e4e7e8;
    border-radius: 5px;
    padding: 0 15px;
    margin-bottom: 15px;
    .card {
      padding: 11px 0;
      &-tit {
        line-height: 16px;
        color: #8f8f8f;
        margin-bottom: 2px;
      }
      &-val {
        line-height: 16px;
        height: 16px;
      }
    }
  }
  .btn-box {
    button {
      min-width: 100px;
    }
  }
}
</style>
  