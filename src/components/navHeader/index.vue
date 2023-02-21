<template>
  <div class="container">
    <van-sticky offset-top="0" class="header-van-sticky--fixed">
      <div
        :class="`nav-header flex center van-hairline--bottom ${
          paddingTop ? 'paddingTop' : ''
        }`"
      >
        <div class="nav-header-con flex between">
          <div class="menu nav-icon flex center-v left">
            <slot name="left">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="t('common.settingTip')"
                placement="bottom-start"
                trigger="hover"
              >
                <div class="icon-box flex center" @click="clickLeft">
                  <i class="iconfont icon-fenlei3" v-if="hasLeft"></i>
                </div>
              </el-tooltip>
            </slot>
          </div>
          <slot name="title">
            <div class="title">
              <div class="title-big text-center text-bold">
                {{ title ? title : currentNetwork.label }}
              </div>
            </div>
          </slot>
          <div class="code nav-icon flex center-v right">
            <slot name="right">
              <el-tooltip
                v-if="hasRight"
                class="box-item"
                effect="dark"
                :content="t('common.switchNet')"
                placement="bottom-end"
                trigger="hover"
              >
                <div class="icon-box flex center" @click="chooseNetWork">
                  <NetIcon
                    :index="currentNetwork.icon.index"
                    :color="netColor"
                    size="15"
                  />
                </div>
              </el-tooltip>
            </slot>
          </div>
        </div>
      </div>
    </van-sticky>

    <van-popup
      v-model:show="show"
      position="left"
      :style="{ height: '100vh' }"
      :duration="0.3"
      class="nav-header-slider-box"
      teleport="#page-box"
    >
      <div class="slider-con">
        <div class="slider-bg">
          <div class="company">
            <div class="company-logo">
              <!-- <img class="compy_img" src="@/assets/token/icon_blue.svg" /> -->
              <img class="compy_img" src="@/assets/token/logowallet.png" />
            </div>
            <div class="company-name">Wormholes</div>
          </div>

          <div class="user-img">
            <div class="user-img-circle">
              <AccountIcon :data="accountInfo.icon" size="small" />
            </div>
          </div>
          <div class="account flex center-v" @click="toggleAccount">
            <div style="font-size: 14px; color: #79797a">
              {{ accountInfo.name }}
              <van-icon
                name="play"
                color="#000"
                :style="`transform: rotate(${showAccount ? '-' : ''}${90}deg);`"
              />
            </div>
          </div>

          <div class="account-address">
            {{ accountInfo.address }}
          </div>
          <div class="account-amount">
            {{ decimal(accountInfo.amount) }}
            {{ currentNetwork.currencySymbol }}
          </div>
        </div>
        <div class="slider-bottom">
          <div class="setting-list">
            <div
              class="setting-btn clickActive flex center-v"
              @click="toOfficiaWebsite"
            >
              <i class="iconfont icon-zailiulanqidakai"></i>
              <span>{{ t("sidebar.aboutAs") }}</span>
            </div>

            <div
              class="setting-btn clickActive flex center-v"
              @click="goPledge()"
              v-if="network.id == 'wormholes-network-1'"
            >
              <i class="iconfont icon-chuiziicon"></i>
              <span>{{ t("sidebar.minerspledge") }}</span>
            </div>

            <div
              class="setting-btn clickActive flex center-v"
              @click="oneClick"
            >
              <i
                class="iconfont icon-fangwujianzhuwugoujianbeifen"
                style="font-size: 16px"
              ></i>
              <span v-if="!exchangeStatus.exchanger_flag">{{
                t("sidebar.openexchange")
              }}</span>
              <span v-else>{{ t("sidebar.exchangemanagement") }}</span>
            </div>

            <div
              class="setting-btn clickActive flex center-v"
              @click="tobrowser"
            >
              <i class="iconfont icon-network"></i>
              <span>{{ t("sidebar.browser") }}</span>
            </div>

            <div
              class="setting-btn clickActive flex center-v"
              @click="routerTo('transactionList')"
            >
              <i class="iconfont icon-liulanlishi" style="font-size: 20px"></i>
              <span>{{ t("sidebar.transationjhistory") }}</span>
            </div>

            <div class="setting-btn clickActive flex center-v" @click="toHelp">
              <i class="iconfont icon-bangzhuzhongxin31"></i>
              <span>{{ t("sidebar.help") }}</span>
            </div>

            <div
              class="setting-btn clickActive flex center-v"
              @click="routerTo('settings')"
            >
              <van-icon name="setting-o" />
              <span>{{ t("sidebar.setting") }}</span>
            </div>
            <div
              class="setting-btn clickActive flex center-v"
              @click="handleLogout"
            >
              <i
                class="iconfont icon-dengchu-xuanting"
                style="font-size: 18px"
              ></i>
              <span>{{ t("sidebar.logout") }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <CreateSuccess
      v-model:show="showModalshare"
      v-if="showModalshare"
    ></CreateSuccess>
    <SwitchNetwork v-model="showModalNetwork" />
    <van-popup
      v-model:show="showAcceptCode"
      :style="{ position: 'absolute' }"
      teleport="#page-box"
      position="bottom"
      round
    >
      <AcceptCode @handleToStep1="show = false" />
    </van-popup>

    <agreement-view
      v-model:check="check"
      v-if="showAgreement"
      v-model:show="showAgreement"
      @submitCheck="submitCheck"
    ></agreement-view>
    <amount-view
      v-model:show="showAcount"
      v-model:minersMoney="minersMoney"
    ></amount-view>
    <pledge-view v-if="showPledge" v-model:show="showPledge"></pledge-view>

    <success-dialog></success-dialog>
    <dialog-warning
      v-if="isWarning"
      v-model:isWarning="isWarning"
      :text="dialogWarningText"
      :iconName="dialogWarningIconName"
      :color="dialogWarningColor"
    >
    </dialog-warning>

    <AffirmDialogA
      v-if="isAffirmDialogA"
      v-model:show="isAffirmDialogA"
    ></AffirmDialogA>
    <AffirmDialogB
      v-if="isAffirmDialogB"
      v-model:show="isAffirmDialogB"
      v-model:isAffirmDialogC="isAffirmDialogC"
    ></AffirmDialogB>
    <AffirmDialogC
      v-if="isAffirmDialogC"
      v-model:show="isAffirmDialogC"
    ></AffirmDialogC>
    <AffirmDialogD
      v-if="isAffirmDialogD"
      v-model:show="isAffirmDialogD"
    ></AffirmDialogD>
  </div>
</template>

<script lang="ts">
import NetIcon from "@/components/netIcon/index.vue";

import {
  SetupContext,
  Ref,
  ref,
  reactive,
  defineComponent,
  computed,
  nextTick,
  watch,
} from "vue";
import {
  Popup,
  Icon,
  Popover,
  ActionSheet,
  Dialog,
  Button,
  Loading,
  Circle,
  Collapse,
  CollapseItem,
  Sticky,
  Toast,
} from "vant";
import NetWorkCard from "../netWorkCard/index.vue";
import { showSlider, show } from "@/components/navHeader/hooks/slider";
import { useToggleAccount } from "@/components/accountModal/hooks/toggleAccount";
import { useNetWork } from "@/components/navHeader/hooks/netWork";
import { useLogin } from "@/components/navHeader/hooks/login";
import { useExchanges } from "@/hooks/useExchanges";
import { useRouter, useRoute, RouteRecordName } from "vue-router";
import AccountIcon from "@/components/accountIcon/index.vue";
import AccountModal from "@/components/accountModal/index.vue";
import SwitchNetwork from "@/components/switchNetwork/index.vue";
import { addressMask, decimal } from "@/utils/filters";
import { useStore } from "vuex";
import AcceptCode from "@/views/account/components/acceptCode/index.vue";
import MinersView from "@/views/account/exchange/index.vue";
import AgreementView from "@/views/account/exchange/agreement.vue";
import AmountView from "@/views/account/exchange/amount.vue";
import PledgeView from "@/views/account/exchange/pledge.vue";
// import LoadingView from "@/views/account/exchange/loading.vue";
import success from "@/views/account/exchange/success.vue";
import AffirmDialogA from "@/views/account/exchange/components/affirmDialogA.vue";
import AffirmDialogB from "@/views/account/exchange/components/affirmDialogB.vue";
import AffirmDialogC from "@/views/account/exchange/components/affirmDialogC.vue";
import AffirmDialogD from "@/views/account/exchange/components/affirmDialogD.vue";

import CreateSuccess from "@/views/account/createsuccess/index.vue";
import { useI18n } from "vue-i18n";
import { getWallet, NetStatus } from "@/store/modules/account";
import dialogWarning from "@/components/dialogWarning/index.vue";
import { ElTooltip, ElButton } from "element-plus";
import dialogWarnings from "@/components/dialogWarning/message.vue";
import { useToast } from "@/plugins/toast";
import { useDialog } from "@/plugins/dialog";
import { isCommunityResourcable } from "@ethersproject/providers";
import { VUE_APP_EXCHANGESMANAGEMENT_URL } from "@/enum/env";
import BigNumber from "bignumber.js";
export default defineComponent({
  name: "NavHeader",
  emits: [
    "clickLeft",
    "clickRight",
    "updateAccountSuccess",
    "showExchange",
    "handleShowAccount",
    "hasRight",
  ],
  components: {
    [Popup.name]: Popup,
    "dialog-warnings": dialogWarnings,
    [Icon.name]: Icon,
    [ActionSheet.name]: ActionSheet,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    ElButton,
    [Loading.name]: Loading,
    [Sticky.name]: Sticky,
    ElTooltip,
    [Circle.name]: Circle,
    [MinersView.name]: MinersView,
    [Popover.name]: Popover,
    [AgreementView.name]: AgreementView,
    [AmountView.name]: AmountView,
    NetIcon,
    // [CreateSuccess.name]: CreateSuccess,
    [PledgeView.name]: PledgeView,
    // [LoadingView.name]: LoadingView,
    "success-dialog": success,
    [AffirmDialogA.name]: AffirmDialogA,
    [AffirmDialogB.name]: AffirmDialogB,
    [AffirmDialogC.name]: AffirmDialogC,
    [AffirmDialogD.name]: AffirmDialogD,
    NetWorkCard,
    AccountIcon,
    AccountModal,
    SwitchNetwork,
    AcceptCode,
    CreateSuccess,
    "dialog-warning": dialogWarning,
  },
  props: {

    hasLeft: {
      type: Boolean,
      default: true,
    },
    hasRight: {
      type: Boolean,
      default: true,
    },
    paddingTop: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    showAccount: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, context: SetupContext) {
    const isWarning = ref(false);
    const { t } = useI18n();
    // const isWarnings = ref(false);
    const router = useRouter();
    const route = useRoute()
    let sonShow = ref(false);
    const store = useStore();
    const { state, commit, dispatch } = store;
    watch(
      () => props.showAccount,
      (n) => {
        showAccount.value = n;
      },
      {
        deep: true,
      }
    );
    watch(() => route.fullPath, () => {
      show.value = false
    })
    const {
      netWorkList,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
    } = useNetWork();

    const {
      createExchanges,
      showCreateExchange,
      ready,
      showExchange,
      closeExchanges,
    } = useExchanges();

    const { $wtoast } = useToast();
    const { logout } = useLogin();
    const accountInfo = computed(() => store.state.account.accountInfo);
    const exchangeStatus = computed(() => store.state.account.exchangeStatus);
    const { emit } = context;
    const clickLeft = () => {
      emit("clickLeft");
    };
    const showPopover = ref(false);
    const clickRight = () => {
      router.replace({ name: "wallet" });
    };
    const toOfficiaWebsite = () => {
      window.open("https://www.wormholes.com");
    };

    const routerTo = (name: string) => {
      show.value = false;
      router.push({ name });
    };
    const { $wdialog } = useDialog();
    const goPledge = async () => {
      show.value = false;
      const wallet = await getWallet();
      const ethAccountInfo = await wallet.provider.send("eth_getAccountInfo", [
        wallet.address,
        "latest",
      ]);
      if (ethAccountInfo.PledgedBalance) {
        router.push({ name: "minersDeal" });
        return;
      }
      let accountAmount = new BigNumber(accountInfo.value.amount);
      
      if (accountAmount.gte(70001)) {
        show.value = false;
        // router.push({ name: 'minersPledge' })
        router.push({ name: "minersDeal" });
      } else {
        $wdialog.open({
          type: "warn",
          theme: "dark",
          hasCancelBtn: false,
          message: t("send.sendMessage"),
        });
        // isWarnings.value = true;
        return;
      }
    };

    const closeModal = () => {
      showAccount.value = false;
    };
    const toBackManage = async () => {
      const wallet = await getWallet();
      const { address } = wallet;
      window.open(
        `${VUE_APP_EXCHANGESMANAGEMENT_URL}?address=${address}&exchangeAddress=${address}`
      );
    };
    const handleLogout = () => {
      show.value = false;
      logout();
    };
    const network = computed(() => store.state.account.currentNetwork);
    const tobrowser = () => {
      window.open(`${network.value.browser || 'https://www.wormholesscan.com'}`)
    };

    const toSend = () => {
      show.value = false;
      router.push({ name: "send" });
    };

    const showAcceptCode: Ref<boolean> = ref(false);
    const toogleAcceptCode = () => {
      showAcceptCode.value = true;
    };
    const oneClick = async() => {
      Toast.loading({
        duration:0
      })
      show.value = false;
      const exchangeStatus = await dispatch('account/getExchangeStatus')
      Toast.clear()
      if (exchangeStatus.exchanger_flag) {
        router.push({
          name: "exchange-management",
        });
      } else {
        router.push({
          name: "bourse",
        });
      }
    };
    const dialogWarningText = ref("");
    const dialogWarningIconName = ref("");
    const dialogWarningColor = ref("");
   
    const myExchangeshare = () => {
      router.push({ name: "createsuccessexchange" });
      return;
      // }
    };
    let showMiners = ref(false);
    const changeShowMiners = () => {
      show.value = false;
      showCreateExchange.value = true;
    };
    let showAgreement = ref(false);
    let showModalshare = ref(false);
    let check = ref(false);
    const submitCheck = (type: string, flag: Boolean) => {
      if (type === "check" && flag) {
        check.value = true;
      } else {
        check.value = false;
      }
    };
    let minersMoney = ref(200);
    let showAcount = ref(false);
    const minersConfirm = () => {
      showMiners.value = false;
      isLoading.value = true;
    };
    let showPledge = ref(false);
    let isLoading = ref(false);
    let isAffirmDialogA = ref(false);
    let isAffirmDialogB = ref(false);
    let isAffirmDialogC = ref(false);
    let isAffirmDialogD = ref(false);
    const closeExchange = async () => {
      const wallet = await getWallet();
      const { address } = wallet;
      const blockNumber = await wallet.provider.getBlockNumber();
      const accountInfo = await wallet.provider.send("eth_getAccountInfo", [
        address,
        "latest",
      ]);
      show.value = false;
      console.log(accountInfo);
      if (blockNumber - accountInfo.BlockNumber >= (currentNetwork.value.chainId == 51888 ?  72 : 6307200)) {
        isAffirmDialogB.value = true;
      } else {
        isAffirmDialogA.value = true;
      }
    };

    const goReceive = () => {
      show.value = false;
      router.push({
        name: "receive-award-home",
      });
    };
    const netStatus = computed(() => state.account.netStatus);
    const netColor = computed(() => {
      let color = "#000";
      switch (netStatus.value) {
        case NetStatus.pendding:
          color = "#3ea757";
          break;
        case NetStatus.success:
          color = "#037CD6";
          break;
        case NetStatus.fail:
          color = "#ce4051";
          break;
        default:
          color = "#000";
          break;
      }
      return color;
    });

    const toHelp = () => {
      // $wtoast.warn(t('common.commingsoon'))
      window.open("https://www.wormholes.com/docs/wallet/");
    };
    const showAccount = ref(false);
    const toggleAccount = () => {
      showAccount.value = !showAccount.value;
      emit("handleShowAccount", showAccount.value);
    };
    return {
      t,
      goPledge,
      goReceive,
      network,
      toggleAccount,
      myExchangeshare, 
      clickLeft,
      clickRight,
      show,
      toOfficiaWebsite,
      netColor,
      tobrowser,
      showAccount,
      closeModal,
      dialogWarningText,
      dialogWarningIconName,
      dialogWarningColor,
      showPopover,
      showModalNetwork,
      chooseNetWork,
      netWorkList,
      currentNetwork,
      handleChoose,
      handleChooseComfirm,
      accountInfo,
      addressMask,
      handleLogout,
      toBackManage,
      toSend,
      showAcceptCode,
      toogleAcceptCode,
      decimal,
      createExchanges,
      showCreateExchange,
      ready,
      showExchange,
      routerTo,
      isWarning,
      oneClick,
      changeShowMiners,
      showMiners,
      showAgreement,
      showModalshare, 
      submitCheck,
      check,
      minersMoney,
      showAcount,
      minersConfirm,
      showPledge,
      isLoading,
      isAffirmDialogA,
      isAffirmDialogB,
      isAffirmDialogC,
      isAffirmDialogD,
      closeExchange,
      exchangeStatus,
      sonShow,
      netStatus,
      toHelp,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
@import "./index.scss";
.c {
  color: #79797a;
  transform: rotate(-90deg);
}
</style>
