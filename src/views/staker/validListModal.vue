<template>
    <CommonModal :title="t('wallet.account')" v-model="showModal" className="validListModal">
        <div class="valid-list-modal">
            <van-field v-model="value1" label="" :placeholder="t('validator.placeholder')">
                <template #right-icon>
                    <i class="iconfont icon-xiajiantou f-14"></i>
                </template>
            </van-field>
            <div class="valid-list scrollBar" @scroll="scrollList">
                <div v-for="item in list" :key="item.useraddr" :class="`flex valid-card pl-10 pr-10 pt-12 pb-12 ${item.selected ? 'selected' : ''}`" :title="item.useraddr" @click="handleSelect(item)">
                    <div class="flex center">
                        <AccountIcon :data="item.icon" />
                    </div>
                    <div class="info flex column between ml-8 flex-1">
                        <div class="flex between">
                            <div class="flex center">
                                <img class="expresion" v-if="item.iconClass == 'smile'" src="@/assets/smile.png" alt="" />
                                <img class="expresion" v-if="item.iconClass == 'sad'" src="@/assets/sad.png"  alt="" />
                                <img class="expresion"  v-if="item.iconClass == 'neutral'" src="@/assets/neutral.png" alt="" />
                            </div>
                            <div>{{ item.Pledged }} ERB</div>
                        </div>
                        <div class="addr text-left van-ellipsis">{{ item.useraddr }}</div>
                    </div>
                </div>
                <div class="pt-10  flex center" v-show="loading" >
                    <van-loading color="#9F54BA" size="22">{{ t('wallet.loading') }}</van-loading>
                </div>
                <NoData v-if="!list.length && !loading" class="pb-20" />
            </div>
            <div class="validator-btns pb-24 pt-24">
                <van-button class="mr-26" @click="cancelClick">{{ t('common.cancel') }}</van-button>
                <van-button type="primary" @click="handleConfirm" :loading="btnLoading">{{ t('common.confirm') }}</van-button>
            </div>
        </div>
    </CommonModal>
</template>

<script lang="ts" setup>
import AccountIcon from "@/components/accountIcon/index.vue";
import NoData from '@/components/noData/index.vue'
import CommonModal from '@/components/commonModal/index.vue'
import { watch, ref, onMounted, computed, nextTick } from 'vue';
import { Field as VanField, Button as VanButton, Skeleton as VanSkeleton, Loading as VanLoading } from 'vant';
import { useStore } from "vuex";
import { getWallet } from "@/store/modules/account";
import { ethers } from "ethers";
import { getRandomIcon } from "@/utils";
import BigNumber from "bignumber.js";
import { useI18n } from "vue-i18n";
import { useToast } from "@/plugins/toast";
import { getValidatorInfo, ValidParams } from '@/http/modules/staker'

const { t } = useI18n()
const { state } = useStore()
const accountInfo = computed(() => state.account.accountInfo)
const showModal = ref(false)
const value1 = ref()
const loading = ref(false)
const finished = ref(false)
const props = defineProps({
    title: String,
    modelValue: Boolean
})
const emits = defineEmits(['update:modelValue', 'confirm'])
watch(() => props.modelValue, n => {
    console.warn('watch modelvalue', n)
    showModal.value = n
    if (n) {
        getList()
    }
}, {
    immediate: true,
    deep: true
})
watch(() => showModal.value, n => {
    if (!n) {
        emits('update:modelValue')
        nextTick(() => {
            cancelClick()
        })
    } 
})

const list = ref([])

const params: ValidParams = {
    count: "10",
    index: "0"
}
const getIconClass = (v: any) => {
      const num = Number(v)
      if (num < 40) return "sad";
      if (num >= 40 && num <= 50) return "neutral";
      if (num > 50) return "smile";
}
const getList = async () => {
    console.log('get list',loading.value, finished.value)
    if(loading.value || finished.value){
        return
    }
    loading.value = true
    try {
        const { data } = await getValidatorInfo(params)
        params.index = Number(params.index) + 10 + ''
        console.warn('d', data)
        list.value.push(...(data && data.length ? data : []).map((item: any) => {
            //The field of Pledged's unit is GWEI
            return { ...item, icon: getRandomIcon(), iconClass:getIconClass(item.coefficient),Pledged: new BigNumber(item.Pledged).div(1000000000).toNumber() }
        }))
        console.warn('list.value', list.value)
        if (!data || data.length < 10) {
            finished.value = true
        }

    } finally {
        loading.value = false
    }
}

onMounted(() => {

})
const scrollList = (e: any) => {
    const cHeight = e.target.clientHeight
    const sTop = e.target.scrollTop
    const sHeight = e.target.scrollHeight
    if(((cHeight + sTop + 20) > sHeight) && !loading.value && !finished.value) {
        getList()
    }
}
const handleSelect = (e: any) => {
    list.value.forEach(item => {
        if (item.useraddr.toUpperCase() == e.useraddr.toUpperCase()) {
            item.selected = true
            value1.value = e.useraddr
        } else {
            item.selected = false
        }
    })
}
const { $toast } = useToast()
const btnLoading = ref(false)
const handleConfirm = async() => {
    if (!value1.value) {
        $toast.fail(t('validator.addressErr'))
        return
    }
    btnLoading.value = true
    try {
        ethers.utils.getAddress(value1.value)
        const wallet = await getWallet()
        const acc = await wallet.provider.send('eth_getAccountInfo',  [value1.value, "latest"])
        console.warn('acc', acc)
        const PledgedBalance = acc.Worm?.PledgedBalance ? new BigNumber(acc.Worm?.PledgedBalance).div(1000000000000000000).toNumber() : 0
        if(PledgedBalance < 700 && accountInfo.value.address.toUpperCase() != value1.value.toUpperCase()) {
            $toast.warn(t('validator.fromPledgeErr'))
            return
        }
        emits('confirm', {
            Balance: PledgedBalance,
            Coefficient: acc.Worm?.Coefficient,
            Addr: value1.value,
            icon: getRandomIcon(),
            isValidator: new BigNumber(PledgedBalance).gte(70000),
            ethAccountInfo: acc
        })
        showModal.value = false
    } catch (err) {
        console.error(err)
        $toast.fail(t('transaction.malformedaddress'))
    } finally {
        btnLoading.value = false
    }

}

const cancelClick = () => {
    showModal.value = false
    finished.value = false
    params.index = '0'
    let time = setTimeout(() => {
        list.value = []
        clearTimeout(time)
    }, 300);
}
</script>
<style lang="scss" scoped>
.valid-list {
    max-height: 226px;
    border-radius: 5px;
    margin: 10px;
    border: 1px solid #B3B3B3;
    min-height: 226px;
    overflow-y: scroll;

    .valid-card {
        height: 60px;
        box-sizing: border-box;
        cursor: pointer;
        color: #838383;
        transition: ease .26s;

        &:hover {
            background-color: #F8F3F9;
        }

        &.selected {
            background: #F8F3F9;

            .info {
                color: #9F54BA;

                .addr {
                    color: #9F54BA;
                }
            }
        }

        .expresion {
            width: 12px;
            display: block;
        }

        .info {
            width: 75%;

            .addr {
                width: 100%;
            }
        }
    }
}

:deep() {
    .van-cell {
        padding: 16px 10px 5px;

        &::after {
            display: none;
        }
    }

    .van-button {
        min-width: 100px;
    }
}
</style>