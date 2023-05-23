<template>
  <NavHeader :title="t('internet.title')">
    <template v-slot:left>
      <span class="back" @click="appProvide.back">{{ t("common.back") }}</span>
    </template>
  </NavHeader>
  <div class="network-list pt-10">
    <div class="network-list-header">
      <div>{{ t("common.mainNetwork") }}</div>
    </div>
    <div class="activited-net pb-10">
      <NetWorkCard
        :data="mainNetwork"
        select
        :hasSelect="false"
        @click="handleModif(mainNetwork)"
        :class="[mainNetwork.id == selectNetwork.id ? 'selected' : '']"
      />
    </div>
    <div class="other-list mt-22">
      <div class="other-list-tit flex between center-v">
        <span class="f-12">{{ t("internet.othertitle") }}</span>
        <van-icon
          name="add"
          class="hover"
          @click="toAdd"
          color="#9F54BA"
          size="20"
        />
      </div>

      <div class="other-list-box" v-if="netWorkList.length">
        <NetWorkCard
          v-for="item in netWorkList"
          :select="item.select"
          :key="item.value"
          :data="item"
          :isShowSelect="false"
          :hasModif="true"
          :class="[item.id == selectNetwork.id ? 'selected' : '']"
          :hasSelect="false"
          @handleModif="handleModif"
        />
      </div>
      <div v-else>
        <NoData></NoData>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { computed } from "vue";
import { Icon, Toast, Button, Sticky, Field, Dialog } from "vant";
import { useRoute, useRouter } from "vue-router";
import NetWorkCard from "@/components/netWorkCard/index.vue";
import { defineComponent, Ref, ref, watch, SetupContext, inject } from "vue";
import { useNetWork } from "@/components/navHeader/hooks/netWork";
import NavHeader from "@/components/navHeader/index.vue";
import NoData from "@/components/noData/index.vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
export default {
  name: "settings",
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    NetWorkCard,
    NavHeader,
    NoData,
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const appProvide = inject("appProvide");
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const selectNetwork = computed(() => {
      return store.state.account.currentNetwork;
    });
    const { emit } = context;
    const {
      netWorkList,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
      networkLoading,
    } = useNetWork();
    watch(
      () => props.show,
      (n) => {
        showModalNetwork.value = n;
      }
    );
    
    const mainNetwork = computed(() =>{
      const { netWorkList } = store.state.account
      return netWorkList.find((item:any) => item.id == 'wormholes-network-1')
    } )

    const emitClose = () => {
      emit("close");
    };
    const toAdd = () => {
      router.push({ name: "addNetwork" });
    };
    const handleModif = (data: any) => {
      router.push({
        name: "addNetwork",
        query: { data: JSON.stringify(data) },
      });
    };

    return {
      t,
      netWorkList,
      selectNetwork,
      currentNetwork,
      chooseNetWork,
      handleChoose,
      showModalNetwork,
      emitClose,
      networkLoading,
      mainNetwork,
      handleChooseComfirm,
      toAdd,
      handleModif,
      appProvide,
    };
  },
};
</script>
<style lang="scss" scoped>
.network-list {
  .btn-groups {
    margin: 50px 20px 0;
  }
  :deep(.van-button--primary) {
    border: none;
    margin: 2px 0 0;
  }
  :deep(.van-icon-success) {
    font-size: 14px;
  }
  :deep(.other-list-box) {
    max-height: inherit;
  }

  .activited-net {
    :deep(.van-hairline--top::after) {
      display: none;
    }
  }
}
.other-list-tit {
  padding: 0 15px;
  span {
    color: #8f8f8f;
    line-height: 20px;
  }
  i {
    font-size: 18px;
  }
}

.network-list-header {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 20px;
  padding: 0 15px;

  div {
    color: #8f8f8f;
  }
}
:deep(.netword-card.selected) {
  .net-name {
    color: #9F54BA;
    svg {
      fill: #9F54BA;
      margin-top: -2px;
    }
  }
}
</style>