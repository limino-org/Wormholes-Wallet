<template>
  <div class="account-list-component van-hairline--top">
    <van-index-bar sticky :sticky-offset-top="offsetTop" :index-list="indexList" v-if="indexList.length">
      <div v-for="(item, idx) in accountList" :key="idx">
        <van-index-anchor :index="item.label" />
        <div
          class="
            account-list-component-card
            pt-14
            pb-14
            flex
            clickActive
          "
          v-for="child in item.children"
          :key="child.address"
          @click="handleClick(child)"
        >
          <div class="flex center">
            <div class="icon flex center">
              <AccountIcon :data="child.icon" />
            </div>
          </div>
          <div class="info flex column between">
            <div class="name lh-20">{{ child.name }}</div>
            <div class="address lh-20">{{ child.address }}</div>
          </div>
        </div>
      </div>
    </van-index-bar>
    <NoData v-else />
  </div>
</template>
<script lang="ts">
import NoData from '@/components/noData/index.vue';
import { defineComponent, SetupContext, computed } from "vue";
import { IndexBar, IndexAnchor } from "vant";
import AccountIcon from "@/components/accountIcon/index.vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "accountListComponent",
  components: {
    AccountIcon,
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
    NoData
  },
  props: {
    indexList: {
      type: Array,
      default: [],
    },
    accountList: {
      type: Array,
      default: [],
    },
    offsetTop: {
      type: Number,
      default : 0
    }
  },
  setup(props: any, context: SetupContext) {
    const store = useStore();
    const { emit } = context;
    const handleClick = (item: any) => {
      emit("handleClick", item);
    };
    return {
      handleClick,
    };
  },
});
</script>
<style lang="scss" scoped>

:deep(.van-index-anchor) {
    background: #f1f3f4;
    color: #aeaeae;
    line-height: 30px;
  }
  :deep(.van-index-bar__sidebar){
    color: #909090;
    right: 8px;
  }
    :deep(.van-index-bar__index){
      width: 18px;
      height: 18px;
      text-align: center;
      line-height: 18px;
      margin-bottom: 4px;
      padding: 0;
    }
  :deep(.van-index-bar__index--active){
    background: #9F54BA;
    color: #fff;
    border-radius: 9px;
  }
.account-list-component {
  &-card {
    padding-left: 15px;
    padding-right: 15px;
    transition: ease 0.3s;
    border-bottom: 1PX solid rgba($color: #B3B3B3, $alpha: 0.5);
    &:hover {
      background: #F8F3F9;
      color:#9F54BA;
      .info .address {
        color:#9F54BA;
      }
    }
    .icon {
      width: 31px;
      height: 31px;
      border-radius: 50%;
      overflow: hidden;
    }
    .info {
      margin-left: 6px;
      width: 300px;
      .name {
        font-size: 12px;
      }
      .address {
        font-size: 12px;
        color: rgba(121, 121, 121, 1);
      }
    }
  }
}
</style>