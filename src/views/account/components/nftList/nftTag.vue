<template>
  <div class="nft-tag">
    <div
      class="flex between center-v"

    >
      <van-popover
        v-model:show="showPopover3"
        placement="top"
        class="nft-tag-popover"
      >
        <div class="lh-16 text-center">L3</div>
        <template #reference>
          <div v-show="data.pidx || data.pidx == 0"  :class="`tag-circle P ${!data.cidx && data.cidx != 0 ? 'last' : ''}`"
 @mouseover="showPopover3 = true" @mouseout="showPopover3 = false" >
            {{ data.pidx }}
          </div>
        </template>
      </van-popover>
      <van-popover
        v-model:show="showPopover2"
        placement="top"
        class="nft-tag-popover"
      >
        <div class="lh-16 text-center">L2</div>
        <template #reference>
          <div
          v-show="data.cidx || data.cidx == 0"
          @mouseover="showPopover2 = true" @mouseout="showPopover2 = false"
          :class="`tag-circle C ${!data.nidx && data.nidx != 0 ? 'last' : ''}`"
          >
            {{ data.cidx }}
          </div>
        </template>
      </van-popover>
      <van-popover
        v-model:show="showPopover1"
        placement="top"
        class="nft-tag-popover"
      >
        <div class="lh-16 text-center">L1</div>
        <template #reference>
          <div
          v-show="data.nidx || data.nidx == 0"
          @mouseover="showPopover1 = true" @mouseout="showPopover1 = false"
          :class="`tag-circle N ${!data.fidx && data.fidx != 0 ? 'last' : ''}`"
          >
            {{ data.nidx }}
          </div>
        </template>
      </van-popover>
      <van-popover
        v-model:show="showPopover"
        placement="top"
        class="nft-tag-popover"

      >
        <div class="lh-16 text-center">L0</div>
        <template #reference>
          <div
          v-show="data.fidx || data.fidx == 0"
          @mouseover="showPopover = true" @mouseout="showPopover = false"
          class="tag-circle F last"
          >
            {{ data.fidx }}
          </div>
        </template>
      </van-popover>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { Popover as vanPopover } from "vant";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
// P C N F
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  tag: {
    type: String,
    default: "F",
  },
});

// SNFT L0 、SNFT L1、L2、L3
const text = computed(() => {
  switch (props.tag) {
    case "F":
      return "L0";
    case "N":
      return "L1";
    case "C":
      return "L2";
    case "P":
      return "L3";
  }
});

const showPopover = ref(false);
const showPopover1 = ref(false);
const showPopover2 = ref(false);
const showPopover3 = ref(false);
</script>
<style lang="scss" scoped>
$L0Color: #037dd6;
$L1Color: #3aae55;
$L2Color: #f7bf03;
$L3Color: #d73a49;
.nft-tag {
  padding: 2px 3px;
  border-radius: 7.5px;
  cursor: pointer;
//   :deep(.van-popover__wrapper) {
//     width: 100%;
//     display: block;
//   }
  .tag-circle {
    width: 30px;
    padding:0 4px;
    text-align: center;
    height: 16px;
    line-height: 16px;
    // font-family: KenneyPixel;
    font-size: 14px;
    color: #fff;
    border-radius: 3px;
    // transform: translateX(7px);
    margin-right: 3px;
    position: relative;
    &.last {

    }
    &.P {
      background: $L3Color;
    }
    &.C {
      background: $L2Color;
    }
    &.N {
      background: $L1Color;

    }
    &.F {
      background: $L0Color;
    }
    &.disabled {
      // display: none;
    }
    &.active {
    }

  }

}
</style>