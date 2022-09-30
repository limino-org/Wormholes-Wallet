// Mnemonic module routing
export default {
  path: "/mnemonic",
  name: "mnemonic",
  redirect: { name: "mnemonic-step1" },
  component:() =>  import("@/views/mnemonic/index.vue"),
  children: [
    {
      path: "/mnemonic/step1",
      name: "mnemonic-step1",
      component:() =>  import("@/views/mnemonic/pages/step1.vue"),
      meta: {
        auth: true,
      },
    },
    {
      path: "/mnemonic/step2",
      name: "mnemonic-step2",
      component:() =>  import("@/views/mnemonic/pages/step2.vue"),
      meta: {
        auth: true,
      },
    },
    {
      path: "/mnemonic/step3",
      name: "mnemonic-step3",
      component:() =>  import("@/views/mnemonic/pages/step3.vue"),
      meta: {
        auth: true,
      },
    },
    {
      path: "/mnemonic/backupSuccessful",
      name: "mnemonic-backupSuccessful",
      component:() =>  import("@/views/mnemonic/pages/backupSuccessful.vue"),
      meta: {
        auth: true,
      },
    },
  ],
};
