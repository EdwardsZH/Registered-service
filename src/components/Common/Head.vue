<template>
  <div class="header">
    <h1 class="Head">
      <img class="log" src="../../assets/logo.jpg">
      <div class="info">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link photo">
            <span>{{UserInfo.hospitalname}}</span>  
            <span>{{UserInfo.departmentname}}</span>
            <span>{{formatRole()}}</span>
            <span>( {{UserInfo.realname}} )</span>
            <img v-if="UserInfo.photo" :src="faceUrl" alt="头像" >
            <img v-else-if="(UserInfo.role==2)&&(UserInfo.sex==1||UserInfo.sex==0)" src="../../assets/hospital.jpg" >
            <img v-else-if="(UserInfo.sex==1)" src="../../assets/man.jpg" >
            <img v-else-if="(UserInfo.sex==0)" src="../../assets/woman.jpg" >  
            <img v-else src="../../assets/logo.jpg">  
          </span>
          <el-dropdown-menu slot="dropdown" class="dropdown">
            <el-dropdown-item v-if="UserInfo.role!=2" command="seeUserinfo">个人信息</el-dropdown-item>
            <el-dropdown-item command="loginout">切换用户</el-dropdown-item>
            <el-dropdown-item command="changePsd">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </h1>
    <el-dialog class="head" title="修改密码" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form">
        <el-form-item label="旧密码: ">
          <el-input type="password" v-model="form.oldpassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码: ">
          <el-input type="password" v-model="form.newpassword"></el-input>
        </el-form-item>
        <p class="submit">
          <el-button type="primary" @click="handlePassword">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </p>
      </el-form>
    </el-dialog>
    <el-dialog class="head2" title="用户信息" :visible.sync="dialogFormVisible2">
      <el-form ref="form">
        <el-form-item label="所属医院:">
          {{UserInfo.hospitalname}}
        </el-form-item>
        <el-form-item label="所属科室: ">
          {{UserInfo.departmentname}}
        </el-form-item>
        <el-form-item label="用户角色: ">
          {{formatRole()}}
        </el-form-item>
        <el-form-item label="用户职称:">
          {{formatTitle()}}
        </el-form-item>
        <el-form-item label="真实姓名: ">
          {{UserInfo.username}}
        </el-form-item>
        <el-form-item label="联系电话: ">
          {{UserInfo.telephone}}
        </el-form-item>
        <el-form-item label="用户名: ">
          {{UserInfo.username}}
        </el-form-item>
        <el-form-item label="email: ">
          {{UserInfo.email}}
        </el-form-item>
        <el-form-item label="手机: " class="userIntroduce">
          {{UserInfo.mobilephone}}
        </el-form-item>
        <el-form-item label="介绍: " class="userIntroduce">
          <span>{{UserInfo.introduce}} </span>
        </el-form-item>
        <el-form-item label="用户头像:">
          <img v-if="UserInfo.photo" :src="faceUrl" alt="头像">
          <img v-else-if="(UserInfo.role==2)&&(UserInfo.sex==1||UserInfo.sex==0)" src="../../assets/hospital.jpg">
          <img v-else-if="(UserInfo.sex==1)" src="../../assets/man.jpg">
          <img v-else-if="(UserInfo.sex==0)" src="../../assets/woman.jpg">
          <img v-else src="../../assets/logo.jpg">
        </el-form-item>
        <el-form-item class="modify">
          <el-button type="primary" @click="handleModify">修改信息</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog class="head3" title="修改用户信息" :visible.sync="dialogFormVisible3">
      <el-form ref="form" :model="form">
        <el-form-item label="姓名">
          <el-input v-model="form.realname"></el-input>
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

        <el-form-item label="介绍" class="userIntroduce">
          <el-input type="textarea" resize="none"  v-model="form.introduce"></el-input>
        </el-form-item>
       
        <el-form-item label="头像" class="photo">
          <el-upload 
          class="avatar-uploader"
          :action=uploadUrl
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"> 
            <img v-if="UserInfo.photo" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleModifySubmit">确 定</el-button>
        <el-button @click="handleModifyCancle">取 消</el-button>
      </div>  
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters,mapActions,mapMutations,mapState } from 'vuex';
  import api from '../../api/api.js'
  export default {
    data() {
      return {
        faceUrl: '',
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        form: {
          oldpassword: '',
          newpassword: '',
          telephone:'',
          mobilephone:'',
          email:'',
          introduce:'',
          photo:''
        },
        imageUrl: '',
        uploadUrl:process.env.API_ROOT+'/upload/',
      }
    },
    computed: {
      ...mapGetters({
        UserInfo: 'getUserInfo'
      })
    },
    methods: {
      handleCommand(command) {
        if (command == 'loginout') {
          localStorage.removeItem('user');
          this.$store.commit("SET_USERINFO", '');
          this.$router.push('/login');
        }
        if (command == 'changePsd') {
          this.dialogFormVisible = true;
        }
        if (command == 'seeUserinfo') {
          this.dialogFormVisible2 = true;
        }
      },
      handlePassword() {
        let vm = this;
        if (vm.form.oldpassword == '') {
          vm.$message({
            message: '必须填写旧密码!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.newpassword == '') {
          vm.$message({
            message: '必须填写新密码!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.newpassword == vm.form.oldpassword) {
          vm.$message({
            message: '新旧密码不能相同!',
            type: 'warning'
          });
          return;
        }
        api.moddifyPsd({
            order: 2,
            userid: vm.UserInfo.userid,
            oldpassword: vm.form.oldpassword,
            newpassword: vm.form.newpassword
          })
          .then(rep => {
            if (rep.errno != 0) {
              vm.$message.error(rep.errmsg);
              vm.form.oldpassword = '';
              vm.form.newpassword = '';
              vm.dialogFormVisible = false;
              return;
            }
          })
        vm.form.oldpassword = '';
        vm.form.newpassword = '';
        vm.dialogFormVisible = false;
      },
      handleModify() {
        let vm=this;
        vm.dialogFormVisible2 = false;
        vm.dialogFormVisible3 = true;
        vm.form.realname = vm.UserInfo.realname;
      
        vm.form.telephone = vm.UserInfo.telephone;
        vm.form.mobilephone=vm.UserInfo.mobilephone;
        vm.form.email=vm.UserInfo.email;
        vm.form.introduce=vm.UserInfo.introduce;
        vm.form.photo=vm.UserInfo.photo;
        vm.imageUrl=vm.uploadUrl+vm.UserInfo.photo;
      },
      handleModifySubmit(){
        let vm=this;
        if (vm.form.realname == '') {
          vm.$message({
            message: '必须填写真实姓名!',
            type: 'warning'
          });
          return;
        }

        let params={};
        params['username'] = vm.UserInfo.username;
        params['modifierid'] = vm.form.userid;
        params['realname'] = vm.form.realname;
        params['telephone'] = vm.form.telephone;
        params['mobilephone'] =vm.form.mobilephone;
        params['introduce'] = vm.form.introduce;
        params['photo'] = vm.form.photo;

       // alert(JSON.stringify(params));
        api.putUser(vm.UserInfo.userid, params)
          .then(rep => {
            if (rep.errno != 0) {
              vm.$message.error(rep.errmsg);
              return;
            }
           api.getUserData(vm.UserInfo.userid)
            .then(res => {
                let data = res.data[0];
                this.$store.commit("SET_USERINFO",data);
                this.user = Object.assign(data);
                localStorage.setItem('user',JSON.stringify(this.user));
                this.faceUrl = process.env.API_ROOT + '/upload/' + this.UserInfo.photo;
            })
            vm.telephone='',
            vm.mobilephone='',
            vm.email='',
            vm.introduce='',
            vm.photo='',
            vm.dialogFormVisible3 = false;
          })
      },
      handleModifyCancle(){
        this.dialogFormVisible3 = false;
      },
      handleCancel() {
        let vm = this;
        vm.form.oldpassword = '';
        vm.form.newpassword = '';
        vm.dialogFormVisible = false;
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
      formatRole() {
        let vm = this;
        if (vm.UserInfo.role == 1) {
          return '超级管理员'
        } else if (vm.UserInfo.role == 2) {
          return '医院管理员'
        } else if (vm.UserInfo.role == 3) {
          return '专家'
        } else if (vm.UserInfo.role == 4) {
          return '申请医生'
        } else if (vm.UserInfo.role == 5) {
          return '专家医生管理员'
        }
      },
      formatTitle() {
        let vm=this;
        if(vm.UserInfo.title==0){
          return '住院医师'
        }else if(vm.UserInfo.title==1){
          return '住院医师'
        }else if(vm.UserInfo.title==2){
          return '副主任医师'    
        }else if(vm.UserInfo.title==3){
          return '主任医师'
        }else{
          return '管理员'
        }
      },
    },

    created() {
      this.faceUrl = process.env.API_ROOT + '/upload/' + this.UserInfo.photo;
      //console.log(this.faceUrl)    
    },
    mounted() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .header {
    width: 100%;
    height: .66rem;
    background: #54b1ff;
    overflow: hidden;
    .submit {
      width: 100%;
      min-height: .40rem;
      margin: 0 auto; // overflow:hidden;
    }
    .modify { margin: .8rem 0 0 .5rem;width: .88rem;}
  }
  .Head {
    font-weight: normal;
    line-height: .66rem;
    font-family: "\5B8B\4F53", sans-serif;
    .log {
      width: 100%;
      height: 100%; //display: inline-block;
      //vertical-align: middle; 
      padding: 0 .33rem;
      float: left;
      font-weight: 900;
      width: 3.47rem;
      height: 0.66rem;
    }
    .info {
      float: right;
      font-size: .14rem;
      color: #fff;
      cursor: pointer;
      .photo {
        span {padding-right:.05rem;}
        img {
          height: .40rem;
          width: .40rem;
          border-radius: .20rem;
        }
      }
      .reset {
        background: #54b1ff;
        border: none;
        color: #fff;
        margin-left: .00rem;
        padding: .10rem .15rem 0 0;
      }
      img {
        display: inline-block;
        vertical-align: middle;
        margin-right: .08rem;
      }
    }
  }
  .Head a {
    color: #fff;
    font-size: .16rem; // text-decoration:none;
    padding-right: .22rem;
  }
</style>
<style lang="scss">
  .header {
    .el-dialog--small {width: 45%;top: 10%!important;margin-bottom:none!important;border-radius: 0.05rem;}
    .el-dialog__body { padding: .20rem;overflow: auto;}
    .el-form-item {width: 45%;box-sizing: border-box;display: flex;justify-content: flex-start;align-items: center;margin-bottom: 0.10rem;float:left;
      img{width:1.25rem;height:1.25rem;border-radius:0.05rem;}
    }
    .el-form-item__content { float: none;display: flex;line-height: .36rem; color:#000;font-size:.15rem;}
    .el-form-item__label {width: 1.2rem!important;}
    .el-input__inner { width: 1.73rem!important;height: 0.36rem;float: left;}
    .el-input { }
    //介绍..宽100%
    .userIntroduce { width:90%!important;float:left;box-sizing: border-box;display:flex;justify-content: flex-start!important;align-items: flex-start;
      .el-form-item__content { text-align: left;}  
      span { height:.75rem;width:3.76rem;overflow-y:auto;line-height: .25rem;word-wrap:break-word;word-break:break-all;}
    }
    .el-button {padding: 0.1rem .15rem;font-size: .14rem;}
  }
  //修改密码..
  .head {
    .el-dialog--small {width: 30%;}
    .el-form-item {width: 100%;box-sizing: border-box;display: flex;align-items: center;justify-content: center;margin-bottom: 0.2rem;}
    .el-form-item__label {padding:.05rem!important;width:auto!important;}
    .el-input__inner {
      width: 1.53rem!important;
      height: 0.36rem;
      float: left;
    }
  }
  //修改用户信息
  .head3 {
    .userIntroduce .el-textarea__inner{height:.85rem;width:4.25rem!important;} 
    .el-dialog__body {padding-bottom: 0rem;}
    .dialog-footer{width:4rem;margin:0 auto;text-align:center;}
    .photo{ 
      .el-form-item__content {width:2.6rem;}
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
  }
  .Head {
    .el-dropdown {
      color: #fff!important;
      font-size: .14rem;
    }
  }
  .dropdown {
    .el-dropdown-menu__item {
      text-align: center!important;
    }
  }
</style>