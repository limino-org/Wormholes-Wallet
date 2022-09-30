export default {
    path: "/receive-award",
    name: "receive-award",
    redirect: { name: "receive-award-home" },
    component:() =>  import("@/views/receiveAward/index.vue"),
    children: [
      {
        path: "/receive-award/home",
        name: "receive-award-home",
        component:() =>  import("@/views/receiveAward/pages/index.vue"),
        meta: {
          auth: true,
        },
      },
    ],
  }