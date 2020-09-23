import Vue from "vue";
import App from "./App.vue";
import getPeer from "./peer";
import "./registerServiceWorker";

const peer = getPeer({});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  destroyed() {
    peer.destroy();
  }
}).$mount("#app");
