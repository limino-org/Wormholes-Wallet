import { SetupContext, Ref, ref, reactive, defineComponent } from "vue";

export const show: Ref<boolean> = ref(false);

export const showSlider = () => {
    show.value = true
}
