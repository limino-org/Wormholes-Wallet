<template>
  <NavHeader
    @clickLeft="handleLeft"

    @handleShowAccount="handleShowAccount"
    :showAccount="actionSheetShow"
  ></NavHeader>
  <div class="wallet">
    <div v-if="!loading" class="container page-container">
      <div class="circle flex center">
      <div            v-show="ethAccountInfo.PledgedBalance">
        <van-popover

v-model:show="showExpresion"
theme="dark"
:close-on-click-outside="false"
z-index="1"
placement="right"
trigger="manual"
:class="`popover-btn-tip ${expresionClass}bg`"
>
<div :class="`${expresionClass}box popover-expresion p-10 hover`">
  <i18n-t tag="div" v-if="expresionClass == 'smile'" keypath="minerspledge.smileTip">
    <template v-slot:value>{{Coefficient}}</template>
    <template v-slot:btn>
      <span class="gotIt"  @click="showExpresion = false">{{t('minerspledge.gotIt')}}</span>
    </template>
  </i18n-t>
  <i18n-t tag="div" v-if="expresionClass == 'sad'" keypath="minerspledge.homeTip">
    <!-- <template v-slot:value>{{Coefficient}}</template> -->
    <template v-slot:btn>
      <span class="gotIt"  @click="showExpresion = false">{{t('minerspledge.gotIt')}}</span>
    </template>
  </i18n-t>
  <i18n-t tag="div" v-if="expresionClass == 'neutral'" keypath="minerspledge.homeTip">
    <!-- <template v-slot:value>{{Coefficient}}</template> -->
    <template v-slot:btn>
      <span class="gotIt" @click="showExpresion = false">{{t('minerspledge.gotIt')}}</span>
    </template>
  </i18n-t>
  
  <!-- <div v-if="expresionClass == 'smile'">
    {{ t("minerspledge.smileTip", { value: Coefficient }) }}
  </div>
  <div v-if="expresionClass == 'sad'">
    {{ t("minerspledge.sadTip", { value: Coefficient }) }}
  </div>
  <div v-if="expresionClass == 'neutral'">
    {{ t("minerspledge.neutralTip", { value: Coefficient }) }}
  </div> -->
</div>
<template #reference>
  <div
    class="hover pl-4 pr-4"
  >
  <div class="account-icon">
<AccountIcon :data="accountInfo.icon" />
</div>
  </div>
</template>
</van-popover>

      </div>
      <div class="account-icon"  v-show="!ethAccountInfo.PledgedBalance" >
      <AccountIcon :data="accountInfo.icon" />
      </div>
      </div>
      <AccountModal v-model:show="showModal" @close="closeModal" />

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
      <div class="account-amount text-center" >
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
      <van-tabs v-model:active="active" sticky :offset-top="48" @click-tab="onClickTab" >

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
                :active="active"
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
      <van-loading size="24px" color="#9F54BA">
        {{ t("wallet.loading") }}
      </van-loading>
    </div>
    <div>
      <Transition name="slider">
        <div class="help-center-box" v-if="!isSelect || active === 0">
          <div class="flex right pl-20 pr-20">
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
      <Transition name="slider">
        <div class="btn-groups" v-if="currentNetwork.id == 'wormholes-network-1' && (!isSelect || active === 0)">
          <div class="pl-20 pr-20 flex right center-v">
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
      </Transition>

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
    <guide-seven></guide-seven>
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
import eventBus from "@/utils/bus";
import { useExchanges } from "@/hooks/useExchanges";

import GuideModal from "@/views/guidance/dialogModal.vue";
import GuideModal1 from "@/views/guidance/step1.vue";
import GuideModal2 from "@/views/guidance/step2.vue";
import GuideModal3 from "@/views/guidance/step3.vue";
import GuideModal4 from "@/views/guidance/step4.vue";
import GuideModal5 from "@/views/guidance/step5.vue";
import GuideModal6 from "@/views/guidance/step6.vue";
import GuideModal7 from "@/views/guidance/step7.vue";
import actionSheet from "./action-sheet.vue";
import dialogWarning from "@/components/dialogWarning/message.vue";
import { useToast } from "@/plugins/toast";
import { useWallet } from "@/hooks/useWallet";
import { getWallet } from '@/store/modules/account';

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
    'guide-seven':GuideModal7,
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
    const { $wtoast } = useToast();
    const showHelp = ref(false);

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
        $wtoast.success(t("common.copyAddr"));
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
    eventBus.on('changeAccount', async() => {
     dispatch('account/getEthAccountInfo')
     dispatch("account/updateBalance");
    })
    eventBus.on('walletReady',() => {
      // dispatch("account/updateBalance");
   
    })

    

    let time: any = null;
    const getWalletBalance = () => {
      dispatch("account/updateAllBalance");
      dispatch("account/updateTokensBalances");
    }
    const handleLoopBalance = () => {
      if(!time) {
        time = setInterval(() => {
          getWalletBalance()
      }, 10000);
      }
    };
    onMounted(async() => {
      dispatch('account/waitTxQueueResponse')
      // const wallet = await getWallet()
      // const res = await wallet.provider.send('eth_call', [{
      //   to:'0x6FCBf98129d354A0f3403C6E418BD7c991cc7c8f',data: '0x4b165090'
      // },'latest'])
      // console.log('res', res)
      eventBus.on('guideSnftModal', (n) => {
        active.value = n
      })
      dispatch('account/getEthAccountInfo')
      dispatch("transfer/clearTx");
      dispatch("account/updateBalance");
      dispatch("account/getExchangeStatus").then((res) => {
        console.warn("getExchangeStatus", res);
        autoexchange.value = res.status;
        autostat.value = res.exchanger_flag;
        if (res.status == 2 && res.exchanger_flag) {
          initExchangeData();
        }
      });
      
      handleLoopBalance()
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
    const showExpresion = ref(false)
    eventBus.on('beforeChangeAccount', async() => {
      showExpresion.value = false
    })
    const ethAccountInfo = computed(() => store.state.account.ethAccountInfo)
    watch(() => ethAccountInfo.value, (n) => {
      if(n.PledgedBalance) {
        showExpresion.value = true
      } else {
        showExpresion.value = false
      }
    },{
      deep: true,
      immediate: true
    })
    const Coefficient = computed(() => {
      return ethAccountInfo.value.Coefficient;
    });
    const expresionClass = computed(() => {
      if (Coefficient.value < 40) return "sad";
      if (Coefficient.value == 40 || Coefficient.value == 50) return "neutral";
      if (Coefficient.value > 50) return "smile";
    });

    const onClickTab = ({name}: any) => {
      console.warn('onClickTab', name)
      if(!name) {
        isSelect.value = false
      }
    }
  
    return {
      onClickTab,
      handleShowSwitch,
      ethAccountInfo,
      expresionClass,
      Coefficient,
      showExpresion,
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
