//组装模块并导出 store 的地方
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
var vue = new Vue();

//导入模块
import Login from './modules/Login';
import Account from './modules/Account';


const store = new Vuex.Store({
	modules:{
		Login,
		Account
	}
})
export default store
