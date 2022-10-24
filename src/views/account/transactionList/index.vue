<template>
  <van-sticky>
    <NavHeader :title="t('setting.transitionHistory')">
      <template v-slot:left>
       <span class="back hover f-12" @click="back">{{t('createAccountpage.back')}}</span>
      </template>
    </NavHeader>
  </van-sticky>
  <div class="transaction-history">
    <!-- <van-sticky offset-top="48">
      <div class="flex center tabs-box pt-14">
        <div class="tabs flex between center-v hover van-hairline--surround">
          <div
            :class="`tab text-center lh-24 ${item.select ? 'active' : ''}`"
            @click="changeTab(item)"
            v-for="item in tabs.list"
            :key="item.value"
          >{{ $t(item.name) }}</div>
        </div>
      </div>
    </van-sticky> -->
    <div class="all" v-show="chooseTabdata.value == 1">
      <!-- Transactions -->
      <div v-if="transactionList.length">
        <CollectionCard @handleClick="handleView(item)" v-for="item in transactionList" :key="item.to" :data="item" />
      </div>
      <no-data v-else />
    </div>
    <!-- <div class="receive" v-show="chooseTabdata.value == 2"></div>
    <div class="send" v-show="chooseTabdata.value == 3">
      <div v-if="sendList.length">
        <CollectionCard @handleClick="handleView(item)" v-for="item in sendList" :key="item.to" :data="item" />
      </div>
      <no-data v-else />
    </div>
    <div class="swap" v-show="chooseTabdata.value == 4">
      <div v-if="swapList.length">
        <CollectionCard @handleClick="handleView(item)" v-for="item in swapList" :key="item.to" :data="item" />
      </div>
      <no-data v-else />
    </div>

    <div class="other" v-show="chooseTabdata.value == 5">
      <div v-if="otherList.length">
        <CollectionCard @handleClick="handleView(item)" v-for="item in otherList" :key="item.to" :data="item" />
      </div>
      <no-data v-else />
    </div> -->
  </div>
  <!-- View transaction details -->
  <van-dialog v-model:show="showTransactionModal" title :showCancelButton="false" :showConfirmButton="false" closeOnClickOverlay>
    <TransactionDetail @handleClose="handleClose" :data="transactionData.data" />
  </van-dialog>
</template>
<script lang="ts">
import { ref, Ref, computed, toRaw, SetupContext, onMounted, reactive,inject } from 'vue'
import { Icon, NavBar, Form, Field, CellGroup, Button, Tab, Tabs, Dialog, IndexBar, IndexAnchor, Sticky, Toast, Empty } from 'vant'
import TokenCard from '@/views/account/components/tokenCard/index.vue'
import TransactionDetail from '@/views/account/components/transactionDetail/index.vue'

import NavHeader from '@/components/navHeader/index.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getRandomIcon } from '@/utils'
import CollectionCard from '@/views/account/components/collectionCard/index.vue'
import { TransactionTypes } from '@/store/modules/account'
import localforage from 'localforage'
export default {
  name: 'transaction-history',
  components: {
    [Icon.name]: Icon,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Sticky.name]: Sticky,
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
    [Dialog.Component.name]: Dialog.Component,
    [Empty.name]: Empty,
    CollectionCard,
    TransactionDetail,
    NavHeader
  },
  setup() {
    const appProvide = inject('appProvide')
    const { t } = useI18n()
    const store = useStore()
      console.log('-=============================',)

    const tabs = reactive({
      list: [
        { name: t('transationHistory.all'), value: 1, select: true },
        // { name: "Receive", value: 2, select: false },
        { name: t('transationHistory.send'), value: 3, select: false },
        { name: t('transationHistory.swap'), value: 4, select: false },
        { name: t('transationHistory.other'), value: 5, select: false }
      ]
    })
    const changeTab = (e: any) => {
      const { value, select } = e
      if (select) {
        return
      } else {
        tabs.list.forEach((item, idx) => {
          if (item.value == value) {
            item.select = true
          } else {
            item.select = false
          }
        })
      }
    }
    // Selected tab'
    const chooseTabdata = computed(() => tabs.list.find(item => item.select))
    const router = useRouter()
    const back = () => {
      router.go(-1)
    }
    const { accountInfo, currentNetwork } = store.state.account
    
    // Current account transaction list
    let tlist: any = ref([])
    onMounted(async() => {
      console.log('----------------------------------------',currentNetwork)
      const txList: any = await localforage.getItem(`txlist-${currentNetwork.id}`) || {}
      try {
      Object.keys(txList).forEach(key => {
        txList[key].forEach((item: any) => {
          tlist.value.push(item)
        })
      })
    } catch (err) {
      tlist.value = []
    }
    console.log('tlist', tlist.value)
    })
    // try {
    //   Object.keys(store.state.account.currentNetwork.transactionList).forEach(key => {
    //     store.state.account.currentNetwork.transactionList[key].forEach((item: any) => {
    //       tlist.value.push(item)
    //     })
    //   })
    // } catch (err) {
    //   tlist.value = []
    // }

    // All transactions
    const transactionList = computed(() => {
      return tlist.value.sort((a: any,b:any) =>  new Date(b.date).getTime() - new Date(a.date).getTime())
    })

    // Send record
    const sendList = computed(() => {
      const newlist = tlist.value || []
      return newlist.filter((item: any) => {
        return item.txType == TransactionTypes.default
      })
    })
    // swap transaction
    const swapList = computed(() => {
      const newlist = tlist.value || []
      return newlist.filter((item: any) => {
        return item.txType == TransactionTypes.swap
      })
    })
    // Other records
    const otherList = computed(() => {
      const newlist = tlist.value || []
      return newlist.filter((item: any) => {
        return item.txType == TransactionTypes.other || item.txType == TransactionTypes.contract
      })
    })
    // Transaction details data
    let transactionData: any = reactive({ data: {} })
    const showTransactionModal: Ref<boolean> = ref(false)
    // View transaction details event
    const handleView = (e: any) => {
      transactionData.data = e
      showTransactionModal.value = true
    }
    const handleClose = () => {
      showTransactionModal.value = false
    }
    return {
      tabs,
      changeTab,
      t,
      chooseTabdata,
      back,
      transactionList,
      sendList,
      transactionData,
      handleView,
      handleClose,
      showTransactionModal,
      otherList,
      swapList,
      appProvide
    }
  }
}
</script>
<style lang="scss" scoped>
.transaction-history {
  height: calc(100vh - 48px - 16px);
  overflow-y: scroll;
}
.tabs-box {
  background: #fff;
}
.tabs {
  width: 345px;
  &::after {
    border-color: #037cd6;
    border-radius: 26px;
  }
  .tab {
    width: 100px;
    line-height: 26px;
    border-radius: 12px;
    font-size: 12px;
    &.active {
      background: #037cd6;
      // border: 1PX solid #037cd6;
      color: #fff;
    }
  }
}
</style>