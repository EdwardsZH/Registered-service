import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import store from '../store/index.js'
import routes from './routes/front'

//import routesb from './routes/back'
//router.addRoutes(routesb)  

const router = new VueRouter({
    routes
})

//全局路由导航钩子函数,默认跳转login页面,
router.beforeEach((to, from, next) => {
	if (to.path == '/login') {
		localStorage.removeItem('user');
	}
	let user = JSON.parse(localStorage.getItem('user'));
	if ((!user && to.path != '/login') || (to.path == '/')) {
	    next({ path: '/login' })
	} else {
	    next()
	}
})

export default router
