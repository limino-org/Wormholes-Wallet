export default {
    path: "/connect-wallet",
    name: "connect-wallet",
    component: () => import("@/views/connectWallet/index.vue"),
    meta: {
        auth: false
    }
  }