<template>
  <div class="currency">
    <div class="flex center">
      <div class="flex center currency-icon">
        <img
          class="currency-symbol"
          :src="require(`@/assets/token/icon_black.svg`)"
          alt="'"
        />
      </div>
    </div>
    <div
      :class="`amount text-center ${
        decimal(pageData.data.balance).length > 30 ? 'small' : 'big'
      }`"
    >
      {{ decimal(pageData.data.balance) }} {{ pageData.data.symbol }}
    </div>
    <div class="text-center lh-16 f-12 mb-20 amount2">
      ≈ $ {{ toUsd(pageData.data.balance, 2) }}
    </div>
    <div class="flex center">
      <div class="actions-list flex evenly">
        <div class="actions-list-card">
          <div class="flex center">
            <div
              class="actions-list-card-icon flex center"
              @click.stop="toogleAcceptCode"
            >
              <i class="iconfont icon-bottom"></i>
            </div>
          </div>
          <div class="actions-list-card-label text-center">
            {{ t("wallet.takeover") }}
          </div>
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
          <div class="actions-list-card-label text-center">
            {{ t("wallet.send") }}
          </div>
        </div>
      </div>
    </div>
    <div class="swap-list">
      <CollectionCard
        @handleClick="handleView(item)"
        @handleSend="handleSend"
        @handleCancel="handleCancel"
        v-for="item in txList"
        :key="item.address"
        :data="item"
      />
      <NoData v-if="!txList.length" :message="$t('wallet.no')" />
      <i18n-t
        tag="div"
        keypath="wallet.toBrowser"
        class="flex center scan-link pb-30"
      >
        <template v-slot:link>
          <a
            :href="VUE_APP_SCAN_URL"
            target="_blank"
            rel="noopener noreferrer"
            >{{ t("wallet.scanLink") }}</a
          >
        </template>
      </i18n-t>
      <van-dialog
        v-model:show="showTransactionModal"
        title
        :showCancelButton="false"
        :showConfirmButton="false"
        closeOnClickOverlay
        class="transfer-detail-modal"
      >
        <TransactionDetail
          @handleClose="handleClose"
          @handleSpeed="handleSend"
          @handleCancel="handleCancel"
          :data="transactionData.data"
        />
      </van-dialog>
    </div>
  </div>
  <CommonModal
    v-model="showSpeedModal"
    :title="sendTxType == 1 ? t('common.gasSpeedUp') : t('transationHistory.cancelDealTit')"
    className="transactionDetailsModal"
  >
    <div class="m-14 pl-14 pr-14 border-round detail-modal">
      <div class="flex between lh-16 pt-12 pb-8">
        <span>{{ t("transactionDetails.nonce") }}</span>
        <span>#{{ sendTx.nonce }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-8 border-bottom">
        <span>{{ t("sendto.gasLimit") }}</span>
        <span>{{
          ethers.utils.formatUnits(sendTx.sendData.gasLimit, "wei")
        }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-8">
        <span>{{ t("converSnft.amount") }}</span>
        <span>{{!sendTx.tokenAddress ? ethers.utils.formatEther(sendTx.sendData.value) : sendTx.amount }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-8">
        <span>{{ t("transactionDetails.gasfee") }}</span>
        <span>{{
          sendTx.sendData.gasPrice
            ? ethers.utils.formatEther(sendTx.sendData.gasPrice)
            : 0
        }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-12">
        <span>{{ t("transactionDetails.totalAmount") }}</span>
        <span>≈ {{!sendTx.tokenAddress ? ethers.utils.formatEther(sendTx.sendData.value) : sendTx.amount}} {{currentNetwork.currencySymbol}}</span>
      </div>
    </div>
    <ModifGasFee
      :show="showSpeedModal"
      :to="sendTx.to"
      :gasPrice="sendTx.gasPrice"
      :gasLimit="sendTx.gasLimit"
      :amount="ethers.utils.formatEther(sendTx.sendData.value)"
      @change="handleGasChange"
    />
    <div class="sendBtnBox pb-20 mt-20">
      <van-button @click="showSpeedModal = false" class="mr-26">{{
        t("common.cancel")
      }}</van-button>
      <van-button type="primary" @click="reSendTx" :loading="reloading">{{
        t("common.confirm")
      }}</van-button>
    </div>
  </CommonModal>
</template>
<script lang="ts">
import {
  ref,
  Ref,
  reactive,
  onMounted,
  computed,
  toRefs,
  onBeforeMount,
  nextTick,
  onUnmounted,
} from "vue";
import { Icon, Popup, Empty, Dialog, Button, Toast } from "vant";
import CollectionCard from "@/views/account/components/collectionCard/index.vue";
import { addressMask, decimal, toUsd } from "@/utils/filters";
import AcceptCode from "@/views/account/components/acceptCode/index.vue";
import TransactionDetail from "@/views/account/components/transactionDetail/index.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { hexValue } from "@ethersproject/bytes";
import { useI18n } from "vue-i18n";
import CommonModal from "@/components/commonModal/index.vue";
import NoData from "@/components/noData/index.vue";
import { VUE_APP_SCAN_URL } from "@/enum/env";
import localforage from "localforage";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { clone, getWallet, TransactionSendStatus } from "@/store/modules/account";
import ModifGasFee from "../components/modifGasFee.vue";
import { utils } from 'ethers';
import { web3 } from "@/utils/web3";
import { useDialog } from '@/plugins/dialog';
import eventBus from "@/utils/bus";

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
    CommonModal,
    ModifGasFee,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const store = useStore();
    const { query } = useRoute();
    const { tokenContractAddress } = query;
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const transactionList = ref([]);
    const pageData = reactive({ data: {} });
    const {$dialog} = useDialog()
    pageData.data = query;
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
    };

    const getPageList = async () => {
      Toast.loading({ duration: 0 });
      let time = setTimeout(async() => {
        try {
        txList.value = [];
        const id = currentNetwork.value.id;
        const targetAddress = accountInfo.value.address.toUpperCase();
        const tx: any = await localforage.getItem(`txlist-${id}-${targetAddress}`);
        if (tx && tx.length) {
          const list = tx || [];
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
          console.log('txList.value', txList.value)
        }
      } finally {
        Toast.clear();
      }
      clearTimeout(time)
      },50)
    };

    let waitTime: any = ref(null)
    onMounted(async () => {
      getPageList()
      store.dispatch("account/waitTxQueueResponse", {time: null, callback(e: any){
        console.warn('e', e)
        waitTime.value = e
      }}).then(res => {
        if(res !== true){
          eventBus.off('txPush')
      eventBus.off('txupdate')
        getPageList()
        }
      });
    });
    const toSend = () => {
      router.push({ name: "send", query });
    };
    const toSwap = () => {};
    let transactionData: any = reactive({ data: {} });
    const showTransactionModal: Ref<boolean> = ref(false);
    const handleView = (e: any) => {
      transactionData.data = e;
      showTransactionModal.value = true;
    };
    const handleClose = () => {
      showTransactionModal.value = false;
    };
    const showSpeedModal = ref(false);
    const sendTx = ref({});
    // 1 speed up  2 cancel
    const sendTxType = ref(1)
    const handleSend = (data: any) => {
      console.log('handleSend...')
      handleClose()
      sendTxType.value = 1
      sendTx.value = data;
      showSpeedModal.value = true;
      console.log('sendTx---', sendTx.value)
    };

    const handleCancel = (data: any) => {
      handleClose()
      sendTxType.value = 2
      console.warn("cancel...", data);
      sendTx.value = data;
      showSpeedModal.value = true;
    };

    const gasLimit = ref("0");
    const gasPrice = ref("0");
    const handleGasChange = (gasData: any) => {
      const { gasLimit: limit, gasPrice: gprice } = gasData;
      console.warn('limit', limit)
      console.warn('gprice', gprice)
      gasLimit.value = limit;
      gasPrice.value = gprice;
    };
    const reloading = ref(false);
    const reSendTx = async () => {
      reloading.value = true;
      if(sendTxType.value === 1){
        resend()
      }
      if(sendTxType.value === 2){
        cancelSend()
      }
    };
    eventBus.on('txPush', (data: any) => {
      // @ts-ignore
      txList.value.unshift(data)
    })
    eventBus.on('txUpdate', (data: any) => {
      console.warn('txupdate', data)
      for(let i = 0;i<txList.value.length;i++){
        let item = txList.value[i]
        const {txId} = item
        if(txId == data.txId) {
          // @ts-ignore
          txList.value[i] = data
        }
      }
    })
    onUnmounted(() => {
      // console.warn('waitTime.value', waitTime.value)

      if(waitTime.value) {
        clearInterval(waitTime.value)
      }
      eventBus.off('txPush')
      eventBus.off('txupdate')
    })
    const cancelSend = async() =>{
      try {
        const wallet = await getWallet();
        const network = await wallet.provider.getNetwork();
        const { nonce, to, network: localNet, value, tokenAddress, amount, transitionType, txType, data: newData, sendData, txId }: any = sendTx.value;
        const gasp = Number(gasPrice.value)
          ? new BigNumber(gasPrice.value).dividedBy(1000000000).toFixed(12)
          : "0.0000000012";
        const bigGas = ethers.utils.parseEther(gasp);
        const tx = {
          to: wallet.address,
          nonce,
          gasPrice: bigGas,
          gasLimit: gasLimit.value,
          chainId: network.chainId,
          value: ethers.utils.parseEther('0')
        };
        let data = await wallet.sendTransaction(tx);
        const {hash,from,type, value: newVal} = data
        store.commit("account/UPDATE_TRANSACTION", {
          ...sendTx.value,
          receipt: {
            from,
            to,
            status: 0
          },
          gasPrice: bigGas,
          gasLimit,
          txId,
          isCancel: true
        });
        data.date = new Date()
        store.commit("account/PUSH_TXQUEUE", {
        hash,
        from,
        gasLimit: gasLimit.value,
        gasPrice: gasPrice.value,
        nonce,
        to,
        type,
        value: newVal,
        transitionType: transitionType || null,
        txType,
        network: clone(localNet),
        data: clone(newData),
        sendStatus: TransactionSendStatus.pendding,
        sendData:  clone(data),
        tokenAddress,
        amount: '0'
      });
        sessionStorage.setItem("new tx", JSON.stringify(data));
        const receipt = await wallet.provider.waitForTransaction(data.hash, null, 60000);
        await store.dispatch('account/waitTxQueueResponse')
      } catch (err) {
        console.error(err);
        Toast(err.reason)
      } finally {
        showSpeedModal.value = false;
        reloading.value = false;
      }
    }

    const resend = async() => {
      try {
        const wallet = await getWallet();
        const network = await wallet.provider.getNetwork();
        const { nonce, to, network: localNet, value, tokenAddress, amount, transitionType, txType, data: newData, sendData,toAddress }: any = sendTx.value;
        const gasp = Number(gasPrice.value)
          ? new BigNumber(gasPrice.value).dividedBy(1000000000).toFixed(12)
          : "0.0000000012";
        const bigGas = ethers.utils.parseEther(gasp);
        const tx: any = {
          to,
          nonce,
          gasPrice: bigGas,
          gasLimit: gasLimit.value,
          chainId: network.chainId,
        };
        console.warn('tx', tx)
        let data = null
        if(tokenAddress) {
          const { contractWithSigner, contract } = await store.dispatch("account/connectConstract", tokenAddress);
          const amountWei = web3.utils.toWei((amount || 0) + '','ether')
          console.log('amountWei', amountWei)
          console.log('gasp', gasp)
          console.log(' gasLimit.value',  gasLimit.value)
          const transferParams = {
            nonce,
            gasPrice: bigGas,
            gasLimit: gasLimit.value,
          }
          data = await contractWithSigner.transfer(toAddress, amountWei, transferParams)
        } else {
          tx.value = value
          data = await wallet.sendTransaction(tx);
        }
        const {hash,from,type, value: newVal} = data
        store.commit("account/UPDATE_TRANSACTION", {
          ...sendTx.value,
          receipt: {
            from,
            to,
            status: 0
          },
          gasPrice: gasPrice.value,
          gasLimit,
        });

        store.commit("account/PUSH_TXQUEUE", {
        hash,
        from,
        gasLimit: gasLimit.value,
        gasPrice: gasPrice.value,
        nonce,
        to,
        type,
        value: newVal,
        transitionType: transitionType || null,
        txType,
        network: clone(localNet),
        data: clone(newData),
        sendStatus: TransactionSendStatus.pendding,
        sendData:  clone(data),
        tokenAddress,
        amount
      });
        sessionStorage.setItem("new tx", JSON.stringify(data));
        const receipt = await wallet.provider.waitForTransaction(data.hash, null, 60000);
        await store.dispatch('account/waitTxQueueResponse')
      } catch (err) {
        console.error(err);
        Toast(err.reason)
      } finally {
        showSpeedModal.value = false;
        reloading.value = false;
      }
    }
    return {
      showSpeedModal,
      sendTxType,
      handleGasChange,
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
      txList,
    };
  },
};
</script>
<style lang="scss" scoped>
.sendBtnBox {
  button {
    min-width: 80px;
  }
}
.detail-modal {
  & > div {
    span:nth-of-type(1) {
      color: #8f8f8f;
    }
  }
}
:deep() {
  .van-dialog__footer {
    display: none;
  }
}
.detail-modal {
  border-radius: 5px;
}
.currency {
  .scan-link {
    color: #848484;
    margin-top: 40px;
    a {
      margin-left: 3px;
      color: #037cd6;
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
    border-top: 1px solid #e4e7e8;
  }
}
.iconfont {
  color: #fff;
}
</style>