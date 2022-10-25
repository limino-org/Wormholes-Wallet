<template>
  <div class="page-box" id="page-box">
    <div class="van-safe-area-top"></div>
    <div class="container" id="container">
      <div v-if="loading" class="loading-box flex center">
        <van-loading size="60" color="#037CD6" vertical>{{
          t("common.loading")
        }}</van-loading>
      </div>
      <router-view v-else />
    </div>
    <div class="van-safe-area-bottom"></div>
  </div>
</template>
<script lang="ts">
import { useRouter } from "vue-router";
import {
  Ref,
  ref,
  watch,
  onBeforeMount,
  onActivated,
  onMounted,
  provide,
  nextTick,
} from "vue";
import { useStore, mapActions } from "vuex";
import { Button, Dialog, Loading, Toast } from "vant";
import { utils } from "ethers";

import { useExchanges } from "@/hooks/useExchanges";
import { useI18n } from "vue-i18n";
import { getWallet, NetStatus, getGasFee} from "./store/modules/account";
import { version } from "@/enum/version";
import { useBroadCast } from "@/utils/broadCast";
import { guid } from "@/utils/utils";
import { get_contract } from "./http/modules/common";
import { provide as appProvide } from "@/provides/app";
import localforage, { clear } from "localforage";

export default {
  components: {
    [Button.name]: Button,
    [Loading.name]: Loading,
  },

  setup() {
    const { commit, dispatch, state } = useStore();

    const { t } = useI18n();
    const router = useRouter();

    provide("appProvide", appProvide());
    const loading = ref(true);
    onBeforeMount(async () => {
      commit("system/UPDATE_TRANSFERUSDRATE", 0.5);
      commit("account/UPDATE_NETSTATUS", NetStatus.pendding);
      commit("system/UPDATA_CONVERSATIONID", guid());

      let time = setTimeout(async () => {
        await dispatch("account/waitTxQueueResponse");
        clearTimeout(time);
      }, 10000);
    });
    window.onload = () => {
      loading.value = false;
      // let time = setTimeout(function () {
      //   commit("account/UPDATE_WORMHOLES_URL", {
      //     URL: "https://api.wormholes.com",
      //     browser: "https://www.wormholesscan.com/#/",
      //   });
      //   clearTimeout(time);
      // }, 1000);
    };
    onMounted(() => {
      const { handleUpdate, broad } = useBroadCast();
      broad.onmessage = (e: any) => {
        const { data }: any = e;
        const { action, id } = data;
        if (data && action) {
          if (
            action == "wromHoles-update" &&
            id != state.system.conversationId
          ) {
            window.location.reload();
          }
        }
      };
      dispatch("account/getContractAddress");

      (async function () {
        const vuex = localStorage.getItem("vuex");
        const mnemonic = localStorage.getItem("mnemonic");
        const hasMove = localStorage.getItem("hasMove");
        console.warn("move data");
        if (!hasMove && vuex && mnemonic) {
          router.replace({ name: "guidance" });
        }
      })();

      // move mnemonic to indexDB
      (function () {
        let time = setTimeout(async () => {
          const mnemonic = await localforage.getItem("mnemonic");
          if (!state.mnemonic.mnemonic && mnemonic) {
            commit("mnemonic/UPDATE_MNEMONIC", mnemonic);
          }
          clearTimeout(time);
        }, 5000);
      })();


    });
    return {
      loading,
      t,
    };
  },
};
</script>
<style lang="scss">
.page-container {
  min-height: calc(100vh - 48px);
  position: relative;
  box-sizing: border-box;
  padding-bottom: 30px;
  &::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }
}
:deep(.van-popup) {
  position: absolute;
}
.page-box {
  transition: transform 0.35s, opacity 0.35s;
  position: relative;
  max-width: 750px;
  margin: 0 auto;
  min-height: 100vh;
  background: #fff;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 0 !important;
    display: none;
  }
  :deep(.van-toast) {
    word-break: keep-all !important;
  }
  & > .container > .loading-box {
    height: 100vh;
  }
}
</style>
