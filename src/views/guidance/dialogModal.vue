<template>
  <div>
    <div>
      <van-dialog
        v-model:show="showModal"
        teleport="#page-box"
        :showConfirmButton="false"
        :showCancelButton="false"
        closeOnClickOverlay
        :before-close="dispatchClose"
        :title="''"
      >
        <div class="title text-center f-16 bold van-hairline--bottom">{{t('bootstrapwindow.techniqueAssistant')}}</div>
        <div class="flex center">
          <img class="wromIcon" src="@/assets/token/logowallet.png" />
        </div>

        <div class="small-tit text-center text-bold f-24">{{t('bootstrapwindow.wormHoles')}}</div>
        <div class="tip f-12 lh-16 text-center pl-24 pr-24 mt-12 mb-12">{{t('bootstrapwindow.wormHolesMessage')}}</div>
        <div class="flex between btn-box pb-24">
          <van-button  @click="dispatchClose">{{t('common.cancel')}}</van-button>
          <van-button type="primary" @click="handleClick(0)">{{t('bootstrapwindow.getStared')}}</van-button>
        </div>
      </van-dialog>
    </div>
    <div>
      <van-dialog
        v-model:show="showModal2"
        teleport="#page-box"
        :showConfirmButton="false"
        :showCancelButton="false"
        closeOnClickOverlay
        :title="''"
      >
        <div class="title text-center f-16 bold van-hairline--bottom">{{t('bootstrapwindow.welcome')}}</div>

        <div class="flex center">
          <img class="wromIcon" src="@/assets/token/logowallet.png" />
        </div>
        <div class="small-tit text-center text-bold f-24">{{t('bootstrapwindow.wormHoles')}}</div>
        <div class="tip f-12 lh-16 text-center pl-24 pr-24 mt-12 mb-12">{{t('bootstrapwindow.wormHolesMessageEnd')}}</div>
        <div class="flex center pb-30 pl-14 pr-14 mt-20 btn-box">

          <van-button type="primary" @click="complete">{{t('bootstrapwindow.okay')}}</van-button>
        </div>
      </van-dialog>
    </div>

    <dialog-warning  @warningSuccess="warningSuccess" theme="light" :text="t('common.confirmExit')"  v-model:isWarning="isWarning"></dialog-warning>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, SetupContext, computed } from 'vue'
import { Popover, Dialog, Button } from 'vant'
import WormTransition from '@/components/wromTransition/index.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import dialogWarning from '@/components/dialogWarning/indexAffirm.vue'

export default defineComponent({
  name: 'GuideModal',
  components: {
    [Popover.name]: Popover,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    WormTransition,
    'dialog-warning': dialogWarning
  },
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  setup(props: any, context: SetupContext) {
    const { emit }: any = context
    const { t } = useI18n()
    const showModal: Ref<boolean> = ref(false)
    const showModal2: Ref<boolean> = ref(false)
    const { state, dispatch, getters, commit } = useStore()
    // commit('system/UPDATE_GUIDEFLAG', false)
    const show0 = computed(() => getters['system/getGuideModal'])
    const show13 = computed(() => state.system.show13)
    watch(
      () => show0,
      n => {
        showModal.value = n.value
      },
      {
        immediate: true,
        deep: true
      }
    )
    watch(
      () => show13,
      n => {
        showModal2.value = n.value
      },
      {
        immediate: true,
        deep: true
      }
    )
    const handleClick = (v: number) => {
      dispatch('system/showDialog', v)
      if (v == 0) {
        showModal.value = false
      }
    }
    const complete = () => {
      dispatch('system/closeGuide')
      showModal2.value = false
      emit('guideModalSuccess')
    }
    const isWarning = ref(false)

    const beforeClose = async () => {
      
    }
    const warningSuccess = () => {
      dispatch('system/closeGuide')
      showModal.value = false
      isWarning.value = false
    }
    const dispatchClose = () => {
      isWarning.value = true
    }
    return {
      warningSuccess,
      isWarning,
      t,
      dispatchClose,
      showModal,
      show0,
      handleClick,
      showModal2,
      complete,
      beforeClose
    }
  }
})
</script>
<style lang="scss" scoped>
.wromIcon {
  width: 56px;
  margin-top: 25px;
}
.btn-box {
  margin: 20px 50px 0;
  button {
    width: 100px;
  }
}
.title {
  line-height: 62px;
  background: #f8fcff;
  font-weight: bold;
}
.tip {
  color: #848484;
}
.small-tit {
  margin-top: 10px;
  line-height: 30px;
}
.savebtn {
  width: 250px;
  background: #f4faff;
  border-radius: 30px;
  color: #037cd6;
  i {
    font-size: 12px;
  }
  &:hover {
    background: #dcecf9;
  }
}
:deep(.icon-box) {
  margin-top: 20px;
}


</style>