<template>
  <NavHeader
    @clickLeft="handleLeft"

    @handleShowAccount="handleShowAccount"
    :showAccount="actionSheetShow"
  ></NavHeader>
  <div class="wallet">
    <div v-if="!loading" class="container page-container">
      <div class="circle flex center">
        <div class="account-icon">
          <AccountIcon :data="accountInfo.icon" />
          <AccountModal v-model:show="showModal" @close="closeModal" />
        </div>
      </div>
      <div class="account-name text-center hover" @click="showaccount">
        <span>{{ accountInfo.name }}</span>
        <div>
          <i
            :class="`iconfont ${
              !actionSheetShow ? 'icon-xiala' : 'icon-shangla'
            }`"
          ></i>
        </div>
      </div>
      <div class="account-amount text-center">
        {{ decimal(accountInfo.amount) }} {{ currentNetwork.currencySymbol }}
      </div>

      <div
        class="account-address van-ellipsis text-center hover"
        @click="toCopy"
      >
        {{ addressMask(accountInfo.address) }}
      </div>
      <div class="flex center actions">
        <div class="actions-btn" @click.stop="toogleAcceptCode">
          <div class="action-icon flex center">
            <i class="iconfont icon-bottom"></i>
          </div>
          <div class="action-name text-center">{{ t("wallet.takeover") }}</div>
        </div>

        <div class="actions-btn" @click="toSend">
          <div class="action-icon flex center">
            <i class="iconfont icon-jiantou_youshang"></i>
          </div>
          <div class="action-name text-center">{{ t("wallet.send") }}</div>
        </div>
        <div class="actions-btn" v-if="currentNetwork.value == 'homestead'">
          <div class="action-icon flex center">
            <van-icon name="exchange" />
          </div>
          <div class="action-name text-center">{{ t("wallet.swap") }}</div>
        </div>
      </div>
      <van-tabs v-model:active="active" sticky :offset-top="48">

        <van-tab :title="$t('wallet.token')">
          <TokenCard :data="myToken" :networkIcon="false" />
          <TokenCard
            v-for="(item, idx) in accountTokens"
            :key="idx"
            :data="item"
          />
          <div class="flex center noTokenBox">
            <div>
              <div class="text-center tip1">
                {{ t("wallet.notoken") }}
                <router-link :to="{ name: 'tokens-import' }" class="tip2">
                  {{ t("wallet.addtoken") }}
                </router-link>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab :title="$t('wallet.collection')">

          <van-list :finished="finished" v-model:error="nftErr">
            <div>
              <NftList
                @success="isSelect = false"
                v-model:isSelect="isSelect"
                v-if="active === 1"
                @updateLength="handleLength"
                @showSwitch="handleShowSwitch"
              />
            </div>
            <!-- <van-empty v-else :description="$t('wallet.no')" /> -->
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
    <div class="loading-box flex center" v-else>
      <van-loading size="24px" color="#1989fa">
        {{ t("wallet.loading") }}
      </van-loading>
    </div>
    <div>
      <Transition name="slider">
        <div class="help-center-box" v-if="!isSelect || active === 0">
          <div class="container flex right pl-20 pr-20">
            <div
              class="help-btn flex center hover"
              @click="toHelp"
              @mouseover="showHelp = true"
              @mouseout="showHelp = false"
            >
              <i class="iconfont icon-bangzhuzhongxin31"></i>
            </div>
            <div class="hint pl-10 pr-10" v-show="showHelp">
              {{ t("common.helpCenter") }}
            </div>
          </div>
        </div>
      </Transition>
      <div v-if="active === 0 && currentNetwork.id == 'wormholes-network-1'">
        <div class="btn-groups">
          <div class="container pl-20 pr-20 flex right center-v">
            <div
              :class="[
                'wallet-hint pt-10 pb-10 pl-10 pr-10 mr-12',
                isExchanger_flag ? 'wallet-hint-h' : '',
              ]"
              @click="goAutoexchange"
            >
              <span v-if="!isExchanger_flag">{{
                t("sidebar.openexchange")
              }}</span>
              <span v-else>{{ t("sidebar.exchangemanagement") }}</span>
            </div>
            <div class="wallet-suspension hover" @click="goAutoexchange">
              <i class="iconfont icon-fangwujianzhuwugoujianbeifen"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <GuideModal
      @guideModalSuccess="guideModalSuccess"
      v-model="showGuideModal"
    />
    <guide-one></guide-one>
    <guide-two></guide-two>
    <guide-three></guide-three>
    <guide-fore></guide-fore>
    <guide-five></guide-five>
    <guide-six></guide-six>
    <action-sheet v-model="actionSheetShow"></action-sheet>
    <BackUpBottom />
  </div>
</template>

<script lang="ts">
import { showSlider, show } from "@/components/navHeader/hooks/slider";
import {
  Tab,
  Tabs,
  Popup,
  Icon,
  Dialog,
  Sticky,
  Toast,
  Popover,
  Loading,
  Empty,
  List,
  Image as VanImage,
} from "vant";
import {
  ref,
  Ref,
  reactive,
  onMounted,
  computed,
  toRefs,
  watch,
  onBeforeMount,
  onUnmounted,
  onDeactivated,
} from "vue";
import BackUpBottom from '@/views/guidance/backupBottom.vue'

import NavHeader from "@/components/navHeader/index.vue";
import TokenCard from "../components/tokenCard/index.vue";
import CollectionCard from "../components/collectionCard/index.vue";
import TransactionDetail from "../components/transactionDetail/index.vue";
import NftList from "../components/nftList/index.vue";
import AccountIcon from "@/components/accountIcon/index.vue";
import AcceptCode from "../components/acceptCode/index.vue";
import AccountModal from "@/components/accountModal/index.vue";
import { useStore, mapState } from "vuex";
import { useRouter } from "vue-router";
import { addressMask, decimal } from "@/utils/filters";
import { useToggleAccount } from "@/components/accountModal/hooks/toggleAccount";
import useClipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";
import { getNftOwner } from "@/http/modules/nft";
import eventBus from "@/utils/bus";
import { useExchanges } from "@/hooks/useExchanges";

import GuideModal from "@/views/guidance/dialogModal.vue";
import GuideModal1 from "@/views/guidance/step1.vue";
import GuideModal2 from "@/views/guidance/step2.vue";
import GuideModal3 from "@/views/guidance/step3.vue";
import GuideModal4 from "@/views/guidance/step4.vue";
import GuideModal5 from "@/views/guidance/step5.vue";
import GuideModal6 from "@/views/guidance/step6.vue";
import actionSheet from "./action-sheet.vue";
import dialogWarning from "@/components/dialogWarning/message.vue";
import { useToast } from "@/plugins/toast";
import { useWallet } from "@/hooks/useWallet";

export default {
  name: "wallet",
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    [Sticky.name]: Sticky,
    [Loading.name]: Loading,
    [Empty.name]: Empty,
    [List.name]: List,
    [Image.name]: Image,
    [Popover.name]: Popover,
    BackUpBottom,
    "action-sheet": actionSheet,
    [Dialog.Component.name]: Dialog.Component,
    TokenCard,
    CollectionCard,
    AcceptCode,
    TransactionDetail,
    NavHeader,
    AccountIcon,
    NftList,
    AccountModal,
    [GuideModal.name]: GuideModal,
    "guide-one": GuideModal1,
    "guide-two": GuideModal2,
    "guide-three": GuideModal3,
    "guide-fore": GuideModal4,
    "guide-five":GuideModal5,
    "guide-six":GuideModal6,
    "dialog-warning": dialogWarning,
  },
  setup() {
    const snft_flag = ref(false);
    const snft_cancel = ref(1);
    // const isWarning = ref(false);
    const { t } = useI18n();
    const { generateSign, initExchangeData } = useExchanges();
    const showGuideModal = ref(false);
    const router = useRouter();
    const active: Ref<number> = ref(0);
    const store = useStore();
    const { dispatch, getters } = store;
    const theme = computed(() => store.state.common.theme);
    const accountInfo = computed(() => store.state.account.accountInfo);
    const exchangeStatus = computed(() => store.state.account.exchangeStatus);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const layoutList = computed(() => store.state.system.layoutList);
    const layoutType = computed(() => store.state.system.layoutType);
    const symbol = currentNetwork.value.currencySymbol;
    const { $toast } = useToast();
    const showHelp = ref(false);
    const { initWallet } = useWallet();
    // Display the default token of the current network
    const myToken = computed(() => {
      const symbol = currentNetwork.value.currencySymbol;
      const balance = accountInfo.value.amount;
      const data = {
        balance,
        logoUrl: "eth.jpg",
        name: symbol,
        precision: 1,
        symbol,
        tokenContractAddress: null,
      };
      return data;
    });
    const canbtn = ref(false);
    const canbtns = ref(true);
    const loading: Ref<boolean> = ref(false);
    console.log("getters", store);
    const accountTokens = computed(
      () => store.getters["account/accountTokens"]
    );
    console.log("accountTokens", accountTokens);
    let sonShow = ref(false);
    const toogleAcceptCode = () => {
      // showAcceptCode.value = true;
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

    const showModal: Ref<boolean> = ref(false);
    const showaccount = () => {
      actionSheetShow.value = true;
    };
    const handleShowAccount = (v: boolean) => {
      actionSheetShow.value = v;
    };
    const closeModal = () => {
      showModal.value = false;
    };
    const tofaucet = () => {
      window.open(
        "http://faucet.wormholesscan.com/?address=" + accountInfo.value.address
      );
    };
    const actionSheetShow = ref(false);
    const tobuy = () => {};
    let transactionData: any = reactive({ data: {} });
    const showTransactionModal: Ref<boolean> = ref(false);
    const handleView = (e: any) => {
      transactionData.data = e;
      showTransactionModal.value = true;
    };
    const handleClose = () => {
      showTransactionModal.value = false;
    };
    const handleLeft = () => {
      showSlider();
    };
    const guideModalSuccess = () => {
      showSlider();
    };

    const getStatus = async () => {
      Toast.loading({});
      try {
        const res = await dispatch("account/getExchangeStatus");
        const { exchanger_flag, status } = res;
        autoexchange.value = status;
        autostat.value = exchanger_flag;
        console.warn("res", res);
        return res;
      } catch (err: any) {
        Toast(err.toString());
      } finally {
        Toast.clear();
      }
    };

    //Jump to open an exchange with one click
    const goAutoexchange = async () => {
      const {exchanger_flag,status} = await getStatus();
      if(exchanger_flag) {
        router.push({ name: "exchange-management" });
      } else {
         router.push({ name: "bourse" });
      }
    };
    const toSend = () => {
      router.push({ name: "send" });
    };
    const { toClipboard } = useClipboard();
    const toCopy = async () => {
      try {
        await toClipboard(`${accountInfo.value.address}`);
        $toast.success(t("common.copyAddr"));
      } catch (e) {
        console.error(e);
      }
    };
    const isExchanger_flag = computed(
      () => store.state.account.exchangeStatus.exchanger_flag
    );
    const isExchangeStatusStatus = computed(
      () => store.state.account.exchangeStatus.status == 2
    );
    const pageData = reactive({ nftList: new Array<any>() });
    const pageDatas = reactive({ nftLists: [] });
    const loadNft: Ref<boolean> = ref(false);
    const finished: Ref<boolean> = ref(false);
    const nftErr: Ref<boolean> = ref(false);
    const autoexchange = ref(0);
    const autostat = ref(false);

    let time: any = null;
    onMounted(() => {
      dispatch("transfer/clearTx");
      initWallet()
      dispatch("account/getExchangeStatus").then((res) => {
        console.warn("getExchangeStatus", res);
        autoexchange.value = res.status;
        autostat.value = res.exchanger_flag;
        if (res.status == 2 && res.exchanger_flag) {
          initExchangeData();
        }
      });
      dispatch("account/updateBalance");
      time = setInterval(() => {
        dispatch("account/updateBalance");
        dispatch("account/updateTokensBalances");
      }, 12000);
    });
    onUnmounted(() => {
      clearInterval(time);
    });
    onDeactivated(() => {
      clearInterval(time);
    });

    const gotxt = () => {
      canbtn.value = true;
      canbtns.value = false;
    };
    const gozh = () => {
      canbtn.value = false;
      canbtns.value = true;
    };
    const snft_cancels = ref(false);

    const isSelect = ref(false);
    const isMouseover = ref(false);
    const mouseover = () => {
      isMouseover.value = true;
    };
    const mousedown = () => {
      isMouseover.value = false;
    };

    const nftLen = ref(0);
    const handleLength = (len: number) => {
      nftLen.value = len;
    };
    const toHelp = () => {
      window.open("https://www.wormholes.com/docs/wallet/");
    };

    const handleShowSwitch = (v:any) => {
      isSelect.value = v
    }
    return {
      handleShowSwitch,
      handleLength,
      toHelp,
      t,
      nftLen,
      handleShowAccount,
      mousedown,
      mouseover,
      isMouseover,
      isSelect,
      pageDatas,
      snft_cancels,
      snft_cancel,
      snft_flag,
      gotxt,
      gozh,
      canbtn,
      showHelp,
      canbtns,
      autoexchange,
      autostat,
      goAutoexchange,
      active,
      // showAcceptCode,
      toogleAcceptCode,
      showTransactionModal,
      handleView,
      handleClose,
      toSend,
      handleLeft,
      isExchanger_flag,
      guideModalSuccess,
      theme,
      loading,
      accountInfo,
      exchangeStatus,
      currentNetwork,
      addressMask,
      showaccount,
      showGuideModal,
      showModal,
      closeModal,
      toCopy,
      transactionData,
      decimal,
      pageData,
      layoutList,
      layoutType,
      tofaucet,
      tobuy,
      dispatch,
      accountTokens,
      myToken,
      loadNft,
      finished,
      nftErr,
      // showExchangeSuccess,
      sonShow,
      actionSheetShow,
    };
  },
};
</script>
<style lang="scss">
@import "./index.scss";
</style>
