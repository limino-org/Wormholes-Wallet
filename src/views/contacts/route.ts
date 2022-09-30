export default {
    path: "/contacts",
    name: "contacts",
    redirect: { name: "contacts-choose" },
    component:() =>  import("@/views/contacts/index.vue"),
    children: [
      {
        path: "/contacts/choose",
        name: "contacts-choose",
        component:() =>  import("@/views/contacts/pages/choose.vue"),
        meta: {
          auth: true,
        },
      },

    ],
  }