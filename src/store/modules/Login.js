

import api from '../../api/api.js'

//initial state
const state = {
    leftNav:{
        hospital:{title:"医院管理",url:"/hospital"},
        depart:{title:"科室管理",url:"/depart"},
        user:{title:"医生管理",url:"/user"}
    },
    userInfo :localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token:localStorage.getItem('token') ? localStorage.getItem('token') : null,

    appplyRecordData:{},
    receiveRecordData:{},
    expertHospitalData:'',
    applyHospitalData:'',
    current:localStorage.getItem('current') ? JSON.parse(localStorage.getItem('current')) : null,
    setUp:{},
    nation: [
        {key: '1',value: '汉族'},{key: '2',value: '壮族'},{key: '3',value: '满族'},
        {key: '4',value: '回族 '}, {key: '5',value: '苗族'}, {key: '6',value: '维吾尔族 '},
        {key: '7',value: '土家族'}, {key: '8',value: '彝族'}, {key: '9',value: '蒙古族'},
        {key: '10',value: '藏族'}, {key: '11',value: '布依族'}, {key: '12',value: '侗族'},
        {key: '13',value: '瑶族'}, {key: '14',value: '朝鲜族'}, {key: '15',value: '白族'},
        {key: '16',value: '哈尼族'}, {key: '17',value: '哈萨克族'}, {key: '18',value: '黎族'},
        {key: '19',value: '傣族'}, {key: '20',value: '畲族'}, {key: '21',value: '傈僳族'},
        {key: '22',value: '仡佬族'}, {key: '23',value: '东乡族'}, {key: '24',value:'高山族'},
        {key: '25',value: '拉祜族'}, {key: '26',value: '水族'}, {key: '27',value: '佤族'},
        {key: '28',value: '纳西族'}, {key: '29',value: '羌族'}, {key: '30',value: '土族'},
        {key: '31',value: '仫佬族'}, {key: '32',value: '锡伯族'}, {key: '33',value: '柯尔克孜族'},
        {key: '34',value: '达斡尔族'}, {key: '35',value: '景颇族'}, {key: '36',value: '毛南族'},
        {key: '37',value: '撒拉族'}, {key: '38',value: '布朗族'}, {key: '39',value: '塔吉克族'},
        {key: '40',value: '阿昌族'}, {key: '41',value: '普米族'}, {key: '42',value: '鄂温克族'},
        {key: '43',value: '怒族'}, {key: '44',value: '京族'}, {key: '45',value: '基诺族'},
        {key: '46',value: '德昂族'}, {key: '47',value: '保安族'}, {key: '48',value: '俄罗斯族'},
        {key: '49',value: '裕固族  '}, {key: '50',value: '乌兹别克族'}, {key: '51',value: '门巴族'},
        {key: '52',value: '鄂伦春族'}, {key: '53',value: '独龙族'}, {key: '54',value: '塔塔尔族'},
        {key: '55',value: '赫哲族'}, {key: '56',value: '珞巴族'}
    ]
}

//getters
const getters = {
	getUserInfo : state => state.userInfo,
    leftNav     : state => state.leftNav,
    getNation:state =>state.nation,
    getAppplyRecordData : state => state.appplyRecordData,
    getReceiveRecordData : state=>state.receiveRecordData,
    getExpertHospitalData : state => state.expertHospitalData,
    getApplyHospitalData : state => state.applyHospitalData,
    getCurrent:state=>state.current,
    getSetup:state=>state.setUp,
    getToken:state=>state.token
}

//actions
const actions = {
    //获取用户信息..
    getUserInfo({ commit, state },data){ 
        api.login(data)
            .then( res=>{
            console.log(res.data)
            let data = res.data;
            commit("SET_USERINFO",res)
        })

    },
    getAppplyRecord({commit,state},data){ 
        api.getAppplyRecord({params:data})
        .then(res=>{
            let data = res.data;
            commit('APPLY_RECORD',data)
        })
    },
    getExpertHospitalData({commit,state},data){
        api.getHospital({role:1})
        .then(res=>{
            let data = res.data;
            commit("EXPERT_HOSPITAL_DATA",data);
        })
    },   
    getReceiveRecord({commit,state},data){ 
        api.getAppplyRecord({params:data})
        .then(res=>{
            let data = res.data;
            commit('RECEIVE_RECORD',data)
        })
    },
    getApplyHospitalData({commit,state},data){
        api.getHospital({role:0})
        .then(res=>{
            let data = res.data;
            commit("APPLY_HOSPITAL_DATA",data);
        })
    },
    getSetUpData({commit,state}){
        api.getSetUp()
        .then(res=>{
            let data = res.data;
            //console.log(data)
            commit("SETUP",data);
        })
    } 
}
// mutations
const mutations = {
    //传入参数user对象是(包含用户全部信息的对象..)
    SET_USERINFO(state,data){
        state.userInfo = data
    },
    SET_NAV(state,{ UserInfo }){
        let userid=UserInfo.userid;
        if(UserInfo.role==1){ 
           state.leftNav.hospital.url='/hospitals/'+userid;
        }else if(UserInfo.role==2){
         let hospitalid=UserInfo.hospitalid;
         state.leftNav.hospital.url='/hospitals/'+hospitalid+'/'+userid;
        }else{

        }
    },
    APPLY_RECORD(state,data){
        state.appplyRecordData = data;
    },

    RECEIVE_RECORD(state,data){
        state.receiveRecordData = data;
    },
    APPLY_HOSPITAL_DATA(state,data){
        state.applyHospitalData = data
    },
    EXPERT_HOSPITAL_DATA(state,data){
        state.expertHospitalData= data
    },
    SET_CURRENT(state,data){
        state.current= data
    },
    SETUP(state,data){
        
        state.setUp= data
    },
    SET_TOKEN(state,data){
        //alert(data)
        state.token= data
        localStorage.setItem('token',data);
       // console.log(data)
      //  
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}