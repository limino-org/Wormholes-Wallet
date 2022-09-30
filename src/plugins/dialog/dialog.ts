import Vue, { App,render,VNode,createVNode } from "vue"
import { ToastFuns } from "../toast/toast"
import Dialog from './index.vue'
export default {
    install: (app: App, options: any) => {
        const vnode: VNode = createVNode(Dialog)
        
        const $dialog: ToastFuns = {
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
        }
        app.config.globalProperties.$dialog = $dialog

    }
  }