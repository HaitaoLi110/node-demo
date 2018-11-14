// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from './http'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from "./store"  // 引入store 对象

//import VueResource from 'vue-resource';


Vue.config.productionTip = false
Vue.use(ElementUI);
//Vue.use(VueResource)

/* eslint-disable no-new */
Vue.prototype.$axios=axios;
new Vue({
  el: '#app',
  router,
  store,  // 注入到根实例中
  components: { App },
  template: '<App/>'
})
