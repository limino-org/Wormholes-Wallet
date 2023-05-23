<template>
  <div class="account-list-component van-hairline--top">
    <div
      class="van-hairline--bottom account-list-component-card flex clickActive"
      v-for="item in accountList"
      :key="item.address"
      @click="handleClick(item)"
    >
      <div class="flex center">
        <div class="icon">
          <AccountIcon size="mini" :data="item.icon" />
        </div>
      </div>
      <div class="info flex column between">
        <div class="name">{{ item.name }}</div>
        <div class="address">{{ addressMask(item.address) }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, SetupContext, computed } from "vue";
import AccountIcon from "@/components/accountIcon/index.vue";
import { addressMask } from "@/utils/filters";
import { useStore } from "vuex";
export default defineComponent({
  name: "accountListComponent",
  components: {
    AccountIcon,
  },
  setup(props: any, context: SetupContext) {
    const store = useStore();
    const { emit } = context;
    const accountList = computed(() => store.state.account.accountList);
    const handleClick = (item: any) => {
      emit("handleClick", item);
    };
    return {
      accountList,
      addressMask,
      handleClick,
    };
  },
});
</script>
<style lang="scss" >
.account-list-component {
  &-card {
    height: 60px;
    padding: 0 15px;
    transition: ease 0.3s;
    &:hover {
      background: rgb(244, 247, 250);
    }
    .icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid #9F54BA;
      overflow: hidden;
    }
    .info {
      padding-left: 10px;
      width: 300px;
      padding: 15px 0 15px 10px;
      .name {
        font-size: 12px;
        font-weight: bold;
        line-height: 12px;
      }
      .address {
        font-size: 12px;
        line-height: 10px;
        color: rgba(121, 121, 121, 1);
      }
    }
  }
}
</style>