<template>
  <van-popup v-model:show="showModal" position="bottom">
    <div class="backup-box p-14">
      <div class="small-tit text-center f-24">
        {{ t("backup.warn") }}
      </div>
      <div class="tip f-12 lh-16 text-center pl-24 pr-24 mt-12 mb-12">
        {{ t("common.guideBtnTip") }}
      </div>
      <div class="tip f-12 lh-16 text-center pl-24 pr-24 mt-12 mb-12">
        {{ t("backup.warn1") }}
      </div>
      <div class="flex between btn-box mt-20 pl-8 pr-8">
        <van-button @click="remindLater">{{
          t("backup.remindMeLater")
        }}</van-button>
        <van-button type="primary" @click="backUp">{{
          t("backup.backup")
        }}</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, SetupContext, computed } from "vue";
import { Popover, Dialog, Button, Popup } from "vant";
import WormTransition from "@/components/wromTransition/index.vue";
import { useStore } from "vuex";
import { mnemonicExpires } from "@/enum/time";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "backup-mnemonic-bottom",
  components: {
    [Popover.name]: Popover,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Popup.name]: Popup,
    WormTransition,
  },
  props: {
    type: {
      type: Number,
      default: 16,
    },
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const router = useRouter();
    const showModal: Ref<boolean> = ref(false);
    const { state, dispatch, getters, commit } = useStore();
    const hasBackUpMnemonic = computed(() => state.system.hasBackUpMnemonic);
    const show13 = computed(() => state.system.show13);
    const show6 = computed(() => state.system.show6);
    const show5 = computed(() => state.system.show5);
    const show4 = computed(() => state.system.show4);
    const show3 = computed(() => state.system.show3);
    const show2 = computed(() => state.system.show2);
    const show1 = computed(() => state.system.show1);
    const show0 = computed(() => state.system.show0);
    const lastDelayTime = computed(() => state.system.lastDelayTime);
    const handleModalChange = (n: Ref<any>) => {
      let time = setTimeout(() => {
        if (n.value) {
        } else {
          // Compare the date to see if it is more than 1 week old and show it again
          if (new Date().getTime() - lastDelayTime.value > mnemonicExpires) {
            showModal.value = true;
          }
        }
        clearTimeout(time);
      }, 600);
    };
    // commit('system/UPDATE_HASBACKUPMNEMONIC', false)
    watch(
      () => hasBackUpMnemonic,
      (n) => {
        handleModalChange(n);
      },
      {
        immediate: true,
        deep: true,
      }
    );

      // watch(() =>[show0.value,show1.value,show2.value,show3.value,show4.value,show5.value,show6.value, show13.value, hasBackUpMnemonic.value],(newVal, oldVal) => {
      //   debugger
      //   const len = [...newVal].splice(0,8).filter(item => !item).length
        
      //   if(len === 8 && !newVal[newVal.length - 1]){
      //     showModal.value = true;
      //   }
      // }, {

      // })

    const backUp = () => {
      // dispatch("system/showDialog", props.type);
      router.push({ name: "mnemonic" });
    };

    const remindLater = () => {
      commit("system/UPDATE_LASTDELAYTIME", new Date().getTime());
      showModal.value = false;
    };

    return {
      t,
      showModal,
      hasBackUpMnemonic,
      lastDelayTime,
      backUp,
      remindLater,
    };
  },
});
</script>
<style lang="scss" scoped>
.backup-box {
  background: #f4faff;
  padding-bottom: 24px;
}
.title {
  line-height: 20px;
  font-size: 15px;
}
.small-tit {
  font-size: 15px;
}
.tip {
  color: #848484;
}
.btn-box {
  button {
    width: 160px;
  }
}
.remindLater {
  line-height: 12px;
  font-weight: bold;
  margin-top: 30px;
  text-decoration: underline;
}
</style>