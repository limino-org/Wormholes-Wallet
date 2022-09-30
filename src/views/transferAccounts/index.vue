<template>
  <div class>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script lang="ts">
import Vue, { computed, ref } from 'vue'
import { Icon, Toast, Button, Sticky, Field, Dialog } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  name: 'pagetransferAccounts',
  components: {
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const back = () => {
      router.replace({name:'wallet'})
    }
    return {
      t,
      back
    }
  }
}
</script>
<style lang="scss" scoped>

</style>