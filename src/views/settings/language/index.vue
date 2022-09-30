<template>
       <NavHeader :title="t('setting.langTit')">
      <template v-slot:left>
        <span class="back" @click="appProvide.back">{{t('common.back')}}</span>
      </template>
    </NavHeader>
  <div class="language">
    <div class="list flex between">
      <div
        :class="`card clickActive flex between column ${
          lang == item.value ? 'active' : ''
        }`"
        v-for="item in langs"
        :key="item.value"
        @click="setLanguage(item)"
      >
        <div class="tit">{{ item.info }}</div>
        <div class="tit2">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { computed, reactive } from "vue";
import { Icon, Toast, Button, Sticky, Field, Dialog } from "vant";
import { useRoute, useRouter } from "vue-router";
import { Language, languages } from "@/enum/language";
import { defineComponent, Ref, ref, watch, SetupContext, inject } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { vantLangs } from "@/language/index";
import { Locale } from "vant";
import NavHeader from "@/components/navHeader/index.vue";

export default {
  name: "language",
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    NavHeader
  },
  setup(props: any, context: SetupContext) {
    const appProvide = inject('appProvide')
    const { locale,t } = useI18n();
    const store = useStore();
    const { dispatch, state } = store;
    const lang = computed(() => state.system.language);
    if (!lang.value) {
      const language = // @ts-ignore
      (
        // @ts-ignore
        navigator.language ? navigator.language : navigator.userLanguage
      ).toLowerCase();
      const langName = language.split("-")[0] != "zh" ? "en" : "zh";
      dispatch("system/setLanguage", langName);
    }
    const setLanguage = (item: Language) => {
      const { value } = item;
      locale.value = value;
      console.log("vantLangs", vantLangs);
      console.log("value", value);
      // @ts-ignore
      console.log("vantLangs[value].value", vantLangs[value]["package"]);
      // @ts-ignore
      Locale.use(vantLangs[value].value, vantLangs[value]["package"]);
      dispatch("system/setLanguage", value);
    };
    const langs = reactive(languages);
    return {
      langs,
      setLanguage,
      appProvide,
      lang,
      t
    };
  },
};
</script>
<style lang="scss" scoped>
.language {
  padding-bottom: 100px;
  .list {
    padding: 15px;
  }
  .card {
    width: 48%;
    padding: 15px;
    height: 80px;
    border: 1px solid rgba(240, 240, 240, 1);
    border-radius: 5px;
    box-sizing: border-box;
    transition: ease 0.2s;
    &:hover {
      color: #1989fa;
    }
    &.active {
      border: 1px solid #1989fa;
    }
    .tit {
      font-size: 10px;
      line-height: 14px;
    }
    .tit2 {
      font-size: 16px;
      line-height: 18px;
      font-weight: bold;
    }
  }
}
</style>