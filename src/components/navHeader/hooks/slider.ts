import { SetupContext, Ref, ref, reactive, defineComponent } from "vue";
import store from '@/store/index'
export const show: Ref<boolean> = ref(false);

export const showSlider = () => {
    show.value = true
    store.dispatch('account/getCreatorStatus', store.state.account.accountInfo.address)

}
