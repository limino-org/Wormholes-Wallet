import { Toast } from 'vant';
import Web3 from 'web3';
import i18n from '@/language/index'
export const web3 = new Web3(Web3.givenProvider);
import localforage from 'localforage';
import { getCookies } from './jsCookie';
import store from '@/store';

export interface DecryptPrivateKeyPraams {
    json: any;
    password: string;
  }

export const decryptPrivateKey = (params: DecryptPrivateKeyPraams) => {
    const { json, password } = params;
    const s: any = web3.eth.accounts.decrypt(json, password);
    return s.privateKey;
  };
export interface EncryptPrivateKeyParams {
    //  The private key to be encrypted
    privateKey: string
    // The password used for encryption
    password: string
}
// Convert private key encryption to Keystore V3 standard format.
export const encryptPrivateKey = (params: EncryptPrivateKeyParams) => {
    const { privateKey, password } = params
    return web3.eth.accounts.encrypt(privateKey, password);
}

export interface EncryptMnemonicParams {
    //  Mnemonic words to encrypt
    mnemonic: string
    // The password used for encryption
    password: string
}
// Encrypt mnemonics into keystores and store them
export const encryptMnemonic = (params: EncryptMnemonicParams) => {
    try {
        const { mnemonic, password } = params
        const mnemonicData = encryptPrivateKey({
            privateKey: web3.utils.toHex(mnemonic),
            password,
        })
        // localforage.setItem("mnemonic", mnemonicData);
        store.commit('mnemonic/UPDATE_MNEMONIC', mnemonicData)
        } catch (err) {
        console.error(err)
    }
}

// Unlock the mnemonic word and return
export const parseMnemonic = async (password: string, json: any): Promise<string> => {
    try {
      const s: any = web3.eth.accounts.decrypt(json, password);
      const str = web3.utils.toUtf8(s.privateKey);
      return str;
    } catch (err) {
      console.error(err);
      Toast(i18n.global.t("wallet.wrongpassword"));
      return Promise.reject(err);
    }
  };

