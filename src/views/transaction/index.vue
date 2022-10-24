<template>
  <div class="transaction">
    <van-sticky>
      <NavHeader :hasRight="false" :title="$t('transaction.initiatetransaction')">
        <template v-slot:left>
          <van-icon name="arrow-left" class="back" @click="back" />
        </template>
      </NavHeader>
    </van-sticky>
    <div class="page-container">
      <van-form @failed="onFailed" @submit="submit">
        <van-cell-group>
          <!-- form addr-->
          <van-cell :title="$t('transaction.from')">
            <van-field
              v-model="from"
              class="clickActive"
              name="form"
              disabled
              type="textarea"
              @click="handleShowAccountModal(0)"
              placeholder="Form"
              right-icon="arrow"
              :rules="[{ validator, message: 'Form add' }]"
            />
          </van-cell>
          <!-- to addr-->
          <van-cell :title="$t('transaction.to')">
            <van-field
              v-model="to"
              type="textarea"
              name="to"
              :placeholder="$t('transaction.to')"
              :rules="[{ validator, message: t('transaction.malformedaddress')}]"
            />
          </van-cell>
          <!-- amount -->
          <van-cell :title="$t('transaction.numberoftransfers')">
            <van-field
              v-model="value"
              name="value"
              type="number"
              :placeholder="$t('transaction.value')"
              :rules="[
                { required: true, message: t('transaction.amount') },
                { validator: validatorVal, message: t('transaction.amountofmoney') },
              ]"
            />
          </van-cell>
          <van-cell :title="$t('transaction.parameter')">
            <van-field
              v-model="data"
              name="data"
              type="textarea"
              :autosize="{maxHeight:200}"
              :placeholder="$t('transaction.data')"
            />
          </van-cell>
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            :loading="loading"
            block
            type="primary"
            native-type="submit"
          >
            {{t('transaction.initiatetransaction')}}
          </van-button>
        </div>
      </van-form>
      <div class="t-tit">{{t('transaction.transactionreturn')}}</div>
      <div class="pre-box" v-if="transactiontx">
        <pre>{{ transactiontx }}</pre>
      </div>
      <van-empty v-else :description="$t('transaction.notransactionreturned')" />
      <div class="t-tit">{{t('transaction.receipt')}}</div>
      <div class="pre-box" v-if="receipt">
        <pre>{{ receipt }}</pre>
      </div>
      <van-empty v-else :description="$t('transaction.noreceiptyet')" />
    </div>
  </div>
  <AccountModal v-model:show="showModal" @close="closeModal" />
</template>
<script lang="ts">
import {
  Tab,
  Tabs,
  Popup,
  Icon,
  Dialog,
  Sticky,
  Toast,
  Loading,
  Empty,
  Form,
  Field,
  Cell,
  Button,
  CellGroup,
} from "vant";
import { ExchangeStatus, getWallet, TransactionReceipt, handleGetTranactionReceipt, TransactionTypes ,clone} from "@/store/modules/account";
import { utils } from "ethers";
import { toHex } from "@/utils/utils";
import { ref, Ref, reactive, onMounted, computed, toRaw } from "vue";
import NavHeader from "@/components/navHeader/index.vue";
import { useRoute, useRouter } from "vue-router";
import AccountModal from "@/components/accountModal/index.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n"
interface Tx {
  from: string;
  to: string;
  value: any;
  data?: string;
}

export default {
  components: {
    NavHeader,
    [Sticky.name]: Sticky,
    [Form.name]: Form,
    [Field.name]: Field,
    [Empty.name]: Empty,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    AccountModal,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const back = () => {
      router.back();
    };
    const store = useStore();
    const from = computed(() => store.state.account.accountInfo.address);
    const to = ref("");
    const value = ref(null);
    const data = ref("");
    const receipt = ref("");
    const transactiontx = ref("");
    const loading = ref(false);
    const idx = ref(0);
    const validator = (val: string) => {
      try {
        utils.getAddress(val);
        return true;
      } catch (err) {
        return false;
      }
    };
    const validatorVal = (val: number) => {
      if (val <= 0) {
        return false;
      } else {
        true;
      }
    };

    const onFailed = (errorInfo: any) => {
      console.log("failed", errorInfo);
    };
    const submit = async () => {
      loading.value = true;
      transactiontx.value = "";
      receipt.value = "";
      let wallet = await getWallet();
      const tx1: Tx = {
        from: from.value,
        to: to.value,
        value: utils.parseEther(value.value),
      };
      if (data.value) {
        const s = `${data.value}`
        const newStr = toHex(s);
        tx1["data"] = `0x${newStr}`;
      }
      localStorage.setItem('sendData', JSON.stringify(tx1))
      const network = clone(store.state.account.currentNetwork)

      wallet.sendTransaction(tx1).then((transactionTX: any) => {
        const { from, gasLimit, gasPrice, hash, nonce, to, type, value,error } = transactionTX;
        store.commit("account/PUSH_TXQUEUE", {
          hash,
          from,
          gasLimit,
          gasPrice,
          nonce,
          to,
          type,
          value,
          txType:TransactionTypes.default,
          transitionType: '11',
          network
        });
        transactiontx.value = transactionTX;
        wallet.provider.waitForTransaction(hash).then((res: any) => {
          receipt.value = res;
          loading.value = false;
          Toast(t('transaction.returnsuccess'));
        });
      }).catch((err:any) => {
        Toast(err.reason)
        loading.value = false
      })
    };
    const showModal: Ref<boolean> = ref(false);
    const handleShowAccountModal = (i: number) => {
      idx.value = i;
      showModal.value = true;
    };
    const closeModal = () => {
      showModal.value = false;
    };
    return {
      t,
      from,
      to,
      value,
      data,
      onFailed,
      validator,
      back,
      submit,
      showModal,
      handleShowAccountModal,
      closeModal,
      receipt,
      validatorVal,
      transactiontx,
      loading,
    };
  },
};

</script>
<style lang="scss" scoped>
.transaction {
  .back {
    font-size: 18px;
    color: rgba(3, 125, 214, 1);
  }
  :deep(.van-cell__title) {
    flex: inherit;
    width: 20%;
    display: flex;
    height: 44px;
    line-height: 44px;
  }
  :deep(.van-field__body) {
    align-items: start;
  }
  :deep(.van-field__control--min-height) {
    min-height: 24px;
    line-height: 1.15;
  }
  .t-tit {
    margin: 0 15px;
    font-size: 14px;
    color: #333;
  }
  .pre-box {
    overflow-x: scroll;
    font-size: 12px;
    margin: 15px;
    width: calc(100vw - 30px);
    border: #f1f1f1 1px solid;
    pre {
      width: fit-content;
      border: none;
    }
  }
}
</style>

