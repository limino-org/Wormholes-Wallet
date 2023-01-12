<template>
  <div
    class="netword-card flex  clickActive van-hairline--bottom"
    @click.stop="handleClick"
  >
    <div class="net-status flex center mr-16" v-if="hasSelect">
      <i
        :class="`iconfont f-14 ${
          select ? 'icon-xuanzhong1' : 'icon-danxuanxuanzhong'
        }`"
      ></i>
    </div>

    <div :class="`net-name flex between`">
      <div :class="`flex center-v ${!hasSelect ? 'between full' : ''} ${select? 'select' : ''}`">
        <div class="flex">
          <div class="flex center mr-6" style="margin-top:-2px;">
            <NetIcon :index="data.icon.index" size="15"  :color="select && hasSelect ? '#037CD6' : '#000'" />
        </div>
        <span>{{ data.label }} {{ t("networklist.network") }}</span>
        </div>
      <i
        v-if="hasModif"
        @click.stop="handleModif"
        class="iconfont icon-bianji"
      ></i>
      </div>
      <!-- <div class="flex center-v right rightIcon" v-show="select && hasSelect">
        <i class="iconfont icon-duihao"></i>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
import {
  toRefs,
  defineComponent,
  SetupContext,
  watch,
  Ref,
  ref,
  computed,
} from "vue";
import { Icon } from "vant";
import { getRandomColor } from "@/utils";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import NetIcon from "@/components/netIcon/index.vue";
export default defineComponent({
  components: {
    [Icon.name]: Icon,
    NetIcon
  },
  emits: ["handleClick", "handleModif"],
  props: {
    data: {
      type: Object,
      default: {},
    },
    // Is there a selection ICON
    hasSelect: {
      type: Boolean,
      default: true,
    },
    // Whether there is an edit icon
    hasModif: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context: SetupContext) {
    const { t } = useI18n();
    const store = useStore();
    const { emit } = context;
    const handleClick = () => {
      emit("handleClick", props.data);
    };

    const handleModif = () => {
      emit("handleModif", props.data);
    };
    const select = computed(() => {
      const currentNetwork = store.state.account.currentNetwork;
      if (currentNetwork.id == props.data.id) {
        return true;
      }
      return false;
    });
    return {
      t,
      getRandomColor,
      handleClick,
      handleModif,
      select,
    };
  },
});
</script>
<style lang="scss">
.netword-card {
  padding: 0 13px;
  height: 46px;
  transition: ease 0.3s;
  .full {
    width: 100%;
  }
  &:hover {
    background: rgb(244, 247, 250);
  }
  .net-status {
    width: 20px;
    color: #ccc;
    i {
      color: #037DD6;
      font-size: 16px;
    }
    i.icon-xuanzhong1 {
      font-size: 18px;
    }
  }
  .net-name {
    line-height: 52px;
    width: 100%;
    font-size: 12px;
    & .select {
      color: #037DD6;
    }
    i {
      color: #bababa;
      font-size: 12px;
      padding: 5px;
    }
  }
  .net-icon {
    margin-left: 18px;
    &-box {
      width: 13px;
      height: 13px;
      border-radius: 50%;
    }
  }
  .rightIcon i{
    color: rgb(13, 215, 13);
    font-size: 14px;
  }
}
</style>
