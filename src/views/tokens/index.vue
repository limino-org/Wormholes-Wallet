<template>
  <van-sticky>
    <NavHeader :title="t('wallet.importToken')">
          <template v-slot:left>
       <span class="back hover" @click="clickLeft">{{t('createAccountpage.back')}}</span>
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
import { Icon, Toast, Button, Sticky, Field } from 'vant'
import NavHeader from '@/components/navHeader/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default {
  name: 'page-tokens',
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    NavHeader
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const clickLeft = () => {
      router.back()
    }
    return {
      route,
      clickLeft,
      t
    }
  }
}
</script>
<style lang="scss" scoped>
.back {
  color: #037CD6;
  font-size: 12px;
}
.title {
  font-size: 16px;
}
</style>