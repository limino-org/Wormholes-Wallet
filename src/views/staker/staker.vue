<template>
    <NavHeader :title="t('validator.pageTit')" :hasRight="false">
        <template v-slot:left>
            <span class="back" @click="back">{{t('common.back')}}</span>
        </template>
    </NavHeader>
    <div class="staker-validator-page">
        <div class="staker-card">
            <div class="label lh-28 flex center-v">
                <span>{{ t('createExchange.exchange') }}</span>
                <van-popover v-model:show="stakerModal" theme="dark" placement="bottom-start">
                    <p class="pl-10 pr-10">{{ t("sendto.gastit") }}</p>
                    <template #reference>
                        <van-icon name="question hover" @mouseover="stakerModal = true" @mouseleave="stakerModal = false" />
                    </template>
                </van-popover>
            </div>
            <div class="stakerAddr pl-8 pr-8 pt-16 pb-16 flex  position relative" @click="showAccountModal = true">
                <div class="flex cenetr">
                    <AccountIcon :data="accountInfo.icon" />
                </div>
                <div class="flex-1 ml-10 flex column between">
                    <div>{{ accountInfo.name }}</div>
                    <div class="addr">{{ accountInfo.address }}</div>
                </div>
                <!-- icon-shangjiantou icon-xiajiantou -->
                <i class="iconfont icon-xiajiantou f-14"></i>
            </div>
            <div class="label lh-28  flex center-v">
                <span>Validators</span>
                <van-popover v-model:show="validModal" theme="dark" placement="bottom-start">
                    <p class="pl-10 pr-10">{{ t("sendto.gastit") }}</p>
                    <template #reference>
                        <van-icon name="question hover" @mouseover="validModal = true" @mouseleave="validModal = false" />
                    </template>
                </van-popover>
            </div>
            <div class="valist">
                <ValidCard v-for="item in stakerExtensions" :key="item.Addr" :data="item" :title="item.Addr" @handleClick="handleClick(item)" />
                <div class="flex between  pt-10 " v-if="coefficient < 70 && isValidator">
                    <div class="lh-14 flex center-v pr-10 neutral ">{{ t('minerspledge.resetBtnTip', { value: resetWeightNum }) }}</div>
                    <div class="flex center">
                        <div class="add-btn flex center hover" @click="handleShowReconveryModal">
                            <i class="iconfont icon-icplus mr-4"></i><span> {{ t('common.recovery') }} </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="add-valid-btn flex center mt-12 mb-12" @click="showValidModal = true"><van-icon name="plus" class="mr-8" />{{ t('validator.addValids') }}</div>
        </div>
        <div class="van-hairline--top"></div>
        <div class="staker-card pt-8">
            <div class="label lh-28  flex center-v">
                <span>{{t('validator.totalStaking')}}</span>
                <van-popover v-model:show="totalModal" theme="dark" placement="bottom-start">
                    <p class="pl-10 pr-10">{{ t("common.exchange_pledge") }}</p>
                    <template #reference>
                        <van-icon name="question hover" @mouseover="totalModal = true" @mouseleave="totalModal = false" />
                    </template>
                </van-popover>
            </div>
            <div class="staker-con flex center-v">
                <span>{{ totalPledgeAmount }}ERB</span>
            </div>
        </div>
        <div class="van-hairline--top"></div>
        <div class="staker-card pt-8">
            <div class="label lh-28  flex center-v">
                <span>{{t('validator.amount')}}</span>
                <van-popover v-model:show="amountModal" theme="dark" placement="bottom-start">
                    <p class="pl-10 pr-10">{{ t("sendto.gastit") }}</p>
                    <template #reference>
                        <van-icon name="question hover" @mouseover="amountModal = true" @mouseleave="amountModal = false" />
                    </template>
                </van-popover>
            </div>
            <div class="staker-con flex center-v">
                <span>{{ amount }}ERB</span>
            </div>
            <div class="pl-10 pr-10">
                <el-slider v-model="value2" @change="handleSliderChange" :max="sliderMaxNum" :step="1" :min="0" :marks="marks" class="lider-ipt" />
            </div>
            <van-form @submit="onSubmitAddNumber" ref="formDom">
                <div :class="`${isError ? 'error' : ''} mt-10`">
                    <van-field maxlength="25" v-model="addNumber" class="text" @blur="handleAddBlur" type="number" :placeholder="t('bourse.placeamount')">
                        <template #right-icon>
                            <span style="font-weight: bold; font-size: 16px; color: #000">ERB</span>
                        </template>
                    </van-field>
                </div>
            </van-form>
        </div>
        <div class="flex evenly mt-24 mb-24 btnBox" v-if="isStaker">
            <van-button @click="handleMinusClick" :disabled="freezeStatus">
                <el-tooltip
              popper-class="tooltip2"
              class="box-item"
              effect="dark"
              :content="t('minerspledge.closeTip2')"
              placement="top"
              trigger="hover"
            >
                <div  :class="`hover redeemBtn ${freezeStatus ? ' disabled' : ''}`">
                    {{ t('createExchange.pledgeRed') }}
                </div>

                </el-tooltip>
            
            </van-button>
            <van-button type="primary" @click="handleAddClick">{{ t('bourse.addTit') }}</van-button>
        </div>
        <div class="flex evenly mt-24 mb-24" v-else>
            <van-button type="primary" block @click="handleAddClick">{{ t('validator.pageTit') }}</van-button>
        </div>
    </div>

    <ActionSheet v-model="showAccountModal" :hasBtn="false" />
    <ValidListModal v-model="showValidModal" @confirm="childConfirm" @cancel="showValidModal = false" @error="handleMinusError" />
    <MinusStackDialog v-model:show="showMinusDialog" @confirm="minusConfirm" :to="toAddr" :minusNumber="addNumber" :amount="totalPledgeAmount" />
    <CommonModal v-model="showReconveryModal" :title="t('validator.recoveryCred')">
        <ReconveryDetail @cancel="showReconveryModal = false" @confirm="reconveryConfirm" :data="reconveryDetail"  />
    </CommonModal>
    <AddStackDialog :address="accountInfo.address" :to="toAddr" :amount="totalPledgeAmount" :addNumber="addNumber" v-model:show="showAddDialog" @error="handleAddError" @open="addStakeConfirm" />
</template>
<script lang="ts" setup>

import NavHeader from "@/components/navHeader/index.vue";
import AccountIcon from "@/components/accountIcon/index.vue";
import ValidCard from "@/views/staker/validCard.vue";
import ActionSheet from "@/views/account/wallet/action-sheet.vue";
import ValidListModal from "@/views/staker/validListModal.vue";
import MinusStackDialog from "@/views/account/miners/miuns-stack-dialog.vue";
import AddStackDialog from "@/views/account/miners/add-affirm-dialog.vue";
import ReconveryDetail from "@/views/account/miners/components/reconveryDetail.vue";
import CommonModal from '@/components/commonModal/index.vue'

import { ElSlider, ElTooltip } from "element-plus";
import { Icon as VanIcon, Form as VanForm, Field as VanField, Button as VanButton, Popover as VanPopover, Loading as VanLoading, Toast } from 'vant'
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import BigNumber from "bignumber.js";
import { watch, onMounted } from "vue";
import eventBus from "@/utils/bus";
import { onUnmounted } from "vue";
import { useToast } from "@/plugins/toast";
import { web3 } from "@/utils/web3";
import { ethers } from "ethers";
import { getRandomIcon } from "@/utils";
import { getUsersCoefficient } from '@/http/modules/staker'
import { Ref } from "vue";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";
import { getGasFee, getWallet } from "@/store/modules/account";
import { useRouter } from "vue-router";

import { TradeStatus } from "@/plugins/tradeConfirmationsModal/tradeConfirm";
const { t } = useI18n()
const stakerModal = ref(false)
const amountModal = ref(false)
const totalModal = ref(false)
const validModal = ref(false)
const showAccountModal = ref(false)
const showValidModal = ref(false)
const showAddDialog = ref(false)
const { state, dispatch, getters } = useStore()
const accountInfo = computed(() => state.account.accountInfo)
const ethAccountInfo = computed(() => state.account.ethAccountInfo)
const addProfit = ref('')
const toAddr = ref('')
const value2 = ref(0)
const isError = ref(false)
const addNumber: Ref<number> = ref(0)
const showReconveryModal = ref(false);
const reconveryDetail = ref({});
const showMinusDialog = ref(false)
const { $tradeConfirm } = useTradeConfirm()
const { $wtoast } = useToast()
const router = useRouter()
// the render view of data
const stakerExtensions = ref([])
// owner stakerExtensions
const myExtensions = ref([])
const blockNumber = ref(0)
onMounted(() => {
    const toast = Toast.loading({
        duration: 0,
        forbidClick: true,
        message: t('common.loading'),
    });
    dispatch('account/getEthAccountInfo').finally(() => {
        toast.clear()
    })
    eventBus.on('changeAccount', (addr) => {
        callBack()
    })

})

onUnmounted(() => {
    eventBus.off('changeAccount')
})

watch(() => ethAccountInfo.value, (n) => {
    updateAddrInitData()
}, {
    deep: true,
})

const updateAddrInitData = async() => {
    const list = ethAccountInfo.value.StakerExtension?.StakerExtensions || []
    const totalPledge = list.length ? list.reduce((cur: any, b: any) => cur + new BigNumber(b.Balance).div(1000000000000000000).toNumber(), 0) : 0
    stakerExtensions.value = list.map((item: any, idx: number) => {
        const { Balance } = item
        const bigBan = new BigNumber(Balance).div(1000000000000000000)
        const myPledge = Balance ? bigBan.toNumber() : 0
        return {
            ...item,
            Balance: myPledge,
            percent: new BigNumber(myPledge).div(totalPledge).multipliedBy(100).toFixed(2),
            totalPledge,
            icon: getRandomIcon(),
            selected: false
        }
    }).sort((a: any, b: any) => b.Balance - a.Balance)

    myExtensions.value = list.map((item: any) => {
        return {
            ...item,
            Balance: new BigNumber(item.Balance).div(1000000000000000000).toFixed(2)
        }
    }).sort((a: any, b: any) => a.Balance - b.Balance)
    const users = list.map((item: { Addr: string; }) => item.Addr)
    if (users && users.length) {
        getUsersCoefficient({ users: JSON.stringify(users) }).then(res => {
            res.data.forEach((item: any) => {
                stakerExtensions.value.forEach(child => {
                    if (child.Addr.toUpperCase() == item.useraddr.toUpperCase()) {
                        child.Coefficient = item.coefficient
                        child.isValidator = true
                    }
                })
            })
        })
    }
    const wallet = await getWallet();
    const blockNum = await wallet.provider.getBlockNumber();
    console.log('blockNum', blockNum)
    blockNumber.value = blockNum
    toAddr.value = stakerExtensions.value.length ? stakerExtensions.value[0].Addr : ''
    if(stakerExtensions.value && stakerExtensions.value.length) {
        stakerExtensions.value[0].selected = true
    }

}

const onSubmitAddNumber = () => {

}
const handleAddBlur = () => {
    if (new BigNumber(addNumber.value).gt(sliderMaxNum.value)) {
        addNumber.value = Number(sliderMaxNum.value)
    }
}

const handleSliderChange = (e) => {
    console.log(e)
    addNumber.value = e
}
const childConfirm = async(v: any) => {
    console.log(v)
    const hasAddr = stakerExtensions.value.find(item => item.Addr.toUpperCase() == v.Addr.toUpperCase())
    if (hasAddr) {
        $wtoast.warn(t('validator.addrHasExits'))
        return
    }
    const wallet = await getWallet();
    const blockNum = await wallet.provider.getBlockNumber();
    console.log('blockNum', blockNum)

    blockNumber.value = blockNum
    stakerExtensions.value.forEach(item => item.selected = false)
    v.selected = true
    const newData = { ...v, percent: 0, Balance: 0 }
    stakerExtensions.value.push(newData)

}

const handleShowReconveryModal = async () => {
    const { Coefficient } = ethAccountInfo.value
    const sendAmount = (70 - Coefficient) / 10;
    if (
        new BigNumber(accountInfo.value.amount).lt(sendAmount + 1)
    ) {
        $wtoast.warn(t("minerspledge.noMoney", { value: sendAmount + 1 }));
        return;
    }
    try {
        Toast.loading({ duration: 0, forbidClick: true });
        const tx = {
            to: accountInfo.value.address,
            value: ethers.utils.parseEther(sendAmount.toString()),
            data: web3.utils.fromUtf8(`wormholes:{"type":26,"version":"v0.0.1"}`),
        };
        const gasFee = await getGasFee(tx);
        reconveryDetail.value = {
            address: accountInfo.value.address,
            Coefficient: Coefficient,
            amount: sendAmount,
            gasFee,
        };
        showReconveryModal.value = true;
    } catch (err: any) {
        $wtoast.warn(err.reason)
    } finally {
        Toast.clear();
    }
};


const handleMinusClick = () => {
    if (!addNumber.value) {
        $wtoast.warn(t('validator.redemAmountErr2'))
        return
    }
    if (Number(addNumber.value) == 0) {
        $wtoast.warn(t('validator.redemAmountErr3'))
        return
    }
    if (new BigNumber(addNumber.value).gt(totalPledgeAmount.value)) {
        $wtoast.warn(t('validator.redemAmountErr'))
        return
    }
    // Total pledge amount - Redemption amount must be greater than or equal to 700 or equal to 0
    const bigLeftPledgeAmount = new BigNumber(totalPledgeAmount.value).minus(addNumber.value)
    if (bigLeftPledgeAmount.lt(700) && bigLeftPledgeAmount.gt(0)) {
        $wtoast.warn(t('validator.leftPledgeErr'))
        return
    }
    showMinusDialog.value = true
}
const callBack = async () => {
    const toast = Toast.loading({
        duration: 0,
        forbidClick: true,
        message: t('validator.updateLoadingText'),
    });
    await dispatch('account/getEthAccountInfo')
    await dispatch('account/updateBalance')
    let time = setTimeout(() => {
        toast.clear()
        clearTimeout(time)
    }, 200)
}

const minusConfirm = async () => {
    showMinusDialog.value = false
    $tradeConfirm.open({
        approveMessage: t('minerspledge.minus_approve'),
        wattingMessage: t('minerspledge.minus_waiting'),
        successMessage: t('minerspledge.minus_success'),
        failMessage: t('minerspledge.minus_wrong'),
        callBack
    })
    try {
        const str = `wormholes:${JSON.stringify({ type: 10, version: "0.0.1" })}`;
        const data3 = web3.utils.fromUtf8(str)
        const tx1 = {
            to: toAddr.value,
            value: addNumber.value,
            data: data3,
        };
        console.warn('tx1', tx1, addNumber.value)
        const data = await dispatch('account/transaction', tx1)
        $tradeConfirm.update({ status: "approve" })
        const res = await data.wait()
        if (res.status != 1) {
            $tradeConfirm.update({ status: "fail", hash: res.transactionHash })
        } else {
            $tradeConfirm.update({ status: "success", hash: res.transactionHash })
        }
        dispatch('account/waitTxQueueResponse')
        // $toast.success('质押成功！')
    } catch (err) {
        $tradeConfirm.update({ status: "fail" })
        $wtoast.fail(err.reason)
    }
}
const handleMinusError = (err: any) => {
    // showMinusDialog.value = false
    $wtoast.fail(t('sendto.insufficientfunds'))
}
const reconveryConfirm = async () => {
    showReconveryModal.value = false;
    const { amount }: any = reconveryDetail.value
    const str = `wormholes:{"type":26,"version":"v0.0.1"}`;
    const tx = {
        value: amount,
        data: web3.utils.fromUtf8(str),
        to: accountInfo.value.address,
    }

    $tradeConfirm.open({
        disabled: [TradeStatus.pendding, TradeStatus.approve],
        callBack
    })

    try {
        const data = await dispatch('account/transaction', tx)
        $tradeConfirm.update({ status: "approve", callBack })
        const { hash } = data
        const receipt = await data.wallet.provider.waitForTransaction(hash)
        const { status } = receipt
        if (!status) {
            $tradeConfirm.update({ status: "fail", callBack, hash })
        } else {
            $tradeConfirm.update({ status: "success", callBack, hash })
        }
        reconveryDetail.value = {}

        dispatch('account/waitTxQueueResponse')
    } catch (err: any) {
        if (err.toString().indexOf("timeout") > -1) {
            $tradeConfirm.update({
                status: "warn",
                failMessage: t("error.timeout"),
                callBack
            });
        } else {
            $tradeConfirm.update({
                status: "fail",
                failMessage: err.reason,
                callBack
            });
        }
        console.error(err)
    }
}

const handleAddClick = () => {
    const e: any = stakerExtensions.value.find(item => item.selected)
    if (!e) {
        $wtoast.warn(t('validator.pleaseSelectedAddr'))
        return
    }
    const bigTotalPledge = new BigNumber(e.Balance)
    // If the amount pledged in the current account at the time of the pledge is 0, the amount pledged must be greater than or equal to 700
    if (bigTotalPledge.lt(700) && (!addNumber.value || new BigNumber(addNumber.value).lt(700))) {
        $wtoast.warn(t('validator.pledgeAmountErr'))
        return
    }
    if (bigTotalPledge.gte(700) && !Number(addNumber.value)) {
        $wtoast.warn(t('validator.pledgeAmountErr1'))
        return
    }
    toAddr.value = e.Addr
    showAddDialog.value = true
}

const addStakeConfirm = async () => {
    $tradeConfirm.open({
        approveMessage: t('minerspledge.create_approve'),
        successMessage: t('minerspledge.create_waiting'),
        wattingMessage: t('minerspledge.create_success'),
        failMessage: t('minerspledge.create_wrong'),
        callBack
    })
    try {
        const str = `wormholes:${JSON.stringify({ type: 9, proxy_address: accountInfo.value.address, fee_rate: 1000, name: "Staker", url: "", version: "v0.0.1" })}`;
        const data3 = web3.utils.fromUtf8(str)
        const tx1 = {
            to: toAddr.value,
            value: addNumber.value,
            data: data3,
        };
        console.warn('tx1', tx1, addNumber.value)
        const data = await dispatch('account/transaction', tx1)
        $tradeConfirm.update({ status: "approve" })
        const res = await data.wait()
        const { transactionHash } = res
        if (res.status != 1) {
            $tradeConfirm.update({ status: "fail", hash: transactionHash })
        } else {
            $tradeConfirm.update({ status: "success", hash: transactionHash })
        }
        dispatch('account/waitTxQueueResponse')
    } catch (err) {
        $tradeConfirm.update({ status: "fail" })
        $wtoast.fail(err.reason)
    }
}

const handleAddError = (err: any) => {
    // showAddDialog.value = false
    $wtoast.fail(t('sendto.insufficientfunds'))
}

const handleClick = (item: any) => {
    console.warn('click item', item)
    const { Addr } = item
    stakerExtensions.value.forEach(item => {
        if (Addr.toUpperCase() == item.Addr.toUpperCase()) {
            item.selected = true
            toAddr.value = item.Addr
        } else {
            item.selected = false
        }
    })
}

const totalPledgeAmount = computed(() => {
    const myExtension = stakerExtensions.value.find(item => item.Balance && item.selected)
    return myExtension ? myExtension.Balance : 0
})

const sliderMaxNum = computed(() => {
    const myExtension = stakerExtensions.value.find(item => item.selected)
    if (!myExtension) {
        return 0
    }
    const v = new BigNumber(accountInfo.value.amount).gt(myExtension.Balance) ? Number(accountInfo.value.amount) : myExtension.Balance
    return v
})

const amount = computed(() => getters["system/getAmount"]);

const marks = computed(() => {
    const accountAmount = new BigNumber(accountInfo.value.amount);
    const newVal = accountAmount.gt(totalPledgeAmount.value) ? accountAmount.toNumber() : totalPledgeAmount.value
    const r = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
    const initData = {}
    for (const item of r) {
        initData[new BigNumber(newVal).multipliedBy(item).toNumber().toString()] = ''
    }
    return initData
});

const coefficient = computed(() => ethAccountInfo.value.Coefficient)

const isValidator = computed(() => {
    return new BigNumber(ethAccountInfo.value.PledgedBalance || 0).div(1000000000000000000).gte(70000)
})

const isStaker = computed(() => {
    const myExtension = stakerExtensions.value.find(item => item.Balance && item.selected)
    return myExtension ? true : false
})

const freezeStatus = computed(() => {
    const select = stakerExtensions.value.find(item => item.selected)
    if(select && select.BlockNumber) {
        // TODO: 6307200
        return (blockNumber.value - select.BlockNumber) > 1 ? false : true
    } else {
        return false
    }
})

const resetWeightNum = computed(() => {
    const { Coefficient } = ethAccountInfo.value
    const sendAmount = (70 - Coefficient) / 10;
    return sendAmount
})

const back = () => {
    router.back()
}
</script>
<style lang="scss" src="./staker.scss" scoped></style>