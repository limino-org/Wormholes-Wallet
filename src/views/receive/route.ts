export default {
    path: "/receive",
    name: "receive",
    redirect: { name: "receive-choose" },
    component:() =>  import("@/views/receive/index.vue"),
    children: [
      {
        path: "/receive/choose",
        name: "receive-choose",
        component:() =>  import("@/views/receive/pages/choose/index.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "/receive/set-amount",
        name: "receive-set-amount",
        component:() =>  import("@/views/receive/pages/setAmount/index.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "/receive/send-link",
        name: "receive-send-link",
        component:() =>  import("@/views/receive/pages/sendLink/index.vue"),
        meta: {
          auth: true,
        },
      },
    ],
  }