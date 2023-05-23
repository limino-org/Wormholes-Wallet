<template>
  <van-dialog v-model:show="showModalNetwork" teleport="#page-box" closeOnClickOverlay :showConfirmButton="false">
    <div class="title text-center text-bold van-hairline--bottom">{{ t("internet.selectNet") }}</div>

    <div class="activited-net">
      <div class="main-tit">{{t("common.mainNetwork")}}</div>
      <NetWorkCard :data="mainNetwork" @handleClick="handleChooseComfirm(mainNetwork)" />
    </div>
    <div class="other-list" v-if="netWorkList.length">
      <div class="other-list-tit">{{ t("internet.othertitle") }}</div>
      <div class="other-list-box">
        <NetWorkCard
          v-for="item in netWorkList"
          :select="item.select"
          :key="item.value"
          :data="item"
          @handleClick="handleChooseComfirm(item)"
        />
      </div>
    </div>

    <div class="flex center  btn-box">
      <van-button plain block @click="handleNet">{{t('internet.addnetwork')}}</van-button>
    </div>
  </van-dialog>
</template>

<script lang="ts">
import { Dialog, Button } from 'vant'
import NetWorkCard from '../netWorkCard/index.vue'
import { defineComponent, Ref, ref, watch, SetupContext } from 'vue'
// @ts-ignore
import { useNetWork } from '@/components/navHeader/hooks/netWork'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'switchnetwork',
  components: {
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    NetWorkCard
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n()
    const router = useRouter()
    const { emit } = context
    const { netWorkList, currentNetwork, showModalNetwork, chooseNetWork, handleChooseComfirm, mainNetwork, networkLoading } = useNetWork()
    watch(
      () => props.modelValue,
      n => {
        showModalNetwork.value = n
      }
    )
    watch(
      () => showModalNetwork.value,
      n => {
        if (!n) {
          emit('update:modelValue', false)
        }
      }
    )
    const emitClose = () => {
      emit('update:modelValue', false)
    }

    const handleNet = () => {
      router.push({name:"addNetwork"})
    }
    return {
      t,
      handleNet,
      netWorkList,
      currentNetwork,
      chooseNetWork,
      handleChooseComfirm,
      showModalNetwork,
      emitClose,
      networkLoading,
      mainNetwork
    }
  }
})
</script>

<style lang="scss" scoped>
.title {
  color: #000;
  font-size: 15px;
  line-height: 62px;
  background: #FBF8FB;
}
.main-tit {
  font-size: 12px;
  padding: 0 18px;
  line-height: 40px;
  color: #8F8F8F;
}
.other-list-tit {
  color: #8F8F8F;
}

.btn-box {
  button {
    border: none;
    border-radius: 0;
    height: 58px;
  }
}
</style>