<template>
  <div class="list">
    <!-- custom  -->
    <div class="custom pl-14 pr-14">
      <div class="title flex between pl-14 pr-14 pt-12 pb-12 mb-30">
        <div class="left flex center">
          <van-icon name="warning" />
        </div>
        <i18n-t
          keypath="addtokens.title"
          tag="div"
          class="right text-left f-12 lh-16"
        >
          <template v-slot:wormholesLink>
            <a
              href="https://192.168.1.237:9012"
              class="ml-4 mr-4 wormholeslink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t("wallet.wormHoles") }}
            </a>
          </template>
        </i18n-t>
        <!-- <div class="right text-left f-12 lh-16">{{ t("addtokens.title") }}</div> -->
      </div>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <div class="title-label pl-10">
            <span>*</span>
            {{ t("addtokens.contractAdd") }}
          </div>
          <van-field
            submit-on-enter
            v-model="tokenContractAddress"
            name="contract"
            :class="tokenError ? 'error' : ''"
            :placeholder="$t('addtokens.contractAddeg')"
            :rules="[
              { validator: asynToken },
            ]"
          />
        </van-cell-group>
        <div class="btn-group">
          <div class="container pl-28 pr-28 flex between">
                        <van-button round block class="mr-10"  @click="cancel">
              {{ t("common.cancel") }}
            </van-button>
            <van-button round block type="primary" native-type="submit">
              {{ t("addtokens.import") }}
            </van-button>
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script lang="ts">
import {
  ref,
  Ref,
  computed,
  toRaw,
  SetupContext,
  onMounted,
  reactive,
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
  Toast,
} from "vant";
import TokenCard from "@/views/account/components/tokenCard/index.vue";
import { useToast } from "@/plugins/toast/index";
import { getWallet } from "@/store/modules/account";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { getRandomIcon } from "@/utils";
import { ethers, utils } from "ethers";
const erc20Abi: any = require("@/assets/json/erc20Abi.json");

// import { useToast } from '@/plugins/toast'
export default {
  name: "import-token",
  components: {
    [Icon.name]: Icon,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
    TokenCard,
  },
  setup() {
    const { t } = useI18n();
    const { dispatch,state } = useStore();
    const { $toast } = useToast();
    // token
    const tokens = ref([
      { name: "ERB Token", value: 2, hasAdd: false },
      { name: "ETH Token", value: 3, hasAdd: true },
      { name: "ABR Token", value: 4, hasAdd: false },
      { name: "DOG Token", value: 25, hasAdd: false },
      { name: "JACK Token", value: 25, hasAdd: false },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "PIG Token", value: 25, hasAdd: true },
      { name: "ACB Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "EAC Token", value: 25, hasAdd: false },
      { name: "MINI Token", value: 25, hasAdd: false },
    ]);
    const search = ref("");
    const alist = computed(() => {
      // Split into two-dimensional arrays according to the first letter
      const list = tokens.value.map((item: any) => item);
      list.sort((a: any, b: any) => {
        return (a.name + "").localeCompare(b.name + "");
      });

      const newl = list.filter((item: any) => {
        if (search.value) {
          if (item.name.indexOf(search.value) > -1) {
            return item;
          }
        } else {
          return item;
        }
      });

      const arr: any = [];
      newl.forEach((item: any) => {
        const { name } = item;
        const label = name.substr(0, 1);
        const f = arr.find((child: any) => child.label == label);
        if (f) {
          arr.forEach((sun: any) => {
            const icon = getRandomIcon();
            sun.label == label ? sun.children.push({ ...item, icon }) : "";
          });
        } else {
          const icon = getRandomIcon();
          arr.push({ label, children: [{ ...item, icon }] });
        }
      });
      return arr;
    });

    const indexList = computed(() => {
      return alist.value.map((item: any) => item.label);
    });

    // tabs Switch data
    const tabs = reactive({
      list: [
        { name: "Search", value: 1, select: true },
        { name: "Custom", value: 2, select: false },
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
    const currentNetwork = computed(() => state.account.currentNetwork)
    const accountInfo = computed(() => state.account.accountInfo)
    const precision: Ref<string> = ref("");
    const name: Ref<string> = ref("");
    const symbol: Ref<string> = ref("");
    const tokenContractAddress: Ref<string> = ref("");
    const back = () => {
      router.go(-1);
    };
    const tokenError = ref(false);
    // Click add connectconstraint
    const onSubmit = async (data: any) => {
      console.log("submit", data);

      Dialog.confirm({
        message: t("currencyList.sure"),
      }).then(async () => {
        const { address } = await getWallet();
        try {
          Toast.loading({
            message: t("userexchange.loading"),
            forbidClick: true,
            loadingType: "spinner",
          });
          await dispatch("account/addToken", {
            tokenContractAddress: tokenContractAddress.value,
            address,
          });
          $toast.success(t("currencyList.Importsuccessful"));
          router.replace({ name: "wallet" });
        } catch (err: any) {
          $toast.fail(err.toString());
        } finally {
          Toast.clear();
        }
      });
    };

    const asynToken = async (val: string) => {
      tokenError.value = false
      if(!val){
         tokenError.value = true
        return t('addtokens.message')
      }
      const key = accountInfo.value.address.toUpperCase();
      const hasAddress = currentNetwork.value.tokens[key] ?  currentNetwork.value.tokens[key].length : 0;
      if (hasAddress) {
        const newv = currentNetwork.value.tokens[key].find(
          (item: any) =>
            item.tokenContractAddress.toUpperCase() ==
            tokenContractAddress.value.toUpperCase()
        );
        if (newv) {
          tokenError.value = true
          return t("common.addressalreadyexists")
        }
      }
      try {
        
        Toast.loading({
          message: t("userexchange.loading"),
          forbidClick: true,
          loadingType: "spinner",
        });

        
       try {
         const wallet = await getWallet();
        const contract = new ethers.Contract(
          tokenContractAddress.value,
          erc20Abi,
          wallet.provider
        );
        const contractWithSigner = contract.connect(wallet);
        const name = await contractWithSigner.name();
        const decimal = await contractWithSigner.decimals();
        const symbol = await contractWithSigner.symbol();
       }catch(err){
        tokenError.value = true
        return t('addCurrency.errTip')
       }
        return true;
      } catch (err: any) {
        console.error(err)
        tokenError.value = true
        return err.toString();
      }finally{
        Toast.clear()
      }
    };
    // Import function
    const handleImport = () => {
      console.log("import...");
    };

    const cancel = () => {
      router.replace({name:"wallet"})
    }
    return {
      tokenError,
      cancel,
      asynToken,
      tabs,
      changeTab,
      t,
      chooseTabdata,
      back,
      precision,
      name,
      symbol,
      tokenContractAddress,
      onSubmit,
      indexList,
      search,
      alist,
      handleImport,
    };
  },
};
</script>
<style lang="scss" scoped>

.error {
  :deep(.van-field__body) {
    border: 1px solid #d73a49 !important;
    background: #fbf2f3;
  }
}
.wormholeslink {
  color: #037cd6;
}
.list {
  height: calc(100vh - 48px - 16px);
  overflow-y: scroll;
}
:deep(.van-index-anchor) {
  background: #f1f3f4;
  color: #aeaeae;
  line-height: 30px;
}
:deep(.van-index-bar__sidebar) {
  color: #909090;
  right: 8px;
}
:deep(.van-index-bar__index) {
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  margin-bottom: 4px;
  padding: 0;
}
:deep(.van-index-bar__index--active) {
  background: #037cd6;
  color: #fff;
  border-radius: 9px;
}
* {
  box-sizing: border-box;
}
.tabs {
  width: 200px;
  // border-radius: 20px;
  // border: 1PX solid #037cd6;
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
.title {
  text-align: center;
  background: #f4faff;
  margin-top: 25px;
  .left {
    width: 20px;
    i {
      font-size: 16px;
      color: #037cd6;
    }
  }
  .right {
    width: calc(100% - 20px);
    padding-left: 3px;
    a {
      text-decoration: underline;
      color: #037cd6;
    }
  }
}
.title-label {
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 10px;
  font-weight: bold;
  position: relative;
  span {
    position: absolute;
    left: 0;
    top: 0;
    color: red;
  }
}
.search-box {
  border: 1px solid #bbc0c5;
  border-radius: 5px;
}
.ipt-box {
  width: 96%;
  i {
    color: #037cd6;
    font-size: 22px;
  }
  :deep(.van-field__body) {
    margin-bottom: 0;
    line-height: 100%;
    border: none;
    outline: none;
    &:hover {
      border: none;
    }
  }
}
.close {
  width: 30px;
  i {
    font-size: 16px;
    color: #037cd6;
  }
}
.icon-right-box {
  i {
    font-size: 18px;
  }
  .icon-add {
    color: #037cd6;
  }
  .icon-minus {
  }
}

.btn-group {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 25px;
}
:deep(.van-cell-group--inset) {
  margin: 0;
}
:deep(.van-field__label) {
  display: none;
}
:deep(.van-field__error-message) {
  margin-bottom: 12px;
  line-height: 12px;
}
:deep(.van-cell:after) {
  display: none;
}
:deep(.van-cell) {
  padding: 0;
}
:deep(.van-field__body) {
  margin-bottom: 10px;
  
  &:hover {
    border: 1px solid #1989fa;
  }
}

.btn-group {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 25px;
}
</style>