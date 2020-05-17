import Vue from 'vue'
import store from '@/config/store'
import router from '@/config/router'


import App from './App.vue'
import babelPolyfill from 'babel-polyfill'
import babelPluginTransformRuntime from 'babel-plugin-transform-runtime'
import apolloProvider from '@/config/vue-apollo'

import {message, Modal} from "ant-design-vue";
Vue.config.productionTip = false;
Vue.prototype.$message = message;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;


new Vue({
  router,
  store,
  babelPolyfill,
  babelPluginTransformRuntime,
  apolloProvider,
  ...App,
}).$mount('#app');
