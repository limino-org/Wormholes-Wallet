<template>
  <div class="page-addtokens">
    <van-sticky>
      <NavHeader :hasRight="false" :title="$t('wallet.addtoken')">
        <template v-slot:left>
          <van-icon name="arrow-left" class="back" @click="back" />
        </template>
      </NavHeader>
    </van-sticky>
    <div class="page-content">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <div class="title-label">{{t('addtokens.contractAdd')}}</div>
          <van-field
            submit-on-enter
            v-model="tokenContractAddress"
            name="contract"
            :placeholder="$t('addtokens.contractAddeg')"
            :rules="[{ required: true, message: t('addtokens.message') }]"
          />
        </van-cell-group>
        <div class="form-button flex between">
          <van-button round block type="default" @click="empty"
            >{{t('addtokens.cancel')}}</van-button
          >
          <van-button round block type="primary" native-type="submit"
            >{{t('addtokens.import')}}</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script lang='ts'>
import { ref, Ref, computed, toRaw, SetupContext, onMounted } from "vue";
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
import { getWallet } from "@/store/modules/account";
import ChooseTokenCard from "@/views/account/components/chooseTokenCard/index.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useBroadCast } from '@/utils/broadCast'

export default {
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
    const router = useRouter();
    const { dispatch } = useStore();
    const precision: Ref<string> = ref("");
    const name: Ref<string> = ref("");
    const symbol: Ref<string> = ref("");
    const tokenContractAddress: Ref<string> = ref("");
    const { handleUpdate } = useBroadCast()
    const back = () => {
      router.go(-1);
    };
    const empty = () => {
      precision.value = "";
      name.value = "";
      symbol.value = "";
      tokenContractAddress.value = "";
      router.go(-1);
    };
    const onSubmit = (data: any) => {
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
        handleUpdate()
        Toast(t("currencyList.Importsuccessful"));
          router.replace({ name: "wallet" });
        } catch (err) {
          Toast(err.toString());
        }
      });
    };
    return {
      t,
      back,
      empty,
      precision,
      name,
      symbol,
      tokenContractAddress,
      onSubmit,
    };
  },
};
</script>

<style lang='scss' scoped>
.page-addtokens {
  .back {
    font-size: 18px;
  }
  .tit {
    font-size: 18px;
    margin-top: 10px;
    line-height: 36px;
    border-bottom: 2px solid #0287db;
  }
  .page-content {
    .title {
      width: 345px;
      height: 56px;
      background-color: #F8F3F9;
      margin: 0 auto;
      font-size: 14px;
      align-items: center;
      .warning-icon {
        margin-left: 15px;
      }
      .create-title {
        margin-left: 10px;
      }
    }
  }
  .title-label {
    margin: 17px 15px;
    font-size: 12px;
    font-weight:700
  }
  .form-button {
    display: flex;
    margin: 50px 16px;
    button:nth-of-type(1) {
      margin-right: 20px;
    }
  }
}
</style>