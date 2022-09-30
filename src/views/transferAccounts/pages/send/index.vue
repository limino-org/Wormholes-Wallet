<template>
  <NavHeader>
    <template v-slot:left>
      <span class="back hover" @click="back">{{
        t("createAccountpage.back")
      }}</span>
    </template>
    <template v-slot:title>
      <div class="flex center title">{{ t("wallet.send") }}</div>
    </template>
  </NavHeader>
  <div class="page-container">
    <div class="mt-14 mr-14 pl-14 userinfo-box">
      <div :class="`userinfo ${checkAddressError ? 'error' : ''}`">
        <div class="from flex column between">
          <div
            class="information p-14 flex between"
            @click="handleShowAccountModal"
          >
            <div class="flex center-v">
              <div class="avatar flex center">
                <AccountIcon :data="accountInfo.icon" />
              </div>
              <div
                class="flex column between userinformation center-h pt-4 pb-4"
              >
                <div class="username mb-4">{{ accountInfo.name }}</div>
                <div class="userbalance">
                  {{ chooseToken.balance }} {{ chooseToken.name }}
                </div>
              </div>
            </div>
            <div class="flex center up-down-box">
              <van-icon :name="`${showModal ? 'arrow-up' : 'arrow-down'}`" />
            </div>
          </div>
        </div>

        <div class="line-box flex between center-v pl-16 pr-16">
          <div class="line"></div>
          <div class="text-bold f-12">{{ t("sendto.to") }}</div>
          <div class="line"></div>
        </div>
        <div class="to from flex between center-v toInfo">
          <div
            class="add-ipt flex center-v between pl-14 pr-14"
            v-show="!hasChooseAddress"
          >
            <van-field
              :placeholder="$t('sendNFT.addAddress')"
              v-model="toAddress"
              @blur="checkAddress"
            ></van-field>
            <div
              class="flex right center-v right to-btns"
              v-show="!hasChooseAddress"
            >
              <i class="iconfont icon-tongxunlu hover" @click="toContacts"></i>
            </div>
            <div class="flex right center-v" v-show="hasChooseAddress">
              <van-icon
                name="cross"
                class="clearAddress"
                @click="clearAddress"
              />
            </div>
          </div>
          <div class="information p-14 flex between" v-show="hasChooseAddress">
            <div class="flex">
              <div class="avatar flex center">
                <AccountIcon :data="account.data.icon" />
              </div>
              <div
                :class="`flex column ${
                  account.data.name ? 'between' : ''
                }  userinformation center-h pt-4 pb-4`"
              >
                <div class="username mb-4">{{ account.data.name }}</div>
                <div class="userbalance userbalanceBox">
                  {{ account.data.address }}
                  <!-- <i class="iconfont icon-duihao"></i> -->
                </div>
              </div>
            </div>
            <div
              class="flex right center-v between to-btns"
              v-show="!hasChooseAddress"
            >
              <i class="iconfont icon-tongxunlu hover" @click="toContacts"></i>
            </div>
            <div class="flex right center-v" v-show="hasChooseAddress">
              <van-icon
                name="cross"
                class="clearAddress"
                @click="clearAddress"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="checkAddressError"
      class="color-error f-12 ml-14 mr-14 mb-14 mt-8"
    >
      {{ addressMsg }}
    </div>
    <!-- Transfer amount / balance area -->
    <div class="pl-14 pr-14 userinfo-box mt-14">
      <div :class="`userinfo  ${amountErr ? 'error' : ''}`">
        <div class="from flex column between">
          <!-- Transfer amount -->
          <div class="pl-14 pr-14 pt-20 pb-20 flex between amount">
            <div class="amount-info van-ellipsis">
              <div class="label">{{ t("sendNFT.amount") }}</div>
              <van-field
                placeholder="0.00"
                v-model="amount"
                maxlength="40"
                @blur="handleAmountBlur"
                @update:model-value="changeAmount"
                type="number"
              />
            </div>
            <div class="flex center-v right up-down-box">
              <span class="max f-12 hover" @click="handleMax">
                {{ t("sendto.max") }}
              </span>
              <div
                class="van-hairline--right h-12 mr-14 ml-14 line-box"
                style="width: 1px"
              ></div>
              <div
                class="token-info flex center-v between pr-6 pl-6 hover"
                @click="handleTokenModal"
              >
                <div class="xuanwo flex center">
                  <img src="@/assets/token/logowallet.png" alt />
                </div>
                <div class="van-ellipsis ml-6 mr-6 token-name lh-14">
                  {{ chooseToken.name }}
                </div>
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="amountErr" class="color-error f-12 ml-14 mr-14 mb-14 mt-8">
      {{ amountErrMsg }}
    </div>

    <!-- Sliding bar -->
    <div class="pl-14 pt-14 pr-14 userinfo-box">
      <div class="userinfo slider-box amount-info pt-20 pb-20 pl-14 pr-14">
        <div class="flex between">
          <div>
            <!-- gas price -->
            <div class="label">
              {{ t("sendto.gasprice") }}
              <van-popover
                v-model:show="gasPriceModal"
                theme="dark"
                placement="right"
              >
                <p class="p-10">{{ t("sendto.gastit") }}</p>
                <template #reference>
                  <van-icon
                    name="question hover"
                    @mouseover="gasPriceModal = true"
                    @mouseleave="gasPriceModal = false"
                  />
                </template>
              </van-popover>
            </div>
            <div class="value">
              <span class="text-bold"
                >≈ {{ gasPriceNum }} Gwei,</span
              >
              <span class="second pl-6"
                >≈ {{ second }} {{ t("sendto.second") }}</span
              >
            </div>
          </div>
          <div class="gasfee-icon flex center-v hover">
            <i class="iconfont icon-conditions" @click="toSetGas"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <div class="container pr-26 pl-26">
        <van-button
          type="primary"
          :disabled="btnDisabled"
          @click="gonext"
          block
          >{{ t("sendto.confirm") }}</van-button
        >
      </div>
    </div>
    <!-- Confirm sending Popup -->
    <SendConfirm v-model="showSendConfirm" :data="sendTx" />
  </div>

  <action-sheet v-model="showModal" :hasBtn="false"></action-sheet>
</template>

<script lang="ts">
import {
  reactive,
  ref,
  computed,
  Ref,
  toRaw,
  watch,
  SetupContext,
  onUnmounted,
  nextTick,
  onActivated,
  onMounted,
} from "vue";
import {
  Icon,
  Toast,
  Button,
  Sticky,
  Field,
  Slider,
  Popover,
  Dialog,
} from "vant";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import NavHeader from "@/components/navHeader/index.vue";
import AccountIcon from "@/components/accountIcon/index.vue";
import AccountList from "@/views/account/components/accountList/index.vue";
import { AccountInfo, getWallet } from "@/store/modules/account";
import { addressMask, decimal, toUsd } from "@/utils/filters";
import actionSheet from "@/views/account/wallet/action-sheet.vue";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal/index";
import { utils } from "ethers";
import { getRandomIcon } from "@/utils";
import BigNumber from "bignumber.js";
import AccountModal from "@/components/accountModal/index.vue";
import { useI18n } from "vue-i18n";
import SendConfirm from "@/views/transferAccounts/components/sendComfirm.vue";
import { web3 } from "@/utils/web3";
import { ethers } from "ethers";
import eventBus from "@/utils/bus";
import CommonModal from "@/components/commonModal/index.vue";
import { useToast } from "@/plugins/toast";

export default {
  name: "pageSend",
  components: {
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Field.name]: Field,
    [Slider.name]: Slider,
    [Popover.name]: Popover,
    actionSheet,
    NavHeader,
    AccountIcon,
    AccountList,
    AccountModal,
    SendConfirm,
    CommonModal,
  },
  setup(props: any, context: SetupContext) {
    const router = useRouter();
    const store = useStore();
    const route = useRoute();
    const { commit } = store;
    const { t } = useI18n();
    const { $toast } = useToast();

    const { dispatch } = store;
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const addressMsg = ref(t("send.addressError"));
    // Default token/ selected token data
    const chooseToken = computed(() => {
      const symbol = currentNetwork.value.currencySymbol;
      const balance = accountInfo.value.amount;
      const data = {
        balance,
        logoUrl: "",
        name: symbol,
        precision: 1,
        symbol,
        tokenContractAddress: null,
      };
      const token = store.state.transfer.chooseToken;
      if (token) {
        return token;
      } else {
        return data;
      }
    });

    // Selected contact data
    const chooseContact = computed(() => store.state.transfer.chooseContact);
    const gasLimit = ref(21000);

    // amount of money
    const chooseAmount = computed(() => store.state.transfer.amount);
    const defaultAccount = toRaw(chooseContact.value || {});
    const account = reactive({ data: defaultAccount });
    const amount = ref(
      toRaw(chooseAmount.value == 0 ? null : chooseAmount.value)
    );
    const hasChooseAddress: Ref<boolean> = ref(false);
    // Clear selection
    const cancelAccount = () => {
      account.data = {};
    };
    const toAddress: Ref<string> = ref(defaultAccount.address);
    const amountErrMsg = ref(t("send.amountError"));
    // Verify the sending data and return the transaction data
    const checkTx = () => {
      checkAddressError.value = false;
      if (!toAddress.value) {
        // $toast.warn(t("sendto.erroraddress"));
        checkAddressError.value = true;
        addressMsg.value = t("send.addressError");
        return false;
      }
      if (
        toAddress.value.toUpperCase() == accountInfo.value.address.toUpperCase()
      ) {
        checkAddressError.value = true;
        addressMsg.value = t("transaction.addressErrMsg");
        return false;
      }
      // Whether the balance is greater than the sent amount
      if (new BigNumber(chooseToken.value.balance).lte(amount.value)) {
        //  $toast.warn(t("sendto.nomoney",{symbol:chooseToken.value.name}));
                     amountErrMsg.value = t("sendto.nomoney", {
          symbol: chooseToken.value.name,
          amount: chooseToken.value.balance
        });
        amountErr.value = true;
        return false;
      }
      // Whether the balance is equal to 0
      if (chooseToken.value.balance == 0 || amount.value == 0) {
        //  $toast.warn(t("sendto.no"));
        amountErrMsg.value = t("sendto.no");
        amountErr.value = true;
        return false;
      }

      const { tokenContractAddress } = chooseToken.value;
      const gasPrice = gasPriceNum.value;
      console.warn("gasPrice", gasPrice);
      if (tokenContractAddress) {
        return {
          address: tokenContractAddress,
          amount: amount.value,
          to: toAddress.value,
          token: chooseToken.value,
          gasPrice,
          gasLimit: gasLimit.value,
        };
      } else {
        return {
          to: toAddress.value,
          value: amount.value,
          token: chooseToken.value,
          gasPrice,
          gasLimit: gasLimit.value,
        };
      }
    };

    // Data transmitted to the sending pop-up window
    const sendTx = ref({});
    const gonext = async () => {

      checkAddressError.value = false;
      amountErr.value = false;
      console.warn("amount.value", amount.value);
      const params = checkTx();
      if (!params) {
        return false;
      }
      if (isNaN(amount.value) || new BigNumber(amount.value).lte(0)) {
        amountErr.value = true;
        $toast.warn(t("sendto.no"));
        return;
      }

      sendTx.value = params;
      // Check first
      handleShowSendConfirm();
    };

    // Generate cache based on input address
    function createCache() {
      let data = {};
      if (toAddress.value) {
        data = {
          address: toAddress.value,
          icon: getRandomIcon(),
        };
      } else {
        data = toRaw(account);
      }
      return data;
    }

    const checkAddressError = ref(false);
    // Verify address format
    async function checkAddress() {
      if (toAddress.value) {
        try {
          utils.getAddress(toAddress.value);
          checkAddressError.value = false;
          account.data = createCache();
      
        } catch (err) {
          Toast(t("sendto.wrongaddressformat"));
          toAddress.value = "";
          checkAddressError.value = true;
        }
      }
    }

    // Listen and select token
    watch(
      chooseToken.value,
      async (n) => {
        nextTick(async() => {
          calcGasLimit();
        });
      },
      { deep: true, immediate: true }
    );

    // Whether the status of the address is selected
    watch(
      () => account,
      (n) => {
        const data = toRaw(n);
        if (JSON.stringify(data.data) == "{}") {
          hasChooseAddress.value = false;
          return;
        }
        hasChooseAddress.value = true;
      },
      {
        deep: true,
        immediate: true,
      }
    );

    const showModal: Ref<boolean> = ref(false);
    const handleShowAccountModal = () => {
      showModal.value = true;
    };

    // Jump to select contacts
    const toContacts = () => {
      router.replace({
        name: "contacts-choose",
        query: { backUrl: "send", clickBackUrl: "send" },
      });
    };

    // Clear selected addresses
    const clearAddress = () => {
      account.data = {};
      toAddress.value = "";
      commit("transfer/CHOOSE_CONTACT", null);
    };

    // Jump to select token
    const handleTokenModal = () => {
      router.replace({
        name: "receive-choose",
        query: { backUrl: "send", clickBackUrl: "send" },
      });
    };

    // Amount change event
    const changeAmount = (v: any) => {
      commit("transfer/UPDATE_AMOUNT", Number(v));
    };
    // Custom gas, change events
    const gasFee = ref(2);

    // Use maximum
    const handleMax = () => {
      // const v = new BigNumber(chooseToken.value.balance).toString()
      const v = chooseToken.value.balance;
      console.log("usemax", v);
      amount.value = v;
    };

    // Control button disabled
    const btnDisabled = computed(() => {
      return false;
    });

    // Send confirmation pop-up
    const showSendConfirm = ref(false);
    const handleShowSendConfirm = () => {
      showSendConfirm.value = true;
    };

    // Get the three highest, lowest and average gas fees
    const gasData: any = ref([]);
    const gasPriceNum = ref("0");
    const initGas = async () => {
      // const wallet = await getWallet();
      try {
        const wallet = await getWallet();
        const gasPrice = await wallet.provider.getGasPrice();
        console.log("gasPrice", utils.formatUnits(gasPrice, "wei"));
        const bigGas = new BigNumber(utils.formatUnits(gasPrice, "wei"));
        const bigGasDiv = bigGas.multipliedBy(0.2);
        const bigGasDiv2 = bigGas.multipliedBy(0.1);
        const max = bigGas.plus(bigGasDiv).dividedBy(1000000000).toString();
        const min = bigGas.dividedBy(1000000000).toString();
        const average = bigGas
          .plus(bigGasDiv2)
          .dividedBy(1000000000)
          .toString();
        console.log("bigGas", bigGas.toString());
        console.log("max", max);
        console.log("min", min);
        console.log("average", average);
        gasData.value = [min, average, max];
        gasPriceNum.value = max;
        reCalc(route.query);
      } catch (err) {
        console.error("getGasPrice:error", err);
      }
    };
    initGas();

    // Estimated transaction sending time
    const random = Math.random() * (1 - 0 + 1);
    const second = ref((11 + random).toFixed(2));

    // Listening to account switching events
    eventBus.on("changeAccount", (e) => {
      // Clear the last selected token cache each time the account is re selected
      commit("transfer/CLEAR_TX");
    });

    // Balance display type
    const amountType = computed(() => store.state.system.amountType);

    // gasPrice  Exchange for us dollars
    const gasPriceUsd = computed(() => {
      const usd: any = toUsd(
        new BigNumber(gasPriceNum.value).dividedBy(1000000000).toFixed(10),
        10
      );
      return usd && !isNaN(usd) ? usd : "0";
    });

    // Insufficient balance
    const isPoor = computed(() => {
      return new BigNumber(amount.value || 0).gt(chooseToken.value.balance);
    });

    // Minus button disabled
    const minusDisabled = computed(() => {
      const biglimit = new BigNumber(gasLimit.value);
      return biglimit.lte(21000);
    });
    // gas limit Out of focus event
    const limitBlur = () => {
      const biglimit = new BigNumber(gasLimit.value);
      if (biglimit.lt(21000)) {
        gasLimit.value = 21000;
      }
    };

    // Set gaslimit dynamically
    const calcGasLimit = async () => {
      const { tokenContractAddress } = chooseToken.value;
      // Token transfer dynamic estimation gaslimit
      if (tokenContractAddress) {
        debugger
        // Get contract token instance object
        const { contractWithSigner, contract } = await dispatch(
          "account/connectConstract",
          tokenContractAddress
        );
        const gas = await contractWithSigner.estimateGas
          .transfer(
            toAddress.value || '0xE2012DdE16A246b5D935f2f96F88bDc1012C2e07',
            (amount.value || "1") + ""
          )
          console.warn(
              "gas----------------==",
              utils.formatUnits(gas, "wei")
            );
            gasLimit.value = utils.formatUnits(gas, "wei");
            console.warn('gasLimit.value',gasLimit.value)
      } else {
        gasLimit.value = 21000;
      }
    };
    calcGasLimit()

    const amountErr = ref(false);
    const handleAmountBlur = async () => {
      await calcGasLimit()
      if (isPoor.value) {
        amountErr.value = true;
      } else {
        amountErr.value = false;
      }
    };

    // gas limit Question mark Popup
    const gasLimitModal = ref(false);
    // gas price Question mark Popup
    const gasPriceModal = ref(false);

    // TO set gas fee
    const toSetGas = () => {
      const tx = checkTx();
      if (!tx) {
        return;
      }
      const { tokenContractAddress } = chooseToken.value;
      const query = {
        toAddress: toAddress.value,
        amount: amount.value,
        tokenContractAddress,
        backUrl: "send",
      };
      router.push({
        name: "gasFee",
        query,
      });
    };
    const reCalc = (query: any) => {
      const {
        gasPrice: gasp,
        second: sec,
        gasLimit: limit,
        gasFee: fee,
      }: any = query;
      if (!gasp || !sec || !limit || !fee) {
        return;
      }
      gasPriceNum.value = gasp;
      gasFee.value = Number(fee);
      gasLimit.value = limit;
      second.value = sec;
    };
    onActivated(() => {
      reCalc(route.query);
    });
    onMounted(() => {
      const accountTokens = computed(
        () => store.getters["account/accountTokens"]
      );
      // Check the address bar for action parameter == Transfer and directly enter the code sweep transfer process
      const { address, tokenContractAddress, value, action }: any = route.query;

      if (action && action == "transfer") {
        toAddress.value = address;
        amount.value = value;
        // If the token is sent and the account does not hold the token, the prompt is imported directly
        const token = accountTokens.value.find(
          (item: any) =>
            item.tokenContractAddress &&
            item.tokenContractAddress == tokenContractAddress
        );
        debugger;
        console.warn("token-----------", token);
        if (tokenContractAddress && tokenContractAddress != "null" && !token) {
          Dialog.confirm({
            title: tokenContractAddress,
            message: t("addtokens.tokenImportTip"),
          }).then(async () => {
            const { address } = await getWallet();
            try {
              Toast.loading({
                message: t("userexchange.loading"),
                forbidClick: true,
                loadingType: "spinner",
              });
              const newToken = await dispatch("account/addToken", {
                tokenContractAddress,
                address,
              });
              console.log("impot-----token----", newToken);
              commit("transfer/UPDATE_CHOOSETOKEN", newToken);
              Toast(t("currencyList.Importsuccessful"));
            } catch (err: any) {
              Toast(err.toString());
            }
          });
        } else {
          commit("transfer/UPDATE_CHOOSETOKEN", token);
        }
        toAddress.value = address;
        amount.value = value;
        checkAddress();
      }
    });

    const back = () => {
      router.replace({ name: "wallet" });
    };
    return {
      back,
      gasLimitModal,
      handleAmountBlur,
      gasPriceModal,
      isPoor,
      amountType,
      limitBlur,
      gasFee,
      second,
      gasPriceUsd,
      gasPriceNum,
      t,
      addressMsg,
      gasLimit,
      handleShowSendConfirm,
      showSendConfirm,
      gonext,
      handleTokenModal,
      accountInfo,
      toAddress,
      account,
      hasChooseAddress,
      addressMask,
      cancelAccount,
      checkAddress,
      amountErrMsg,
      showModal,
      handleShowAccountModal,
      decimal,
      currentNetwork,
      scroll,
      toContacts,
      clearAddress,
      amount,
      changeAmount,
      chooseToken,
      handleMax,
      btnDisabled,
      sendTx,
      gasData,
      toUsd,
      minusDisabled,
      checkAddressError,
      toSetGas,
      amountErr,
    };
  },
};
</script>

<style lang="scss" scoped>
.back {
  color: #037cd6;
  font-size: 12px;
}
.title {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}
.userbalanceBox {
  letter-spacing: -0.8px;
}
.toInfo {
  display: block !important;
}
.icon {
  height: auto;
  margin-bottom: 0;
}
.gasfee-icon i {
  color: #037cd6;
  font-size: 24px;
}
.page-container {
  padding-bottom: 80px;
  width: 100%;
  .common-modal-txt {
    color: #848484;
  }
  .slider-container {
    position: relative;
    z-index: 20;
  }
  .tip-box {
    position: fixed;
    left: 15px;
    right: 15px;
    bottom: 95px;
    .box {
      background: #fbf2f3;
      border-radius: 7.5px;
      font-size: 12px;
    }
    i {
      font-size: 14px;
      color: #ff4258;
    }
  }
  .balance-box {
    color: #a4a4a4;
    margin: 11.5px 0;
    .value {
      max-width: 375px;
    }
    div {
      line-height: 16px;
      font-size: 12px;
    }
  }
  .limit-box {
    height: 44px;
    background: #f1f3f4;
    border-radius: 22px;
    .ipt-box {
      width: 60px;
      :deep(.van-field input) {
        text-align: center;
      }
    }
    .action {
      width: 17.5px;
      height: 17.5px;
      border-radius: 50%;
      border: 1px solid #037cd6;
      cursor: pointer;
      &.disabled {
        border: 1px solid #ccc;
        cursor: no-drop;
        i {
          color: #ccc;
        }
      }
      i {
        font-size: 12px;
        color: #037cd6;
        font-weight: bold;
      }
    }
  }
  .token-info {
    height: 35px;
    min-width: 90px;
    max-width: 140px;
    background: #f1f3f4;
    border-radius: 17.5px;
    .xuanwo {
      width: 24px;
      height: 24px;
      border-radius: 10px;
      // background: #0b80d7;
      padding: 2px;
      img {
        display: block;
        width: 100%;
        height: 100%;
        // border-radius: 50%;
      }
    }
    .token-name {
      color: #000;
    }
  }
  :deep() {
    .van-field__body {
      border: none;
      padding: 0;
      height: auto;
    }
    .van-cell {
      padding: 0;
    }
  }
  :deep(.van-slider .van-slider__button) {
    z-index: 100;
    width: 20px;
    height: 20px;
  }
  :deep(.van-slider .van-slider__bar) {
    z-index: 1000;
  }
  :deep(.van-slider) {
    z-index: 1000;
  }
  .slider-dian {
    height: 30px;
    position: relative;
    .slider-icon {
      width: 7.5px;
      position: absolute;
      display: block;
      height: 7.5px;
      border-radius: 50%;
      background: #f1f3f4;
      z-index: 1;
      &.active {
        background: #1989fa;
      }
    }

    .slider-l {
      left: 8px;
      top: -17px;
    }
    .slider-c {
      left: 50%;
      margin-left: -3.75px;
      top: -17px;
    }
    .slider-r {
      right: 8px;
      top: -17px;
    }
    .speed-label {
      font-size: 12px;
      color: #9a9a9a;
      line-height: 18px;
      position: absolute;
      top: 2px;
      &.speed-l {
        left: 0;
      }
      &.speed-c {
        left: 50%;
        width: 48px;
        margin-left: -24px;
        text-align: center;
      }
      &.speed-r {
        right: 0;
      }
    }
  }
  .account-box {
    margin-bottom: 50px;
  }
  .userinfo-box {
    background: #fff;
  }
  .clearAddress {
    font-size: 16px;
    color: #037cd6;
  }
  .slider-box.amount-info {
    .value {
      color: #000;
      font-size: 12px;
    }
  }
  .cancel {
    font-size: 11px;
    color: #037cd6;
  }
  .up-down-box {
    i {
      font-size: 15px;
    }
    span {
      word-break: keep-all;

      color: #037cd6;
    }
    .line-box::after {
      border-color: #6e7276 !important;
    }
    font-size: 12px;
    color: #037cd6;
  }
  :deep(input) {
    font-size: 12px;
    line-height: 16px;
    font-weight: bold;
  }
  .amount-info {
    width: 100%;
    .van-cell {
      background: none;
      padding: 0;
    }

    .label,
    .value {
      font-size: 12px;
      color: #9a9a9a;
      line-height: 18px;
      &.equal {
        color: #000;
      }
    }
    .second {
      color: #3aae55;
    }
  }
  .to-btns {
    // width: 66px;
    i {
      color: #037cd6;
      font-size: 20px;
    }
  }
  .line-box {
    .line {
      height: 0;
      width: 46%;
      border-bottom: 1px solid #bbc0c5;
    }
  }
  .userinfo {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background: #fff;
    border: 1px solid #bbc0c5;
    border-radius: 5px;
    &.error {
      border-color: #d73a49;
      background: #fbf2f3;
      .van-cell {
        background: #fbf2f3;
      }
    }
    &::after {
      border-radius: 5px;
      border-color: #bbc0c5;
    }
  }
  .btn-group {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 25px;
  }
  .from {
    display: flex;
    justify-content: space-around;
    .userfrom {
      font-size: 12px;
      margin-top: 18px;
      width: 76px;
      text-align: center;
    }
    .information {
      border-collapse: collapse;
      position: relative;
      &.amount {
        padding: 20px 14px 20px;
      }
      &:hover {
        transition: ease 0.3s;
        background-color: rgba(3, 125, 214, 0.1);
      }
      .closeIcon {
        position: absolute;
        right: 10px;
        top: 14px;
        font-size: 18px;
        color: #6a737d;
      }
      .jticon {
        position: absolute;
        right: 10px;
        top: 14px;
        &::before {
          color: #6a737d;
        }
      }
      &::after {
        border-radius: 10px;
      }
      .avatar {
        overflow: hidden;
        border-radius: 50%;
        height: 42px;
        :deep(.account-icon-component) {
          overflow: hidden;
          border-radius: 50%;
        }
      }
      .userinformation {
        margin-left: 5px;
        .username {
          font-size: 12px;
          line-height: 14px;
        }
        .userbalance {
          line-height: 14px;
          font-size: 12px;
          color: #9a9a9a;
          word-break: break-all;
          i {
            color: #0dd70d;
            font-size: 14px;
            margin-left: 8px;
          }
        }
      }
    }
  }
  .to {
    display: flex;
    justify-content: space-between;
    .sendto {
      font-size: 12px;
      margin-top: 18px;
      width: 76px;
      text-align: center;
    }
    .add-ipt {
      height: 100%;
      padding-top: 20px;
      padding-bottom: 20px;
      &::after {
        border-radius: 10px;
      }
      & .van-cell {
        padding-left: 0;
      }
      & .van-cell:after {
        display: none;
      }
    }
    .receiver {
      font-size: 12px;
      text-align: center;
      line-height: 46px;
      width: 286px;
      height: 46px;
      border-radius: 10px;
      border: 1px solid rgba(209, 212, 215, 1);
    }
  }
  .transfer {
    height: 40px;
    line-height: 40px;
    margin-left: 15px;
    font-size: 12px;
    color: rgba(7, 118, 211, 1);
  }
  .useravatar {
    width: 30px;
    height: 30px;
    background-color: green;
  }
  .recent {
    .text {
      width: 100%;
      background-color: rgba(241, 243, 244, 1);
      border: 1px solid rgba(216, 216, 216, 1);
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      color: rgba(121, 121, 121, 1);
      padding-left: 15px;
    }
  }
}
</style>