<template>
  <div :class="`bourse ${isModif ? 'modif' : ''}`">
    <NavHeader
      :title="
        isModif
          ? t('minerspledge.modifValidator')
          : t('minerspledge.beValidator')
      "
    >
      <template v-slot:left>
        <span class="back" @click="appProvide.back">{{
          t("common.back")
        }}</span>
      </template>
      <template v-slot:right>
        <cancel-btn />
      </template>
    </NavHeader>

    <div class="bourse-container" v-if="!pageLoading">
      <div :class="`bourse-container-meaning}`">
        <span class="card-tit">{{ t("minerspledge.stackTit") }} </span>
        <el-tooltip
          popper-class="tooltip2"
          class="box-item"
          effect="dark"
          :content="t('minerspledge.stackTip')"
          placement="right"
          trigger="hover"
        >
          <van-icon name="question" color="#9A9A9A" />
        </el-tooltip>
      </div>
      <div class="t3">
        {{ PledgedBalance }}ERB <span>(≈{{ toUsd(PledgedBalance, 2) }})</span>
      </div>

      <div v-if="isModif">
        <div class="bourse-container-meaning bt" style="margin-bottom: 10px">
          <span class="card-tit">{{ t("minerspledge.Delegatetit") }}</span>
          <el-tooltip
            popper-class="tooltip2"
            class="box-item"
            effect="dark"
            :content="t('minerspledge.proxyAccountTip')"
            placement="right"
            trigger="hover"
          >
            <van-icon name="question" color="#9A9A9A" />
          </el-tooltip>
        </div>
        <div class="flex modif-acc pb-12">
          <div class="userIcon">
            <AccountIcon :data="selectAccount.icon" size="small" />
          </div>
          <div
            :class="`value  flex  account-box ${
              selectAccount.name ? ' column between' : 'center-v'
            }`"
          >
            <div class="name" v-if="selectAccount.name">
              {{ selectAccount.name }}
            </div>
            <div class="val">{{ selectAccount.address }}</div>
          </div>
        </div>
      </div>

      <div class="bourse-container-warning" v-if="isWarning">
        <van-icon name="warning" color="#F7BF03" size="20" />
        <span>{{ t("minerspledge.isPoor") }}</span>
      </div>
      <div class="bourse-container-name" style="margin-top: 20px" v-if="isOpen">
        <span class="card-tit">{{ t("minerspledge.addTit") }} </span>
        <el-tooltip
          popper-class="tooltip4"
          class="box-item"
          effect="dark"
          :content="t('minerspledge.addTip')"
          placement="right"
          trigger="hover"
        >
          <van-icon name="question" color="#9A9A9A" />
        </el-tooltip>
      </div>
      <div class="maxBalance" v-if="isModif">{{ addNumber2 || 0 }}ERB</div>
      <el-slider
        v-if="isModif"
        class="slider-ipt"
        v-model="addNumber2"
        :min="0"
        :max="maxBalance"
        :marks="marks"
        @input="handleChangeSlider"
      />
      <div class="create-new-password" v-if="isOpen">
        <van-form @submit="onSubmitAddNumber" ref="formDom">
          <div
            :class="
              isError
                ? 'error-field'
                : isSuccess
                ? 'success-field'
                : ''
            "
          >
            <van-field
              maxlength="25"
              v-model="addNumber"
              class="text"
              @blur="handleAddBlur"
              type="number"
              :placeholder="t('bourse.placeamount')"
            >
              <template #right-icon>
                <span style="font-weight: bold; font-size: 16px; color: #000"
                  >ERB</span
                >
              </template>
            </van-field>
          </div>
        </van-form>
      </div>

      <div
        class="bourse-container-meaning bt"
        v-if="!isModif"
        style="margin-bottom: 10px"
      >
        <span class="card-tit">{{
          isDelegate
            ? t("minerspledge.Stackingtit")
            : t("minerspledge.Delegatetit")
        }}</span>
        <el-tooltip
          popper-class="tooltip2"
          class="box-item"
          effect="dark"
          :content="t('minerspledge.proxyAccountTip')"
          placement="right"
          trigger="hover"
        >
          <van-icon name="question" color="#9A9A9A" />
        </el-tooltip>
      </div>
      <div
        class="flex between pl-14 pr-14 pt-20 pb-20 account-outBox hover"
        @click="openModal"
        v-if="!isModif"
      >
        <div class="flex account-info-box">
          <div class="userIcon">
            <AccountIcon :data="selectAccount.icon" size="small" />
          </div>
          <div
            :class="`value  flex  account-box ${
              selectAccount.name ? ' column between' : 'center-v'
            }`"
          >
            <div class="name" v-if="selectAccount.name">
              {{ selectAccount.name }}
            </div>
            <div class="val van-ellipsis">{{ selectAccount.address }}</div>
          </div>
        </div>
        <div class="rightIcon flex center">
          <van-icon name="arrow-up" v-if="showAccountModal" />
          <van-icon name="arrow-down" v-else />
        </div>
        <AccountList v-model="showAccountModal" @on-change="handleAccount" />
        <!-- <AccountModal v-model:actionSheetShow="showAccountModal" :hasBtn="false" :showAmount="false" /> -->
      </div>

      <!-- <div class="bourse-container-name pt-14 border-top" v-if="!isModif">
        <span class="card-tit">{{ t("minerspledge.node") }} </span>
        <el-tooltip
          popper-class="tooltip4"
          class="box-item"
          effect="dark"
          :content="t('minerspledge.nodeTip')"
          placement="right"
          trigger="hover"
        >
          <van-icon name="question" color="#9A9A9A" />
        </el-tooltip>
      </div>
      <div class="create-new-password nodeIpt" v-if="!isModif">
        <van-form @submit="onSubmit" ref="formDom2">
          <div
            :class="
              isError
                ? 'error-field'
                : isSuccess
                ? 'success-field'
                : ''
            "
          >
            <van-field
              :disabled="isOpen"
              maxlength="100"
              validate-trigger="onChange"
              v-model="name"
              class="text"
              type="text"
              :placeholder="t('bourse.placenode')"
              :rules="[{ validator: asynPwd2, message: t('bourse.vainode') }]"
            />
          </div>
        </van-form>
      </div> -->
      <div class="bourse-container-btns">
        <div class="container pl-28 pr-28">

          <Tip  :message="t('minerspledge.tip4')" v-if="!isModif" />
       
          <div class="btns flex between">
            <van-popover
            v-model:show="showClose"
            v-if="!showCloseBtn && isModif"
            theme="dark"
            :close-on-click-outside="false"
            z-index="1"
            placement="top"
            trigger="manual"
            class="popover-btn-tip"
          >
            <div class="f-12 pl-10 pr-10 pt-10 pb-10 ">
              {{ t("minerspledge.closeTip2") }}
            </div>
            <template #reference>
              <van-button
              :disabled="showCloseBtn ? false : true"
              plain
              @click="closeDialogTime = true"
              >{{ t("minerspledge.stackinglabel") }}</van-button
            >
            </template>
          </van-popover>
          <van-button
              v-if="isModif && showCloseBtn"
              :disabled="showCloseBtn ? false : true"
              plain
              @click="closeDialogTime = true"
              >{{ t("minerspledge.stackinglabel") }}</van-button
            >

            <van-button
              :loading="isLoading"
              @click="onSubmit"
              type="primary"
              :style="{width:isModif ? '48%' : '100%'}"
              >{{
                !isModif ? t("common.confirm") : t("bourse.saveExchange")
              }}</van-button
            >
          </div>
        </div>
      </div>

      <agreement-view
        v-model:check="checked"
        v-if="showAgreement"
        v-model:show="showAgreement"
        @submitCheck="submitCheck"
      ></agreement-view>
      <amount-view
        v-if="showAcount"
        :moneyMinF="moneyMin"
        :moneyMax="moneyMax"
        v-model:show="showAcount"
        v-model:minersMoney="money"
      ></amount-view>

      <van-dialog
        v-model:show="showExchange1"
        z-index="9999"
        show-cancel-button
        teleport="#page-box"
        :showConfirmButton="false"
        :showCancelButton="false"
      >
        <div class="miners-success" v-if="isClose">
          <div class="miners-header">
            <span>{{ t("minerspledge.stackinglabel") }}</span>
          </div>
          <div class="flex center">
            <img
              class="exchange-welcome-icon"
              src="@/assets/exchange/SketchPng6487f59e1a3e4adec886c6b63f8c41c4aa0d61ebfe43fcaad735b3ff5ca97e8d.png"
            />
          </div>
          <div class="flex center">
            <span class="text-s">{{ t("bourse.closeSuccess") }}</span>
          </div>
          <div class="container-btn flex center">
            <van-button type="primary" class="btn" round @click="tohome">{{
              $t("createExchange.gohome")
            }}</van-button>
          </div>
        </div>
        <div class="miners-success" v-else-if="isOne">
          <div class="miners-header">
            <span>{{ $t("createExchange.open_exchange") }}</span>
          </div>
          <div class="flex center">
            <img
              class="exchange-welcome-icon"
              src="@/assets/exchange/SketchPng6487f59e1a3e4adec886c6b63f8c41c4aa0d61ebfe43fcaad735b3ff5ca97e8d.png"
            />
          </div>
          <div class="flex center">
            <span class="text-s">{{ $t("createExchange.openyourself") }}</span>
          </div>
          <div class="container-btn flex center">
            <van-button type="primary" class="btn" round @click="tohome">{{
              $t("createExchange.gohome")
            }}</van-button>
          </div>
        </div>
      </van-dialog>

      <affirm-dialog
        @open="sendToPledgeHttp"
        :name="name"
        :address="selectAccount.address"
        :amount="PledgedAmount"
        v-model:show="isAffirmDialog"
        v-if="isAffirmDialog"
      ></affirm-dialog>
      <add-affirm-dialog
        @open="sendToPledgeHttp"
        :name="name"
        :address="selectAccount.address"
        :amount="PledgedBalance"
        :addNumber="PledgedAmount"
        v-model:show="isAddAffirmDialog"
      >
      </add-affirm-dialog>
      <SwitchNetwork
        v-model:show="showModalNetwork"
        @close="showModalNetwork = false"
      />
      <close-dialog
        @warningSuccess="isCloseAffirm = true"
        v-model:isWarning="isCloseDialog"
        v-if="isCloseDialog"
      ></close-dialog>
      <close-submit-dialog
        @open="submitOpen"
        :formatValueNumber="PledgedBalance"
        v-model:show="closeDialogSubmit"
        :address="accountInfo.address"
      ></close-submit-dialog>
      <!-- <close-dialog-time
        @affirmClose="closeDialogSubmit = true"
        v-model:show="closeDialogTime"
      ></close-dialog-time> -->
      <affirm-close
        name="name"
        :serverIndex="serverIndex"
        :money="money"
        v-model:show="isCloseAffirm"
        @affirmClose="affirmClose"
        v-if="isCloseAffirm"
      ></affirm-close>
      <close-home
        v-model:isWarning="isCloseHome"
        v-if="isCloseHome"
      ></close-home>
      <!-- Adjust the amount of pledge -->
      <ModifPledgeModal
        v-model="closeDialogTime"
        :max="formatValueNumber || PledgedAmount"
        @confirm="handleMinusConfirm"
      />

      <!-- Reduce the pledge pop-up window -->
      <MinusStackDialog
        v-model:show="showMinusModal"
        :minusNumber="minusNumber"
        :amount="formatValueNumber || PledgedAmount"
      />
    </div>
    <div class="loading-box flex center" v-else>
      <div class="p-30">
        <van-loading color="#037CD6" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  watch,
  SetupContext,
  computed,
  reactive,
  toRaw,
  onMounted,
  inject,
  ComputedRef,
  nextTick,
  onBeforeMount,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { RegUrl, RegNum1 } from "@/enum/regexp";
import { ethers, utils } from "ethers";
import { useStore, mapState } from "vuex";
import NavHeader from "@/components/navHeader/index.vue";
import MinusStackDialog from "@/views/account/miners/miuns-stack-dialog.vue";
import Tip from '@/components/tip/index.vue'
import { useExchanges } from "@/hooks/useExchanges";
import BigNumber from "bignumber.js";
import { AccountInfo, ExchangeStatus } from "@/store/modules/account";
import {
  Dialog,
  Form,
  Field,
  CellGroup,
  Cell,
  Button,
  Popup,
  Circle,
  Icon,
  Toast,
  Slider,
  Checkbox,
  Loading,
  Popover
} from "vant";
import useClipboard from "vue-clipboard3";
import { getWallet, wallet } from "@/store/modules/account";
import { useI18n } from "vue-i18n";
import AmountView from "@/views/account/exchange/amount.vue";
import AgreementView from "@/views/account/exchange/agreement.vue";
import success from "@/views/account/exchange/success.vue";
import {
  formatEther,
  toUsd,
  decimalCopy,
  scientificToNumber,
  decimal,
} from "@/utils/filters";
import { web3 } from "@/utils/web3";
import { useNetWork } from "@/components/navHeader/hooks/netWork";
import SwitchNetwork from "@/components/switchNetwork/index.vue";
import { ElTooltip, ElSlider } from "element-plus";
import dialogWarning from "@/components/dialogWarning/index.vue";
import affirmDialog from "./affirm-dialog.vue";
import addAffirmDialog from "./add-affirm-dialog.vue";

import closeDialog from "./close-dialog.vue";
import close1 from "./close1.vue";
import closeSubmitDialog from "./close-submit.vue";
import closeAffirmDialog from "./close-affirm-dialog.vue";
import AccountIcon from "@/components/accountIcon/index.vue";
import closeHome from "./close-home.vue";
import { ElSelect, ElOption } from "element-plus";
import { useDialog } from "@/plugins/dialog";
import AccountModal from "@/views/account/wallet/action-sheet.vue";
import AccountList from "@/views/account/miners/components/accountList.vue";
import ModifPledgeModal from "@/views/account/components/modifPledgeModal/index.vue";
import { debug } from "console";
import { toHex } from "@/utils/utils";
import { getRandomIcon } from "@/utils";
import { useToast } from "@/plugins/toast";
import {
  VUE_APP_EXCHANGESMANAGEMENT_URL,
  VUE_APP_EXCHANGES_URL,
} from "@/enum/env";
export default defineComponent({
  name: "createExchange",
  components: {
    "affirm-dialog": affirmDialog,
    "close-dialog-time": close1,
    "close-submit-dialog": closeSubmitDialog,
    [Dialog.Component.name]: Dialog.Component,
    [Form.name]: Form,
    ElSelect,
    ElOption,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    ElTooltip,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Slider.name]: Slider,
    [Circle.name]: Circle,
    [Checkbox.name]: Checkbox,
    [Loading.name]: Loading,
    [Popover.name]:Popover,
    MinusStackDialog,
    [Icon.name]: Icon,
    [AmountView.name]: AmountView,
    [AgreementView.name]: AgreementView,
    AccountModal,
    "success-dialog": success,
    SwitchNetwork,
    "dialog-warning": dialogWarning,
    "close-dialog": closeDialog,
    "affirm-close": closeAffirmDialog,
    "close-home": closeHome,
    "add-affirm-dialog": addAffirmDialog,
    ElSlider,
    AccountIcon,
    NavHeader,
    AccountList,
    ModifPledgeModal,
    Tip
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const { $dialog } = useDialog();
    const showAccountModal = ref(false);
    const store = useStore();
    const accountInfo = computed(() => store.state.account.accountInfo);
    const blockNumber = ref(0);
    const accountInfoBlockNumber = ref(0);
    const accountList = computed(() => store.state.account.accountList);
    const { sendToPledge } = useExchanges();
    const appProvide = inject("appProvide");
    const pageLoading = ref(true);
    //  Is it an append
    const isModif = ref(true);
    const showCloseBtn = ref(false);

    //  const { state } = store;
    onMounted(async () => {
      try {
        const wallet = await getWallet();
        const { address } = wallet;
        blockNumber.value = await wallet.provider.getBlockNumber();
        ethAccountInfo.value = await wallet.provider.send(
          "eth_getAccountInfo",
          [address, "latest"]
        );
        debugger;
        const blockn = web3.utils.toHex(blockNumber.value.toString());
        debugger
        // Amount of the first pledge/total amount of the pledge *36 (start time of the second cancellation of the pledge calculation)+ Amount of the second pledge/total amount *72=54 = (time when the second cancellation of the pledge can be revoked)
        showCloseBtn.value = new BigNumber(blockNumber.value)
          .minus(ethAccountInfo.value.PledgedBlockNumber)
          .gt((currentNetwork.value.chainId == 51888 ?  72 : 6307200));
        const pledgeList = await wallet.provider.send("eth_getValidator", [
          `${blockn}`,
        ]);
        console.log("pledgeList", pledgeList);

        if (!ethAccountInfo.value.PledgedBalance) {
          isModif.value = false;
          // $dialog.open({title:t('minerspledge.beValidator'),message:t("minerspledge.warn"),type:'warn'});
        } else {
          isModif.value = true;
          try {
            const pledge = pledgeList.Validators.find(
              (item: any) =>
                item.Addr.toUpperCase() ==
                accountInfo.value.address.toUpperCase()
            );
            console.warn("pledge", pledge);
            const selectAcc = accountList.value.find(
              (item: any) =>
                item.address.toUpperCase() == pledge.Proxy.toUpperCase()
            );
            debugger;
            selectAccount.value = selectAcc
              ? { ...selectAcc }
              : { address: pledge.Addr, name: "", icon: getRandomIcon() };
          } catch (err) {
            console.error(err);
          }
        }
        accountInfoBlockNumber.value = ethAccountInfo.value.BlockNumber;
        console.log(blockNumber.value - accountInfoBlockNumber.value);
        console.log("blockNumber.value - accountInfoBlockNumber.value");
      } finally {
        pageLoading.value = false;
      }
    });
    const isTimeQualified = computed(
      () => blockNumber.value - accountInfoBlockNumber.value >= (currentNetwork.value.chainId == 51888 ?  72 : 6307200)
    );
    const {
      netWorkList,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
    } = useNetWork();
    const networkTypeValue = computed(() => store.state.account.networkType);
    const { emit }: any = context;
    const firstamount = ref(100);
    const isSuccess = computed(() => {
      return name.value && asynPwd2(name.value);
    });
    const {
      createExchanges,
      showCreateExchange,
      showExchange,
      showExchange1,
      ready,
      sendTo,
      closeExchanges,
      modifExchangeBalance,
    } = useExchanges();
    const name = ref("");
    const handleNameBlur = () => {};
    console.log("===========");
    console.log("===========");

    const { dispatch } = store;
    const amount = ref(200);

    // Open exchange status
    const exchangeStatus: ComputedRef<ExchangeStatus> = computed(
      () => store.state.account.exchangeStatus
    );
    const maxBalance = computed(() => {
      const v = parseInt(store.state.account.accountInfo.amount);
      const bigAmount = new BigNumber(v).minus(1)
      return bigAmount.gte(0) ? bigAmount.toNumber() : 0;
    });
    const sliderDisabled = computed(() => {
      // You can slide the slider only if you don't hand in both
      if (
        exchangeStatus.value.exchanger_flag == false &&
        exchangeStatus.value.status != 2
      ) {
        return false;
      }
      return true;
    });
    const isWarningText = ref(false);
    // Disable the status of the Submit one-click exchange button
    const openDisabled = computed(() => {
      const v = parseFloat(store.state.account.accountInfo.amount);
      // @ts-ignore
      if (
        exchangeStatus.value.exchanger_flag == true &&
        exchangeStatus.value.status != 2
      ) {
        // The first fee was paid and the second one was not paid
        if (v < 200) {
          return true;
        } else {
          return false;
        }
      }
      // I didn't pay the first and I didn't pay the second
      // @ts-ignore
      if (
        exchangeStatus.value.exchanger_flag == false &&
        exchangeStatus.value.status != 2
      ) {
        if (v < 301) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    });
    const { $toast } = useToast();
    const isAddAffirmDialog = ref(false);
    const onSubmitAddNumber = async () => {
      if (!addNumber.value || addNumber.value == "0") {
        $toast.warn(t("sendto.no"));
        return;
      }
      console.log(addNumber.value, isAddAffirmDialog.value, isModif.value);

      isAddAffirmDialog.value = true;
      console.log(isAddAffirmDialog.value);
    };


    const addNumber = ref();

    const PledgedAmount = computed(() => {
      return addNumber.value || 70000;
    });
    const isLoading = ref(false);
    const selectValue = ref("");
    const sendToPledgeHttp = async () => {
      try {
        isLoading.value = true;
        // An additional amount greater than 0 is an additional pledge, otherwise it is the first pledge

        // If the selected address is not the current account address, take the selected address -> proxy address


        const proxy_address =
          selectAccount.value.address.toUpperCase() ==
          accountInfo.value.address.toUpperCase()
            ? ""
            : selectAccount.value.address;
        const am = addNumber.value ? Number(addNumber.value) : 0 || 70000;
        console.warn("proxy_address", proxy_address);
        console.warn("am", am);
        //
        await sendToPledge(am, isModif.value ? "" : proxy_address);
        isLoading.value = false;
        addNumber.value = null;
        await initData();
      } catch (err) {
        console.error(err);
      }
    };

    const toCancel = () => {
      showCreateExchange.value = false;
    };

    const value = ref(50);

    const toGo = () => {

      showExchange.value = false;

      showExchange1.value = true;
    };



    const isClose = ref(false);
    const isClosePladge = ref(false);
    const affirmClose = () => {
      isClose.value = true;
      showExchange.value = true;
      closeExchanges();
    };
    const tohome = () => {
      showExchange1.value = false;
      showCreateExchange.value = false;
      emit("closeSonShow", false);
      router.push({
        path: "/wallet",
      });
    };

    const submitOpen = () => {
      initData();
    };

    watch(
      () => props.show,
      (n) => {
        console.log("==================n===========");
        console.log(n);
        console.log("==================n===========");
        showCreateExchange.value = n;
      }
    );
    showCreateExchange.value = props.show;

    watch(
      () => sliderDisabled.value,
      (n) => {
        // If the slider is disabled, the first fund limit is 100
        firstamount.value = 100;
      },
      { immediate: true }
    );
    watch(
      () => networkTypeValue.value,
      (now) => {
        console.log(now);
        console.log("-------------------------------");
        if (now === 3) {
          isWarning.value = true;
        }
      }
    );
    // server
    let serverIndex = ref(0);
    let money = ref(0);
    let moneyMin = ref(0);
    let updateMoney = ref(0);
    let showAcount = ref(false);
    let checked = ref(false);
    let showAgreement = ref(false);
    let moneyMax = ref(10);
    let isOne = ref(true);
    // The first successful display of the pop-up box
    let successDialog = ref(false);
    const customClick = () => {
      showAcount.value = true;
    };
    const changeServerIndex = (value: number) => {
      if (
        !exchangeStatus.value.exchanger_flag &&
        exchangeStatus.value.status == 2
      ) {
        return;
      }
      if (
        !exchangeStatus.value.exchanger_flag ||
        exchangeStatus.value.status != 2
      ) {
        serverIndex.value = value;
      }
    };
    const submitCheck = (type: string, flag: Boolean) => {
      if (type === "check" && flag) {
        checked.value = true;
      } else {
        checked.value = false;
      }
    };
    const successFn = () => {
      successDialog.value = false;
      showCreateExchange.value = false;
    };
    const networkList = computed(() => store.state.account.netWorkList)
    const mainNetwork = computed(() => networkList.value.find((item:any) => item.id == 'wormholes-network-1'))
    const asynPwd2 = async (val: string) => {
      
      isError.value = false;
      if (!name.value) {
        return t('minerspledge.nodeErr');
;
      }
      if (RegUrl.test(name.value)) {
        //Verify node chainId
        Toast.loading({
          message: t("common.veriPwd"),
        });
        try {
          const provider = ethers.getDefaultProvider(name.value);
          const { chainId } = await provider.getNetwork();
          debugger
          const mainProvider = ethers.getDefaultProvider(mainNetwork.value.URL)
          debugger
          const {chainId: mainChainId} = await mainProvider.getNetwork()
          console.warn('mainChainId', mainChainId)
          console.warn('chainId', chainId)
          if (chainId != mainChainId) {
            isError.value = true;
            return t('minerspledge.invalidChainId',{chainId});
          }
          return true;
        } catch (err) {
          isError.value = true;
          return t('minerspledge.invalidNode')
        } finally {
          Toast.clear();
        }
      } else {
        isError.value = true;
        return t('minerspledge.nodeErr');
      }
    };
   
    // Disable the node input box
    const isOpen = ref(false);

    onMounted(async () => {
      await initData();
    });
    const isFirst = ref(false);
    const formatValueNumber = ref(0);
    const ethAccountInfo: Ref<any> = ref({});
    const initData = async () => {
      const wallet = await getWallet();
      const { address } = wallet;
      const data = await wallet.provider.send("eth_getAccountInfo", [
        address,
        "latest",
      ]);
      ethAccountInfo.value = data;
      const { PledgedBalance } = data;
      let formatValue;

      const toPledge = (PledgedBalance - 0).toLocaleString();
      console.log(new BigNumber(PledgedBalance).toString());

      formatValue = utils.formatEther(
        toPledge.toString().replace(/\$|\,/g, "")
      );
      console.warn(
        "formatValue------------",
        formatValue,
        PledgedBalance.toString()
      );
      if (Number(formatValue) > 0) {
        isOpen.value = true;
        if (Number(formatValue) > 70000) {
          isClosePladge.value = true;
          formatValueNumber.value = Number(formatValue);
          // addNumber.value = (Number(formatValue) - 100000) + ''
        }
        isWarningText.value = true;
      } else {
        isFirst.value = true;
      }
    };
    const isExchanger_flag = computed(
      () => store.state.account.exchangeStatus.exchanger_flag
    );

    console.log(isExchanger_flag);
    console.log("===============================11111111111==========");

    let cancelClick = () => {
      showCreateExchange.value = false;
      emit("closeSonShow", false);
    };
    let screentNumber = (ExchangerBalance: any) => {
      return Number(utils.formatEther(ExchangerBalance + "")).toFixed(2);
    };
    const visible1 = computed(() => serverIndex.value === 0);
    const visible2 = computed(() => serverIndex.value === 1);
    const isWarning = ref(false);
    const isError = ref(false);
    const formDom = ref();
    const formDom2 = ref()
    const router = useRouter();
    const back = () => {
      router.back();
    };
    const isAffirmDialog = ref(false);
    const onSubmit = async () => {
      if (isModif.value) {
        if (!addNumber.value) {
          $toast.warn(t("receive.numTip"));
          return;
        }
        onSubmitAddNumber();
        return;
      }
      // The pledge amount
      // if(!name.value){
        
      //   $dialog.open({title:t('minerspledge.beValidator'),message:t("minerspledge.warn"),type:'warn',callBack:() => {
      //     openConfirmInfoModal()
      //   }});
      //   return
      // }
      debugger
      try {
        // await formDom2.value.validate();
        openConfirmInfoModal()
      }catch(err) {
        console.error(err)
        // @ts-ignore
        const [data] = err
        const {message} = data
        $toast.warn(message)
      }
      // try {
      //   console.log('formDom', formDom.value)
      //   openConfirmInfoModal()
      // }catch(err) {
      //   $dialog.open({title:t('minerspledge.beValidator'),message:err?.toString(),type:'warn'})
      // }
    };

    const openConfirmInfoModal = async() => {
      try {
        isError.value = false;
        isAffirmDialog.value = true;
      } catch (error) {
        isError.value = true;
        console.log(error);
      }
    }
    const gradientColor = {
      "0%": "#C1E2F7",
      "100%": "#087ED7",
    };
    const isCloseDialog = ref(false);
    const isCloseAffirm = ref(false);
    const isCloseHome = ref(false);
    const options: any = reactive({
      data: [],
    });
    const selectIcon = ref({});
    const selectValueNam = ref("");
    const selectValueColor = ref("");
    nextTick(() => {
      const list = store.state.account.accountList;
      const accountItem = {
        label: store.state.account.accountInfo.name,
        value: store.state.account.accountInfo.address,
      };
      const arr = list
        .filter(
          (f: any) => f.address !== store.state.account.accountInfo.address
        )
        .map((m: any) => {
          return {
            label: m.name,
            value: m.address,
          };
        });
      options.data = [accountItem, ...arr];
      console.log(arr);
      console.log(accountItem);
      console.log("options.dataoptions.dataoptions.dataoptions.data");

      selectValue.value = store.state.account.accountInfo.address;
      selectValueNam.value = store.state.account.accountInfo.name;
      selectValueColor.value = store.state.account.accountInfo.icon.color;
      selectIcon.value = store.state.account.accountInfo.icon;
    });

    const selectChange = (e: any) => {
      selectValueNam.value = store.state.account.accountList.find(
        (f: any) => f.address === e
      ).name;
      selectValueColor.value = store.state.account.accountList.find(
        (f: any) => f.address === e
      ).icon.color;
    };
    const isDelegate = computed(() => {
      return (
        selectAccount.value.address.toUpperCase() ==
        store.state.account.accountInfo.address.toUpperCase()
      );
    });
    const closeDialogTime = ref(false);
    const closeDialogSubmit = ref(false);

    const selectAccount: Ref<AccountInfo | any> = ref({ ...accountInfo.value });
    // Select the account
    const handleAccount = (account: AccountInfo) => {
      selectAccount.value = account;
    };

    const PledgedBalance = computed(() => {
      console.warn("ethAccountInfo.value", ethAccountInfo.value);
      if (!ethAccountInfo.value?.PledgedBalance) {
        return 70000;
      }
      console.warn("ethAccountInfo.value", ethAccountInfo.value);
      return decimal(
        new BigNumber(ethAccountInfo.value?.PledgedBalance)
          .div(1000000000000000000)
          .toFixed(6)
      );
    });

    // Open the pop-up window for selecting the proxy address
    const openModal = () => {
      if (isModif.value) {
        return;
      }
      showAccountModal.value = true;
    };
    const accountAmount = new BigNumber(accountInfo.value.amount);
    const marks = reactive({
      [accountAmount.multipliedBy(0.1).toNumber().toString()]: "",
      [accountAmount.multipliedBy(0.2).toNumber().toString()]: "",
      [accountAmount.multipliedBy(0.3).toNumber().toString()]: "",
      [accountAmount.multipliedBy(0.4).toNumber().toString()]: "",
      [accountAmount.multipliedBy(0.5).toNumber().toString()]: "",
      [accountAmount.multipliedBy(0.6).toNumber().toString()]: "",
      [accountAmount.multipliedBy(0.7).toNumber().toString()]: "",
      [accountAmount.multipliedBy(0.8).toNumber().toString()]: "",
      [accountAmount.multipliedBy(0.9).toNumber().toString()]: "",
    });
    const addNumber2 = ref(0);
    const handleChangeSlider = () => {
      addNumber.value = addNumber2.value;
    };
    const handleAddBlur = () => {
      debugger
      const addNum = new BigNumber(addNumber.value);
      if (addNum.gte(accountInfo.value.amount)) {
        $toast.warn(t("createExchange.ispoor"));
        addNumber.value = maxBalance.value;
        return;
      }else{
        nextTick(() => {
          addNumber2.value = parseFloat(addNumber.value)
        })
      }
      
    };

    const showMinusModal = ref(false);
    const minusNumber = ref();
    const handleMinusConfirm = (v: number) => {
      showMinusModal.value = true;
      minusNumber.value = v;
    };
    const showClose = ref(true)
    return {
      showClose,
      showMinusModal,
      handleMinusConfirm,
      minusNumber,
      openModal,
      handleChangeSlider,
      addNumber2,
      marks,
      PledgedBalance,
      PledgedAmount,
      utils,
      handleAccount,
      handleAddBlur,
      selectAccount,
      formDom2,
      formatValueNumber,
      closeDialogSubmit,
      closeDialogTime,
      isDelegate,
      selectChange,
      selectIcon,
      selectValueNam,
      networkTypeValue,
      selectValueColor,
      isCloseHome,
      isCloseAffirm,
      options,
      accountList,
      isCloseDialog,
      isOpen,
      isExchanger_flag,
      gradientColor,
      isAffirmDialog,
      isClose,
      ethAccountInfo,
      isClosePladge,
      asynPwd2,
      back,
      formDom,
      showAccountModal,
      isWarning,
      isFirst,
      isError,
      visible1,
      visible2,
      onSubmit,
      t,
      toUsd,
      value,
      showCreateExchange,
      showExchange,
      showExchange1,
      name,
      // toCreate,
      toCancel,
      addNumber,
      affirmClose,
      sendToPledgeHttp,
      open,
      isLoading,
      ready,
      submitOpen,
      appProvide,
      toGo,
      tohome,
      screentNumber,
      firstamount,
      amount,
      selectValue,
      maxBalance,
      // formatVal,
      openDisabled,
      sliderDisabled,
      serverIndex,
      accountInfo,
      money,
      isTimeQualified,
      showAcount,
      onSubmitAddNumber,
      isWarningText,
      exchangeStatus,
      customClick,
      moneyMin,
      moneyMax,
      checked,
      changeServerIndex,
      showAgreement,
      submitCheck,
      successDialog,
      successFn,
      isOne,
      isSuccess,
      cancelClick,
      netWorkList,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
      decimal,
      isModif,
      pageLoading,
      isAddAffirmDialog,
      showCloseBtn,
    };
  },
});
</script>
<style lang="scss" scoped>
  .border-top {
    border-top: 1px solid #e4e7e8;
  }
.maxBalance {
  font-size: 15px;
  font-weight: bold;
  margin-top: 6px;
  margin-bottom: 10px;
}
:deep() {
  .wormholes-tip {
    margin: 0 0 20px;
  }
  .van-field__right-icon span {
    font-size: 12px !important;
  }
  .slider-ipt {
    padding: 0;
    margin-bottom: 11px;
  }

  .el-slider__runway {
    height: 3px;
    background: #f1f3f4;
  }

  .el-slider__bar {
    height: 3px;
    background-color: #85e19b;
  }

  .el-slider__button {
    width: 20px;
    height: 20px;
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
    border: none;
  }

  .el-slider__stop {
    height: 4px;
    width: 3px;
    background-color: #f1f3f4;
    margin-top: -4px;
    border-radius: 0;
    transform: translateX(0);
  }

  .van-cell {
    padding: 0;
  }
}
.card-tit {
  color: #848484;
}
.loading-box {
  height: calc(100vh - 48px);
}
:deep(.el-select-dropdown__item) {
  height: auto;
}
.rightIcon {
  i {
    color: #037cd6;
    font-size: 16px;
  }
}
.account-info-box {
  width: 95%;
}
.account-outBox {
  border-radius: 5px;
  border: 1px solid #bbc0c5;
  margin: 15px 0;
}
.modif-acc .account-box {
  // width: 95%;
}
.modif-acc {
  border-bottom: 1px solid #e4e7e8;
  .val {
    letter-spacing: 0px !important;
  }
}
.modif-acc .account-info-box {
  width: 100%;
}
.account-box {
  // width: 250px;
  // width: 85%;
  padding-left: 5px;
  .name {
  }
  .val {
    font-size: 12px;
    color: #9a9a9a;
    letter-spacing: -0.8px;
  }
}
.userIcon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid #979797;
  background: rgb(234, 234, 234);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ease 0.3s;
}
.exchange-container1 {
  height: 550px;

  .exchange-modal-title {
    height: 62px;
    font-size: 15px;
    line-height: 62px;
    background-color: #f8fcff;
  }
  .exchange-welcome-icon {
    height: 35px;
    width: 35px;
    margin: 27px auto 0;
    display: block;
  }
  .echange-slogan1 {
    font-size: 15px;
    text-align: center;
    margin: 11px auto 20px;
  }
  .exchange-create-form {
    border: 1px solid #e4e7e8;
    width: 315px;
    margin: auto;
    .form-title {
      height: 56px;
      background-color: #ccffff;
      text-align: center;
      line-height: 24px;
    }
  }
  .echange-slogan2 {
    width: 100%;
    height: 17px;
    font-size: 12px;
    line-height: 17px;
    margin: 21px auto 23px;
    text-align: center;
    .right {
      color: #037cd6;
      text-decoration: underline;
    }
  }
  .exchange-button {
    display: flex;
    justify-content: space-evenly;
  }
}
.exchange-container {
  height: 300px;

  .exchange-modal-title {
    height: 62px;
    font-size: 15px;
    line-height: 62px;
    background-color: #f8fcff;
  }
  .exchange-welcome-icon {
    height: 35px;
    width: 35px;
    margin: 27px auto 0;
    display: block;
  }
  .echange-slogan1 {
    font-size: 15px;
    text-align: center;
    margin-top: 20px;
  }
  .exchange-create-form {
    border: 1px solid #e4e7e8;
    width: 315px;
    margin: auto;
  }
  .echange-slogan2 {
    width: 100%;
    height: 17px;
    font-size: 12px;
    line-height: 17px;
    margin: 21px auto 23px;
    text-align: center;
    .right {
      color: #037cd6;
      text-decoration: underline;
    }
  }
  .exchange-button {
    display: flex;
    justify-content: space-evenly;
  }
}
.progress-bar {
  margin: 69px auto;
  display: flex;
}

.exchange-create {
  border: 1px solid #e4e7e8;
  width: 315px;
  height: 116px;
  margin: auto;
  .table {
    height: 37px;
    padding: 10px 13px;
    .top {
      display: flex;
      justify-content: space-between;
      .right {
        width: 12px;
        height: 12px;
        img {
          width: 12px;
          height: 12px;
        }
      }
    }
    .down {
      height: 24px;
      line-height: 24px;
      color: #037cd6;
      text-decoration: underline;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .exchange-line {
    height: 1px;
    width: 285px;
    background-color: #e4e7e8;
    margin: auto;
  }
}
</style>

<style scoped lang="scss">
.btns {
  width: 100%;
  button {
    width: 48%;
  }
  :deep(.van-popover__wrapper) {
            position: relative;
            width: 48%;
            button {
              width: 100%;
            }
        }
}
.miners {
  width: 341px;
  height: 646px;
  background: #fff;
  margin: auto;
  border-radius: 8px;
  .miners-header {
    height: 62px;
    line-height: 62px;
    text-align: center;
    font-weight: bold;
    background: #f8fcff;
    font-size: 14px;
    color: #0f0f0f;
  }
  .miners-container {
    ::-webkit-input-placeholder {
      color: #232323;
      font-size: 12px;
    }
    :-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #232323;
      font-size: 12px;
    }
    ::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #232323;
      font-size: 12px;
    }
    :-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #232323;
      font-size: 12px;
    }

    .contaienr-top-header {
      margin: 28px 0 21px 0;
      span {
        &:first-child {
          display: inline-block;
          width: 35px;
          height: 35px;
          line-height: 35px;
          margin-bottom: 12px;
          text-align: center;
          border-radius: 5px 5px 5px 5px;
          opacity: 1;
          color: #0287db;
          border: 3px solid #0287db;
        }
        &:last-child {
          font-weight: bold;
          font-size: 14px;
          color: #0f0f0f;
        }
      }
    }
    .contaienr-top-ipt {
      width: 315px;
      height: 303px;
      margin: auto;
      padding: 11px 15px 20px 15px;
      box-sizing: border-box;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #e4e7e8;
      .user-field {
        font-size: 12px;
        border-bottom: 1px solid #ecedef;
      }
      > span {
        font-size: 12px;
        color: #8f8f8f;
      }
      .ipt-text-a {
        padding-top: 20px;
        margin-top: 30px;
        border-top: 1px solid #ecedef;
        font-size: 12px;
        color: #8f8f8f;
      }
      .ipt-text-b {
        margin: 5px 0 9px 0;
        color: #000;
        font-size: 12px;
        font-weight: bold;
      }
      .ipt-server {
        font-size: 10px;
        color: #8f8f8f;
        font-weight: bold;
        span {
          font-weight: 400;
          color: #000000;
        }
        .ipt-server-i {
          width: 133px;
          height: 30px;
          padding: 0 2px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f4faff;
          border-radius: 7px 7px 7px 7px;
          &:first-child {
            padding: 0 18px;
          }
        }
        .ipt-server-i-active {
          color: #0287db;
          background: #f4faff;
          border: 1px solid #037cd6;
          span {
            color: #0287db;
          }
        }
      }
      .money {
        margin: 10px 0 20px 0;
        font-size: 12px;
        font-weight: bold;
        span {
          &:first-child {
            color: #000000;
          }
          &:last-child {
            color: #0287db;
          }
        }
      }
      .ipt-slider {
        margin-left: 5px;
      }
      .stake {
        margin: 20px 0 5px 0;
        font-size: 12px;
        color: #8f8f8f;
        span {
          color: #3aae55;
        }
      }
      ::v-deep .van-cell {
        padding-left: 0px;
      }
    }
    .container-btn {
      margin-bottom: 30px;
      .btn {
        width: 104px;
        height: 45px;
        margin-top: 21px;
        &:first-child {
          margin-right: 35px;
        }
      }
      span {
        font-size: 12px;
        &:first-child {
          margin: 0 5px 0 10px;
          color: #8f8f8f;
        }
        &:last-child {
          color: #0287db;
        }
      }
      .btn-text {
        margin: 15px 0 20px 0;
        font-size: 12px;
        color: #8f8f8f;
      }
      .underline {
        text-decoration: underline;
      }
      .text {
        margin: 0 5px 0 10px;
      }
    }
    ::v-deep .van-cell {
      &:after {
        display: none;
      }
    }
  }
}
:deep(.el-input__inner) {
  display: none;
}
:deep(.el-select) {
  width: 100%;
}
:deep(.el-input__prefix) {
  width: calc(100% - 60px);
}
</style>
<style>
.dialog-c {
  top: 50% !important;
}
</style>
<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  padding: 0;
}
.select-header {
  display: flex;
  align-items: center;
  // width: calc(100% - 30px);
  height: 75px;
  //  margin-left: -30px;
}
.select-header-c {
  text-align: left;
  line-height: 25px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  div {
    &:first-child {
      color: #000;
    }
  }
}
.open-c {
  :deep(.van-cell) {
    background-color: #f1f3f4;
  }
}
.miners-success {
  width: 341px;
  height: 327px;
  background: #fff;
  margin: auto;
  border-radius: 8px;
  .miners-icons {
    margin: 20px 0;
  }
  .text-s {
    margin: 0 22px 41px 23px;
    font-size: 14px;
    color: #0f0f0f;
  }
  .exchange-welcome-icon {
    width: 41px;
    height: 41px;
    margin: 42px 0 41px 0;
  }
  .miners-header {
    height: 62px;
    line-height: 62px;
    text-align: center;
    font-weight: bold;
    background: #f8fcff;
    font-size: 14px;
    color: #0f0f0f;
  }
  .miners-container {
    .contaienr-top-header {
      margin: 28px 0 21px 0;
      span {
        &:first-child {
          display: inline-block;
          width: 35px;
          height: 35px;
          line-height: 35px;
          margin-bottom: 12px;
          text-align: center;
          border-radius: 5px 5px 5px 5px;
          opacity: 1;
          color: #0287db;
          border: 3px solid #0287db;
        }
        &:last-child {
          font-weight: bold;
          font-size: 14px;
          color: #0f0f0f;
        }
      }
    }
    .contaienr-top-ipt {
      width: 315px;
      height: 115px;
      margin: auto;
      padding: 11px 15px;
      box-sizing: border-box;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #e4e7e8;
    }
    .conditions {
      margin: 0px 0 20px 0;
    }
    .text-a {
      height: 17px;
      line-height: 14px;
      font-size: 12px;
      color: #8f8f8f;
    }
    .m-r-5 {
      margin-right: 5px;
    }
    .text-b {
      text-decoration: underline;
      font-size: 12px;
      color: #0287db;
    }
    .block {
      display: inline-block;
      padding-bottom: 12px;
      margin-bottom: 11px;
      border-bottom: 1px solid #ecedef;
    }
    .container-btn {
      .btn {
        width: 104px;
        height: 45px;
        margin-top: 21px;
      }
      span {
        font-size: 12px;
        &:first-child {
          margin: 0 5px 0 10px;
          color: #8f8f8f;
        }
        &:last-child {
          color: #0287db;
        }
      }
      .btn-text {
        margin: 15px 0 10px 0;
        font-size: 12px;
        color: #8f8f8f;
      }
      .underline {
        text-decoration: underline;
      }
    }
  }
}
.snftmiddle-text {
  display: inline-block;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.conditions {
  margin: 0px 0 20px 0;
}
.text-a {
  height: 17px;
  line-height: 14px;
  font-size: 12px;
  color: #8f8f8f;
}
.m-r-5 {
  margin-right: 5px;
}
.text-b {
  text-decoration: underline;
  font-size: 12px;
  color: #0287db;
}
</style>
<style  lang="scss" scoped>
.bourse {
  height: 100%;
  &.modif {
    .nodeIpt {
      :deep(.van-field__body) {
        background: #f1f3f4;
        border: 1px solid #bbc0c5;
      }
    }
    .account-outBox {
      background: #f1f3f4;
      border: 1px solid #bbc0c5;
      .rightIcon {
        display: none;
      }
    }
  }
  .bourse-header {
    // position: fixed;
    position: absolute;
    top: -50px;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    padding: 0 16px;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 1px 2px rgb(135 134 134 / 10%);
  }

  .bourse-container {
    min-height: 100vh;
    overflow-y: auto;
    padding: 23px 15px 25px 15px;
    font-size: 14px;
  }
  .bourse-container-meaning {
    // margin-top: 15px;
    padding-top: 15px;
  }
  .bourse-container-pull {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .hundred {
      color: #3aae55;
      font-size: 18px;
      line-height: 30px;
    }
  }
  .bourse-container-slider {
    margin: 33.5px 0;
  }
  .bourse-container-server {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    div {
      width: 310px;
      height: 85px;
      display: flex;
      margin-left: 15px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: #f4faff;
      border-radius: 7.5px;
      box-sizing: border-box;
    }
    .active {
      border: 1px solid #037cd6;
      span {
        color: #037cd6;
      }
    }
    .t1 {
      font-size: 12px;
      color: #848484;
      line-height: 20px;
    }
    .t2 {
      font-size: 12px;
      font-weight: bold;
      line-height: 20px;
    }
  }
  .bourse-container-server-b {
    div {
      background-color: #f1f3f4 !important;
    }
    .active-d {
      border: 1px solid #000;
    }
  }
  .bourse-container-btns {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 25px;
    // position: absolute;
    // bottom: 20px;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    // flex-direction: column;
    .b1 {
      width: 160px;
    }
  }
  .bourse-container-error,
  .bourse-container-warning {
    width: 100%;
    margin-bottom: 20px;
    height: 40px;
    background: #fbf2f3;
    border-radius: 7.5px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    span {
      margin-left: 10px;
      font-size: 12px;
    }
  }
  .bourse-container-error-text {
    width: 100%;
    margin-bottom: 20px;
    height: 40px;
    background: #f4faff;
    border-radius: 7.5px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    span {
      margin-left: 10px;
      font-size: 12px;
    }
  }
  .bourse-container-error-text-warning {
    width: 100%;
    margin-bottom: 20px;
    height: 40px;
    background: #fefcda;
    border-radius: 7.5px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    span {
      margin-left: 10px;
      font-size: 12px;
    }
  }
  .t1 {
    font-size: 14px;
    color: #037cd6;
  }
  .t3 {
    font-size: 15px;
    font-weight: bold;
    line-height: 20px;
    margin-top: 10px;
    padding-bottom: 15px;
  }
  .t2 {
    font-size: 16px;
  }

  .right-img {
    width: 18px;
    height: 18px;
    margin-top: -2px;
  }
  .create-new-password {
    margin-top: 13.5px;
    .tit-small {
      color: #848484;
    }
    .right {
      color: #037cd6;
      text-decoration: underline;
    }
    .icon-yanjing {
      color: #037dd6;
    }
    :deep(.van-field__label) {
      display: none;
    }
    :deep(.van-field__error-message) {
      margin-bottom: 0px;
    }
    :deep(.van-cell:after) {
      display: none;
    }
    :deep(.van-cell) {
      padding: 0;
    }
    :deep(.van-field__body) {
      margin-bottom: 10px;
      border-radius: 5px;
      transition: ease 0.3s;
      // &:hover {
      //   border: 1px solid #1989fa;
      // }
    }
    .error-field {
      :deep(.van-field__body) {
        border: 1px solid #d73a49 !important;
        background: #fbf2f3;
      }
    }
    .success-field {
      :deep(.van-field__body) {
        border: 1px solid #1989fa !important;
      }
    }
    .tool {
      color: #037cd6;
    }
    .pointer {
      cursor: pointer;
    }
    .check-box {
      margin-top: 30px;
    }
  }
}
.bt {
  border-top: 1px solid #e4e7e8;
}
:deep(.van-icon-arrow-down) {
  margin-top: 13px !important;
}
:deep(.van-cell-group) {
  border: 1px solid #e4e7e8;
}
.right-img-cell {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 50%;
  background-color: #037cd6;
  display: block;
  margin-right: 10px;
}
:deep(.el-icon) {
  color: #037cd6 !important;
}
</style>
<style>
.appendto1,
.appendto2 {
  background-color: #1989fa !important;
  border: none !important;
  max-width: 267px !important;
}

.appendto2 > span::before {
  background-color: #1989fa !important;
  border: none !important;
}
.appendto1 > span::before {
  background-color: #1989fa !important;
  border: none !important;
}
.tooltip1 {
  max-width: 180px;
}
.tooltip2 {
  max-width: 200px;
}
.tooltip3 {
  max-width: 220px;
}
.tooltip4 {
  max-width: 200px;
}
.appendtobear {
  background-color: #f1f3f4 !important;
}

.appendtobear > span::before {
  background-color: #848484 !important;
  border: none !important;
}
.appendtobear {
  background-color: #848484 !important;
  border: none !important;
  max-width: 267px !important;
}
.warning {
  border-color: #f00;
}
.error-field {
}
</style>
