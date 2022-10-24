<template>
  <NavHeader>
    <template v-slot:left>
      <span class="back hover" @click="back">{{
      t("createAccountpage.back")
      }}</span>
    </template>
  </NavHeader>
  <div class="connect-wallet"></div>
</template>
<script  lang="ts" >
import { useToast } from "@/plugins/toast";
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { Toast } from "vant";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getWallet } from "@/store/modules/account";
import { JsonObject } from "type-fest";
import { getCookies } from "@/utils/jsCookie";
import NavHeader from "@/components/navHeader/index.vue";
import { useToggleAccount } from '@/components/accountModal/hooks/toggleAccount'
import {
  createWalletByMnemonic,
  createWalletByJson,
  CreateWalletByJsonParams,
  ImportPrivateKey,
  CreateWalletByMnemonicParams,
  createRandomWallet,
} from "@/utils/ether";
import { ethers } from "ethers";
import { useI18n } from "vue-i18n";
import { decode } from "js-base64";
export enum Actions {
  getAddress = "getAddress",
  login = "login",
  getBlockNumber = "getBlockNumber",
  getBalance = "getBalance",
  getAccount = "getAccount",
  sigMessage = "sigMessage",
  sendTransaction = "sendTransaction",
  sendOpenExchangeTransaction = 'sendOpenExchangeTransaction'
}
type URLParams = {
  action: Actions;
  data: any;
  backUrl: string
};
export default {
  components: {
    NavHeader,
  },
  setup() {
    const { handleAccount } = useToggleAccount()
    const route = useRoute();
    const { state } = useStore();
    const router = useRouter();
    const { t } = useI18n();
    const { query } = route;
    const { backUrl, action, address, params }: any = query;
    const queryData = params ? JSON.parse(params) : {};
    const { $toast } = useToast();
    Toast.loading({
      message: "loading...",
      duration: 0,
    });
    const password = getCookies();
    const accountList = computed(() => state.account.accountList);
    const accountInfo = computed(() => state.account.accountInfo);
    const currentNetwork = computed(() => state.account.currentNetwork);
    const nowAccount = computed(() => {
      if (address) {
        return accountList.value.find(
          (item: any) => item.address.toUpperCase() == address.toUpperCase()
        );
      }
      return null;
    });

    const handleInitData = () => {
      const handleList = [
        "getAddress",
        "getAccount",
        "login",
        "sigMessage",
        "getBlockNumber",
        "getBalance",
        "sendTransaction",
        "sendOpenExchangeTransaction"
      ];
      if (!backUrl || !action) {
        $toast.warn("Parameter error");
        return;
      }
      if (!handleList.includes(action ? action?.toString() : "")) {
        $toast.warn("Unsupported method");
        return;
      }
      switch (action) {
        case "getAddress":
          getAddress();
          break;
        case "login":
          login();
          break;
        case "getBlockNumber":
          getBlockNumber();
          break;
        case "getBalance":
          getBalance();
          break;
        default:
        case "getAccount":
          getAccount();
          break;
        case "sigMessage":
          sigMessage();
          break;
        case "sendTransaction":
          sendTransaction();
          break;
        case "sendOpenExchangeTransaction":
          sendOpenExchangeTransaction()
          break;
      }
      Toast.clear();
    };

    handleInitData();


    function sendOpenExchangeTransaction() {
      router.replace({
        name: "sendOpenExchangeTransaction",
        query: {
          txs: JSON.stringify(queryData),
          backUrl,
          address,
        },
      });
    }

    function sendTransaction() {
      router.replace({
        name: "sendTransaction",
        query: {
          tx: JSON.stringify(queryData),
          backUrl,
          address,
        },
      });
    }
    function sigMessage() {
      const { sig } = queryData;
      router.replace({
        name: "exchangeSign",
        query: {
          sig,
          backUrl,
          address,
        },
      });
    }
    function getAddress() {
      const accountInfo = computed(() => state.account.accountInfo);
      const { address } = accountInfo.value;
      const data = {
        address,
      };
      location.href = handleConnectBackUrl({
        action: Actions.getAddress,
        data,
        backUrl
      });
    }
    async function login() {
      const wallet = await getWallet();
      const accountInfo = computed(() => state.account.accountInfo);
      const { address } = accountInfo.value;
      const netWork = await wallet.provider.getNetwork();
      const data = {
        address,
        chainId: netWork.chainId,
      };
      location.href = handleConnectBackUrl({
        action: Actions.login,
        data,
        backUrl

      });
    }
    async function getBlockNumber() {
      const wallet = await getWallet2();
      const blockNumber = await wallet.provider.getBlockNumber();
      const data = {
        blockNumber,
      };
      location.href = handleConnectBackUrl({
        action: Actions.getBlockNumber,
        data,
        backUrl

      });
    }
    async function getBalance() {
      const wallet = await getWallet2();
      const balance = await wallet.getBalance();
      const data = {
        balance,
      };
      location.href = handleConnectBackUrl({
        action: Actions.getBalance,
        data,
        backUrl

      });
    }

    function getAccount() {
      const accountInfo = computed(() => state.account.accountInfo);
      const { address, icon, name } = accountInfo.value;
      const data = {
        address,
        icon,
        name,
      };
      location.href = handleConnectBackUrl({
        action: Actions.getAccount,
        data,
        backUrl

      });
    }


    const back = () => {
      router.replace({ name: "wallet" });
    };
    // How to obtain a wallet without affecting the wallet status
    async function getWallet2() {
      if (!nowAccount.value) {
        $toast.warn("common.addressnotfound");
        return null;
      }
      if (nowAccount.value.address.toUpperCase() != accountInfo.value.address.toUpperCase()) {
        return await handleAccount(nowAccount.value, 0)
      } else {
        return await getWallet()
      }

    }

    onBeforeRouteLeave(() => {
      Toast.clear();
    });
    return {
      t,
      back,
    };
  },
};


export function handleConnectBackUrl(params: URLParams) {
  const { action, data, backUrl } = params;
  const back = decode(backUrl);
  return `${back}${back.indexOf("?") > -1 ? "&" : "?"
    }action=${action}&data=${encodeURIComponent(JSON.stringify(data))}`;
}
</script>
<style lang="scss" scoped>
.back {
  color: #037cd6;
  font-size: 12px;
}

.connect-wallet {}
</style>