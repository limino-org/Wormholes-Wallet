<template>
  <van-sticky>
    <NavHeader :title="t('setting.transitionHistory')">
      <template v-slot:left>
        <span class="back hover f-12" @click="back">{{
          t("createAccountpage.back")
        }}</span>
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
      <div v-if="transactionList.length">
        <CollectionCard @handleClick="handleView(item)" v-for="item in transactionList" :key="item.to" :data="item"         @handleSend="handleSend"
        @handleCancel="handleCancel" />
      </div>
      <no-data v-else />
    </div>
    <!-- <div class="all">
      <el-table-v2
        :columns="columns"
        :data="transactionList"
        :row-height="40"
        :width="700"
        :height="`calc(100vh - 60px)`"
        :footer-height="50"
        row-key="item"
      >
        <template #row="scope">
          <CollectionCard
              @handleClick="handleView(scope)"
              :key="scope.to"
              :data="scope"
            />
        </template>
      </el-table-v2>
    </div> -->
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
  <van-dialog
    v-model:show="showTransactionModal"
    title
    :showCancelButton="false"
    :showConfirmButton="false"
    closeOnClickOverlay
  >
    <TransactionDetail
      @handleClose="handleClose"
      :data="transactionData.data"
      @handleSpeed="handleSend"
      @handleCancel="handleCancel"
    />
  </van-dialog>

  <CommonModal
    v-model="showSpeedModal"
    :title="t('common.gasSpeedUp')"
    className="transactionDetailsModal"
  >
    <div class="m-14 pl-14 pr-14 border-round detail-modal">
      <div class="flex between lh-16 pt-12 pb-8">
        <span>{{ t("transactionDetails.nonce") }}</span>
        <span>{{ transactionData.data.nonce }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-8 border-bottom">
        <span>{{ t("sendto.gasLimit") }}</span>
        <span>{{
          ethers.utils.formatUnits(transactionData.data.sendData.gasLimit, "wei")
        }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-8">
        <span>{{ t("converSnft.amount") }}</span>
        <span>{{!transactionData.data.tokenAddress ? ethers.utils.formatEther(transactionData.data.sendData.value) : transactionData.data.amount }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-8">
        <span>{{ t("transactionDetails.gasfee") }}</span>
        <span>{{
          transactionData.data.sendData.gasPrice
            ? ethers.utils.formatEther(transactionData.data.sendData.gasPrice)
            : 0
        }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-12">
        <span>{{ t("transactionDetails.totalAmount") }}</span>
        <span>≈ {{!transactionData.data.tokenAddress ? ethers.utils.formatEther(transactionData.data.sendData.value) : transactionData.data.amount}} {{currentNetwork.currencySymbol}}</span>
      </div>
    </div>
    <ModifGasFee
      :show="showSpeedModal"
      :to="transactionData.data.to"
      :gasPrice="transactionData.data.gasPrice"
      :gasLimit="transactionData.data.gasLimit"
      :amount="ethers.utils.formatEther(transactionData.data.sendData.value)"
      :tokenContractAddress="''"
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
<script lang="tsx">
import {
  ref,
  Ref,
  computed,
  toRaw,
  SetupContext,
  onMounted,
  reactive,
  inject,
  Transition,
  onUnmounted,
} from "vue";
import {
  Icon,
  NavBar,
  Form,
  Field,
  CellGroup,
  Button,
  Tab,
  Tabs,
  Dialog,
  IndexBar,
  IndexAnchor,
  Sticky,
  Toast,
  Empty,
} from "vant";
import TokenCard from "@/views/account/components/tokenCard/index.vue";
import TransactionDetail from "@/views/account/components/transactionDetail/index.vue";
import ModifGasFee from "@/views/currency/components/modifGasFee.vue";
import CommonModal from "@/components/commonModal/index.vue";

import NavHeader from "@/components/navHeader/index.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { getRandomIcon } from "@/utils";
import { ElTableV2 } from "element-plus";
import CollectionCard from "@/views/account/components/collectionCard/index.vue";
import { clone, TransactionSendStatus, TransactionTypes } from "@/store/modules/account";
import localforage from "localforage";
import { Column } from "element-plus/lib/components";
import { ethers } from 'ethers';
import BigNumber from "bignumber.js";
import {getWallet} from '@/store/modules/account'
import { useDialog } from "@/plugins/dialog";
import { web3 } from '@/utils/web3';
import eventBus from '@/utils/bus';
export default {
  name: "transaction-history",
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
    NavHeader,
    ElTableV2,
    ModifGasFee,
    CommonModal
  },
  setup() {
    const appProvide = inject("appProvide");
    const { t } = useI18n();
    const store = useStore();
    console.log("-=============================");
    const currentNetwork = computed(() => store.state.account.currentNetwork)
    const {$dialog} = useDialog()

    const tabs = reactive({
      list: [
        { name: t("transationHistory.all"), value: 1, select: true },
        // { name: "Receive", value: 2, select: false },
        { name: t("transationHistory.send"), value: 3, select: false },
        { name: t("transationHistory.swap"), value: 4, select: false },
        { name: t("transationHistory.other"), value: 5, select: false },
      ],
    });
    const changeTab = (e: any) => {
      const { value, select } = e;
      if (select) {
        return;
      } else {
        tabs.list.forEach((item, idx) => {
          if (item.value == value) {
            item.select = true;
          } else {
            item.select = false;
          }
        });
      }
    };
    // Selected tab'
    const chooseTabdata = computed(() => tabs.list.find((item) => item.select));
    const router = useRouter();
    const back = () => {
      router.go(-1);
    };
    const { accountInfo, } = store.state.account;

    // Current account transaction list
    let tlist: any = ref([]);
    const waitTime: any = ref(null)
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



    const getPageList = async () => {
      tlist.value = [];
      Toast.loading({ duration: 0 });
      let time = setTimeout(async() => {
        try {
        const id = currentNetwork.value.id;
        const address = accountInfo.address.toUpperCase()
        const key = `txlist-${id}-${address}`
          console.log('key', key)
          const tx: any = await localforage.getItem(key);
          console.warn('tx', tx)
        if (tx && tx.length) {
          tlist.value.push(...tx)
        }
        // store.state.account.accountList.forEach(async(item: any) => {
        //   const {address} = item
        //   const key = `txlist-${id}-${address.toUpperCase()}`
        //   console.log('key', key)
        //   const tx: any = await localforage.getItem(key);
        //   console.warn('tx', tx)
        // if (tx && tx.length) {
        //   tlist.value.push(...tx)
        // }
        // })

      }catch(err){
        console.error(err)
      } finally {
        Toast.clear();
      }
      clearTimeout(time)
      }, 50)

    };


    // All transactions
    const transactionList = computed(() => {
      return tlist.value.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    // Send record
    const sendList = computed(() => {
      const newlist = tlist.value || [];
      return newlist.filter((item: any) => {
        return item.txType == TransactionTypes.default;
      });
    });
    // swap transaction
    const swapList = computed(() => {
      const newlist = tlist.value || [];
      return newlist.filter((item: any) => {
        return item.txType == TransactionTypes.swap;
      });
    });
    // Other records
    const otherList = computed(() => {
      const newlist = tlist.value || [];
      return newlist.filter((item: any) => {
        return (
          item.txType == TransactionTypes.other ||
          item.txType == TransactionTypes.contract
        );
      });
    });
    // Transaction details data
    let transactionData: any = reactive({ data: {} });
    const showTransactionModal: Ref<boolean> = ref(false);
    // 1 speed up  2 cancel
    const sendTxType = ref(1)
    // View transaction details event
    const handleView = (e: any) => {
      transactionData.data = e;
      showTransactionModal.value = true;
    };
    const handleClose = () => {
      showTransactionModal.value = false;
    };
    const columns: any = ref([
      {
        key: "",
        title: "",
        dataKey: "",
        width: "100%",
      }
    ]);

    const showSpeedModal = ref(false)
    const gasLimit = ref("0");
    const gasPrice = ref("0");
    const handleGasChange = (gasData: any) => {
      const { gasLimit: limit, gasPrice: gprice } = gasData;
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
      tlist.value.unshift(data)
    })
    eventBus.on('txUpdate', (data: any) => {
      console.warn('txupdate', data)
      for(let i = 0;i<tlist.value.length;i++){
        let item = tlist.value[i]
        const {txId} = item
        if(txId == data.txId) {
          tlist.value[i] = data
        }
      }
    })
    
    onUnmounted(() => {
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
        const { nonce, to, network: localNet, value, tokenAddress, amount, transitionType, txType, data: newData, sendData, txId }: any = transactionData.data;
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
          ...transactionData.data,
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
        showSpeedModal.value = false
        Toast(err.reason)
        console.error(err)
      } finally {
        showSpeedModal.value = false;
        reloading.value = false;
      }
    }

    const resend = async() => {
      try {
        const wallet = await getWallet();
        const network = await wallet.provider.getNetwork();
        const { nonce, to, network: localNet, value, tokenAddress, amount, transitionType, txType, data: newData, sendData,toAddress }: any = transactionData.data;
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
          ...transactionData.data,
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
        showSpeedModal.value = false;
        await store.dispatch('account/waitTxQueueResponse')
      } catch (err) {
        console.error(err)
        Toast(err.reason)
      } finally {
        showSpeedModal.value = false
        reloading.value = false;
      }
    }
      
    const handleSend = (data: any) => {
      handleClose()
      sendTxType.value = 1
      transactionData.data = data;
      showSpeedModal.value = true;
    };

    const handleCancel = (data: any) => {
      handleClose()
      sendTxType.value = 2
      console.warn("cancel...");
      transactionData.data = data;
      showSpeedModal.value = true;
    };

    return {
      handleSend,
      handleCancel,
      tabs,
      handleGasChange,
      reloading,
      reSendTx,
      ethers,
      columns,
      showSpeedModal,
      currentNetwork,
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
      appProvide,
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