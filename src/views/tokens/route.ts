export default {
    path: "/tokens",
    name: "tokens",
    component:() =>  import("@/views/tokens/index.vue"),
    children: [
      {
        path: "/tokens/import",
        name: "tokens-import",
        component:() =>  import("@/views/tokens/pages/import.vue"),
        meta: {
          auth: true,
        },
      },
    ],
  };
  