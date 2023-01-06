<template>
  <NavHeader :title="t('common.setting')">
    <template v-slot:left>
      <span class="back" @click="appProvide.back">{{ t("common.back") }}</span>
    </template>
  </NavHeader>
  <div class="settings settings-index">
    <div
      class="clickActive settings-card flex between"
      @click="routerPush('name', 'networkList')"
    >
      <div>
        <div class="flex between title center-v">
          <div class="label">{{ t("setting.networks") }}</div>
        </div>
        <div class="desc">{{ t("setting.networkstltle") }}</div>
      </div>
      <div class="icon flex center"><van-icon name="arrow" /></div>
    </div>
    <div
      class="clickActive settings-card flex between"
      @click="routerPush('name', 'successpage')"
    >
      <div>
        <div class="flex between title center-v">
          <div class="label">{{ t("setting.safety") }}</div>
        </div>
        <div class="desc">
          {{ t("setting.safetytltle") }}
        </div>
      </div>

      <div class="icon flex center"><van-icon name="arrow" /></div>
    </div>

    <div
      class="clickActive settings-card flex between"
      @click="routerPush('name', 'mnemonic')"
    >
      <div>
        <div class="flex between title center-v">
          <div class="label">{{ t("importByMnemonic.mnemonicExport") }}</div>
        </div>
        <div class="desc">
          {{ t("importByMnemonic.backUpDesc") }}
        </div>
      </div>

      <div class="icon flex center"><van-icon name="arrow" /></div>
    </div>
    <div
      class="clickActive settings-card flex between"
      @click="routerPush('name', 'language')"
    >
      <div>
        <div class="flex between title center-v">
          <div class="label">{{ t("setting.langTit") }}</div>
        </div>
        <div class="desc">
          {{ t("setting.languageSelection") }}
        </div>
      </div>
      <div class="icon flex center"><van-icon name="arrow" /></div>
    </div>
    <div class="btn-groups">
      <div class="container flex center pl-26 pr-26">
        <van-button
          type="primary"
          block
          :loading="loading"
          @click="handleClearCanche"
          >{{ t("common.clearCanche") }}</van-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { inject, ref } from "vue";
import { Icon, Toast, Button, Sticky, Field } from "vant";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import NavHeader from "@/components/navHeader/index.vue";
import { useStore } from "vuex";
import localforage from "localforage";
import { useToast } from "@/plugins/toast";

export default {
  name: "settings",
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    NavHeader,
  },
  setup() {
    const { t } = useI18n();
    const appProvide = inject("appProvide");
    const route = useRoute();
    const router = useRouter();
    const { state } = useStore();
    const clickLeft = () => {};
    const { $wtoast } = useToast();
    const routerPush = (type: string, value: string) => {
      router.push({ [type]: value });
    };
    const loading = ref(false);
    const handleClearCanche = async () => {
      loading.value = true;
      try {
        await localforage.iterate(async (value, key, iterationNumber) => {
          if (key !== "vuex") {
            await localforage.removeItem(key);
          }
        });
        $wtoast.success(t("common.clearCancheSuccess"));
      } finally {
        loading.value = false;
      }
    };
    return {
      t,
      clickLeft,
      loading,
      routerPush,
      route,
      handleClearCanche,
      appProvide,
    };
  },
};
</script>
<style lang="scss" scoped>
.settings-index {
  .settings-card {
    padding: 13px 12px 16px 14px;
    transition: ease 0.3s;
    border-bottom: 1px solid #e6e6e6;
    &:hover {
      // background: rgb(244, 247, 250);
      color: #037cd6;
      i,
      .desc,
      .label {
        color: #037cd6;
      }
    }
    .title {
      .label {
        font-size: 15px;
        font-weight: bold;
        line-height: 21px;
      }
    }
    .desc {
      margin-top: 1px;
      font-size: 12px;
      color: #848484;
      line-height: 18px;
    }
  }
  .icon {
    font-size: 18px;
    color: rgb(138, 133, 133);
  }
}
</style>