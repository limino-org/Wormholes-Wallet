import { getCurrentInstance, ComponentInternalInstance } from 'vue'
import { ToastFuns } from "../toast/toast"
export const useDialog = () => {
    const { globalProperties } = (getCurrentInstance() as ComponentInternalInstance).appContext.config
    const $wdialog: ToastFuns = globalProperties.$wdialog
    return {
        $wdialog
    }

}