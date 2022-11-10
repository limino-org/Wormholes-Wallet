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
      <div class="actions-list flex evenly">
        <div class="actions-list-card">
          <div class="flex center">
            <div class="actions-list-card-icon flex center" @click.stop="toogleAcceptCode">
            <i class="iconfont icon-bottom"></i>
          </div>
          </div>
          <div class="actions-list-card-label text-center">{{ t("wallet.takeover") }}</div>
          <!-- <van-popup v-model:show="showAcceptCode" class="receive-sheet-popup" teleport="#page-box"  position="bottom" round>
            <AcceptCode />
          </van-popup> -->
        </div>
        <div class="actions-list-card" @click="toSend">
          <div class="flex center">
            <div class="actions-list-card-icon flex center">
            <i class="iconfont icon-jiantou_youshang"></i>
          </div>
          </div>
          <div class="actions-list-card-label text-center">{{ t("wallet.send") }}</div>
        </div>
      </div>
    </div>
    <div class="swap-list">
      <CollectionCard @handleClick="handleView(item)" @handleSend="handleSend" @handleCancel="handleCancel" v-for="item in txList" :key="item.address" :data="item" />
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
  <CommonModal v-model="showSpeedModal" title="发送替换交易">
    <div class="pt-20">
      <div>nonce {{sendTx.nonce}}</div>
      <div>gasLimit {{ethers.utils.formatEther(sendTx.sendData.gasLimit) }}</div>
      <div>gasPrice {{sendTx.sendData.gasPrice ? ethers.utils.formatEther(sendTx.sendData.gasPrice) : 0}}</div>
      <div>value {{ethers.utils.formatEther(sendTx.sendData.value)}}</div>
    </div>
    <div class="sendBtnBox pb-20 mt-20">
      <van-button type="primary" @click="reSendTx" :loading="reloading">重新提交</van-button>
    </div>
  </CommonModal>
</template>
<script lang="ts">
import { ref, Ref, reactive, onMounted, computed, toRefs, onBeforeMount } from 'vue'
import { Icon, Popup, Empty, Dialog, Button } from 'vant'
import CollectionCard from '@/views/account/components/collectionCard/index.vue'
import { addressMask, decimal, toUsd } from '@/utils/filters'
import AcceptCode from '@/views/account/components/acceptCode/index.vue'
import TransactionDetail from '@/views/account/components/transactionDetail/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { hexValue } from '@ethersproject/bytes'
import { useI18n } from 'vue-i18n'
import CommonModal from '@/components/commonModal/index.vue'
import NoData from '@/components/noData/index.vue'
import {VUE_APP_SCAN_URL} from '@/enum/env'
import localforage from 'localforage'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { getWallet } from '@/store/modules/account'
export default {
  components: {
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Empty.name]: Empty,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    CollectionCard,
    AcceptCode,
    TransactionDetail,
    NoData,
    CommonModal
  },
  setup() {
    
    const { t } = useI18n()
    const router = useRouter()
    const store = useStore()
    const { query } = useRoute()
    const { tokenContractAddress } = query
    const accountInfo = computed(() => store.state.account.accountInfo)
    const currentNetwork = computed(() => store.state.account.currentNetwork)
    const transactionList = ref([])
    const pageData = reactive({ data: {} })
    pageData.data = query
    // const txList = computed(() => {
    //   return transactionList.value.sort((a: any,b:any) =>  new Date(b.date).getTime() - new Date(a.date).getTime())
    // })
    const txList = ref([]);
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

    onMounted(async() => {
      // const wallet = await getWallet()
      // const data = await wallet.provider.waitForTransaction("0x2f175dda5f06ef17afa057e3b7475f716c9abad87dcaee094856c9e5fe57ba98")
      // debugger
      const id = currentNetwork.value.id;
      const targetAddress = accountInfo.value.address.toUpperCase();
      const tx: any = await localforage.getItem(`txlist-${id}`);
      if (tx && tx[targetAddress]) {
        const list = tx[targetAddress] || [];
        if (tokenContractAddress) {
          txList.value = list.filter(
            (item: any) =>
              item.tokenAddress &&
              item.tokenAddress.toUpperCase() ==
                tokenContractAddress.toString().toUpperCase()
          );
        } else {
          txList.value = list.filter((item: any) => !item.tokenAddress);
        }
      }
    })
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
    const showSpeedModal = ref(false)
    const sendTx = ref({})
    const handleSend = (data: any) => {
      sendTx.value = data
      showSpeedModal.value = true
    }
    const reloading = ref(false)
    const reSendTx = async() => {
      reloading.value = true
      try {
        const wallet = await getWallet()
      const network = await wallet.provider.getNetwork()
      const { gasPrice, gasLimit, value, nonce, to, network: localNet, sendData, txType }: any = sendTx.value
      const gasp =  Number(gasPrice) ? new BigNumber(gasPrice).dividedBy(1000000000).toFixed(12) : '0.0000000012';
      const bigGas = ethers.utils.parseEther(gasp)
      const tx = {
        to,
        // @ts-ignore
        value: ethers.utils.parseEther(ethers.utils.formatEther(sendTx.value.sendData.value)),
        nonce,
        gasPrice: bigGas,
        gasLimit,
        chainId: network.chainId
      }
      debugger
      // const newTx = await wallet.signTransaction(tx)
      const data = await wallet.sendTransaction(tx)
      debugger
      const receipt = await wallet.provider.waitForTransaction(data.hash)
      store.commit('account/UPDATE_TRANSACTION', {...sendTx.value,receipt,network:localNet, sendData: data, gasPrice: bigGas, gasLimit })
      setTimeout(() => {
        location.reload()
      },1000)
      }catch(err){
        console.error(err)
      }finally{
        reloading.value = false
      }
    }
    const handleCancel = () => {
      console.warn('cancel...')
    }
    return {
      showSpeedModal,
      handleSend,
      sendTx,
      reSendTx,
      handleCancel,
      t,
      ethers,
      accountInfo,
      toogleAcceptCode,
      toSend,
      toSwap,
      handleView,
      handleClose,
      showTransactionModal,
      reloading,
      transactionData,
      decimal,
      currentNetwork,
      transactionList,
      pageData,
      toUsd,
      VUE_APP_SCAN_URL,
      txList
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(){
  .van-dialog__footer {
    display: none;
  }
}
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
    width: 50%;
    &-card {
      width: 60px;
      &-icon {
        height: 32px;
        width: 32px;
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