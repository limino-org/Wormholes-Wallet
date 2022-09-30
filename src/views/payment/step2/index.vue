<template>
  <div class="step2 flex column between page-container">
    <div class="amount-form">
      <div class="step2-tit">{{t('send.enter')}}</div>
      <div class="search-box flex center-v" @click="handleShowBoard">
        <van-field v-model="amount"></van-field>
        <span class="currency">ERB</span>
      </div>
    </div>
    <div class="btn-bottom">
      <van-button plain block type="primary" @click="resetAmount">{{t('wallet.reset')}}</van-button>
      <van-button class="next" block type="primary" @click="toSendLink">{{t('wallet.next')}}</van-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Field, Icon, Button, NumberKeyboard } from "vant";
import { ref, Ref } from "vue";
import { useRouter, Router } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default {
  name:'paymentStep2',
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [NumberKeyboard.name]: NumberKeyboard,
  },
  setup() {
    const{t}=useI18n()
    const router: Router = useRouter()
    const amount: Ref<string> = ref('0');

    const resetAmount = () => {
        amount.value = '0'
    }
    const toSendLink = () => {
        router.push({
            name: 'sendLink',
            query: {
              amount: amount.value
            }
        })
    }
    return {
      t,
      amount,
      resetAmount,
      toSendLink
    };
  },
};
</script>
<style lang="scss" scoped>
:deep(.van-field) {
  padding: 0;
}
:deep(.van-cell:after){
  display: none;
}
.step2 {
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
    &-value {
      color: rgba(224, 227, 229, 1);
      font-size: 20px;
      margin-right: 6px;
    }
  }
  .currency {
    font-size: 20px;
  }
  .next {
    margin: 15px 0 30px;
  }
}
</style>