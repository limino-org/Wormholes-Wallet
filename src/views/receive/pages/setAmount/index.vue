<template>
    <van-sticky>
    <NavHeader :title="t('receive.receive')">
      <template v-slot:left>
       <span class="back hover f-12" @click="back">{{t('createAccountpage.back')}}</span>
      </template>
    </NavHeader>
  </van-sticky>
  <div class="page-set-amount">
    <div class="tit">{{t('receive.enterNum')}}</div>
    <div class="amount-box flex between">
      <div class="flex center-v">
        <input
        v-model="amount"
          type="number"
          placeholder="Enter the amount"
          class="ipt"
          maxlength="24"
        />
      </div>
      <div class="flex center-v right">
        <div
          class="token-info hover flex center-v between pr-6 pl-6 hover"
          @click="handleTokenModal"
        >
          <div class="xuanwo flex center">
            <img src="@/assets/token/logowallet.png" alt="icon-blue" />
          </div>
          <div class="van-ellipsis ml-6 mr-6 token-name lh-14">
            {{ chooseToken.name }}
          </div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
  <div class="btn-group">
    <div class="container pl-24 pr-24">
      <van-button plain class="mb-14" block @click="reset">{{t('receive.reset')}}</van-button>
      <van-button type="primary" block @click="handlerNext">{{t('receive.next')}}</van-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getWallet } from "@/store/modules/account";
import { computed, onMounted, ref } from "@vue/runtime-core";
import { Button as vanButton, Icon as vanIcon, Field as vanField, Toast, Sticky as vanSticky } from "vant";
import NavHeader from '@/components/navHeader/index.vue'
import { useI18n } from "vue-i18n";
import { inject } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const appProvide = inject('appProvide')
const store = useStore();
const { commit } = store;
const { t } = useI18n();
const router = useRouter();
const route = useRoute()
const { dispatch } = store;
const accountInfo = computed(() => store.state.account.accountInfo);
const currentNetwork = computed(() => store.state.account.currentNetwork);
// Default token/ selected token data
const chooseToken = computed(() => {
  const symbol = currentNetwork.value.currencySymbol;
  const balance = accountInfo.value.amount;
  const data = {
    balance,
    logoUrl: "",
    name: symbol,
    precision: 1,
    symbol,
    tokenContractAddress: null,
  };
  const token = store.state.transfer.chooseToken;
  if (token) {
    return token;
  } else {
    return data;
  }
});

const handleTokenModal = () => {
  router.push({
    name: "receive-choose",
    query: {
      clickBackUrl: "receive-set-amount",
      backUrl: "receive-set-amount",
    },
  });
};
const back = () => {
  router.replace({name:'receive-choose'})
}
const amount = ref('')
const code = ref({})

onMounted(async() => {
    const wallet = await getWallet()
    const { address } = wallet
    const { tokenContractAddress,symbol,name } = route.query
    code.value = JSON.stringify({ data: { address, tokenContractAddress, value: amount.value,symbol,name }, type: 'receive' })
})

const reset = () => {
    amount.value = ''
}
const handlerNext = () => {
    if(parseFloat(amount.value) <= 0 || !amount.value){
        Toast(t('receive.numTip'))
        return
    }
    const {type,data}: any = {...JSON.parse(code.value.toString())}
    router.push({
        name:"receive-send-link",
        query: {code:JSON.stringify({type,data:{...data,value:amount.value}})}
    })
}
</script>
<style lang="scss">
.title {
  font-size: 16px;
    color: #000;
  font-weight: bold;
}
.page-set-amount {
  padding: 22px 15px 0;
  .tit {
    line-height: 20px;
    font-size: 14px;
  }
  .amount-box {
    height: 75px;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #bbc0c5;
    padding: 0 15px;
    .ipt {
      border: none;
      outline: none;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
    }
    .token-info {
      height: 35px;
      border-radius: 17.5px;
      background: #f1f3f4;
       i {
        color: #9F54BA;
        font-size: 16px;
       }
       .token-name {
        font-size: 12px;
       }
    }
    .xuanwo {
      img {
        width: 20px;
        object-fit: cover;
      }
    }
  }
}
.btn-group {
  position: fixed;
  bottom: 25px;
  left: 0;
  right: 0;
}
</style>