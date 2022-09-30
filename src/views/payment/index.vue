<template>
  <van-sticky>
    <NavHeader :hasLeft="false">
      <template v-slot:title>
        <span class="header-tit">{{t('send.sendbutton')}}</span>
      </template>
      <template v-slot:right>
        <van-icon name="cross" class="back-btn" @click="close" />
      </template>
    </NavHeader>
  </van-sticky>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<script lang="ts">
import NavHeader from "@/components/navHeader/index.vue";
import { Icon, Sticky } from "vant";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n'
export default {
  name: "payment",
  components: {
    NavHeader,
    [Icon.name]: Icon,
    [Sticky.name]: Sticky,
  },
  setup() {
    const {t}=useI18n()
    const router = useRouter();
    const close = () => {
      router.replace({ name: "wallet" });
    };
    return {
      t,
      close,
    };
  },
};
</script>
<style lang="scss" scoped>
.header-tit {
  line-height: 24px;
  font-size: 17px;
}
.back-btn {
  font-size: 18px;
  color: #037dd6;
}
</style>