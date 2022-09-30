<template>
  <div class="page-currency-list">
    <van-sticky>
      <NavHeader :hasRight="false" :title="$t('wallet.addtoken')">
        <template v-slot:left>
          <van-icon name="arrow-left" class="back" @click="back" />
        </template>
      </NavHeader>
    </van-sticky>
    <div class="page-container">
      <ChooseTokenCard
        v-for="item in tokens"
        :key="item.tokenContractAddress"
        :data="item"
        @handleClick="hancleChoose"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import {
  Sticky,
  Icon,
  Form,
  Field,
  Button,
  Cell,
  CellGroup,
  Dialog,
  Toast,
} from "vant";
import NavHeader from "@/components/navHeader/index.vue";
import ChooseTokenCard from "@/views/account/components/chooseTokenCard/index.vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { getWallet } from "@/store/modules/account";
import { useStore } from "vuex";
export default {
  name: "page-currency-list",
  components: {
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Form.name]: Form,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    NavHeader,
    ChooseTokenCard,
  },
  setup() {
    const { t } = useI18n();
    const tokens = require("@/assets/json/tokens.json");
    const router = useRouter();
    const { dispatch } = useStore();
    const back = () => {
      router.go(-1);
    };
    const hancleChoose = (data: any) => {
      console.log("token", data);
      Dialog.confirm({
        message: t("currencyList.sure"),
      }).then(async () => {
        // Add the current token to the tokens of the current account
        const { address } = await getWallet();
        const {
          name,
          symbol,
          logoUrl,
          precision,
          tokenType,
          tokenContractAddress,
        } = data;
        try {
          await dispatch("account/addToken", {
            name,
            symbol,
            logoUrl,
            precision,
            tokenType,
            tokenContractAddress,
            address,
          });
          Toast(t("currencyList.Importsuccessful"));
          router.replace({name:'wallet'})
        } catch (err) {
          Toast (t("currencyList.error"));
        }
      });
    };
    return {
      t,
      back,
      tokens,
      hancleChoose,
    };
  },
};
</script>
<style lang="scss" scoped>
.page-currency-list {
  .back {
    font-size: 18px;
  }
  .tit {
    font-size: 18px;
    margin-top: 10px;
    line-height: 36px;
    border-bottom: 2px solid #0287db;
  }
}
</style>