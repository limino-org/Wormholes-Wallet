<template>
    <div class="nft-tag">
        <van-popover v-model:show="showPopover" placement="top-end" class="nft-tag-popover">
            <div class="lh-16 text-center ">{{text}}</div>
            <template #reference>
        <div class="flex between center-v" @mouseover="showPopover = true" @mouseout="showPopover = false">
            <div :class="`tag-circle ${tag == 'P' ? 'active' : 'disabled'}`"></div>
            <div :class="`tag-circle ${(tag == 'P' || tag == 'C') ? 'active' : 'disabled'}`"></div>
            <div :class="`tag-circle ${(tag == 'P' || tag == 'C' || tag == 'N') ? 'active' : 'disabled'}`"></div>
            <div :class="`tag-circle ${(tag == 'P' || tag == 'C' || tag == 'N' || tag == 'F') ? 'active' : 'disabled'}`"></div>
        </div>
        </template>
        </van-popover>
    </div>
</template>
<script lang="ts" setup>
import {computed, defineProps, ref} from 'vue'
import {Popover as vanPopover} from 'vant'
import { useI18n } from 'vue-i18n'
const {t} = useI18n()
// P C N F
const props = defineProps({
    tag: {
        type: String,
        default: 'F'
    },
})

// S-NFT L0 、S-NFT L1、L2、L3
const text = computed(() => {
    switch(props.tag){
        case 'F':
            return 'S-NFT L0'
        case 'N':
            return 'S-NFT L1'
        case 'C':
            return 'S-NFT L2'
        case 'P':
            return 'S-NFT L3'
    }
})

const showPopover = ref(false)
</script>
<style lang="scss" scoped>
.nft-tag {
    padding: 2px 3px;
    background: #EBF9EE;
    width: 42px;
    height: 10px;
    border-radius: 7.5px;
    cursor: pointer;
    :deep(.van-popover__wrapper) {
        width: 100%;
        display: block;
    }
    .tag-circle {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        &.disabled {
            background: #BBC0C5;
        }
        &.active {
            background: #3AAE55;
        }
    }
}
</style>