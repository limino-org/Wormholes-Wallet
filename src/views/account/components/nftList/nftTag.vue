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
          <div   v-show="data.pidx || data.pidx == 0" class="tag-circle P" @mouseover="showPopover3 = true" @mouseout="showPopover3 = false" >
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
            class="tag-circle C"
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
          class="tag-circle N"
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
            class="tag-circle F"
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

// S-NFT L0 、S-NFT L1、L2、L3
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
    min-width: 16px;
    height: 16px;
    // font-family: KenneyPixel;
    font-size: 14px;
    color: #fff;
    padding: 0 14px 0 7px;
    border-radius: 3px;
    // transform: translateX(7px);
    margin-right: -7px;
    position: relative;
    &.P {
      background: $L3Color;
      &::after {
        content: "";
        display: block;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background: $L3Color;
        position: absolute;
        right: 5px;
        z-index: 1;
        top: 6px;
      }
    }
    &.C {
      background: $L2Color;
      &::after {
        content: "";
        display: block;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background: $L2Color;
        position: absolute;
        right: 5px;
        z-index: 1;
        top: 6px;
      }
    }
    &.N {
      background: $L1Color;
      &::after {
        content: "";
        display: block;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background: $L1Color;
        position: absolute;
        right: 5px;
        z-index: 1;
        top: 6px;
      }
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
  .van-popover__wrapper {
    &:nth-last-of-type(1) {
        .tag-circle {
            border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      padding: 0 7px;
        }
    }
  }
}
</style>