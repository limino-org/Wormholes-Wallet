//The same window broadcast synchronizes the data of each window

import store from '@/store/index'

export const useBroadCast = () => {
    let broad: any = {
        onmessage: (e: any) => { },
        postMessage: (params: any) => { },
    };
    console.warn('system', judgeClient())
    if (judgeClient() != 'IOS' && BroadcastChannel) {
        console.warn('BroadcastChannel', BroadcastChannel)
        broad = new BroadcastChannel('WormHoles-Wallet')
    }
    // broadcast

    const postMessage = (params: any) => {
        try {
            broad.postMessage(params)
        } catch (err) {
            console.warn('The browser does not support BroadcastChannel')
        }
    }
    // Wallet update event
    const handleUpdate = () => {
        if(judgeClient() != 'IOS') {
        // @ts-ignore
        postMessage({ action: 'wromHoles-update', id: store.state.system.conversationId })

        }
    }
    return {
        postMessage,
        handleUpdate,
        broad
    }
}

function judgeClient() {
    let client = '';
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        client = 'IOS';
    } else if (/(Android)/i.test(navigator.userAgent)) {
        client = 'Android';
    } else {
        client = 'PC';
    }
    return client;
}