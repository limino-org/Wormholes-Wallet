import { getCurrentInstance, ComponentInternalInstance } from 'vue'
export type TradeConfirmType = {
    open: Function
    update: Function
    hide: Function
}
export const useTradeConfirm = () => {
    const { globalProperties } = (getCurrentInstance() as ComponentInternalInstance).appContext.config
    const $tradeConfirm: TradeConfirmType = globalProperties.$tradeConfirm
    return {
        $tradeConfirm
    }

}