import { getCurrentInstance, ComponentInternalInstance } from 'vue'
import { ToastFuns } from './toast'
export const useToast = () => {
    const { globalProperties } = (getCurrentInstance() as ComponentInternalInstance).appContext.config
    const $wtoast: ToastFuns = globalProperties.$wtoast
    return {
        $wtoast
    }

}