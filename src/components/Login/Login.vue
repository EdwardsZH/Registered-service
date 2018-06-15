 <template>
  <div class="main">
    <div class="login">
      <h1><img class="log" src="../../assets/logo2.png"></h1>
      <div class="login-con">
        <img src="../../assets/back.png" >
        <ul class="login-ul">
          <li>
            <span><img src="../../assets/login01.png"></span>
            <input class="username" type="text" placeholder="账号" v-model="userName"/>
          </li>
          <li>
            <span><img src="../../assets/login02.png" ></span>
            <input class="pwd" type="password" placeholder="密  码" v-model="passWord"/>
          </li>
          <li>
            <span><img src="../../assets/login03.png" ></span>
            <input class="code1" type="code" placeholder="验证码" v-model="valiCode" @keyup.enter="userLogin"/>
            <i class="code2" @click='createCode'>{{code}}</i> 
          </li>  
          <li v-show="errorMsg" class="message"><b>{{errorMsg}}</b></li>
          <li><button class="btn" type="submit" @click="userLogin">登录</button></li>
        </ul> 
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions,mapMutations } from 'vuex';
import api from '../../api/api.js'

export default {
  name: 'login',
  data () {
    return {
      userName: '',
      passWord: '',
      valiCode: '',
      code:'',
      errorMsg:false,
      user:{}
    }
  },
  computed:{
    ...mapGetters({
      UserInfo:'getUserInfo'
    })
  },
  created() {
    // 随机数字验证码
    this.code = this.createCode();
    //根据vuex的状态自动登录..
    if(this.UserInfo){
      this.userName = this.UserInfo.username;
      this.passWord = '123456';
      //this.userLogin();
    } 
  },
  methods: {
    ...mapActions([
        'getUserInfo',
        'getSetUpData'
      ]),
    //验证用户信息..
    userLogin() {
      //console.log("username: "+this.userName,"password:"+this.passWord,this.valiCode);
      if ( !this.userName || !this.passWord ){ 
        this.errorMsg = true;
        this.errorMsg = '账户和密码不能为空！';
        return false;
      }else if ( !this.valiCode ){
        this.errorMsg = '验证码不能为空！';
        return false;
      }else if ( this.valiCode !== this.code ){
        this.errorMsg = '验证码不正确!';
        this.valiCode='';
        this.createCode();
        return false;
      }else{
        api.login({username:this.userName,password:this.passWord})
          .then( res=>{
            //console.log(res)
            let errdata = res.errno;
            if( errdata == 0){
              let data = res.data;
              this.$store.commit("SET_USERINFO",data);
              this.user = Object.assign(res.data);
              localStorage.setItem('user',JSON.stringify(this.user));
              const userRole = res.data.role;
              const hospitalRole = res.data.hospital_role;
              switch (userRole) {
                case 1:
                  this.$router.push('/applyrecord');
                  break;
                case 2:
                  if(hospitalRole==0)
                    this.$router.push('/applyrecord');
                  else
                    this.$router.push('/receiverecord');
                  break;
                case 3:
                  this.$router.push('/receiverecord');
                  break;
                case 4:
                  this.$router.push('/applyrecord');
                  break;
                default:
                  this.$router.push('/applyrecord');
              }
            }else{
              this.errorMsg = "账号或密码错误！请重新登陆!!"
              this.createCode();
            }
          })
          .catch(error=>{ 
            console.log(error);
            this.$notify.error({title: '错误',message: '服务器没有响应,请稍后再试...'});
          })
      }
    },
    //简单4位验证码..
    createCode(){
      let code = '';
      let codeLength = 4;
      let random = new Array(0,1,2,3,4,5,6,7,8,9);
      for(let i = 0; i < codeLength; i++){
       var index = Math.floor(Math.random()*10);
       code += random[index]; 
      }
     return this.code = code;
    }
  }
}
</script>

Add "scoped" attribute to limit CSS to this component only
<style scoped lang="scss">
  .main{width:100%;height:100%;background:#54b1ff;overflow:auto;}
  .login{
    width: 9.50rem;height: 6.62rem;
    margin: 0 auto ;//.85rem auto;
    img{width:100%;height:100%;cursor:pointer;}
    input{outline:none;}
  }
  .login h1 {
    padding:.60rem 0 .35rem 0;
    .log {display:inline-block;vertical-align:middle;width:6.64rem;height:.85rem;}
  }
  .login-con{
    img{height:4rem; width:4.22rem;}
    border-radius: .20rem;min-height:4.00rem;
    background:#92d2fe;
    .login-ul {
      list-style-type: none;background: #92d2fe;
      width:3.79rem;height:2.80rem;float:right;padding:.90rem .50rem 0rem 0rem!important;
      border-radius: .20rem;
     .message{height:0rem;font-size: large;margin-bottom: 0;color:#900;}
      li {
        float:left;width:3.75rem;height:.45rem;margin-bottom:.18rem;
        input{width:3.0rem;height:.44rem;float:left;text-indent:.10rem;font-size:.16rem;}
        span {width:.48rem;height:.48rem;float:left;background:#64b8ff}
        span img{width:0.22rem;height:.22rem;margin-top:0.13rem;}
        .code1{width:2.06rem;height:.44rem;float:left;margin-right:.05rem;}
        .code2{background:#fff url(../../assets/apple.jpg)no-repeat center;width:.90rem;height:.48rem;line-height:.48rem;float:left;font-size:.28rem;background-size:150% 100%; cursor:pointer;}
      }
    }
    .btn {
      background: #4cabf8;width:3.70rem;height:.45rem;margin-top:.28rem;
      color:#fff;font-size:.28rem;border:none;border-radius:.05rem;cursor:pointer;
    }
  }
</style>