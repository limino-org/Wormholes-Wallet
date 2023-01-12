<template>
  <div v-if="showModal" class="custom-popover">
    <div class="custom-popover-header"></div>
    <div class="custom-popover-container"></div>
    <div class="custom-popover-footer">
      <div class="footer-text">
        <div>
          {{t('guidePopup.tip1')}}
        </div>
      </div>
      <div class="footer-btns">
        <div class="container pl-20 pr-20 evenly flex">
          <span class="hover" @click="dispatchClose">{{t('common.cancel')}}</span>
        <span class="hover" @click="handleClick(1)">{{t('common.next')}} 1/6</span>
        </div>
      </div>
    </div>
  </div>
  <dialog-warning @warningSuccess="warningSuccess" theme="light" @close="handleClose"  :text="t('common.confirmExit')"  v-model:isWarning="isWarning"></dialog-warning>

</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, SetupContext, computed } from 'vue'
import { Popover, Dialog, Button, Popup } from 'vant'
import WormTransition from '@/components/wromTransition/index.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import dialogWarning from '@/components/dialogWarning/indexAffirm.vue'
export default defineComponent({
  name: 'guide-modal1',
  components: {
    [Popover.name]: Popover,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Popup.name]: Popup,
    WormTransition,
    'dialog-warning': dialogWarning
  },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n()
    const { state, dispatch } = useStore()
    const showModal = ref(false)
    const show1 = computed(() => state.system.show1)
    watch(
      () => show1,
      n => (showModal.value = n.value),
      { immediate: true, deep: true }
    )
    const isWarning = ref(false)
    const handleClick = (v: number) => {
      dispatch('system/showDialog', v)
    }
    const beforeClose = async () => {
      const flag = await Dialog.confirm({
        message: t('bootstrapwindow.unboot'),
        className: 'closeGuideModal'
      })
        .then(() => true)
        .catch(() => false)
      console.log('flag', flag)
      if (flag) {
        dispatch('system/closeGuide')
        showModal.value = false
      }
    }
    const dispatchClose = () => {
      isWarning.value = true
      showModal.value = false
    }
    const warningSuccess = () => {
      dispatch('system/closeGuide')
      showModal.value = false
      isWarning.value = false
    }
    const handleClose = () => {
      showModal.value = true
    }
    return {
      handleClose,
      t,
      // show1,
      handleClick,
      showModal,
      beforeClose,
      dispatchClose,
      isWarning,
      warningSuccess
    }
  }
})
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
    height: 48px;
    background-color: rgba(0, 0, 0, .7);
  }
  .custom-popover-container {
    height: 271px;
  }
  .custom-popover-footer {
    position: relative;
    height: calc(100% - 320px);
    background-color: rgba(0, 0, 0, .7);
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
      font-size: 12px;
      border-radius: 50px;
            cursor: pointer;

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
    top: 83px;
    left: 50%;
    width: 50%;
    div {
      display: inline-block;
      transform: translateX(-50%);
      &:before {
        content: "";
        position: absolute;
        top: -44px;
        left: 70px;
        width: 76px;
        display: inline-block;
        z-index: 999999;
        transform: rotate(90deg);
        border-top: 1px dotted #037cd6;
      }
      &:after {
      content: "";
      position: absolute;
      top: -8px;
      left: 106px;
      width: 4px;
      height: 4px;
      background-color: #037CD6;
      border-radius: 50%;
      display: inline-block;
      z-index: 999999;
    }
    }
  }
.dialog-box {
  // max-width: 340px;
  padding-bottom: 25px;
  position: relative;
  .serial-number {
    display: flex;
    justify-content: flex-end;
    text-indent: 10px;
    padding-bottom: 14px;
    padding-right: 14px;
    font-size: 12px;
    .left {
      color: #037cd6;
    }
  }
  .tip2 {
    position: absolute;
    bottom: -100px;
    color: #fff;
  }

  .title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
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