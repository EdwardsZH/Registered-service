//前后端修改的url地址不一样..http://192.168.55.9:8579
import axios from 'axios'
import store from '../store/index.js'
import router from '../router/index.js'
//axios.defaults.baseURL =process.env.API_ROOT;
//axios.defaults.baseURL ='http://localhost:8080/api';
axios.defaults.baseURL=(process.env.NODE_ENV=="development")?'http://localhost:8080/api':process.env.API_ROOT
function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(response => {
              if(response.data.errmsg=="TOKEN_INVALID"){
                  localStorage.removeItem('user');
                  store.commit("SET_USERINFO",'');
                  router.push('/login');
              }
              store.commit("SET_TOKEN",response.headers.token); 
              resolve(response.data);
            })
            .catch((error) => {
               console.log(error)
               reject(error)
            })
    })
}
function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
              if(response.data.errmsg=="TOKEN_INVALID"){
                  localStorage.removeItem('user');
                  store.commit("SET_USERINFO",'');
                  router.push('/login');
              }
              store.commit("SET_TOKEN",response.headers.token); 
              resolve(response.data);
            })
            .catch((error) => {
               console.log(error)
               reject(error)
            })
    })
}

function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, params)
            .then(response => {
              if(response.data.errmsg=="TOKEN_INVALID"){
                  localStorage.removeItem('user');
                  store.commit("SET_USERINFO",'');
                  router.push('/login');
              }
              store.commit("SET_TOKEN",response.headers.token); 
              resolve(response.data);
            })
            .catch((error) => {
               console.log(error)
               reject(error)
            })
    })
}

function del(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, params)
            .then(response => {
              if(response.data.errmsg=="TOKEN_INVALID"){
                  localStorage.removeItem('user');
                  store.commit("SET_USERINFO",'');
                  router.push('/login');
              }
              store.commit("SET_TOKEN",response.headers.token); 
              resolve(response.data);
            })
            .catch((error) => {
               console.log(error)
               reject(error)
            })
    })
}
function postlogin(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                store.commit("SET_TOKEN",response.headers.token); 
                resolve(response.data);           
            })
            .catch((error) => {
              // console.log(error)
               reject(error)
            })
    })
}
axios.interceptors.request.use((config) => {
  config.headers.token=store.getters.getToken;
  return config;
}, (err) => {
    return Promise.reject(err);
})
export default {
  // 获取我的页面的后台数据
  getHospitalDataP(params) {
     return get('/hospital/',params);
  },
  getHospital(params) {
     return get('/hospitals/',{'params':params})
  },

  postHospital(params) {
     return post('/hospital/',params);
  },
  putHospital(id,params) {
     return put('/hospital/'+id,params);
  },
  delHospital(id,params) {
     return del('/hospital/'+id,params);
  },
  getHospitalById(id) {
     return get('/hospital/'+id);
  },
 //部门
 getDepartData(params){
     return get('/department/',params);
  },
 getDepart(params){
     return get('/departments/',{'params':params});
  },
 postDepart(params) {
     return post('/department/',params);
  },
  putDepart(id,params) {
     return put('/department/'+id,params);
  },
  delDepart(id,params) {
     return del('/department/'+id,params);
  },





  getUserData(id,params) {
            //alert(id);
    
     return get('/user/'+id,params);
  },
 postUser(params) {
     return post('/user/',params);
  },
  putUser(id,params) {
     return put('/user/'+id,params);
  },
  delUser(id,params) {
     return del('/user/'+id,params);
  },
  moddifyPsd(params) {
     return post('/moddifypsd/',params);
  },

  postLogin(params) {
     return post('/login/',params);
  },
  //当用户登录后头像在服务器丢失的情况;
  getFurlServer(url){
    return get(url);
  },

  getHospitalData(id,params) {
    // alert('进入api.js')
   // alert(JSON.stringify(params));
   // alert(JSON.stringify(id));
     return get('/hospital/'+id,params);
  },
  postHospital(params) {
     return post('/hospital/',params);
  },
  putHospital(id,params) {
     return put('/hospital/'+id,params);
  },
  delHospital(id,params) {
     return del('/hospital/'+id,params);
  },
  getHospitalById(id) {
     return get('/hospital/'+id);
  },


  //新增申请 ..数据请求
    //获取医院信息..
  getHospital(params) {
    // alert(id);
    // alert(JSON.stringify(params));
    return get('/hospitals/',{'params':params});
  },
  //获取专家科室...
  getExpertDepart(params){
    return get('/departments/',{'params':params})
  },
  //获取会诊专家...
  getConsultant(params){
    return get('/users/',{'params':params})
  },
  //提交form表单数据.申请信息...
  postApplyInfo(params){
    return post('/applyrecord/',params)
  },

  //提交病历信息
  postMedicalrecord(params){
    return post('/medicalrecord/',params)
  },
  // 获取申请记录的后台数据..
  getApplyDetaile(params) {
    return get('/applyrecord/',params);
  },
  //获取病历信息
  getMedicalRecord(params) {
    return get('/medicalrecord/',{'params':params});
  },
  //获取申请专家医院后的进度状态...
  getHospitalState(params){
    return get('/applyrecord/',{'params':params})
  },
  //修改病历信息
  putApplyInfo(id,params){
    return put('/applyrecord/'+id,params)
  },
  getAppplyRecord(params) {


    //
    return get('/applyrecord/',params);
  },
  getAppplyRecordById(id) {
    return get('/applyrecord/'+id);
  },
  getSetUp() {
    return get('/setup');
  },
  postSetUp(params) {
    return post('/setup/',params);
  },

  postReport(params) {
    //alert(JSON.stringify(params));
    return post('/report/',params);
  },
  getReport(params) {
  //  alert(JSON.stringify(params));
    return get('/report/',{'params':params});
  },
  delMedicalRecord(id,params){
    return del('/medicalrecord/'+id,params);
  },
  postReportAttach(params){
    return post('/reportattch/',params);
  },
  getReportAttach(params){
    return get('/reportattch/',{'params':params});
  },
  //当用户登录后头像丢失的情况;
  getFaceUrl(params){
    return get({'params':params});
  },

  login(params){
    return postlogin('/login/',params)
  }

}
