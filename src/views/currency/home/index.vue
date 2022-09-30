<template>
  <div class="currency">
    <div class="flex center">
      <div class="flex center currency-icon">
        <img class="currency-symbol" :src="require(`@/assets/token/icon_black.svg`)" alt="'" />
      </div>
    </div>
    <div :class="`amount text-center ${decimal(pageData.data.balance).length > 30 ? 'small' : 'big'}`">{{ decimal(pageData.data.balance) }} {{ pageData.data.symbol }}</div>
    <div class="text-center lh-16 f-12 mb-20 amount2">≈ $ {{toUsd(pageData.data.balance, 2)}}</div>
    <div class="flex center">
      <div class="actions-list flex between">
        <div class="actions-list-card">
          <div class="actions-list-card-icon flex center" @click.stop="toogleAcceptCode">
            <i class="iconfont icon-bottom"></i>
          </div>
          <div class="actions-list-card-label text-center">{{ t("wallet.takeover") }}</div>
          <van-popup v-model:show="showAcceptCode" class="receive-sheet-popup" teleport="#page-box"  position="bottom" round>
            <AcceptCode />
          </van-popup>
        </div>
        <div class="actions-list-card" @click="toSend">
          <div class="actions-list-card-icon flex center">
            <i class="iconfont icon-jiantou_youshang"></i>
          </div>
          <div class="actions-list-card-label text-center">{{ t("wallet.send") }}</div>
        </div>
      </div>
    </div>
    <div class="swap-list">
      <CollectionCard @handleClick="handleView(item)" v-for="item in transactionList" :key="item.address" :data="item" />
      <NoData v-if="!transactionList.length" :message="$t('wallet.no')" />
      <i18n-t tag="div" keypath="wallet.toBrowser" class="flex center scan-link pb-30">
        <template v-slot:link>
          <a :href="VUE_APP_SCAN_URL" target="_blank" rel="noopener noreferrer">{{t('wallet.scanLink')}}</a>
        </template>
      </i18n-t>
      <van-dialog v-model:show="showTransactionModal" title :showCancelButton="false" :showConfirmButton="false" closeOnClickOverlay>
        <TransactionDetail @handleClose="handleClose" :data="transactionData.data" />
      </van-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, reactive, onMounted, computed, toRefs, onBeforeMount } from 'vue'
import { Icon, Popup, Empty, Dialog } from 'vant'
import CollectionCard from '@/views/account/components/collectionCard/index.vue'
import { addressMask, decimal, toUsd } from '@/utils/filters'
import AcceptCode from '@/views/account/components/acceptCode/index.vue'
import TransactionDetail from '@/views/account/components/transactionDetail/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { hexValue } from '@ethersproject/bytes'
import { useI18n } from 'vue-i18n'
import NoData from '@/components/noData/index.vue'
import {VUE_APP_SCAN_URL} from '@/enum/env'

export default {
  components: {
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Empty.name]: Empty,
    [Dialog.Component.name]: Dialog.Component,
    CollectionCard,
    AcceptCode,
    TransactionDetail,
    NoData
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const store = useStore()
    const { query } = useRoute()
    const { tokenContractAddress } = query
    const accountInfo = computed(() => store.state.account.accountInfo)
    const currentNetwork = computed(() => store.state.account.currentNetwork)
    const transactionList = computed(() => {
      const { accountInfo } = store.state.account
      const { address } = accountInfo
      const list = currentNetwork.value.transactionList[address.toUpperCase()]
      return list || []
    })
    const pageData = reactive({ data: {} })
    pageData.data = query
  
    const toogleAcceptCode = () => {
          const params = {
        type: "receive",
        data: {
          address: accountInfo.value.address,
          tokenContractAddress: null,
          value: 0,
          symbol: currentNetwork.value.symbol,
          name: currentNetwork.value.name,
        },
      };
      router.push({
        name: "receive-send-link",
        query: {
          code: JSON.stringify(params),
        },
      });
    }

    const toBuy = () => {
    }

    const toSend = () => {
      router.push({ name: 'send', query })
    }
    const toSwap = () => {
    }
    let transactionData: any = reactive({ data: {} })
    const showTransactionModal: Ref<boolean> = ref(false)
    const handleView = (e: any) => {
      transactionData.data = e
      showTransactionModal.value = true
    }
    const handleClose = () => {
      showTransactionModal.value = false
    }
    return {
      t,
      accountInfo,
      toogleAcceptCode,
      toSend,
      toBuy,
      toSwap,
      handleView,
      handleClose,
      showTransactionModal,
      transactionData,
      decimal,
      currentNetwork,
      transactionList,
      pageData,
      toUsd,
      VUE_APP_SCAN_URL
    }
  }
}
</script>
<style lang="scss" scoped>
.currency {
  .scan-link {
    color: #848484;
    margin-top: 40px;
     a {
      margin-left: 3px;
      color: #037CD6;
      &:hover {
        text-decoration: underline;
      }
     }
  }
  .currency-icon {
    width: 40px;
    height: 40px;
    .currency-symbol {
      width: 37.5px;
      // border-radius: 50%;
    }
  }
  &-icon {
    margin-top: 25px;
    width: 34px;
    height: 59px;
    border-radius: 50%;
    margin-bottom: 5px;
  }
  .amount {
    line-height: 42px;
    font-size: 24px;
    font-weight: 600;
    &.small {
      font-size: 16px;
    }
    &.big {
      font-size: 22px;
    }
  }
  .amount2 {
    color: #848484;
  }
  .actions-list {
    &-card {
      width: 32px;
      margin: 0 10px;
      &-icon {
        height: 32px;
        background: rgba(3, 125, 214, 1);
        border-radius: 32px;
        transition: ease 0.3s;
        i {
          font-size: 18px;
        }
        &:hover {
          background: rgb(4, 110, 190);
          box-shadow: 0 3px 4px rgb(166, 213, 248);
        }
      }
      &-label {
        line-height: 16px;
        color: rgba(3, 125, 214, 1);
        font-size: 12px;
        margin-top: 7px;
      }
    }
  }

  .swap-list {
    margin-top: 20px;
    border-top: 1px solid #E4E7E8;
  }
}
.iconfont {
  color: #fff;
}
</style>