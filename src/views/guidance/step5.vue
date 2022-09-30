
<template>
  <div v-if="showModal" class="custom-popover">
    <div class="custom-popover-header">
      <!-- <div class="header-left"></div>
      <div class="header-right">
        <div class="footer-text">
          <div class="flex center h-10">
            <div class="dot"></div>
          </div>
          <div class="flex center lh-30">
            {{ t("sendNFT.more") }}
          </div>
        </div>
      </div> -->
            <div class="footer-btns">
        <div class="container pl-20 pr-20 evenly flex">          <span @click="dispatchClose">{{ t("common.cancel") }}</span>
          <span @click="handleClick(5)">{{ t("common.next") }} 5/6</span>
        </div>
      </div>
    </div>
    <div class="custom-popover-container"></div>
    <div class="custom-popover-footer flex">
      <div class="left-footer"></div>
      <span class="tip-txt">
        <span>{{t('sidebar.myexchange')}}</span>
      </span>
      <span class="line"></span>
      <span class="line-circle"></span>
    </div>

    <dialog-warning
      @warningSuccess="warningSuccess"
      :text="t('common.confirmExit')"
      v-model:isWarning="isWarning"
      theme="light" 
    ></dialog-warning>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, SetupContext, computed } from "vue";
import { Popover, Dialog, Button } from "vant";
import WormTransition from "@/components/wromTransition/index.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import dialogWarning from "@/components/dialogWarning/indexAffirm.vue";
export default defineComponent({
  name: "guide-modal5",
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
      default: 4,
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
    const dispatchClose = () => {
      isWarning.value = true;
    };
    const warningSuccess = () => {
      dispatch("system/closeGuide");
      showModal.value = false;
      isWarning.value = false;
    };
    return {
      t,
      show5,
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100000;
}
.custom-popover-header {
  height: 200px;
  width: 100%;
  display: flex;
  background-color: rgba(0, 0, 0, 0.7);
  // .header-left {
  //   width: 50px;
  //   height: 100%;
  //   position: relative;
  //   &:before {
  //     content: "";
  //     position: absolute;
  //     top: 25px;
  //     left: 50px;
  //     width: 70px;
  //     display: inline-block;
  //     z-index: 999999;
  //     border-top: 1px dotted #037cd6;
  //   }
  //   &:after {
  //     content: "";
  //     position: absolute;
  //     top: 59.5px;
  //     left: 86px;
  //     width: 70px;
  //     display: inline-block;
  //     z-index: 999999;
  //     transform: rotate(90deg);
  //     border-top: 1px dotted #037cd6;
  //   }
  // }
  // .header-right {
  //   height: 100%;
  //   width: calc(100% - 50px);
  //   background-color: rgba(0, 0, 0, 0.7);
  // }
}
.custom-popover-container {
  height: calc(100vh - 300px);
  background-color: rgba(0, 0, 0, 0.7);
}
.custom-popover-footer {
  position: relative;
  height: 100px;
  .left-footer {
    width: 30%;
  background-color: rgba(0, 0, 0, 0.7);
  }
  .tip-txt {
    position: absolute;
    top: -98px;
    right: 50px;
    color: #fff;

  }
  .line {
      width: 0;
      border-right: 1px solid #037cd6;
      height: 75px;
      position: absolute;
      right: 126px;
      top: -75px;
  }
  .line-circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #037cd6;
    position: absolute;
    right: 123px;
    top: -80px;
  }
  
}
.footer-btns {
    position: fixed;
    top: 230px;
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
        background-color: #037cd6;
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
    background-color: #037cd6;
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
      color: #037cd6;
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

@media screen and (min-width:750px) {
  .custom-popover-footer {
  .left-footer {
    width: 65%;
  }
  }
}
</style>