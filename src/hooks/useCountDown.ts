import { Ref, ref } from "vue"

/**
 * count down hooks
 * @returns 
 */
export const useCountDown = () => {
    const countTime:Ref<number> = ref(3000)
    const countDown = (time: number | null | undefined, callBack: Function | undefined | null) => {
        let timer = setTimeout((callBack: Function)=>{
            clearTimeout(timer)
        }, time || countTime.value)
    }
    return {

    }
}