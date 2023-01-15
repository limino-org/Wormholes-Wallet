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
    <div class="all" v-show="!loading">
      <div v-if="transactionList.length">
        <CollectionCard
        :id="item.hash"
          @handleClick="handleView(item)"
          v-for="item in transactionList"
          :key="item.to"
          :data="item"
          @handleSend="handleSend"
          @handleCancel="handleCancel"
          :active="route.query.hash?.toString() === item.hash"
        />
      </div>
      <no-data v-else />
      <i18n-t
        tag="div"
        keypath="wallet.toBrowser"
        class="flex center scan-link pb-30"
      >
        <template v-slot:link>
          <span
            @click="viewAccountByAddress(accountInfo.address)"
            rel="noopener noreferrer"
            >{{ t("wallet.scanLink") }}</span
          >
        </template>
      </i18n-t>
    </div>
    <div class="loading-list-con" v-show="loading">
      <div class="loading-list-card" v-for="item in 16" :key="item">
        <van-skeleton avatar :row="2" />
      </div>
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
    :title="
      sendTxType == 1
        ? t('common.gasSpeedUp')
        : t('transationHistory.cancelDealTit')
    "
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
          ethers.utils.formatUnits(
            transactionData.data.sendData.gasLimit,
            "wei"
          )
        }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-8">
        <span>{{ t("converSnft.amount") }}</span>
        <span>{{
          !transactionData.data.tokenAddress
            ? ethers.utils.formatEther(transactionData.data.sendData.value)
            : transactionData.data.amount
        }}</span>
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
        <span
          >≈
          {{
            !transactionData.data.tokenAddress
              ? ethers.utils.formatEther(transactionData.data.sendData.value)
              : transactionData.data.amount
          }}
          {{ currentNetwork.currencySymbol }}</span
        >
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
  Skeleton,
} from "vant";
import TokenCard from "@/views/account/components/tokenCard/index.vue";
import TransactionDetail from "@/views/account/components/transactionDetail/index.vue";
import ModifGasFee from "@/views/currency/components/modifGasFee.vue";
import CommonModal from "@/components/commonModal/index.vue";

import NavHeader from "@/components/navHeader/index.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { guid, viewAccountByAddress } from "@/utils/utils";
import { ElTableV2 } from "element-plus";
import CollectionCard from "@/views/account/components/collectionCard/index.vue";

import {
  clone,
  DEL_TXQUEUE,
  PUSH_TRANSACTION,
  TransactionSendStatus,
  TransactionTypes,
} from "@/store/modules/account";
import localforage from "localforage";
import { Column } from "element-plus/lib/components";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { getWallet } from "@/store/modules/account";
import { useDialog } from "@/plugins/dialog";
import { web3 } from "@/utils/web3";
import eventBus from "@/utils/bus";
import { utils } from 'ethers';
import { stopLoop } from '@/store/modules/txList';
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
    [Skeleton.name]: Skeleton,
    [Empty.name]: Empty,
    CollectionCard,
    TransactionDetail,
    NavHeader,
    ElTableV2,
    ModifGasFee,
    CommonModal,
  },
  setup() {
    const appProvide = inject("appProvide");
    const { t } = useI18n();
    const store = useStore();
    console.log("-=============================");
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const accountInfo = computed(() => store.state.account.accountInfo);
    const { $wdialog } = useDialog();
    const route = useRoute()
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

    const handleAsyncTxList = () => {
      return store.dispatch(
        "txList/loopAsyncTxList",
        accountInfo.value.address
      );
    };
    eventBus.on('waitTxEnd', () => {
      handleAsyncTxList()
    })
    eventBus.on("loopTxListUpdata", () => {
      getPageList();
    });
    eventBus.on("txPush", (data: any) => {
      // @ts-ignore
      tlist.value.unshift(data)
    });

    eventBus.on("delTxQueue", (data: any) => {
      // @ts-ignore
      tlist.value = tlist.value.filter(item => item.txId.toUpperCase() != data.txId.toUpperCase())
    });
    
    eventBus.on("txQueuePush", (data: any) => {
      let time = setTimeout(async() => {
        // @ts-ignore
        tlist.value.unshift(data)
        clearTimeout(time)
      },300)
    });
    
    eventBus.on("txUpdate", (data: any) => {
      console.warn("data----", data);
      for (let i = 0; i < tlist.value.length; i++) {
        let item = tlist.value[i];
        const { txId } = item;
        if(data.txId) {
          // @ts-ignore
          if (txId && txId.toString().toUpperCase() == data.txId.toUpperCase()) {
          // @ts-ignore
          tlist.value[i] = data;
          }
        }
      }
    });
    eventBus.on('changeNetwork', async(address) => {
      loading.value = true
      tlist.value = []
      try {
        await handleAsyncTxList();
        await getPageList();
      }finally {
        loading.value = false
      }
      store.dispatch("account/waitTxQueueResponse", {
        time: null,
        callback(e: any) {
          console.warn("e", e);
          waitTime.value = e;
        },
      });
    })

    // Current account transaction list
    let tlist: any = ref([]);
    const waitTime: any = ref(null);
    onMounted(async () => {
      try {
        await handleAsyncTxList();
        await getPageList();
      }finally {
        loading.value = false
      }
      store.dispatch("account/waitTxQueueResponse", {
        time: null,
        callback(e: any) {
          console.warn("e", e);
          waitTime.value = e;
        },
      });
    });
    const loading = ref(true);
    const getPageList = async () => {
      // showSpeedModal.value = false;
        const chainId = currentNetwork.value.chainId;
        try {
          const id = currentNetwork.value.id;
          const targetAddress = accountInfo.value.address.toUpperCase();
          let searchKey = "";
          if (id === "wormholes-network-1") {
            searchKey = `async-${id}-${chainId}-${targetAddress}`;
          } else {
            searchKey = `txlist-${id}-${chainId}-${targetAddress}`;
          }
          const txInfo: any = await localforage.getItem(searchKey);
          const queuekey = `txQueue-${id}-${chainId}-${targetAddress.toUpperCase()}`;
          const txQueue = await localforage.getItem(queuekey);
          let tx = [];
          if (id === "wormholes-network-1") {
            tx = txInfo ? txInfo.list : [];
          } else {
            tx = txInfo;
          }
          Array.isArray(tx) ? tlist.value = [...tx] : '';
          Array.isArray(txQueue) ? tlist.value.unshift(...txQueue) : "";
        } finally {
          loading.value = false;
        }
        const hash = route.query.hash
        if(hash) {
          const tx = tlist.value.find((item: any) => item.hash.toUpperCase() == hash?.toString().toUpperCase())
          if(tx) {
            transactionData.data = tx
            showTransactionModal.value = true;
            let time = setTimeout(() => {
              const ele = document.getElementById(hash?.toString())
             ele ? ele.scrollIntoView() : ''
             clearTimeout(time)
            })
          }
        }
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
    const sendTxType = ref(1);
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
      },
    ]);

    const showSpeedModal = ref(false);
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
      if (sendTxType.value === 1) {
        resend();
      }
      if (sendTxType.value === 2) {
        cancelSend();
      }
    };
   

    onUnmounted(() => {
      if (waitTime.value) {
        clearInterval(waitTime.value);
      }
      stopLoop()
      eventBus.off("txPush");
      eventBus.off("txUpdate");
      eventBus.off("loopTxListUpdata");
      eventBus.off("txQueuePush");
      eventBus.off("delTxQueue");
      eventBus.off('waitTxEnd')
    });
    const cancelSend = async () => {
      try {
        const wallet = await getWallet();
        const blockNumber = await wallet.provider.getBlockNumber();
        const {
          nonce,
          to,
          network: localNet,
          value,
          tokenAddress,
          toAddress,
          amount,
          transitionType,
          data: newData,
          sendData,
          txId,
        }: any = transactionData.data;
        const tx = {
          to: wallet.address,
          nonce,
          gasPrice: gasPrice.value || '1.2',
          gasLimit: gasLimit.value,
          value: ethers.utils.parseEther("0"),
          data: sendData.data
        };
        let data = null;
        if (tokenAddress) {
          const transferParams = {
            nonce,
            gasPrice: gasPrice.value || '1.2',
            gasLimit: gasLimit.value,
            to: toAddress,
            checkTxQueue: false,
            address: tokenAddress,
            amount
          };
          data = await store.dispatch('account/tokenTransaction', transferParams)
        } else {
          data = await store.dispatch('account/transaction', {
            ...tx,
            checkTxQueue: false
          })
        }
        let txType = 'normal'
        if(tokenAddress) {
          txType = 'contract'
        } else {
          txType = !newData ? 'normal' : (newData.indexOf('wormholes') > -1 ? 'wormholes' : 'contract')
        }

        // let data = await wallet.sendTransaction(tx);
        // const data = await store.dispatch('account/transaction', {
        //     ...tx,
        //     checkTxQueue: false
        //   })
        const { hash, from, type, value: newVal, contractAddress } = data;
        const txInfo =  {
          ...transactionData.data,
          receipt: {
            blockHash: null,
            blockNumber: blockNumber,
            cumulativeGasUsed: { type: "BigNumber", hex: "0x0" },
            effectiveGasPrice: { type: "BigNumber", hex: "0x0" },
            gasUsed: { type: "BigNumber", hex: "0x0" },
                 // @ts-ignore
            transactionHash: transactionData.data.hash,
            from,
            to,
            contractAddress,
            transactionIndex: 0,
            status: 0,
          },
          gasPrice: gasLimit,
          gasLimit: gasLimit.value,
          value: ethers.utils.formatUnits(value, "wei"),
          txType
        }
        await DEL_TXQUEUE(txInfo)
        const newres = {
          ...clone(txInfo),
          txId: guid(),
          sendData: data,
          sendType: 'cancel',
        }
        await PUSH_TRANSACTION(newres)
        const receipt = await data.wallet.provider.waitForTransaction(
          data.hash,
          null,
          60000
        );
        await store.dispatch("account/waitTxQueueResponse");
        handleAsyncTxList()
      } catch (err) {
        console.error(err);
        Toast(err.reason);
      } finally {
        showSpeedModal.value = false;
        reloading.value = false;
      }
    };

    const resend = async () => {
      /**
       * step1  step1  Set the original transaction status to false and unshift to the transaction record
       * step2  New transactions are added to the send queue
       * step3  Query the transaction receipt of the send queue
       */

      try {
        const wallet = await getWallet();
        const blockNumber = await wallet.provider.getBlockNumber();
        const {
          nonce,
          to,
          network: localNet,
          value,
          tokenAddress,
          amount,
          transitionType,
          data: newData,
          sendData,
          toAddress,
          txId,
        }: any = transactionData.data;
        const tx: any = {
          to,
          nonce,
          gasPrice: gasPrice.value || '1.2',
          gasLimit: gasLimit.value,
          data: sendData.data
        };
        console.warn("tx", tx);
        let data = null;
        if (tokenAddress) {
          const transferParams = {
            nonce,
            gasPrice: gasPrice.value || '1.2',
            gasLimit: gasLimit.value,
            to: toAddress,
            checkTxQueue: false,
            address: tokenAddress,
            amount
          };
          data = await store.dispatch('account/tokenTransaction', transferParams)
        } else {
          tx.value = utils.formatEther(value);
          data = await store.dispatch('account/transaction', {
            ...tx,
            checkTxQueue: false
          })
        }
        // step1  Set the original transaction status to false and unshift to the transaction record
        const { hash, from, type, value: newVal, contractAddress } = data;
        let txType = 'normal'
        if(tokenAddress) {
          txType = 'contract'
        } else {
          txType = !newData ? 'normal' : (newData.indexOf('wormholes') > -1 ? 'wormholes' : 'contract')
        }
        const txInfo =  {
          ...transactionData.data,
          receipt: {
            blockHash: null,
            blockNumber: blockNumber,
            cumulativeGasUsed: { type: "BigNumber", hex: "0x0" },
            effectiveGasPrice: { type: "BigNumber", hex: "0x0" },
            gasUsed: { type: "BigNumber", hex: "0x0" },
                 // @ts-ignore
            transactionHash: transactionData.data.hash,
            from,
            to,
            contractAddress,
            transactionIndex: 0,
            status: 0,
          },
          value: ethers.utils.formatUnits(value, "wei"),
          gasPrice: gasLimit,
          gasLimit: gasLimit.value,
          txType

        }
        await DEL_TXQUEUE(txInfo)
        // store.commit("account/DEL_TXQUEUE",txInfo);
        const newres = {
          ...clone(txInfo),
          txId: guid(),
          sendData: data,
          sendType: 'speed',
        }
        await PUSH_TRANSACTION(newres)
        // store.commit("account/PUSH_TRANSACTION",newres);
        sessionStorage.setItem("new tx", JSON.stringify(data));
        const receipt = await data.wallet.provider.waitForTransaction(data.hash);
        await store.dispatch("account/waitTxQueueResponse");
        handleAsyncTxList()
      } catch (err) {
        console.error(err);
        Toast(err.reason);
      } finally {
        showSpeedModal.value = false;
        reloading.value = false;
      }
    };

    const handleSend = (data: any) => {
      handleClose();
      sendTxType.value = 1;
      transactionData.data = data;
      showSpeedModal.value = true;
    };

    const handleCancel = (data: any) => {
      handleClose();
      sendTxType.value = 2;
      console.warn("cancel...");
      transactionData.data = data;
      showSpeedModal.value = true;
    };

    return {
      handleSend,
      handleCancel,
      tabs,
      handleGasChange,
      accountInfo,
      reloading,
      reSendTx,
      loading,
      ethers,
      columns,
      route,
      showSpeedModal,
      currentNetwork,
      changeTab,
      t,
      viewAccountByAddress,
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
      sendTxType,
      tlist,
    };
  },
};
</script>
<style lang="scss" scoped>
  .scan-link {
    color: #848484;
    margin-top: 40px;
    span {
      margin-left: 3px;
      color: #037cd6;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
:deep() {
  .van-skeleton__avatar--round {
    margin-top: 12px;
  }
}
.loading-list-con {
  height: calc(100vh - 48px);
  overflow: hidden;
}
.loading-list-card {
  padding: 6px 0;
}
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