// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'amfe-flexible'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import { setupWebViewJavascriptBridge, judgeAppEnv } from 'common/js/util'
import '../../common/css/base.less';
import {
  Style,
  Toast,
  Loading,
  Dialog
} from 'cube-ui'
Vue.use(Toast)
Vue.use(Dialog)

Vue.config.productionTip = false
fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('common/img/default.png')
})

// 兼容处理(在app内)
if(judgeAppEnv()){
  setupWebViewJavascriptBridge(function(bridge) {   

  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
