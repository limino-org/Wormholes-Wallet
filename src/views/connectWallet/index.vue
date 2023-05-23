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
import { ethers } from "ethers";
import { useI18n } from "vue-i18n";
import { decode } from "js-base64";
import localforage from 'localforage';
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
    const queryData = params ? JSON.parse(decodeURIComponent(params)) : {};
    const { $wtoast } = useToast();
    Toast.loading({
      message: "loading...",
      duration: 0,
    });
    const password = getCookies();
    const accountList = computed(() => state.account.accountList);
    const accountInfo = computed(() => state.account.accountInfo);
    const currentNetwork = computed(() => state.account.currentNetwork);
    if(!accountList.value.length){
      router.replace({name:"guidance"})
    }
    if(!password) {
        // @ts-ignore
        router.replace({name:"withpassword",query: {backUrl:'connectWallet',loginParams: {...query}}})
    }

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
        "sendOpenExchangeTransaction",
        "sendContractTransaction",
        "addNetwork"
      ];
      if (!backUrl || !action) {
        $wtoast.warn("Parameter error");
        return;
      }
      if (!handleList.includes(action ? action?.toString() : "")) {
        $wtoast.warn("Unsupported method");
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
        if (!nowAccount.value) {
        $wtoast.warn("common.addressnotfound");
        return;
      }
          sendTransaction();
          break;
        case "sendOpenExchangeTransaction":
        if (!nowAccount.value) {
        $wtoast.warn("common.addressnotfound");
        return;
      }
          sendOpenExchangeTransaction()
          break;
        case "sendContractTransaction":
        if (!nowAccount.value) {
        $wtoast.warn("common.addressnotfound");
        return;
      }

        sendContractTransaction()
        break;
        case 'addNetwork':
        addNetwork()
        break;
      }
      Toast.clear();
    };

    handleInitData();
                                                                                                                                                                                                                                                                                                                                                                          
    function addNetwork() {
      router.replace({
        name:'addNetwork',
        query: {
          backUrl,
          URL: queryData.URL,
        }
      })
    }

    async function sendContractTransaction (){
      const wallet = await getWallet2();
      router.replace({
        name: "sendContractTransaction",
        query: {
          tx: JSON.stringify(queryData),
          backUrl,
          address,
        },
      });
    }

    async function sendOpenExchangeTransaction() {
      const wallet = await getWallet2();
      router.replace({
        name: "sendOpenExchangeTransaction",
        query: {
          txs: JSON.stringify(queryData),
          backUrl,
          address,
        },
      });
    }

    async function sendTransaction() {
      const wallet = await getWallet2();
      router.replace({
        name: "sendTransaction",
        query: {
          tx: JSON.stringify(queryData),
          backUrl,
          address,
        },
      });
    }
    async function sigMessage() {
      const wallet = await getWallet2();

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
   
      const accountInfo = computed(() => state.account.accountInfo);
      const { address } = accountInfo.value;
   
      let netWork: any = {
        chainId: 51888
      }
      try {
        const wallet = await getWallet();
        netWork = await wallet.provider.getNetwork();
      }catch(err){
        console.error(err)
      }
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
      if(!address){
        $wtoast.warn('The address parameter cannot be empty')
        return null;
      }
      if (!nowAccount.value) {
        $wtoast.warn("common.addressnotfound");
        // router.replace({name:'import'})
        return null;
      }
      if (nowAccount.value.address.toUpperCase() != accountInfo.value.address.toUpperCase()) {
        return await handleAccount(nowAccount.value, 0)
      } else {
        try {
          return await getWallet()
        }catch(err: any){
          Toast(err.toString())
        }
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
  color: #9F54BA;
  font-size: 12px;
}

</style>