
<template>
  <div v-if="showModal" class="custom-popover">
    <div class="custom-popover-header">
      <div class="left-b"></div>
      <div class="container flex">
        <div class="header-left"></div>
      <div class="header-right">
        <div class="footer-text">
          <div class="flex center h-10">
            <div class="dot"></div>
          </div>
          <div class="flex center lh-30">
            {{ t("sendNFT.more") }}
          </div>
        </div>
      </div>
      </div>
      <div class="right-b"></div>
    </div>
    <div class="custom-popover-container"></div>
    <div class="custom-popover-footer">
      <div class="footer-btns">
        <div class="container pl-20 pr-20 evenly flex">          <span @click="dispatchClose">{{ t("common.cancel") }}</span>
          <span @click="handleClick(5)">{{ t("common.next") }} 5/7</span>
        </div>
      </div>
    </div>


  </div>
  <dialog-warning @warningSuccess="warningSuccess" theme="light"  @close="handleClose"  :text="t('common.confirmExit')"  v-model:isWarning="isWarning"></dialog-warning>

</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, SetupContext, computed } from "vue";
import { Popover, Dialog, Button } from "vant";
import WormTransition from "@/components/wromTransition/index.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import dialogWarning from "@/components/dialogWarning/indexAffirm.vue";
export default defineComponent({
  name: 'guide-modal4',
  components: {
    [Popover.name]: Popover,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    WormTransition,
    "dialog-warning": dialogWarning,
  },
  props: {
    type: {
      type: Number,
      default: 5,
    },
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const { state, dispatch } = useStore();
    const show5 = computed(() => state.system.show5);
    const showModal = ref(false);
    watch(
      () => show5,
      (n) => (showModal.value = n.value),
      { immediate: true, deep: true }
    );

    const handleClick = (v: number) => {
      dispatch("system/showDialog", v);
    };
    const beforeClose = async () => {
      const flag = await Dialog.confirm({
        message: t("bootstrapwindow.unboot"),
        className: "closeGuideModal",
      })
        .then(() => true)
        .catch(() => false);
      console.log("flag", flag);
      if (flag) {
        dispatch("system/closeGuide");
        showModal.value = false;
      }
    };
    let isWarning = ref(false);

    const warningSuccess = () => {
      dispatch("system/closeGuide");
      showModal.value = false;
      isWarning.value = false;
    };

    const dispatchClose = () => {
      isWarning.value = true
      showModal.value = false
    }
    const handleClose = () => {
      showModal.value = true
    }
    return {
      t,
      handleClose,
      beforeClose,
      handleClick,
      showModal,
      dispatchClose,
      warningSuccess,
      isWarning,
    };
  },
});
</script>
<style lang="scss" scoped>
.custom-popover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100000;
}
.custom-popover-header {
  height: 48px;
  width: 100%;
  display: flex;
  display: flex;
  .left-b,.right-b {
    background-color: rgba(0, 0, 0, 0.7);
    // width: 100%;
    // height: 100%;
    flex: 1;
  }
  .container {
    height: 100%;
    width: 100%;
    
  }
  .header-left {
    width: 50px;
    height: 100%;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: 25px;
      left: 50px;
      width: 70px;
      display: inline-block;
      z-index: 999999;
      border-top: 1px dotted #9F54BA;
    }
    &:after {
      content: "";
      position: absolute;
      top: 59.5px;
      left: 86px;
      width: 70px;
      display: inline-block;
      z-index: 999999;
      transform: rotate(90deg);
      border-top: 1px dotted #9F54BA;
    }
  }
  .header-right {
    height: 100%;
    width: calc(100% - 50px);
    background-color: rgba(0, 0, 0, 0.7);
  }
}
.custom-popover-container {
  height: 272px;
  background-color: rgba(0, 0, 0, 0.7);
}
.custom-popover-footer {
  position: relative;
  height: calc(100% - 320px);
  background-color: rgba(0, 0, 0, 0.7);
}
.footer-btns {
    position: fixed;
    bottom: 30px;
    left: 0;
    right: 0;
    width: 100%;
  div {
    span {
      display: inline-block;
      width: 100px;
      height: 45px;
      cursor: pointer;
      font-size: 12px;
      border-radius: 50px;
      text-align: center;
      line-height: 45px;
      color: #fff;
      box-sizing: border-box;
      &:first-child {
        border: 1px solid #fff;
        margin-right: 40px;
      }
      &:last-child {
        background-color: #9F54BA;
      }
    }
  }
}
.footer-text {
  position: absolute;
  font-size: 12px;
  color: #fff;
  top: 93px;
  left: 70.5px;
  z-index: 100;
  width: 100px;
  text-align: center;
  div {
    position: relative;
    // display: inline-block;
  }
  .dot {
    width: 4px;
    height: 4px;
    background-color: #9F54BA;
    border-radius: 50%;
  }
}
.dialog-box {
  // width: 340px;
  padding-bottom: 25px;
  .serial-number {
    display: flex;
    justify-content: flex-end;
    text-indent: 10px;
    padding-bottom: 14px;
    padding-right: 14px;
    font-size: 12px;
    font-size: 12px;
    .left {
      color: #9F54BA;
    }
  }
  .title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
    margin-top: 44px;
  }
  .small-tit {
    text-align: center;
    margin-bottom: 50px;
    font-size: 12px;
    color: #848484;
  }
  :deep {
    button {
      min-width: 100px;
    }
  }
  :deep(.van-popover__wrapper) {
    height: 0;
  }
}
</style>