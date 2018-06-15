import Vue from 'vue';
import rem from './common/js/rem.js'
//import axios from 'axios';
//引入全部的ElementUI组件库..
import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui';
import router from './router';
import store from './store';
//配置axios 在Vue原型上增加$http属性；
//Vue.prototype.$http = axios;

Vue.prototype.pagesizes = [5,10,15];

//全局注册组件
import App from './App';
//import Levelbar from './components/Common/Levelbar'



Vue.use(ElementUI);
//Vue.component(Levelbar.name,Levelbar);


//生产环境不加载插件。。
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  render: h => h(App)
})
