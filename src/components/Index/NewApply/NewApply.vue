<!-- 新增申请记录 -->        
<template>
  <div class="Cont">
    <el-tabs type="border-card" class="tab-title newapply">
      <el-tab-pane label="申请信息">
        <el-form class="tab-cont" ref="form" :model="form" label-width="100">
          <el-form-item label="专家医院">
            <el-select  @change="hospitalName" v-model="form.expert_hospital_id" placeholder="请选择">
              <el-option v-for="item in hospitalData" :key="item.hospitalid" :label="item.hospitalname" :value="item.hospitalid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病人姓名">
            <el-input  v-model="form.patient_name"></el-input>
          </el-form-item>
          <el-form-item label="专家科室">
            <el-select  @change="departmentName" v-model="form.expert_department_id" placeholder="请选择">
              <el-option v-for="item in department" :key="item.departmentid" :label="item.departmentname" :value="item.departmentid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input  v-model="form.age"></el-input>
          </el-form-item>
          <el-form-item label="会诊专家">
            <el-select  v-model="form.expert_user_id" placeholder="请选择">
              <el-option v-for="item in consultation" :key="item.userid" :label="item.username" :value="item.userid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="form.sex" placeholder="请选择">
              <el-option label="女" value="0"></el-option>
              <el-option label="男" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会诊类型">
            <el-select  v-model="form.apply_type" placeholder="请选择">
              <el-option label="专家会诊" value="0"></el-option>
              <el-option label="普通会诊" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族">
            <el-select  v-model="form.nation" placeholder="请选择">
              <el-option v-for="item in Nation" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会诊方式">
            <el-select  v-model="form.apply_method" placeholder="请选择">
              <el-option label="普通会诊" value="0"></el-option>
              <el-option label="视频会诊" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="婚否">
            <el-select v-model="form.marriage" placeholder="请选择">
              <el-option label="已婚" value="0"></el-option>
              <el-option label="未婚" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请医生">
            <el-select  v-model="form.apply_user_id" placeholder="请选择">
              <el-option :data="UserInfo" :key="UserInfo.userid" :label="UserInfo.realname" :value="UserInfo.userid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工作单位">
            <el-input  v-model="form.company"></el-input>
          </el-form-item>
          
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="患者信息">
        <el-form class="patientinfo" ref="form" :model="form">
          <el-form-item label="病史摘要">
            <el-input type="textarea" resize="none" v-model="form.medical_hostory"></el-input>
          </el-form-item>
          <el-form-item label="诊断以及依据">
            <el-input type="textarea" resize="none" v-model="form.diagnosis"></el-input>
          </el-form-item>
          <el-form-item label="目前诊断与治疗">
            <el-input type="textarea" resize="none" v-model="form.treatment"></el-input>
          </el-form-item>
          <el-form-item label="申请会议目的">
            <el-input type="textarea" resize="none" v-model="form.apply_purpose"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="病历信息">
        <el-form class="upload" ref="uploadinfo" :model="form">
      
          <el-upload
            class="upload-demo"
            drag
            :action=form.uploadUrl
            multiple
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :on-progress="handleProgress"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload">
            <el-button type="info" size="small" icon="upload2">选择文件</el-button>
          </el-upload>

            <!--<el-button style="margin-left: .10rem;"  icon="arrow-down" type="success" @click="submitUpload">上传病例资料</el-button>
            <el-button class="" type="primary" icon="arrow-down">导出病例信息</el-button>
            <el-button class="" type="primary" icon="search">查看</el-button>-->

        </el-form>
      </el-tab-pane>
    </el-tabs>
    <p class="sub">
      <el-button class="submit" type="primary" @click="onSubmit">确认</el-button>
      <el-button class="submit" @click="handleBaseCancel">取消</el-button>
    </p>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'Vuex';
  import api from '../../../api/api.js'
  export default {
    name: 'v-ApplyRecord',
    data() {
      return {
        uploadinfo: [], //上传文件数组
        form: {
          expert_hospital_id: '',
          patient_name: '',
          expert_department_id: '',
          age: '',
          expert_user_id: '',
          sex: '',
          apply_type: '',
          nation: '',
          apply_method: '',
          marriage: '',
          apply_user_id: '',
          company: '',
          medical_hostory: '',
          diagnosis: '',
          treatment: '',
          apply_hospital_id: '',
          apply_hospital_department_id:'',
          apply_purpose: '',
          state:0,
          uploadUrl:process.env.API_ROOT+'/upload/'
        },
        hospitalData: '',
        department: '',
        consultation: '',
        textarea: '',
        hospitalId: '',
        fileList: [],
        progress:{}////上传的进度100%//上传的状态success||fail
      }
    },
    computed: {
      ...mapGetters({
        UserInfo: 'getUserInfo',
        Nation:'getNation'
      })
    },
    methods: {
      onSubmit(params) {
        var vm = this;
        if (vm.form.expert_hospital_id == '') {
          vm.$message({
            message: '必须选择专家医院!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.expert_department_id == '') {
          vm.$message({
            message: '必须选择专家科室!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.apply_type == '') {
          vm.$message({
            message: '必须选择会诊类型!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.apply_method == '') {
          vm.$message({
            message: '必须选择会诊方式!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.patient_name == '') {
          vm.$message({
            message: '必须填写病人姓名!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.age == '') {
          vm.$message({
            message: '必须填写病人年龄!',
            type: 'warning'
          });
          return;
        }

        let reg=/^[0-9]*[1-9][0-9]*$/; // ^[1-9]\d?$  
        let num = vm.form.age; 
        if(!reg.test(num) ){ 
          vm.$message({message: '年龄格式错误!',type: 'warning'}); 
          vm.form.age = "";
          return false; 
        } 

        if (vm.form.sex == '') {
          vm.$message({
            message: '必须选择性别!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.nation == '') {
          vm.$message({
            message: '必须选择民族!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.marriage == '') {
          vm.$message({
            message: '必须选择婚姻状况!',
            type: 'warning'
          });
          return;
        }
        
        if( vm.progress.percentage!="100"||vm.progress.status!="success"){

          if(JSON.stringify(vm.progress) != "{}"){
              vm.$notify.error({
              message: '正在上传病历,请稍候!',
              type: 'warning'
            });
            return;
          }
        };
       // if(JSON.stringify(vm.uploadinfo)=='[]'){


        vm.form.apply_hospital_id = vm.UserInfo.hospitalid;
        vm.form.apply_hospital_department_id== vm.UserInfo.departmentid;
        //alert(JSON.stringify(vm.form))
        api.postApplyInfo(vm.form)
          .then(res => {
            //console.log(res);
            if (res.errno!=0) {
              vm.$message.error('提交申请失败！');
              return;
            }
            //console.log(res)会诊号id;
            this.saveMedicalrecord(res.data);//保存病历资料
            for (let i in vm.form) {
              vm.form[i] = "";
            }
            this.$router.push('/applyrecord');
          })
      },
      handleBaseCancel() {
        this.$router.go(-1);
        //history.go(-1);
      },
      hospitalName(key) {
        this.hospitalId = key;
        //console.log(this.hospitalId)
        this.form.expert_department_id='';
        this.form.expert_user_id='';
        api.getExpertDepart({
            'hospitalid': key
          })
          .then(res => {
            this.department = res.data
          })
      },
      departmentName(key) {
        //console.log(key)
        this.form.expert_user_id='';
        api.getConsultant({
            'hospitalid': this.hospitalId,
            'role':3,
            'departmentid': key
          })
          .then(res => {
            this.consultation = res.data
          })
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) { 
        let vm = this;
        vm.progress={};
        if(vm.uploadinfo.length==0)
          return;
        let name = file.response.data.name;
        for (let i in vm.uploadinfo) {
          if (vm.uploadinfo[i].newname == name) {
            vm.uploadinfo.splice(i, 1);
            return;
          }
        }
      },
      saveMedicalrecord(id) {
        let vm = this;
       // alert(vm.uploadinfo.length);
        for (let i in vm.uploadinfo) {
          vm.uploadinfo[i].applyrecordid = id
         // alert(JSON.stringify(vm.uploadinfo[i]));
          api.postMedicalrecord(vm.uploadinfo[i])
            .then(res => {
              if (res.errno!=0) {
                vm.$message.error('保存病历信息失败！');
                return;
              }
            })
        }
      },
      handleAvatarSuccess(res, file) {
        let vm = this;
        //alert(JSON.stringify(res.data))
        //console.log(res)
        let params = {
          'originalname': res.data.originalFilename,
          'newname': res.data.name,
          'size': res.data.size
        };
        vm.uploadinfo.push(params);
      },
      handleProgress(event, file){
        //console.log(file)
        this.progress = file;
      },
      beforeAvatarUpload(file) {
        const isLt2G = file.size / 1024 / 1024 /1024< 2;
        if (!isLt2G ) {
          this.$message.error('上传病历文件大小不能超过 2G!');
        }
        return isLt2G ;
      },
      getHospitalData() {
        api.getHospital({
            role: 1
          })
          .then(res => {
            this.hospitalData = res.data;
          })
      }
    },
    created() {
      this.getHospitalData();
      this.form.apply_user_id=this.UserInfo.userid;
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .Cont {
    background: #fff;
   // height: 5.60rem;
    font-size: .16rem;
    padding: .20rem;
    .tab-title {
      border: none;
      min-height: 4.60rem;
      overflow:hidden;
    }
    .tab-cont {
      padding: .40rem .30rem .30rem .50rem; //申请信息style
      overflow:hidden;
      box-sizing: border-box;
    }
    .sub {
      width: 8.00rem;
      margin:.20rem auto;
      .submit {
        font-size:.18rem;
        width: 1.20rem;
        height: .40rem;
      }
    }
  }
  .upload {
    width: 9.50rem;
    height: 4.00rem;
    margin-left: .05rem;
    border-radius: .15rem;
    margin-top: .10rem;
    .upload-demo {
      width: 95%;
      display: inline-block;
      padding: .10rem;
      margin-top: .10rem;
      //border:. 1rem solid #ccc;
      border-radius:.05rem;
      height: 70%;
      margin-bottom: .10rem;
      overflow:auto;
    }
  }
</style>
<style lang="scss">
  .newapply{
    .el-tabs__item.is-active {
      background-color: #abcdef!important;
    }
    .el-input__inner {
      width: 2.35rem;font-size: 0.14rem;height:0.36rem;
     // float: left;
    }
    .el-form-item {
      margin-bottom:0.2rem;
      width: 40%;
      float: left;
      display:flex;justify-content:flex-start;align-items: center;
    }
    .el-form-item__content {
      display: flex; float: none; 
    }
    .el-form-item__label {
     // padding: .11rem .10rem;
      width:1.3rem!important;
      font-size: .14rem;
    } 
    .el-select {
      //float: left;
    }
    .el-upload-dragger{
      width:3.10rem;
      height:.58rem;
      border:none;
      border-radius:0.04rem;
      text-align: left;
    }
    .el-upload {
      text-align: center;
      cursor: pointer;
      bottom:.07rem;
      left: .30rem;
      position: absolute;
    }
    .el-upload-list__item-name {
      text-align: left;
    }
    /* .el-upload-list__item{
      width:88%;
    } */

    .el-select-dropdown__item {/*  名族等下拉选择框 */
      font-size: .14rem;
      padding:.08rem .10rem;
      height: .36rem;
      line-height: 1.5;
    }
  }
  .patientinfo{
    padding: .20rem .30rem .00rem .50rem;
    overflow:hidden;
    .el-form-item {
      width: 100%;float: left;
      box-sizing:border-box;display:flex;justify-content:flex-start;align-items: flex-start;
    }
    .el-form-item__content {
      float: none; display: flex;
    }
    .el-form-item__label {
      width:.68rem!important;
      text-align: left;
   
    } 
    .el-textarea__inner{
      height:.80rem;
      width:8.00rem;
    }
    .el-textarea {
      display: inline-block;
      width: 60%;
      float: left;
    }
  }
  .sub {
    .el-button {padding:0rem!important;font-size:0.16rem;}
  }
</style>