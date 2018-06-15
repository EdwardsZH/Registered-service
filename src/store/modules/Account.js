
import  api  from '../../api/api.js'
// initial state
const state = {
    hospitalTableDataS:{},
    departData:{},
    userData:{}
}

//getters
const getters = {
    hospitalTableDataS: state=>state.hospitalTableDataS,
    departData: state=>state.departData,
    userData: state=>state.userData
}

// actions
const actions = {
 
    getDepartData({commit,state},data){ 
        api.getDepartData({params:data})
        .then(rep => {
            commit('DEPARTDATA',rep)
        })
    },
    getHospitalData({commit,state},data){
 
        api.getHospitalDataP({params:data})
        .then(rep => {
            commit('HOSPITALDATAS',rep)
        })
    },
    getUserData({commit,state},data){
     
        let id=data.userid;
        data.userid=undefined;
       
        api.getUserData(id,{params:data})
        .then(rep => {
            commit('USERDATA',rep)
        })
    }
}



// mutations
const mutations = {
    //获取所有医院信息后
    HOSPITALDATAS(state,{data}){
        state.hospitalTableDataS=data;
    },
    DEPARTDATA(state,data){
        state.departData=data.data; 
    },
    USERDATA(state,data){   
        state.userData = data.data; 
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
