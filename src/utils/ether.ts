
import { ethers } from 'ethers';
import { useStore } from 'vuex';
import i18n from "@/language/index";

export function getPath(n: string = '0'): string {
    return `m/44'/60'/0'/0/${n}`
}
// Generate random wallets
export function createRandomWallet() {
    return ethers.Wallet.createRandom()
}

export interface ParsekeystoreParams {
    // The wallet instance
    wallet: any
    password: string
    // Derive a callback for progress
    callback?: Function
}
// Generate the Keystore JSON file with the password
export function parsekeystore(opt: ParsekeystoreParams): Promise<Object> {
    const { callback, password, wallet } = opt
    return new Promise((resolve, reject) => {
        function call(progress: number) {
            const p: number = progress * 100
            callback ? callback(p) : ''
        }
        let encryptPromise = wallet.encrypt(password, call);
        encryptPromise.then((json: string) => {
            const data: Object = json || ''
            resolve(data)
        }).catch((err: any) => reject(err));
    })
}


export interface CreateWalletByJsonParams {
    json: string
    password: string
}
// Create the wallet instance from the JSON file of the password Keystore
export function createWalletByJson(params: CreateWalletByJsonParams): Promise<Object> {
    const { password, json }: any = params
    return ethers.Wallet.fromEncryptedJson(JSON.stringify(json), password)
}



export interface CreateWalletByMnemonicParams {
    phrase: string
    pathIndex: string
    path?: string
}
// Create a wallet by memorizing words
export function createWalletByMnemonic(params: CreateWalletByMnemonicParams) {
    const { phrase, pathIndex } = params
    let path: string = ''
    if (pathIndex != '-1') {
        path = getPath(pathIndex);
    }
    // Create a wallet with mnemonics
    try {
        return Promise.resolve(ethers.Wallet.fromMnemonic(phrase, path))
    } catch (err) {
        console.error(err)
        return Promise.reject(err)
    }
}


export interface PrivateKeyParams {
    privatekey: string
}
// Import the account through the private key
export function ImportPrivateKey(params: PrivateKeyParams) {
    const { privatekey } = params
    // Determine if it is a 66-bit hash string
    if(!privatekey){
        return Promise.reject({reason:i18n.global.t("import.empty")})
    }
    if(privatekey && privatekey.length < 64){
        return Promise.reject({reason:i18n.global.t("import.wronglength")})
    }
    const startWord = privatekey.substring(0,2)
    let newPrivadteKey = ''
    if(privatekey && startWord == '0x'){
        newPrivadteKey = privatekey
    } else {
        newPrivadteKey = `0x${privatekey}`
    }
    try {
        const provider = ethers.getDefaultProvider();
        const wallet = new ethers.Wallet(newPrivadteKey, provider)
        return wallet;
    } catch (err) {
        return Promise.reject(err)
    }
}



/**
 * Converts the string that needs to be signed into hash data
 * @param {string} message
 * @returns
 */
 export function hashMessage(message: any) {
    const messagePrefix = '\x19Ethereum Signed Message:\n'
    if (typeof message === 'string') {
      message = ethers.utils.toUtf8Bytes(message)
    }
    return ethers.utils.keccak256(
      ethers.utils.concat([ethers.utils.toUtf8Bytes(messagePrefix), ethers.utils.toUtf8Bytes(String(message.length)), message])
    )
  }
    //@ts-ignore
  window.hashMessage = hashMessage