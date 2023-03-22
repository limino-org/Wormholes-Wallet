<template>
  <div class="bourse">
    <NavHeader :title="!isExchanger_flag ? t('createExchange.headerTitle') : t('sidebar.exchangemanagement')">
      <template v-slot:left>
        <span class="back" @click="back">{{ t("common.back") }}</span>
      </template>
      <template v-slot:right>
        <cancel-btn />
      </template>
    </NavHeader>
    <div class="bourse-container" id="bourse-page" v-if="!loading">
      <div class="bourse-container-name">
        <span>{{ t("bourse.name") }} ({{ name.length }}/20)</span>
        <el-tooltip
          popper-class="tooltip4"
          class="box-item"
          effect="dark"
          :content="t('bourse.tip5')"
          placement="right"
          trigger="hover"
        >
          <van-icon name="question" class="ml-4" color="#9A9A9A" />
        </el-tooltip>
      </div>

      <div class="create-new-password" v-show="!isExchanger_flag">
        <van-form @submit="onSubmit" ref="formDom">
          <div>
            <van-field
              :disabled="isExchanger_flag"
              maxlength="20"
              validate-trigger="onSubmit"
              v-model="name"
              :class="`text ${nameError ? 'error' : ''}`"
              type="text"
              :placeholder="t('bourse.placename')"
              :rules="[
                // { required: true, message: t('bourse.vainame') },
                { validator: asynPwd2, message: t('bourse.vainame2') },
              ]"
            />
          </div>
        </van-form>
      </div>
      <div v-show="isExchanger_flag" class="f-12 text-bold mt-8">
        {{ name }}
      </div>

      <div class="bourse-container-name bt mt-14 pt-10" v-if="isExchanger_flag">
        <span class="mt-8">{{ t("createExchange.formCharge") }}</span>
        <el-tooltip
          popper-class="tooltip4"
          class="box-item"
          effect="dark"
          :content="feilvstr"
          placement="right"
          trigger="hover"
        >
          <van-icon class="ml-6" name="question" color="#9A9A9A" />
        </el-tooltip>
      </div>
      <div v-if="isExchanger_flag" class="f-14 text-bold mt-8">
        {{ money / 10 }}%
      </div>

      <div v-if="isExchanger_flag" class="bourse-container-name bt mt-14 pt-10 ">
        <span class="mt-8">{{ t("bourse.stakingFee") }}</span>
        <el-tooltip
          popper-class="tooltip4"
          class="box-item"
          effect="dark"
          :content="t('bourse.tip3')"
          placement="right"
          trigger="hover"
        >
          <van-icon class="ml-6" name="question" color="#9A9A9A" />
        </el-tooltip>
      </div>
      <div v-if="isExchanger_flag" class="f-14 text-bold mt-8">
        {{ exchangerBalance }} ERB
        <span>≈${{ toUsd(exchangerBalance, 2) }}</span>
      </div>
    
      <div class="bourse-container-meaning bt mt-14" v-if="!isExchanger_flag">
        <span>{{ t("bourse.marketCom") }}</span>
        <el-tooltip
          popper-class="tooltip1"
          class="box-item"
          effect="dark"
          :content="feilvstr"
          placement="right"
          trigger="hover"
        >
          <van-icon class="ml-4" name="question" color="#9A9A9A" />
        </el-tooltip>
      </div>
      <div class="bourse-container-pull" v-if="!isExchanger_flag">
        <div>
          <span class="hundred">{{ money / 10 }}%</span>
          <span>（{{ t("bourse.tip12") }}）</span>
        </div>
      </div>
      <div class="bourse-container-slider" v-if="!isExchanger_flag">
        <el-slider
          v-model="money"
          :disabled="isExchanger_flag"
          :min="10"
          :max="100"
          :marks="marks"
          :format-tooltip="(v) => v / 10"
        />
        <van-field
          :disabled="isExchanger_flag"
          v-model="money2"
          class="slider-ipt"
          type="number"
          @change="handleMoney"
        />
      </div>
   
      <div class="bourse-container-meaning bt mt-14" v-if="!isExchanger_flag">
        <span>{{ t("bourse.stakingFee") }}</span>
        <el-tooltip
          popper-class="tooltip2"
          class="box-item"
          effect="dark"
          :content="t('bourse.tip3')"
          placement="right"
          trigger="hover"
        >
          <van-icon name="question" class="ml-4" color="#9A9A9A" />
        </el-tooltip>
      </div>
      <div class="t3" v-if="!isExchanger_flag">
        700ERB <span>(≈${{ toUsd(700, 2) }})</span>
      </div>

     <!--
       // <div class="bourse-container-meaning bt mt-14" v-if="isExchanger_flag">
      //   <span>{{ t("createExchange.addPl") }} </span>
      //   <el-tooltip
      //     popper-class="tooltip3"
      //     class="box-item"
      //     effect="dark"
      //     :content="t('bourse.tip4')"
      //     placement="right"
      //     trigger="hover"
      //   >
      //     <van-icon name="question" class="ml-4" color="#9A9A9A" />
      //   </el-tooltip>
      //   <div class="add-amount f-14 text-bold mt-6 mb-14">
      //     {{ addAmount || 0 }} ERB
      //   </div>
      //   <el-slider
      //     v-model="addAmount"
      //     :min="minBalance"
      //     :max="maxBalance"
      //     @input="changeAdd"
      //     :marks="marks2"
      //     :step="1"
      //   />
      //   <div class="mt-16">
      //     <van-field type="number" v-model="addAmount" @change="handleAdd" />
      //   </div>
      // </div>
      -->
      <div class="bourse-container-meaning bt mt-14" v-if="!isExchanger_flag">
        <span>{{ t("bourse.marketServer") }} </span>
        <el-tooltip
          popper-class="tooltip3"
          class="box-item"
          effect="dark"
          :content="t('bourse.tip4')"
          placement="right"
          trigger="hover"
        >
          <van-icon name="question" class="ml-4" color="#9A9A9A" />
        </el-tooltip>
      </div>
      <p v-show="insufficientMoney && !isExchanger_flag" class="insufficientMoney-tip">{{ insufficientMoney ? t('createExchange.insufficientMoney', {value: addBalance}) : '' }}</p>

      <div
        v-if="!isExchanger_flag"
        :class="[
          'bourse-container-server',
          isExchanger_flag ? 'bourse-container-server-b' : '',
        ]"
      >
        <van-popover
          v-model:show="visible1"
          placement="bottom-start"
          :class="`${isExchangeStatusStatus ? 'appendtobear' : 'appendto1'}`"
          v-if="!isExchanger_flag"
        >
          <div>
            {{ t("bourse.tip13") }}
          </div>
          <template #reference>
            <div
              :class="`${
                serverIndex === 0 && !isExchangeStatusStatus
                  ? 'active'
                  : !isExchangeStatusStatus
                  ? 'active-d'
                  : ''
              }`"
              @click="changeServerIndex(0)"
            >
              <span class="t1 flex center">0ERB</span>
              <span class="t2 flex center"
                ><span class="flex right">None</span>
                <i
                  :class="`iconfont ${
                    serverIndex == 0 ? 'icon-duigouxiao' : 'icon-dui'
                  }`"
                ></i
              ></span>
              <span class="t1 flex center">0$</span>
            </div>
          </template>
        </van-popover>
        <van-popover
          v-model:show="visible2"
          placement="bottom-end"
          :class="isExchangeStatusStatus ? 'appendtobear' : 'appendto2'"
        >
          <span>{{ t("bourse.tip14") }}</span>
          <template #reference>
            <div
              :class="
                serverIndex === 1 && !isExchangeStatusStatus
                  ? 'active'
                  : (isExchangeStatusStatus
                  ? 'active-d'
                  : '') + (insufficientMoney === true ? 'disabled' : '')
              "
              @click="changeServerIndex(1)"
            >
              <span class="t1 flex center">200ERB</span>

              <span class="t2 flex center"
                ><span>Best</span>
                <i
                  :class="`iconfont ${
                    serverIndex == 1 ? 'icon-duigouxiao' : 'icon-dui'
                  }`"
                ></i
              ></span>

              <span class="t1 flex center">{{toUsd(200,0)}}$</span>
            </div>
          </template>
        </van-popover>
      </div>
      <div class="bourse-container-warning" v-if="isWarning">
        <van-icon name="warning" color="#F7BF03" size="20" />
        <span>{{ t("bourse.tip15") }}</span>
      </div>
      <!-- <div class="bourse-container-error" v-if="isError">
        <van-icon name="question" color="#D73A49" />

        <span>{{ t("bourse.tip16") }}</span>
      </div> -->

      <div :class="!isExchanger_flag ? 'bourse-container-btns' : 'btn-groups'">
        <div class="pwd-tip mb-8">
        <i18n-t keypath="createAccountpage.pwdTip2" tag="div" class="text-center mt-20 lh-16">
          <template v-slot:br><br></template>
          <template v-slot:link1><span class="hover" @click="routerTo">{{t('createAccountpage.link3')}}</span></template>
        </i18n-t>
      </div>
        <div class="container flex between pl-12 pr-12 btn-box">
          <van-button
            v-if="!isExchanger_flag"
            @click="onSubmit"
            block
            type="primary"
            >{{ t("common.confirm") }}</van-button
          >
          <template v-else>
            <template v-if="isExchanger_flag">
              <van-popover
                v-model:show="showClose"
                v-if="!isTimeQualified"
                theme="dark"
                :close-on-click-outside="false"
                placement="top"
                trigger="manual"
                class="popover-btn-tip"
              >
                <div class="f-12 pl-10 pr-10 pt-10 pb-10">
                  {{ t("bourse.closeTip") }}
                </div>
                <template #reference>
                  <van-button
                    class="b1 mr-10 closeBtn"
                    @click="handleMinus"
                    block
                    :disabled="minusDisabled"
                    plain
                    >{{ t("createExchange.pledgeRed") }}</van-button
                  >
                </template>
              </van-popover>
              <van-button
                v-else
                class="b1 mr-10 closeBtn"
                @click="handleMinus"
                block
                :disabled="minusDisabled"
                plain
                >{{ t("createExchange.pledgeRed") }}</van-button
              >

              <van-button
                v-if="!isExchanger_flag"
                class="b1"
                @click="onSubmit"
                block
                type="primary"
                >{{ t("bourse.saveExchange") }}</van-button
              >
              <!--
              <van-button
                v-else
                class="b1"
                @click="addSubmit"
                block
                type="primary"
                >{{ t("bourse.saveExchange") }}</van-button>
              -->
            </template>
          </template>
        </div>
      </div>
    </div>
    <div class="flex center loading-page" v-else>
    <van-loading color="#037CD6" />
    </div>
    <CustomExchangeModal
      v-model="showAcount"
      :maxBalance="10"
      :minBalance="1"
      :defaultAmount="moneyStr"
      @handleConfirm="handleConfirm"
    />

    <dialog-warning
      v-model:isWarning="isDialogWarning"
      :text="t('send.sendMessage')"
    >
    </dialog-warning>
    <affirm-dialog
      @open="open"
      :name="name"
      :money="moneyStr"
      v-model:show="isAffirmDialog"
      :serverIndex="serverIndex"
      v-if="isAffirmDialog"
    ></affirm-dialog>
    <SwitchNetwork
      v-model:show="showModalNetwork"
      @close="showModalNetwork = false"
    />
    <close-dialog
      @warningSuccess="handleClose"
      v-model:isWarning="isCloseDialog"
      v-if="isCloseDialog"
    ></close-dialog>
    <affirm-close
      :name="name"
      :money="moneyStr"
      v-model:show="isCloseAffirm"
      @affirmClose="affirmClose"
    ></affirm-close>
    <close-home v-model:isWarning="isCloseHome" v-if="isCloseHome"></close-home>
    <AddModal
      v-model="showAddModal"
      :amount="addAmount"
      :fee="exchangerBalance"
      :name="name"
    />
    <MinusModal
      v-model="showMinusModal"
      :amount="minusAmount"
      :fee="exchangerBalance"
      :name="name"
    />
    <ModifPledgeModal
      v-model="showPledgeModal"
      :max="parseInt(exchangerBalance)"
      :defaultValue="700"
      @confirm="handleConfirmMinus"
    />
  </div>
</template>
<script lang="ts">
import NavHeader from "@/components/navHeader/index.vue";

import {
  defineComponent,
  Ref,
  ref,
  watch,
  SetupContext,
  computed,
  toRaw,
  onMounted,
  ComputedRef,
  nextTick,
  onBeforeMount,
  inject,
  reactive,
  CSSProperties,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { ethers, utils } from "ethers";
import { useStore, mapState } from "vuex";

import { useExchanges } from "@/hooks/useExchanges";
import BigNumber from "bignumber.js";
import { ExchangeStatus } from "@/store/modules/account";
import {
  Dialog,
  Form,
  Field,
  CellGroup,
  Button,
  Popup,
  Circle,
  Icon,
  Toast,
  Slider,
  Checkbox,
  Popover,
  Sticky,
  Loading,
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
} from "@/utils/filters";
import AddModal from "./add-modal.vue";
import MinusModal from "./minus-modal.vue";
import { useNetWork } from "@/components/navHeader/hooks/netWork";
import SwitchNetwork from "@/components/switchNetwork/index.vue";
import { ElTooltip, ElSlider } from "element-plus";
import dialogWarning from "@/components/dialogWarning/index.vue";
import affirmDialog from "./affirm-dialog.vue";
import closeDialog from "./close-dialog.vue";
import closeAffirmDialog from "./close-affirm-dialog.vue";
import closeHome from "./close-home.vue";
import eventBus from "@/utils/bus";
import CustomExchangeModal from "./customExchangeModal.vue";
import { useToast } from "@/plugins/toast";
import { regExchangeName } from "@/enum/regexp";
import Bignumber from "bignumber.js";
import ModifPledgeModal from "@/views/account/components/modifPledgeModal/index.vue";
import {
  VUE_APP_EXCHANGESMANAGEMENT_URL,
  VUE_APP_EXCHANGES_URL,
} from "@/enum/env";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";
import { getAccount } from "@/http/modules/nft";
interface Mark {
  style: CSSProperties;
  label: string;
}

type Marks = Record<number, Mark | string>;
export default defineComponent({
  name: "createExchange",
  components: {
    "affirm-dialog": affirmDialog,
    [Dialog.Component.name]: Dialog.Component,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    ElTooltip,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Slider.name]: Slider,
    [Circle.name]: Circle,
    [Checkbox.name]: Checkbox,
    [Icon.name]: Icon,
    [Popover.name]: Popover,
    [Sticky.name]: Sticky,
    [Loading.name]: Loading,
    [AmountView.name]: AmountView,
    [AgreementView.name]: AgreementView,
    "success-dialog": success,
    SwitchNetwork,
    "dialog-warning": dialogWarning,
    "close-dialog": closeDialog,
    "affirm-close": closeAffirmDialog,
    "close-home": closeHome,
    NavHeader,
    CustomExchangeModal,
    ElSlider,
    AddModal,
    MinusModal,
    ModifPledgeModal,

  },

  setup(props: any, context: SetupContext) {
    const blockNumber = ref(0);
    const accountInfoBlockNumber = ref(0);
    const { $wtoast } = useToast();
    const appProvide = inject("appProvide");

    const marks = reactive<Marks>({
      10: "",
      20: "",
      30: "",
      40: "",
      50: "",
      60: "",
      70: "",
      80: "",
      90: "",
      100: "",
    });

    const loading: Ref<boolean> = ref(false);
    const account = ref({});
    const initPageData = async () => {
      loading.value = true;
      try {
        const wallet = await getWallet();
        const { address } = wallet;
        account.value = await getAccount(address);
        blockNumber.value = await wallet.provider.getBlockNumber();
        const accountInfo = await wallet.provider.send("eth_getAccountInfo", [
          address,
          "latest",
        ]);
        console.log(blockNumber.value - accountInfoBlockNumber.value);
        console.log("blockNumber.value - accountInfoBlockNumber.value");
        await dispatch("account/getExchangeStatus");
        ethAccountInfo.value = accountInfo;
        accountInfoBlockNumber.value = accountInfo.BlockNumber;
        console.log(blockNumber.value - accountInfoBlockNumber.value);
        dispatch("account/getExchangeStatus");
        if (exchangeStatus.value.exchanger_flag) {
          const { ExchangerBalance, ExchangerName, ExchangerURL, FeeRate } =
            accountInfo;
          let formatValue;
          money.value = new BigNumber(FeeRate).div(10).toNumber();
          if (ExchangerBalance.toString().indexOf("e") !== -1) {
            formatValue = utils.formatEther(
              scientificToNumber(ExchangerBalance) + ""
            );
          } else {
            formatValue = utils.formatEther(ExchangerBalance + "");
          }
          name.value =ExchangerName;
          isOne.value = false;
        }
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };
    eventBus.on("walletReady", async () => {
      initPageData();
    });

    const isTimeQualified = computed(
      () => blockNumber.value - accountInfoBlockNumber.value >= (currentNetwork.value.chainId == 51888 ?  72 : 6307200)
    );

    const minusDisabled = computed(() => !isTimeQualified.value);
    const {
      netWorkList,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
    } = useNetWork();
    const { t } = useI18n();
    const { emit }: any = context;

    const isSuccess = computed(() => {
      return name.value && asynPwd2(name.value);
    });
    const {
      createExchanges,
      showCreateExchange,
      ready,
      sendTo,
      closeExchanges,
      modifExchangeBalance,

      addExchangeBalance,
    } = useExchanges();
    const name = ref("");
    const store = useStore();
    const { dispatch } = store;
    const amount = ref(700);
    const accountInfo = computed(() => store.state.account.accountInfo);
    const exchangeStatus: ComputedRef<ExchangeStatus> = computed(
      () => store.state.account.exchangeStatus
    );
    const visible1 = computed(() => serverIndex.value === 0);
    const visible2 = computed(() => serverIndex.value === 1);
    const toCreate = async (name: string, amount: number) => {
      const fee_rate = money.value;
      try {
        if (exchangeStatus.value.exchanger_flag) {
          await modifExchangeBalance(name);
        } else {
          console.warn("name", name);
          console.warn("fee_rate", fee_rate);
          await createExchanges(name, 200, fee_rate);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const value = ref(50);
    const isClose = ref(false);
    const affirmClose = () => {
      closeExchanges();
    };

    showCreateExchange.value = props.show;

    let money = ref(0);
    let moneyMin = ref(0);
    let updateMoney = ref(0);
    let showAcount = ref(false);
    // let checked = ref(false);
    let showAgreement = ref(false);
    let moneyMax = ref(10);
    let isOne = ref(true);
    // The first successful display of the pop-up box
    let successDialog = ref(false);
    const customClick = () => {
      showAcount.value = true;
    };
    // Server selection
    let serverIndex = ref(1);
    const changeServerIndex = (value: number) => {
      if(value && insufficientMoney.value) {
        return
      }
      if (exchangeStatus.value.exchanger_flag) {
        return;
      }
      if (
        !exchangeStatus.value.exchanger_flag ||
        exchangeStatus.value.status != 2
      ) {
        serverIndex.value = value;
      }
    };
    const successFn = () => {
      successDialog.value = false;
      showCreateExchange.value = false;
    };
    const nameError = ref(false);
    const asynPwd2 = (val: string) => {
      nameError.value = false;
      if (!val) {
        nameError.value = true;
        return t("bourse.vainame");
      }
      if (val.length < 4 || val.length > 20) {
        nameError.value = true;
        return false;
      }
      if (regExchangeName.test(val)) {
        nameError.value = true;
        return false;
      }
      return true;
    };
    const { $tradeConfirm } = useTradeConfirm();
    const open = async () => {
      const fee_rate = money.value;
      try {
        if (exchangeStatus.value.exchanger_flag) {
          await modifExchangeBalance(name.value);
        } else {
          const callBack = () =>
            router.replace({ name: "exchange-management" });
          $tradeConfirm.open({
            approveMessage: t("createExchange.create_approve"),
            successMessage: t("createExchange.create_waiting"),
            wattingMessage: t("createExchange.create_success"),
            failMessage: t("createExchange.create_wrong"),
            // wattingTitle: serverIndex.value == 1 ?t('createExchange.wattingTitle') : t('bootstrapwindow.watting'),
            wattingTitle:t('createExchange.wattingTitle'),
            callBack: callBack,
            failBack: callBack,
          });
          await sendTo(
            name.value,
            700,
            serverIndex.value == 0 ? false : true,
            fee_rate
          );
        }
      } catch (err) {
        console.error(err);
      }
      showCreateExchange.value = false;
    };


    const ethAccountInfo = ref({ ExchangerBalance: 0 });
    const exchangerBalance = computed(() =>
      new Bignumber(
        ethAccountInfo.value ? ethAccountInfo.value.ExchangerBalance : 0
      )
        .div(1000000000000000000)
        .toString()
    );

    const insufficientMoney = computed(() => {
      return new Bignumber(accountInfo.value.amount).lt(901) ? true : false
    })
    const addBalance = computed(() => {
      return new Bignumber(901).minus(accountInfo.value.amount).toFixed(6)
    })
    onMounted(() => {
      initPageData();
      if(insufficientMoney.value) {
        serverIndex.value = 0
      }
    });
    const isExchanger_flag = computed(
      () => store.state.account.exchangeStatus.exchanger_flag
    );
    const isExchangeStatusStatus = computed(
      () =>
        store.state.account.exchangeStatus.exchanger_flag &&
        store.state.account.exchangeStatus.status == 2
    );

    const isWarning = ref(false);
    const isError = ref(false);
    const formDom = ref();
    const router = useRouter();
    const back = () => {
      // Do not open the exchange directly jump home page, otherwise the previous page
      if (isExchangeStatusStatus.value) {
        router.replace({ name: "exchange-management" });
      } else {
        router.replace({ name: "wallet" });
      }
    };
    const isAffirmDialog = ref(false);
    const onSubmit = async () => {
      const { exchanger_flag, status } = store.state.account.exchangeStatus;
      const am = new BigNumber(accountInfo.value.amount);
      if (!exchanger_flag && status != 2) {
        if (am.lt(701)) {
          $wtoast.warn(t("createExchange.ispoor"));
          return;
        }
      }

      if(serverIndex.value === 0) {
        if (am.lt(701)) {
          $wtoast.warn(t("createExchange.ispoor"));
          return;
        }
      }
      if(serverIndex.value === 1) {
        if (am.lt(901)) {
          $wtoast.warn(t("createExchange.ispoor"));
          return;
        }
      }
      try {
        await formDom.value.validate();
        isError.value = false;
        isAffirmDialog.value = true;
        // open()
      } catch (error) {
        isError.value = true;
        console.log(error);
      }
    };
    
    // Additional pledge confirmation pop-up window
    const showAddModal = ref(false);
    const handleAddAmount = () => {
      const am = new BigNumber(accountInfo.value.amount);
      const addnum = new BigNumber(addAmount.value);
      if (addnum.lt(700)) {
        isCloseDialog.value = true;
        return;
      }
      const diffAm = new Bignumber(maxBalance.value).minus(
        exchangerBalance.value
      );
      debugger;
      if (am.lt(diffAm)) {
        $wtoast.warn(t("createExchange.ispoor"));
        return;
      }
      showAddModal.value = true;
    };
    const isDialogWarning = ref(false);
    const gradientColor = {
      "0%": "#C1E2F7",
      "100%": "#087ED7",
    };
    const isCloseDialog = ref(false);
    const isCloseAffirm = ref(false);
    const isCloseHome = ref(false);

    const handleClose = () => {
      isCloseAffirm.value = true;
      // closeExchanges()
    };

    const moneyStr = computed(() => money.value / 10);

    const handleConfirm = (v: number) => {
      money.value = v * 10;
    };
    const money2: Ref<number> = ref(1);
    const handleMoney = () => {
      if (new BigNumber(money2.value).lt(1) || !money2.value) {
        money.value = 10;
        money2.value = 1;
        return;
      }
      if (new BigNumber(money2.value).gt(10)) {
        money.value = 100;
        money2.value = 10;
        return;
      }
      const val = parseFloat(new BigNumber(money2.value).toFixed(1));

      money.value = new BigNumber(val).multipliedBy(10).toNumber();
      money2.value = val;
    };
    watch(
      () => money.value,
      (n) => {
        money2.value = n / 10;
      }
    );

    const addAmount = ref();
    const minBalance = computed(() => 0);
    const maxBalance = computed(() =>
      new Bignumber(accountInfo.value.amount).minus(1).toNumber()
    );
    const handleAdd = () => {
      // Exceeds the amount that can be pledged
      if (new Bignumber(addAmount.value || 0).gt(maxBalance.value)) {
        const ama = parseInt(new Bignumber(maxBalance.value).toString());
        addAmount.value = ama;
        return;
      }
      if (new Bignumber(addAmount.value || 0).lt(1)) {
        addAmount.value = 0;
        return;
      }
      addAmount.value = parseInt(
        new Bignumber(addAmount.value).toNumber().toString()
      );
    };
    const closeBtnDisabled = ref(true);

    const changeAdd = () => {
     
    };

    const bigAmount = new BigNumber(accountInfo.value.amount);

    const marks2 = ref<Marks>({});
    for (let i = 1; i < 10; i++) {
      const key: any = bigAmount
        .multipliedBy(i / 10)
        .toNumber()
        .toFixed(0);
      marks2.value[key] = "";
    }

    const showPledgeModal = ref(false);

    const addSubmit = () => {
      const addBigAmount = new BigNumber(addAmount.value || 0);
      if (addBigAmount.lte(0)) {
        $wtoast.warn(t("sendto.no"));
        return;
      }
      showAddModal.value = true;
    };
    const showMinusModal = ref(false);
    const handleMinus = () => {
      showPledgeModal.value = true;
    };
    const minusAmount = ref(0);
    const handleConfirmMinus = (v: number) => {
      minusAmount.value = v;
      showMinusModal.value = true;
    };
    const showClose = ref(true);
    const feilvstr = computed(() => {
      console.warn('moneyStr.value', t('createExchange.commission',{value: moneyStr.value}))
      return t('createExchange.commission',{value: moneyStr.value})
    })

    const routerTo = () => {
      window.open('https://limino.com/upload/tsm.html')
    }
    return {
      feilvstr,
      routerTo,
      showClose,
      handleClose,
      minusAmount,
      handleConfirmMinus,
      showMinusModal,
      addSubmit,
      handleMinus,
      showPledgeModal,
      closeBtnDisabled,
      handleMoney,
      serverIndex,
      changeServerIndex,
      addAmount,
      visible1,
      visible2,
      addBalance,
      changeAdd,
      handleAdd,
      minusDisabled,
      handleConfirm,
      insufficientMoney,
      money2,
      minBalance,
      showAddModal,
      moneyStr,
      isCloseHome,
      isCloseAffirm,
      isCloseDialog,
      isExchanger_flag,
      gradientColor,
      isAffirmDialog,
      isClose,
      asynPwd2,
      nameError,
      isDialogWarning,
      back,
      marks,
      formDom,
      isWarning,
      marks2,
      isError,
      onSubmit,
      handleAddAmount,
      appProvide,
      t,
      toUsd,
      value,
      showCreateExchange,
      name,
      toCreate,
      affirmClose,
      open,
      ready,
      exchangerBalance,
      amount,
      maxBalance,
      accountInfo,
      money,
      isTimeQualified,
      blockNumber,
      accountInfoBlockNumber,
      showAcount,
      exchangeStatus,
      customClick,
      isExchangeStatusStatus,
      moneyMin,
      moneyMax,
      showAgreement,
      successDialog,
      successFn,
      isOne,
      isSuccess,
      netWorkList,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
      loading,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "./bourse.scss";
</style>
