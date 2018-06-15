<!-- 申请记录 -->
<template>
  <div class="Cont applyRecord apply">
    <!-- <Levelbar></Levelbar> -->
    <!-- 会诊查询 -->
    <el-form class="title" ref="form" :model="form">
      <div class="titlel">
        <span>专家医院
          <el-select @change="hospitalChange" v-model="form.expert_hospital_id" placeholder="请选择" > 
            <el-option label="全部医院" value=""></el-option>
            <el-option 
              v-for="item in hospitalData"  
              :key="item.hospitalid" 
              :label="item.hospitalname"
              :value="item.hospitalid">
            </el-option>

          </el-select>
        </span>
       
        <span>状态
          <el-select @change="hospitalState" v-model="form.state" placeholder="申请状态" > 
              <el-option label="全部状态" value=""></el-option>
              <el-option label="申请已提交" value="0"></el-option>
              <el-option label="已安排专家" value="1"></el-option>
              <el-option label="会诊结束" value="2"></el-option>
              <el-option label="申请已取消" value="-1"></el-option>
              <el-option label="申请已退回" value="-2"></el-option>
          </el-select>
        </span>
      </div>
      <div class="titler">
        <el-form-item label="" >
          <span>会诊时间</span>
          <el-date-picker class="dtime"
            v-model="form.start_datetime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <span>至</span>
          <el-date-picker class="dtime"
            v-model="form.end_datetime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-button  type="primary" icon="search" @click="search">查询</el-button>
      </div> 
    </el-form>

    <!-- table栏主要内容 -->
    <el-table :data="aRData.data" @row-click="rowClick" v-loading="loading" element-loading-text="正在加载组件...">
      <el-table-column align="center" prop="applyrecordid" label="会诊号" width="60" key="applyrecordid"></el-table-column>
      <el-table-column align="center" prop="expert_hospital_name" label="专家医院"></el-table-column>
      <el-table-column align="center" prop="expert_department_name" label="要求科室"></el-table-column>
      <el-table-column align="center" prop="expert_user_name" label="要求专家"></el-table-column>
      <el-table-column align="center" prop="apply_type" :formatter="formatType" label="会诊类型"></el-table-column>
      <el-table-column align="center" prop="apply_method" :formatter="formatMethod" label="会诊方式"></el-table-column>
      
      <el-table-column align="center" prop="patient_name" label="患者姓名"></el-table-column>
      <el-table-column align="center" prop="apply_user_name" label="申请医生" width="110"></el-table-column>

      <el-table-column align="center" prop="apply_time" :formatter="formatDateTime" label="申请时间" width="180"></el-table-column>
      
      
      <el-table-column align="center" prop="consultation_time" label="申请日期"></el-table-column>
      <el-table-column align="center" prop="state" label="进度状态">
        <template scope="scope">
          <el-button    
          size="small"
          :type="scope.row.state===0 ? 'success' : scope.row.state===1 ? 'info' : scope.row.state===2 ? '':scope.row.state===-1 ? 'danger':scope.row.state===-2 ? 'warning':''"
          close-transition>{{formatState(scope.row.state)}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="block">
      <el-pagination 
           @size-change="sizeChange"
           @current-change="pageIndexChange"      
           v-bind:current-page="aRData.currentPage"
           v-bind:page-size="aRData.numbersPrePage"
           v-bind:page-sizes="pageSizes"
           v-bind:page-count="aRData.totalPages"
           v-bind:total="aRData.count"
           layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { mapActions,mapGetters } from 'Vuex';
  import api from '../../../api/api.js'
  export default {
    name: 'v-ApplyRecord',
    data() {
      return {
        loading: false,//加载loading....
        applyId:'',
        textarea: '',
        form:{ 
          state :'',
          start_datetime:'',
          end_datetime:'',
          expert_hospital_id :'',
          apply_hospital_id:'',
          apply_user_id:''
        },
        hospitalName:'',
        hospitalId:'',
        StateData:'',
        hospitalid:'',
        realName:'',
        userId:'',
        numsPerPage: 10, //每页_?_条数
        currentPage: 1,//当前页
        pageSizes: this.pagesizes,
        
      }
    },
    computed:{
     ...mapGetters({
        UserInfo: 'getUserInfo',
        aRData:'getAppplyRecordData',
        hospitalData:'getExpertHospitalData'
     })
    },
    methods: {
      ...mapActions([
        'getAppplyRecord',
        'getExpertHospitalData'
      ]),
      formatType(row, column) {
        return row.apply_type == 1 ? '普通会诊' : row.apply_type == 0 ? '专家会诊' : '';
      },
      formatMethod(row, column) {
        return row.apply_method == 1 ? '视频会诊' : row.apply_method == 0 ? '普通会诊' : '';
      },
      
      formatState(state) {
        if(state==0)
          return '申请已提交'
        else if(state==1)
          return '已安排专家'
        else if(state==2)
          return '会诊结束'
        else if(state==-1)
          return '申请已取消'
        else if(state==-2)
          return '申请已退回'
        else
         return '未定义状态'    
      },
      hospitalState(key){
        this.form.state=key;
        this.form.expert_hospital_id='';
        this.form.start_datetime='';
        this.form.end_datetime='';
        this.getarData();
      },
      hospitalChange(key){
        this.form.expert_hospital_id=key;
        this.form.state='';
        this.form.start_datetime='';
        this.form.end_datetime='';
        this.getarData();
      },
      search(){
        this.getarData();
      },
      formatDateTime(row, column) {
          var d = new Date(row.apply_time);
          var d3 = d.getFullYear() + "年"+ (d.getMonth() + 1) +"月"+ d.getDate() +"日"+d.getHours()+"时"+d.getMinutes()+"分";
          return d3
      },
      rowClick(row, event){
        this.$store.commit("SET_CURRENT",{'applyrecordid':row.applyrecordid,'cmd':2});
        localStorage.setItem('current',JSON.stringify({'applyrecordid':row.applyrecordid,'cmd':2}));
        this.$router.push('/applydetailes');
        this.loading = true;
      },

      ///每页条数size
      sizeChange(numbersPrePage) {
        let vm = this;
        vm.aRData.numsPerPage = numbersPrePage;
        vm.getarData();
      },
      //翻页
      pageIndexChange(currentPage) {
        let vm = this;
        vm.aRData.currentPage = currentPage;
        vm.getarData();
      },
      getarData(){
        let vm = this;
        let params={};
        if(vm.form.state!=''){
          params['state'] = vm.form.state;
        }
        if(vm.form.start_datetime!=''){

          var d = new Date(vm.form.start_datetime);
          var d3 = d.getFullYear() + "-"+ (d.getMonth() + 1) +"-"+ d.getDate()
          params['start_datetime'] = d3 ;
        }
        if(vm.form.end_datetime!=''){
          var d = new Date(vm.form.end_datetime);
          var d3 = d.getFullYear() + "-"+ (d.getMonth() + 1) +"-"+ (d.getDate()+1)
          params['end_datetime'] = d3;
        }
        if(vm.form.expert_hospital_id!=''){
          params['expert_hospital_id'] = vm.form.expert_hospital_id;
        }
        if(vm.form.apply_hospital_id!=''){
          params['apply_hospital_id'] = vm.form.apply_hospital_id;
        }
        if(vm.form.apply_user_id!=''){
          params['apply_user_id'] = vm.form.apply_user_id;
        }
        if (typeof(vm.aRData.count) == "undefined") {
          params['page'] = vm.currentPage;
          params['per_page'] = vm.numsPerPage;
        } else {
          params['page'] = vm.aRData.currentPage;
          params['per_page'] = vm.aRData.numsPerPage;
        }
      // alert(JSON.stringify(params));
        vm.getAppplyRecord(params);

        /*this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 2000);*/
      }

    },
    
    mounted()
    {
      this.timeid=setInterval(()=>{
          this.getarData();
          this.getExpertHospitalData();
      }, 1000*30); 
    },
    beforeDestroy()
    {
      let vm=this;
      clearInterval(vm.timeid);
      vm.aRData.currentPage=vm.currentPage;
      vm.aRData.numsPerPage=vm.numsPerPage;
    },
    created(){
      let vm=this;
      if(vm.UserInfo.role===2){
        vm.form.apply_hospital_id=vm.UserInfo.hospitalid;
      }else if((vm.UserInfo.role===3)||(vm.UserInfo.role===4)){
        vm.form.apply_user_id=vm.UserInfo.userid;
      }else{

      }
      vm.getarData();
      vm.getExpertHospitalData()
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.applyRecord{padding:none;}
.block{float:right;height:0.30rem;padding:0.10rem 0.50rem 0 0;}
.title{float:left;box-sizing:border-box;width:100%;height: .56rem;text-align: left;padding: 0.1rem 0.15rem;display:flex;justify-content: space-around;font-size:.16rem;}
.titlel{width:44%;display:flex;justify-content: space-around;align-items: center;}
//.titlel .expert{margin-right: .25rem;}display: flex;justify-content: flex-start;align-items: center;
.titler{width:56%;display:flex;justify-content: space-around;;align-items: center;
  //.tittime{margin-right:.32rem;}
}
.cell a{color:#fff;}
</style>
<style lang="scss">
  .apply{
    .el-table {
      border:none;font-size: .14rem;
    }
   .el-table::before {
      background-color: rgba(255,255,255,0.1);
    } 
    .el-table::after {
      width:0rem;
    }
    .el-button--small {
      min-width:0.82rem;
    }
    .title{  
      .el-input__inner {height:0.36rem;}
      .el-input__icon+.el-input__inner {padding-right: .05rem;}
      .el-form-item__content {font-size:.16rem;}
    }
    .titlel{
      .el-form-item {
        //margin: 0 0rem .18rem 0;
        // display: inline-block;
        // vertical-align: middle;
        width: 50%;
        float: left;
        box-sizing:border-box;
      }
      .el-form-item__content {
        display: flex;
        float: none; 
        //margin-left: .80rem!important;//width: 1.60rem;
      }
      .el-form-item__label {
         padding: .11rem .10rem;
        // width:1rem!important;
      } 
      .el-input__inner {
        width:1.3rem!important;
        font-size:.14rem!important;
      }
    }
    .titler{
      .el-input {
        width:1.33rem!important;         
      }     
      .dtime{
        margin-right:0.25rem;
      }
      .el-button {
        padding: 0 .1rem!important;font-size:0.16rem;height:0.36rem;
      }
    }
  }
</style>