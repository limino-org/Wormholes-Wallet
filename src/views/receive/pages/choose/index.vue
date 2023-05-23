<template>
  <van-sticky>
    <NavHeader>
      <template v-slot:left>
       <span class="back hover f-12" @click="back">{{t('createAccountpage.back')}}</span>
      </template>
      <template v-slot:title>
        <div class="flex center title">{{t('bootstrapwindow.tOKENs')}}</div>
      </template>
    </NavHeader>
  </van-sticky>
  <div class="choose-list">
    <div class="list pt-16">
      <div class="search-box ml-14 mr-14 flex center-v between">
        <div class="flex center-v ipt-box pl-10">
          <van-icon name="search hover" />
          <van-field
            v-model="name"
            :placeholder="t('receive.search')"
          ></van-field>
        </div>
        <div
          class="close flex center pr-14 pt-10 pb-10 pl-10"
          v-show="name"
          @click="clear"
        >
          <van-icon name="cross" />
        </div>
      </div>

      <div class="index-list mt-16 mb-30" v-if="tokens.length">
        <van-index-bar sticky :sticky-offset-top="0" :index-list="indexList">
          <div v-for="(item, idx) in tokens" :key="idx">
            <van-index-anchor :index="item.label" />
            <TokenCard
              v-for="(child, idx) in item.children"
              :key="idx"
              :data="child"
              :toName="backUrl"
            />
          </div>
        </van-index-bar>
      </div>
      <div v-else class="no-box">
        <NoData />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { computed, reactive } from "vue";
import {
  Icon,
  Toast,
  Button,
  Sticky,
  Field,
  Dialog,
  IndexBar,
  IndexAnchor,
  Cell,
} from "vant";
import { useRoute, useRouter } from "vue-router";
import { defineComponent, Ref, toRaw, ref, watch, SetupContext,inject } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import AccountIcon from "@/components/accountIcon/index.vue";
import { getRandomIcon } from "@/utils/index";
import TokenCard from "@/views/account/components/tokenCard/index.vue";
import NavHeader from '@/components/navHeader/index.vue'
import NoData from '@/components/noData/index.vue'
export default {
  name: "choose-list",
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Field.name]: Field,
    [Sticky.name]: Sticky,
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
    [Cell.name]: Cell,
    AccountIcon,
    TokenCard,
    NavHeader,
    NoData
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const { query } = route;
    const { backUrl,clickBackUrl } = query;

    const replaceBackUrl = ref(clickBackUrl || '')

    const appProvide = inject('appProvide')
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
    const accountTokens = computed(
      () => store.getters["account/accountTokens"]
    );
    console.log("----------accountTokens", toRaw(accountTokens.value));
    console.log("----------myToken", myToken.value);
    const name = ref("");
    const alist = computed(() => {
      const tks = toRaw(accountTokens.value);
      // Split into two-dimensional arrays according to the first letter
      const list = [toRaw(myToken.value), ...tks].map((item: any) => item);
      list.sort((a: any, b: any) => {
        return (a.name + "").localeCompare(b.name + "");
      });
      console.log("list---", list);
      const newl = list.filter((item: any) => {
        if (name.value) {
          if (item.name.toUpperCase().indexOf(name.value.toUpperCase()) > -1) {
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

    let tokens = alist;

    const indexList = computed(() => {
      return tokens.value.map((item: any) => item.label);
    });

    const clear = () => {
      name.value = "";
    };
    const back = () => {
      router.replace({name : replaceBackUrl.value?.toString() || 'wallet'})
    }
    return {
      t,
      back,
      name,
      clear,
      tokens,
      indexList,
      myToken,
      accountTokens,
      backUrl: backUrl || "",
      appProvide,
      replaceBackUrl
    };
  },
};
</script>
<style lang="scss" scoped>
  :deep(){
    .van-field {
      padding:0;
      .van-field__body {
        border: none;
      }
    }
  }
.title {
  font-size: 16px;
    color: #000;
  font-weight: bold;
}
.choose-list {

  :deep(.van-index-anchor) {
    background: #f1f3f4;
    color: #aeaeae;
    line-height: 30px;
  }
  :deep(.van-index-bar__sidebar) {
    color: #909090;
    display: none;
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
    background: #9F54BA;
    color: #fff;
    border-radius: 9px;
  }
  * {
    box-sizing: border-box;
  }
  .list {
    height: calc(100vh - 48px - 16px);
    overflow-y: scroll;
  }
  .search-box {
    border: 1px solid #bbc0c5;
    border-radius: 5px;
    &:hover {
      border-color: #9F54BA;
    }
  }

  .ipt-box {
    width: 96%;
    i {
      color: #9F54BA;
      font-size: 22px;
    }
  }
  .close {
    width: 30px;
    i {
      font-size: 18px;
      color: #9F54BA;
    }
  }
}
</style>