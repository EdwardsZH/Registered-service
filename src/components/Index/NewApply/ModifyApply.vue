<!-- 新增申请记录 -->       
<template>
  <div class="Cont">
    <el-tabs type="border-card" class="tab-title modifyapply">
      <el-tab-pane label="申请信息">
        <el-form class="tab-cont" ref="form" :model="form" label-width="100">
          <el-form-item label="专家医院">
            <el-select @change="hospitalName" v-model="form.expert_hospital_id" placeholder="请选择">
              <el-option v-for="item in hospitalData" :key="item.hospitalid" :label="item.hospitalname" :value="item.hospitalid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病人姓名">
            <el-input  v-model="form.patient_name"></el-input>
          </el-form-item>
          <el-form-item label="专家科室">
            <el-select @change="departmentName" v-model="form.expert_department_id" placeholder="请选择">
              <el-option v-for="item in departmentData" 
              :key="item.departmentid"
               :label="item.departmentname" 
               :value="item.departmentid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input  v-model="form.age"></el-input>
          </el-form-item>
          <el-form-item label="会诊专家">
            <el-select v-model="form.expert_user_id" placeholder="请选择">
              <el-option v-for="item in expertData" :key="item.userid" :label="item.username" :value="item.userid">
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
            <el-select v-model="form.apply_type" placeholder="请选择">
              <el-option label="专家会诊" value="0"></el-option>
              <el-option label="普通会诊" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族">
            <el-select v-model="form.nation" placeholder="请选择">
              <el-option v-for="item in Nation" 
              :key="item.key" 
              :label="item.value" 
              :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会诊方式">
            <el-select v-model="form.apply_method" placeholder="请选择">
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

          <el-form-item v-if="UserInfo.role <= 2" label="申请医生">
            <el-select v-model="form.apply_user_id" placeholder="请选择">
              <el-option :data="form" :key="form.apply_user_id" :label="form.apply_user_name" :value="form.apply_user_id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-else label="申请医生">
            <el-select v-model="form.apply_user_id" placeholder="请选择">
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
            <el-input resize="none" type="textarea" v-model="form.medical_hostory"></el-input>
          </el-form-item>
          <el-form-item label="诊断以及依据">
            <el-input resize="none" type="textarea" v-model="form.diagnosis"></el-input>
          </el-form-item>
          <el-form-item label="目前诊断与治疗">
            <el-input resize="none" type="textarea" v-model="form.treatment"></el-input>
          </el-form-item>
          <el-form-item label="申请会议目的">
            <el-input resize="none" type="textarea" v-model="form.apply_purpose"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- <el-tab-pane label="病历信息">
        <div class="caseinfo">
          <div class="badge">
            <el-badge :value="medicalRecord.dicomCount" class="item">
              <el-button class="dge" size="small" type="primary" @click="handleDicom">dicom</el-button>
            </el-badge>
            <el-badge :value="medicalRecord.pdfCount" class="item">
              <el-button class="dge" size="small" type="primary" @click="handlePdf">pdf</el-button>
            </el-badge>
            <el-badge :value="medicalRecord.pictureCount" class="item">
              <el-button class="dge" size="small" type="primary" @click="handlePicture">图片</el-button>
            </el-badge>
            <el-badge :value="medicalRecord.videoCount" class="item">
              <el-button class="dge" size="small" type="primary" @click="handleVideo">视频</el-button>
            </el-badge>
            <el-badge :value="medicalRecord.textCount" class="item">
              <el-button class="dge" size="small" type="primary" @click="handleText">文本</el-button>
            </el-badge>
            <el-badge :value="medicalRecord.otherCount" class="item">
              <el-button class="dge" size="small" type="primary" @click="handleOther">其它</el-button>
            </el-badge>
          </div>
          <el-table :data="medicalRecord.allData" style="width: 1050" height="280" element-loading-text="加载中">
            <el-table-column align="center" prop="originalname" label="文件名"></el-table-column>
            <el-table-column align="center" prop="size" label="大小"></el-table-column>
            <el-table-column align="center" prop="uploadtime" :formatter="formatDateTime" label="上传日期"></el-table-column>
            <el-table-column align="center" prop="type" :formatter="formatFiletype" label="文件类型"></el-table-column>
            <el-table-column align="center" label="操作" >
              <template scope="scope">                  
                <a :href="scope.row.url+scope.row.newname" target="_blank">查看</a> 
                <a :href="medicalRecord.url+scope.row.newname" download="w3logo">下载</a>
              </template>
              <template scope="scope">                  
                <div v-if="typeof(scope.row.url)!='undefined'" class="delete">
                    <div v-if="scope.row.type==5">
                      <a :href="scope.row.url+scope.row.dicom_property.patientid" target="_blank">查看</a> 
                    </div>
                    <div v-else>
                      <a :href="scope.row.url+scope.row.newname" target="_blank">查看</a> 
                    </div>
                </div>
                <a :href="medicalRecord.uploadUrl+scope.row.newname" download="">下载</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
          <el-upload
              class="upload-demo"
             
              :action=medicalRecord.uploadUrl
              multiple
              :show-file-list="true"
              :on-success="handleAvatarSuccess"
              :on-progress="handleProgress"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload">
              <el-button size="small" type="info" icon="upload2">添加文件</el-button>
          </el-upload>
        
      </el-tab-pane> -->
    </el-tabs>
    <p class="sub">
      <el-button class="submit" type="primary" @click="onSubmit">确认</el-button>
      <el-button class="submit" @click="handleBaseCancel">取消</el-button>
    </p>
  </div>
</template>

<script>

  import {mapGetters,mapActions} from 'Vuex';
  import api from '../../../api/api.js'
  export default {
    name: 'v-ApplyRecord',
    data() {
      return {
        medicalRecord:{
          allData:[],
          pdf:[],
          picture:[],
          video:[],
          text:[],
          dicom:[],
          other:[],
          current: [],
          pdfCount: 0,
          pictureCount: 0,
          videoCount: 0,
          textCount: 0,
          dicomCount: 0,
          otherCount: 0,
          uploadUrl:process.env.API_ROOT+'/upload/' 
        },
        uploadinfo: [], //上传文件数组
        uploadattach: [], //附件数组
        id:'',
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
        activeName: 'second',
        hospitalData: '',
        departmentData: '',
        expertData: '',
        textarea: '',
        hospitalId: '',
        fileList: [],
        progress:{}////上传的进度100%//上传的状态success||fail
      }
    },
    computed: {
      ...mapGetters({
        currentData:'getCurrent',
        UserInfo: 'getUserInfo',
        aRData:'getAppplyRecordData',
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
        if( vm.progress.percentage!="100"||vm.progress.status!="success"){
          if(JSON.stringify(vm.progress) != "{}"){
              vm.$notify.error({
              message: '正在上传病历,请稍后!',
              type: 'warning'
            });
            return;
          }
        };
        vm.form.apply_hospital_id = vm.UserInfo.hospitalid;
        vm.form.apply_hospital_department_id== vm.UserInfo.departmentid;
       // alert(JSON.stringify(vm.form))
        api.putApplyInfo(vm.id,vm.form)
          .then(res => {
            if (res.errno!=0) {
              vm.$message.error('提交修改申请失败！');
              return;
            }
            this.saveMedicalrecord(vm.id);//保存病历资料
            for (let i in vm.form) {
              vm.form[i] = "";
            }
            this.$router.push('/applyrecord');
          })
      },
      handleBaseCancel() {
        this.$router.go(-1);
       
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
            this.departmentData = res.data
          })
      },
      departmentName(key) {
        //console.log(key)
        this.form.expert_user_id='';
        api.getConsultant({
            'hospitalid': this.hospitalId,
            'departmentid': key
          })
          .then(res => {
            this.expertData = res.data
            //alert(JSON.stringify(this.consultation))
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
        if(vm.uploadinfo.length==0)
        return;
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
      formatDateTime(row, column) {
          var d = new Date(row.uploadtime);
          //var d2 = d.getFullYear() + "年"+ (d.getMonth() + 1) +"月"+ d.getDate() +"日";
          var d3 = d.getFullYear() + "年"+ (d.getMonth() + 1) +"月"+ d.getDate() +"日"+d.getHours()+"时"+d.getMinutes()+"分";
          return d3
      },
      formatFiletype(row,column){
        let typestring;
        switch(row.type){
          case 1:
            typestring='pdf'
            break;
          case 2:
            typestring='图片'
            break;
          case 3:
            typestring='视频'
            break;
          case 4:
            typestring='文本'
            break;
          case 5:
            typestring='DICOM'
            break;
          default:
             typestring='其它文件'
        }
        return typestring;
      },
      getHospitalData() {
        api.getHospital({
            role: 1
          })
          .then(res => {
            this.hospitalData = res.data;
          })
      },
      getDepartmentData(params) {
          api.getExpertDepart(params)
          .then(res => {
            this.departmentData = res.data;
          })
      },
      getDepartmentData(params) {
          api.getExpertDepart(params)
          .then(res => {
            this.departmentData = res.data;
          })
      },
      getExpertData(params) {
          api.getConsultant(params)
          .then(res => {
            this.expertData = res.data;
          })
      },   
      getTableData(){
       let vm=this;
       //let form=vm.form;
       // vm.id = vm.$route.params.applyId
        vm.id=vm.currentData.applyrecordid;
        const Data = vm.aRData.data
        for (var i = 0; i < Data.length; i++) {
          if(Data[i].applyrecordid == vm.id){
            vm.tableData = Data[i]; 
            this.form = Object.assign(vm.tableData);
            this.form.sex = this.form.sex.toString();
            this.form.apply_type = this.form.apply_type.toString();
            this.form.apply_method = this.form.apply_method.toString();
            this.form.marriage = this.form.marriage.toString();
            vm.getDepartmentData({'hospitalid':this.form.expert_hospital_id});
            vm.getExpertData({'departmentid':this.form.expert_department_id});
            //alert(JSON.stringify(this.form))
        /*  form.expert_hospital_id=vm.tableData.expert_hospital_id;
            form.expert_department_id=vm.tableData.expert_department_id;
            form.expert_user_id=vm.tableData.expert_user_id;
            form.age=vm.tableData.age;
            form.patient_name=vm.tableData.patient_name;
            form.nation=vm.tableData.nation.toString();
            form.sex=vm.tableData.sex.toString();
            form.apply_type=vm.tableData.apply_type.toString();
            form.apply_method=vm.tableData.apply_method.toString();
            form.apply_user_id=vm.tableData.apply_user_id;
            form.marriage=vm.tableData.marriage.toString();
            form.company=vm.tableData.company;
            form.medical_hostory=vm.tableData.medical_hostory;
            form.diagnosis=vm.tableData.diagnosis;
            form.treatment=vm.tableData.treatment;
            form.apply_hospital_id=vm.tableData.apply_hospital_id;
            form.apply_hospital_department_id=vm.tableData.apply_hospital_department_id;
            form.apply_purpose=vm.tableData.apply_purpose;*/
            break;
          }
        } 
      },
      //获取记录
      getmedicalrecord(recordid){
        api.getMedicalRecord({'applyrecordid':recordid})
          .then(rep => {
            if(rep.errno==0){
                this.medicalRecord.allData=rep.data;
              for(let i in rep.data){
                if(rep.data[i].type==1){
                  this.medicalRecord.pdf.push(rep.data[i])
                }
                else if(rep.data[i].type==2){
                  this.medicalRecord.picture.push(rep.data[i])
                }
                else if(rep.data[i].type==3){
                  this.medicalRecord.video.push(rep.data[i])
                }
                else if(rep.data[i].type==4){
                  this.medicalRecord.text.push(rep.data[i])
                }
                else if(rep.data[i].type==5){
                  this.medicalRecord.dicom.push(rep.data[i])
                }
                else if(rep.data[i].type==0){
                  this.medicalRecord.other.push(rep.data[i])
                }else{

                }
              }
            }
          })
      },
      handlePdf() {
        this.medicalRecord.current = this.medicalRecord.pdf;
      },
      handlePicture() {
        this.medicalRecord.current = this.medicalRecord.picture;
      },
      handleVideo() {
        this.medicalRecord.current = this.medicalRecord.video;
      },
      handleText() {
        this.medicalRecord.current = this.medicalRecord.text;
      },
      handleDicom() {
        this.medicalRecord.current = this.medicalRecord.dicom;
      },
      handleOther() {
        this.medicalRecord.current = this.medicalRecord.other;
      }
    },
    created() {
      this.getHospitalData();
      this.getTableData();
      this.getmedicalrecord(this.id)
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .Cont {
    background: #fff;
    //height: 5.60rem;
    font-size: .16rem;
    padding: .20rem;
    .tab-title {
       border: none;
       min-height: 4.60rem;
       overflow:hidden;
    }
    .tab-cont {
      padding: .40rem .30rem .30rem .50rem; //申请信息style
      overflow:hidden; box-sizing: border-box;
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
    .caseinfo{
      padding-top:.20rem;display: flex;justify-content: flex-start;
      .badge {
        width: 1.20rem;
        float:left;
        .dge {
          margin: .06rem .05rem;
          width:.72rem;
          min-height:.30rem;
        }
      }
    }
    .delete {
      display: inline-block;
    }
  }

</style>
<style lang="scss"> 
  .modifyapply{
    .el-tabs__item.is-active {
      background-color: #abcdef!important;
    }
    .el-input__inner {
      width: 2.35rem;font-size: 0.14rem;height:0.36rem;
    }
    .el-form-item {
      margin-bottom:0.2rem;
      width: 40%;
      float: left;
      box-sizing:border-box;display:flex;justify-content:flex-start;align-items: center;
    }
    .el-form-item__content {
      float: none;display: flex;
    }
    .el-form-item__label {
      font-size: .14rem;
      //padding: .11rem .10rem;
      width:1.3rem!important;
    } 
    .el-table {
      border-radius:.08rem;
      max-width: 10rem !important;
      flex: 1;
      margin-top: .10rem;
    }
    .el-table__body-wrapper {
      overflow-x: hidden;
      overflow-y: auto;
    }
    .el-table td {
      border-bottom: none;
    }
    .upload-demo {
      border: none;
      overflow:auto;
      width: 10.00rem;
      height: 1.00rem;
      margin-left: 1.00rem;
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
      width:8.00rem;
      height:.80rem;
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
  .caseinfo{
    .cell {
      padding:0.05rem 0.25rem!important;
    }
    .badge{
      .el-button--small {
        padding: 0.07rem .09rem;
        font-size: .12rem;
        border-radius: .04rem;
      }
    }
  }
</style>