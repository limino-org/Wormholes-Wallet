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
      class="clickActive settings-card  flex between"
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
      class="clickActive settings-card  flex between"
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
  </div>
</template>
<script lang="ts">
import Vue, { inject } from "vue";
import { Icon, Toast, Button, Sticky, Field } from "vant";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import NavHeader from "@/components/navHeader/index.vue";

export default {
  name: "settings",
  components: {
    [Icon.name]: Icon,
    NavHeader,
  },
  setup() {
    const { t } = useI18n();
    const appProvide = inject("appProvide");
    const route = useRoute();
    const router = useRouter();
    const clickLeft = () => {};
    const routerPush = (type: string, value: string) => {
      router.push({ [type]: value });
    };
    return {
      t,
      clickLeft,
      routerPush,
      route,
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
    border-bottom: 1px solid #E6E6E6;
    &:hover {
      // background: rgb(244, 247, 250);
      color: #037cd6;
      i,
      .desc,.label {
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