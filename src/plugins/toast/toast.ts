import Vue, { App,render,VNode,createVNode } from "vue"
export type ToastFuns = {
    success:Function
    fail: Function
    warn: Function
    open: Function
    hide?: Function
}
import Toast from './index.vue'
export default {
    install: (app: App, options: any) => {
        const vnode: VNode = createVNode(Toast)
        const $wtoast: ToastFuns = {
            success: (message: string) =>{
                render(vnode, document.body)
                vnode.component?.exposed?.success(message)
            },
            fail: (message: string) => {
                render(vnode, document.body)
                vnode.component?.exposed?.fail(message)
            },
            warn: (message: string) => {
                render(vnode, document.body)
                vnode.component?.exposed?.warn(message)
            },
            open: (opt: any) => {
                render(vnode, document.body)
                vnode.component?.exposed?.open(opt)
            },
            hide: () => {
                vnode.component?.exposed?.hide()
            }
        }
        app.config.globalProperties.$wtoast = $wtoast

    }
  }