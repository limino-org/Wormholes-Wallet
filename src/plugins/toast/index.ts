import { getCurrentInstance, ComponentInternalInstance } from 'vue'
import { ToastFuns } from './toast'
export const useToast = () => {
    const { globalProperties } = (getCurrentInstance() as ComponentInternalInstance).appContext.config
    const $toast: ToastFuns = globalProperties.$toast
    return {
        $toast
    }

}