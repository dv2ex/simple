import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";

createApp(App)
  .use(store)
  .mixin({
    methods: {
      async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      },
      cid2url(cid) {
        //TODO how to fix gateway address
        return `http://127.0.0.1:4698/ipfs/${cid}`;
      },
    },
  })
  .use(router)
  .mount("#app");
