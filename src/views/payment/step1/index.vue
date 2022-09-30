<template>
  <div class="step1">
    <div class="step1-tit">{{t('send.requestasset')}}</div>
    <div class="search-box flex between center-v">
      <van-icon name="search" />
      <van-field
        v-model="value"
        label=""
        :placeholder="$t('send.enterfind')"
      />
    </div>
    <div class="step1-tit">{{t('send.searchresults')}}</div>
    <div class="search-list">
      <div class="search-list-card flex center-v" @click="toEnterAmount(item)" v-for="item in accountInfo.token" :key="item.name">
          <div class="currency-icon flex center-v">
              <img v-if="item" :src="require(`@/assets/token/${item.logoUrl}`)" alt="">
          </div>
          <div class="currency-info">
              <div class="currency-info-tit">{{item.symbol}}</div>
              <div class="currency-info-type">{{item.name}}</div>
          </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Field, Icon } from "vant";
import { useRouter, useRoute } from 'vue-router';
import { computed, reactive, Ref, ref } from 'vue';
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
export default {
  name:'paymentStep1',
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
  },
  setup() {
    const {t}=useI18n()
      const router = useRouter()
      const route = useRoute()
      const { name } = route.query
      const { state } = useStore()
      const value:Ref<string> = ref('')
      const accountInfo = computed(() => state.account.accountInfo)
      const toEnterAmount = ({ symbol }: any) => {
          router.push({
              name: 'step2',
              query: { name }
          })
      }
      return {
          t,
          toEnterAmount,
          value,
          accountInfo
      }
  },
};
</script>
<style lang="scss" scoped>
:deep(.van-field) {
  padding: 0;
}
.step1 {
  padding: 0 20px;
  &-tit {
    font-size: 14px;
    line-height: 20px;
    margin-top: 23px;
    margin-bottom: 10px;
  }
  .search-box {
    height: 30px;
    background: #ffffff;
    padding: 0 12px;
    border-radius: 5px;
    border: 1px solid #e8e9eb;
    i {
      font-size: 20px;
      color: #8591a2;
      margin-right: 10px;
    }
  }
  .search-list {
    &-card {
      height: 65px;
      background: #ffffff;
      border-radius: 5px;
      border: 1px solid #e8e9eb;
      margin-bottom: 10px;
      padding: 12px 20px 12px 4px;
      box-sizing: border-box;
      .currency-icon {
          margin-right: 10px;
          width: 50px;
          img {
            width: 100%;
            object-fit: contain;
          }
      }
      .currency-info {
          &-tit {
              font-size: 15px;
          }
          &-type {
              font-size: 12px;
              line-height: 21px;
          }
      }
    }
  }
}
</style>