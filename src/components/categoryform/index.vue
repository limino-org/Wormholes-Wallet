<template>
  <div class="categoryform">
    <van-dialog
      v-model:show="showModal"
      teleport="#page-box"
      :showConfirmButton="false"
      :showCancelButton="false"
      closeOnClickOverlay
      :title="''"
    >
      <div class="title text-center text-bold van-hairline--bottom">
        {{ $t("receive.selectCategory") }}
      </div>
      <div class="category-list">
        <SelectCard
          class="card"
          v-for="item in categoryList"
          @handleClick="handleClick"
          :select="item.select"
          :data="item"
          :key="item.value"
        ></SelectCard>
      </div>
      <div class="flex between pb-30 pl-16 pr-16 btn-box pt-20">
        <van-button block @click="tocancel">{{
          t("receive.cancel")
        }}</van-button>
        <van-button block type="primary" @click="handleComfirm">{{
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
} from "vue";
import SelectCard from "@/components/selectCard/index.vue";

import {
  Dialog,
  Button,
  Field,
  NumberKeyboard,
  Toast,
  RadioGroup,
  Radio,
} from "vant";
import { regNum2 } from "@/enum/regexp";
import { useI18n } from "vue-i18n";
import BigNumber from "bignumber.js";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  name: "categoryform",
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Field.name]: Field,
    [NumberKeyboard.name]: NumberKeyboard,
    [RadioGroup.RadioGroup]: RadioGroup,
    [Radio.name]: Radio,
    SelectCard,
  },
  emits: ["handleComfirm","update:modelValue"],
  props: {
    // Popup window title
    title: {
      type: String,
      default: "Select Category",
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    selectId: {
      type: String,
      default: "",
    },
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const { emit }: any = context;
    const showModal: Ref<boolean> = ref(false);
    const categoryList = ref([
      {
        value: "art",
        label: t("snftclassificationcategory.art"),
        select: false,
      },
      {
        value: "music",
        label: t("snftclassificationcategory.music"),
        select: false,
      },
      {
        value: "domain_names",
        label: t("snftclassificationcategory.domainNames"),
        select: false,
      },
      {
        value: "virtual_worlds",
        label: t("snftclassificationcategory.virtualWorlds"),
        select: false,
      },
      {
        value: "trading_cards",
        label: t("snftclassificationcategory.tradingCards"),
        select: false,
      },
      {
        value: "collectibles",
        label: t("snftclassificationcategory.collectibles"),
        select: false,
      },
      {
        value: "sports",
        label: t("snftclassificationcategory.sports"),
        select: false,
      },
      {
        value: "utility",
        label: t("snftclassificationcategory.utility"),
        select: false,
      },
    ]);
    watch(
      () => props.modelValue,
      (n) => {
        showModal.value = n;
        if (n) {
          if (!props.selectId) {
            categoryList.value[0].select = true;
          } else {
            categoryList.value.forEach((item: any) => {
              item.select = false;
              if (item.value == props.selectId) {
                item.select = true;
              }
            });
          }
        }
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
    const checked = ref("1");
    const tocancel = () => {
      showModal.value = false;
    };

    const handleClick = (data: any) => {
      categoryList.value.forEach((item) => {
        if (item.value == data.value) {
          item.select = true;
        } else {
          item.select = false;
        }
      });
    };

    const handleComfirm = () => {
      const data = categoryList.value.find((item) => item.select);
      if (data) {
        emit("handleComfirm", data);
        showModal.value = false;
      } else {
        Toast(t("categoryform.categoryform"));
      }
    };

    return {
      t,
      showModal,
      tocancel,
      checked,
      categoryList,
      handleClick,
      handleComfirm,
    };
  },
});
</script>
<style lang="scss" scoped>
.title {
  line-height: 62px;
  font-weight: bold;
  font-size: 14px;
  background: #F8F3F9;
}
.category-list {
  max-height: 350px;
  overflow-y: scroll;
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
  .van-field {
    padding: 0;
    width: 40px;
    display: inline-block;
    :deep(input) {
      font-size: 15px;
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
.transfer {
  i {
    color: #B3B3B3;
    font-size: 14px;
  }
}
.btn-box {
  width: 260px;
  margin: 0 auto;
  button {
    width: 103px;
  }
}
</style>
