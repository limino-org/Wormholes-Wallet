import { web3 } from "@/utils/web3";
import { Ref, ref } from 'vue'
import { ethers, utils } from "ethers";
import { getWallet } from "@/store/modules/account";

export const useGasPrice = () => {
    const gasPrice: Ref<string> = ref("0");
    const getGasPrice = async () => {
        const wallet = await getWallet()
        const p = await wallet.provider.getGasPrice()
        gasPrice.value = ethers.utils.formatEther(p);
        return Promise.resolve(gasPrice.value)
    }
    return {
        gasPrice,
        getGasPrice
    }
}