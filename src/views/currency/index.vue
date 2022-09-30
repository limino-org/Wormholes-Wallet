<template>
  <div class="currency">
    <van-sticky>
      <NavHeader :hasRight="false">
        <template v-slot:left>
          <span class="back hover" @click="back">{{t('createAccountpage.back')}}</span>
        </template>
        <template v-slot:title>
                  <div class="flex center title">{{t('wallet.token')}}</div>

        </template>
      </NavHeader>
    </van-sticky>
    <router-view />
  </div>
</template>
<script lang="ts">
import NavHeader from "@/components/navHeader/index.vue";
import { Icon, Sticky } from "vant";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
export default {
  name:'currency',
  components: {
    [Icon.name]: Icon,
    [Sticky.name]: Sticky,
    NavHeader,
  },
  setup() {
    const router = useRouter();
    const {t} = useI18n()
    const back = () => {
      router.replace({name:"wallet"});
    };
    return {
      back,
      t
    };
  },
};
</script>
<style lang="scss" scoped>
.currency {
  .title {
      font-size: 16px;
    color: #000;
  font-weight: bold;
  }
  .back-icon {
    color: rgba(3, 125, 214, 1);
    font-size: 22px;
    margin-left: -6px;
  }
}
</style>