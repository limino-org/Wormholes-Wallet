<template>
  <div class="common-modal">
    <van-dialog
      v-model:show="showModal"
      :showConfirmButton="false"
      :showCancelButton="false"
      closeOnClickOverlay
      :title="''"
    >
      <div class="title text-center f-16 bold van-hairline--bottom">
        {{ title }}
      </div>
      <div class="text-center">
          <slot></slot>
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
import { Dialog, Toast,Button } from "vant";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "common-modal",
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]:Button,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    
  },
  setup(props: any, context: SetupContext) {
    const { emit }: any = context;
    const showModal: Ref<boolean> = ref(false);
    const { t } = useI18n();
    watch(
      () => props.modelValue,
      (n) => {
        showModal.value = n;
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
    return {
      t,
      showModal,
    };
  },
});
</script>
<style lang="scss" scoped>
.title {
  color: #000;
  line-height: 62px;
  background: #f8fcff;
  font-weight: bold;
}
.savebtn {
  width: 220px;
  background: #f1f3f4;
  border-radius: 30px;
  box-sizing: border-box;
  font-size: 12px;
  i {
    font-size: 12px;
  }
  &:hover {
    background: #deebf6;
    color: #666;
  }
}
.code {
  width: 180px !important;
  height: 180px !important;
}
.code-box {
  width: 200px;
  height: 200px;
  border: 7px solid #000;
  padding: 1px;
}
.btn-group {
  width: 180px;
  margin: 0 auto 20px;
}
.btn-box {
  .btn {
    width: 34px;
    height: 34px;
    box-sizing: border-box;
    border-radius: 17px;
    border: 1PX solid #037cd6;
    cursor: pointer;
    &:hover {
      background: #037cd6;
      i {
        color: #fff;
      }
    }
    i {
      font-size: 18px;
      color: #037cd6;
    }
  }
  .text {
    color: #037cd6;
    font-size: 12px;
  }
}
</style>
