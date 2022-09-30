<template>
  <van-dialog
    v-model:show="showModal"
    show-cancel-button
    :showConfirmButton="false"
    :showCancelButton="false"
    teleport="#page-box"
    closeOnClickOverlay
  >
    <div class="title">{{ t("wallet.account") }}</div>
    <div class="account-list">
      <div
        :class="`card flex between hover ${
          item.address.toUpperCase() == selectAccount.address.toUpperCase()
            ? 'active'
            : ''
        }`"
        v-for="item in accountList"
        @click.stop="handleSelect(item)"
        :key="item.address"
      >
        <div class="card-info flex">
          <div class="userIcon flex center">
            <AccountIcon size="small" :data="item.icon" />
          </div>
          <div class="acc-info flex column between">
            <div class="name f-14 text-bold">{{ item.name }}</div>
            <div class="address f-12">{{ item.address }}</div>
          </div>
        </div>
        <!-- <div class="icon-box flex center">
          <i
            class="iconfont icon-duihao2"
            v-if="
              item.address.toUpperCase() == selectAccount.address.toUpperCase()
            "
          ></i>
        </div> -->
      </div>
    </div>
  </van-dialog>
</template>
<script lang="ts" setup>
import { computed, onMounted, Ref, ref, watch } from "vue";
import { Dialog, Icon as vanIcon, Popup as vanPopup } from "vant";
import AccountIcon from "@/components/accountIcon/index.vue";
import { useStore } from "vuex";
import { AccountInfo, getWallet } from "@/store/modules/account";
import { useI18n } from "vue-i18n";
const { state } = useStore();
const { t } = useI18n();
const accountList = computed(() => state.account.accountList);
const VanDialog = Dialog.Component;
const props = defineProps({
  modelValue: Boolean,
});
console.warn("props", props.modelValue);
const emits = defineEmits(["update:modelValue", "onChange"]);
const showModal: Ref<boolean> = ref(false);
const selectAccount: Ref<AccountInfo | any> = ref({});
watch(
  () => props.modelValue,
  (n) => {
    showModal.value = n;
  }
);
watch(
  () => showModal.value,
  (v) => {
    console.warn("emit", v);
    emits("update:modelValue", v);
  }
);

const handleSelect = (item: AccountInfo) => {
  selectAccount.value = item;
  emits("onChange", item);
  showModal.value = false;
};

onMounted(async () => {
  const wallet = await getWallet();
  const account = accountList.value.find(
    (item: any) => item.address.toUpperCase() == wallet.address.toUpperCase()
  );
  selectAccount.value = account;
});
</script>
<style lang="scss" scoped>
.title {
  line-height: 60px;
  background: #f8fcff;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
}
.account-list {
  max-height: 40vh;
  overflow-y: scroll;
  padding: 20px 0 48px 0;
  .card {
    padding: 16px 15px;
    border-bottom: 1px solid #ecedef;
    transition: ease .3s;
    &:hover {
      .acc-info {
        .name,
        .address {
          color: #037dd6;
        }
      }
    }
    &.active {
      .acc-info {
        .name,
        .address {
          color: #037dd6;
        }
      }
    }
    .acc-info {
      margin-left: 15px;

      .address {
        color: #838383;
        letter-spacing: -0.6px;
      }
    }
  }
  .userIcon {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid #979797;
    overflow: hidden;
  }
}
</style>