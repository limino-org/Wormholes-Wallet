import Vue, { App,render,VNode,createVNode } from "vue"
import { TradeConfirmType } from "."
import TradeConfirm from './index.vue'
export enum TradeStatus {
    pendding = 'pendding',
    approve = 'approve',
    success = 'success',
    fail = 'fail',
    warn = 'warn'
}
export type TradeConfirmOpt = {
    status: TradeStatus
    callBack?: Function
    approveMessage?: string
    successMessage?: string
    wattingMessage?: string
    wattingTitle?: string,
    failMessage?: string
}
export default {
    install: (app: App, options: any) => {
        const vnode: VNode = createVNode(TradeConfirm)
        const $tradeConfirm: TradeConfirmType = {
            open: (opt: TradeConfirmOpt) => {
                render(vnode, document.body)
                vnode.component?.exposed?.open(opt)
            },
            update:(opt: TradeConfirmOpt) => {
                render(vnode, document.body)
                vnode.component?.exposed?.update(opt)
            },
            hide:() =>vnode.component?.exposed?.hide()
        }
        app.config.globalProperties.$tradeConfirm = $tradeConfirm

    }
  }