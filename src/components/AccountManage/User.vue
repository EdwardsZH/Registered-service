<!-- http://192.168.55.9:8579 -->
<template>
  <div class="doctor Cont">
    <!-- 标题栏搜索等 -->
    <div class="title">
      <div class="titlel">
        <el-radio-group v-model="role" @change="userTypeChange">
          <el-radio class="radio" v-model="role" label="3">专家</el-radio>
          <el-radio class="radio" v-model="role" label="4">申请医生</el-radio>
        </el-radio-group> 
        <span>所属医院
          <el-select @change="hospitalChange"  v-model="hospitalId" placeholder="选择所属医院">
            <el-option
              v-for="item in hospData"
              :key="item.hospitalid"
              :label="item.hospitalname"
              :value="item.hospitalid">
            </el-option>
          </el-select>
        </span>
      </div>
      <div class="titler">
        <span>姓名
          <el-input v-model="realName" placeholder="输入用户姓名"></el-input>
        </span>
        <span>
          <el-button  type="primary" icon="search" @click="handleSearch">查询</el-button>
          <el-button  type="primary" icon="edit" @click="handleCreate">添加</el-button>
        </span>
      </div>  
    </div>
    <!-- table栏主要内容 -->
    <el-table :data="userData.data" element-loading-text="拼命加载中">
      <el-table-column align="center" prop="hospitalname" label="医院名称"></el-table-column>
      <el-table-column align="center" prop="realname" label="姓名"></el-table-column>
      <el-table-column align="center" prop="role" :formatter="formatrole" label="用户类型"></el-table-column>
      
      <el-table-column align="center" prop="sex" :formatter="formatSex" label="性别"></el-table-column>
      <el-table-column align="center" prop="title" :formatter="formatTitle" label="职称"></el-table-column>
      <el-table-column align="center" prop="departmentname" label="科室名称"></el-table-column>
      <el-table-column align="center" prop="createtime" label="添加时间" :formatter="formatDateTime" width="200"></el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template scope="scope">           
          <el-button size="small" :plain="true" type="success" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" :plain="true" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button size="small" :plain="true" type="warning" @click="handleResetPsd(scope.$index, scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination 
           @size-change="sizeChange"
           @current-change="pageIndexChange"      
           v-bind:current-page="userData.currentPage"
           v-bind:page-size="userData.numbersPrePage"
           v-bind:page-sizes="pageSizes"
           v-bind:page-count="userData.totalPages"
           v-bind:total="userData.count"
           layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog class="newdoctor" v-bind:title="dialogtitle" :visible.sync="dialogFormVisible" :before-close="handleCreateCancle">
      <el-form ref="form" :model="form" label-width="100">
        <el-form-item label="用户类型" class="usertype">
          <el-radio-group v-model="form.role" >
            <el-radio class="radio" v-model="form.role" label="3">专家</el-radio>
            <el-radio class="radio" v-model="form.role" label="4">申请医生</el-radio>
          </el-radio-group>
        </el-form-item> 

        <el-form-item  label="登录名称">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item  label="真实姓名">
          <el-input v-model="form.realname"></el-input>
        </el-form-item>

        <el-form-item label="所属医院">
          <el-select @change="hospitalChange_dlg"  v-model="form.hospitalid" placeholder="选择所属医院">
            <el-option
              v-for="item in hospData"
              :key="item.hospitalid"
              :label="item.hospitalname"
              :value="item.hospitalid">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item v-if="method ==='post'" label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item> 

          <!--<el-form-item label="用户类型">
            <el-select v-model="form.role" placeholder="请选择用户类型" :value="form.role">
            <el-option label="专家" value="3"></el-option>
            <el-option label="申请医生" value="4"></el-option>
            </el-select>
          </el-form-item>  -->
 
        <el-form-item label="所属科室">
          <el-select   v-model="form.departmentid" placeholder="选择所属科室" >
            <el-option
              v-for="item in departData"
              :key="item.departmentid"
              :label="item.departmentname"
              :value="item.departmentid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="性别">
          <el-select v-model="form.sex" placeholder="请选择性别" >
            <el-option label="女" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职称">
          <el-select v-model="form.title" placeholder="请选择用户职称" >
            <el-option label="住院医师" value="0"></el-option>
            <el-option label="主治医师" value="1"></el-option>
            <el-option label="副主任医师" value="2"></el-option>
            <el-option label="主任医师" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="电话">
             <el-input v-model="form.telephone"></el-input>
        </el-form-item>

        <el-form-item label="手机">
             <el-input v-model="form.mobilephone"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" >
             <el-input v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="介绍" class="usertype">
          <el-input type="textarea" resize="none"  v-model="form.introduce"></el-input>
        </el-form-item>

        <el-form-item label="头像" class="photo">
          <el-upload 
          class="avatar-uploader"
          :action=uploadUrl
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCreateSubmit">确 定</el-button>
        <el-button @click="handleCreateCancle">取 消</el-button>
      </div>  
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapActions,
    mapMutations,
    mapState
  } from 'vuex'
  import api from '../../api/api.js'
  export default {
    name: 'Tablelist',
    data() {
      return {
        hospData:'',
        departData:'',
        pageSizes: this.pagesizes,
        hospitalId: '',//查询条件
        role:'3',
        realName:'',
        userId:'',
        hospitalName:'',
        numsPerPage: 10, //每页条数
        currentPage: 1, //当前页
        dialogtitle: '',
        form: {
          username: '',
          realname: '',
          password:'',
          role:'',
          sex:'',
          hospitalid: '',
          departmentid:'',
          title:'',
          telephone:'',
          mobilephone:'',
          email: '',
          introduce: '',
          photo:''
        },
        imageUrl: '',
        method: 'post',
        currentuserid: '',
        dialogFormVisible: false,
        uploadUrl:process.env.API_ROOT+'/upload/'
      }
    },
    computed: {
      ...mapGetters({
        UserInfo: 'getUserInfo',
        userData: 'userData'
       // hospData: 'hospitalTableDataS'
      })
    },
    created() {},
    methods: {
      ...mapActions([
        'getUserData'
      ]),
      formatSex(row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '';
      },
      formatDateTime(row, column) {
          var d = new Date(row.createtime);
          //var d2 = d.getFullYear() + "年"+ (d.getMonth() + 1) +"月"+ d.getDate() +"日";
          var d3 = d.getFullYear() + "年"+ (d.getMonth() + 1) +"月"+ d.getDate() +"日"+d.getHours()+"时"+d.getMinutes()+"分";
          return d3
      },
     formatrole(row, column) {
        if(row.role==1){
          return '超级管理员'
        }else if(row.role==2){
          return '医院管理员'
        }else if(row.role==3){
          return '专家'    
        }else if(row.role==4){
          return '申请医生'
         }else if(row.role==5){
          return '专家/申请医生'
        }
      },

      formatTitle(row, column) {
        if(row.title==0){
          return '住院医师'
        }else if(row.title==1){
          return '住院医师'
        }else if(row.title==2){
          return '副主任医师'    
        }else if(row.title==3){
          return '主任医师'
        }else{
          return '管理员'
        }
      },

      getHospital(params){
        api.getHospital(params)
        .then(rep=>{
          this.hospData=rep.data;
        })
      },
      getDepart(params){
        api.getDepart(params)
        .then(rep=>{
          this.departData=rep.data;
        })
      },
      //alert(JSON.stringify(row));
      sizeChange(numbersPrePage) {
        let vm = this;
        vm.userData.numsPerPage = numbersPrePage;
        vm.getUser();
      },
      //翻页
      pageIndexChange(currentPage) {
        let vm = this;
        vm.userData.currentPage = currentPage;
        vm.getUser();
      },
      getUser(){
        let vm=this;
        let params = {};
       params['userid']=vm.userId;
       if (vm.hospitalId != '') {
          params['hospitalid'] = vm.hospitalId;
        }

        if(vm.UserInfo.role===2){ 
          params['hospitalid'] = vm.UserInfo.hospitalid;
        } 

        if (vm.hospitalName != '') {
          params['hospitalname'] = vm.hospitalName;
        }

        if (vm.realName != '') {
          params['name'] = vm.realName;
        }

       if (vm.role != '') {
          params['role'] = vm.role;
        }
     
        if (typeof(vm.userData.count) == "undefined") {
          params['page'] = vm.currentPage;
          params['per_page'] = vm.numsPerPage;
        } else {
          params['page'] = vm.userData.currentPage;
          params['per_page'] = vm.userData.numsPerPage;
        }


         // alert(JSON.stringify(params));
        vm.getUserData(params);
      },
  
      //医院类型选择
      hospitalChange(value) {
        

        let vm = this;
        vm.hospitalId=value;
        vm.realName='';
        vm.userData.page = 1;
        vm.getUser();
      },
      //医院类型选择
      hospitalChange_dlg(value) {
        let vm=this;
        vm.getDepart({hospitalid:value});
      },


      userTypeChange(value){
        let vm = this;

        vm.hospitalId = '';
        vm.realName='';

        vm.role=value;
        vm.userData.page = 1;
        vm.getUser();
      },
      handleSearch() {
        let vm = this;
        vm.hospitalId = '';
        vm.userData.page = 1;
        vm.getUser();
      },
      //修改的方法
      handleEdit(index, row) {
        let vm = this;

        vm.form.username = row.username;
        vm.form.realname = row.realname;
        vm.form.role = row.role.toString();
        vm.form.sex = row.sex.toString();

        vm.form.hospitalid = row.hospitalid;
        vm.form.departmentid = row.departmentid;
        vm.form.title = row.title.toString();
        vm.form.telephone = row.telephone;
        vm.form.mobilephone=row.mobilephone;
        vm.form.email=row.email;
        vm.form.introduce=row.introduce;
        vm.form.photo=row.photo;
        vm.imageUrl=vm.uploadUrl+row.photo;
        
        vm.currentuserid=row.userid;
        vm.getDepart({'hospitalid':row.hospitalid});
        vm.method = 'put';
        vm.dialogFormVisible = true;
        vm.dialogtitle = '修改用户';
      },
      //单个删除
      handleResetPsd(index, row){
           let vm=this;
            api.moddifyPsd({order:1,userid:row.userid,password:'123456'})
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.$message({
                message: '重置密码成功!',
                type: 'success'
              });

            })
      },
      
      handleDelete(index, row) {
        let vm = this;
        vm.$confirm('此操作将删除用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delUser(row.userid)
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.$message({
                message: '删除用户信息成功!',
                type: 'success'
              });
              vm.getUser();
            })
        })
      },
      handleCreate() {
 
        let vm = this;
        vm.dialogFormVisible = true;
        vm.method = 'post';
        vm.dialogtitle = '增加用户'
      },

      handleAvatarSuccess(res, file) {
      //  alert(JSON.stringify(res));
        this.form.photo=res.data.name;
        this.imageUrl = URL.createObjectURL(file.raw);
        
      },
      beforeAvatarUpload(file) {
        
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!(isJPG||isPNG||isBMP)) {
          this.$message.error('上传头像图片只能是 jpeg、png、bmp 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handleCreateCancle(){
        let vm=this;
        vm.dialogFormVisible = false;
        for (var i in vm.form) {
                vm.form[i] = ''
        };
        vm.imageUrl='';
      },
      //新增提交
      handleCreateSubmit() {
        var vm = this;
        if (vm.form.username == '') {
          vm.$message({
            message: '必须填写用户名!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.realname == '') {
          vm.$message({
            message: '必须填写真实姓名!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.role == '') {
          vm.$message({
            message: '必须选择用户类型!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.sex == '') {
          vm.$message({
            message: '必须选择用户性别!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.hospitalid == '') {
          vm.$message({
            message: '必须选择医院!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.departmentid == '') {
          vm.$message({
            message: '必须选择科室!',
            type: 'warning'
          });
          return;
        }

        if (vm.form.title== '') {
          vm.$message({
            message: '必须选择职称!',
            type: 'warning'
          });
          return;
        }
    

        if (vm.method == 'post') {

          if (vm.form.password== '') {
              vm.form.password='123456';
          }

          let params = vm.form;
          params['creatorid'] = vm.UserInfo.userid;
          api.postUser(vm.form)
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.$message({
                message: '添加用户成功!',
                type: 'success'
              });

              vm.hospitalId = '';
              vm.realName = '';
              vm.userData.page = 1;

              vm.getUser()
              for (var i in vm.form) {
                vm.form[i] = ''
              };
 
              vm.dialogFormVisible = false;
            })
        }
        if (vm.method == 'put') {
          let params = vm.form;
          params['modifierid'] = vm.UserInfo.userid;

      
          api.putUser(vm.currentuserid, vm.form)
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.$message({
                message: '修改用户成功!',
                type: 'success'
              });
              vm.hospitalId = '';
              vm.realName = '';
              vm.getUser();
              for (var i in vm.form) {
                vm.form[i] = ''
              };
              vm.dialogFormVisible = false;
            })
        }
      }
    },
    created() {
      let vm=this;
      if(vm.UserInfo.role===1){
        vm.getHospital();
        vm.getUser();
      }  
      if(vm.UserInfo.role===2){
        vm.hospitalId=vm.UserInfo.hospitalid;
        vm.getHospital({hospitalid:vm.hospitalId});
        vm.getUser();        
      }  
      //alertalert(JSON.stringify(this.userData))   
    }
  }
</script>
<style scoped lang="scss">
  .title {float: left;box-sizing: border-box;width: 100%;text-align: left;padding: .1rem .15rem;display:flex;justify-content: space-around;}
  .titlel{width:50%;display:flex;justify-content: space-around;align-items: center;}
  .titler{width:50%;display:flex;justify-content: space-around;align-items: center;}
  .block {float: right;padding:.10rem .50rem 0 0;}
  .dialog-footer{width:4rem;min-height:.4rem;margin:0 auto;text-align:center;}
  .avatar-uploader .el-upload {
    border:.01rem dashed #d9d9d9;
    border-radius:.06rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 50%;
    float: left;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: .28rem;
    color: #8c939d;
    width: 1.2rem;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
  }
  .dialog{display: inline-block;padding:0.5rem 0rem;vertical-align:middle;}  
</style>
<style lang="scss"> 
  .doctor{
    .el-table {
      border:none;font-size: .14rem;
    }
    .el-table::before {
      background-color: rgba(255,255,255,0.1);
    } 
    .el-table::after {
      width:0rem;
    }
    .title{  
      .el-input__inner {height:0.36rem!important;}
      .el-input {width: 1.53rem;}
      .el-button {padding: 0 .1rem!important;font-size:0.16rem;height:0.36rem;}
      //.el-input__inner{width:1.53rem;}
      .el-radio-group {
         .el-radio__label {font-size: .14rem;}
      }
    }
    .newdoctor{
      .el-dialog__body{
        padding:.2rem .2rem 0 .2rem;overflow:hidden;
      }
      .el-dialog__footer {
        padding: .10rem .20rem ;
        .el-button {
           padding: 0.1rem .15rem;font-size: .14rem;
        }
      }
      // 用户类型
      .usertype{
        width:90%!important;
        float:left;box-sizing: border-box;display:flex;justify-content: flex-start!important;align-items: center;
        .el-form-item__label{  width:1.05rem;}
      }
      // 介绍
     /* .introduce{
       margin-right:.44rem!important;
     } */
      .el-form-item {
        margin-bottom: .10rem;
        float: left;box-sizing:border-box;
        display:flex;align-items: center;justify-content: center;
        width: 45%;
      }
      .el-form-item__content {
        float: none; display: flex;
      }
      .el-input__inner{
        width:1.8rem!important;  
      }
      .el-radio-group {
        // display: inline-block;
        // float: left;
        .el-radio__label {font-size: .14rem!important;}
      }
      .el-form-item__label {
        width:1.3rem;
      } 
      .el-textarea__inner{
        height:.7rem;width:4.65rem!important;
      }
      // 图片img
      .photo{ 
        .el-form-item__content {width:2.3rem;}
      }
      .avatar {
        width: 1.25rem;
        height: 1.25rem;
        display: inline-block;
        float: left;border-radius:0.05rem;
      }
      .avatar-uploader-icon {
         font-size: .28rem;
         color: #8c939d;
         width: 1.25rem;
         height: 1.25rem;
         line-height: 1.25rem;
         text-align: center;
         border-radius:.06rem;
         border:.02rem dashed #abcdef;
      } 
      .el-dialog--small {
        top: 3%!important;margin-bottom:0rem!important;
      }
    }
  }
</style>