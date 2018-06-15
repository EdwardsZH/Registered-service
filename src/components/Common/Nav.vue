<template>
  <aside class="nav" :class="collapsed?'menu-collapsed':'menu-expanded'">
    <!-- <div class="tools" @click.prevent="collapse">
      <i class="el-icon-d-arrow-left" style="fontSize:.20rem"></i>
    </div> -->
    <!--导航菜单-->
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" router  unique-opened >
      <div v-if="(setUp.expert_allow_apply) || !( _role===3||(_role===2 && hospital_role===1))">
        <el-menu-item class="tab-nav" index="/newapply" >
          <img src="../../assets/01.png"><span>新增申请</span>
        </el-menu-item>
    
        <el-menu-item class="tab-nav" index="/applyrecord" >
          <img src="../../assets/02.png"><span>申请记录</span>
        </el-menu-item>
      </div>
    
      <el-menu-item 
       v-if="(setUp.user_allow_receive) || !(_role===5||_role===4|| hospital_role===0)" 
       class="tab-nav" index="/receiverecord" >
        <img src="../../assets/03.png"><span>接收记录</span>
      </el-menu-item>
      
      <!-- <el-menu-item class="tab-nav" index="4" :route="{path:'/applyrecord'}">
        <img src="../../assets/04.png"><span>统计分析</span>
      </el-menu-item> -->
     
      <el-submenu v-if="(_role===1||_role===2)" class="tab-nav account" index="5">
         <template slot="title" >
           <img src="../../assets/05.png"><span>账号管理</span>
         </template>
         <el-menu-item index="/hospital" :route="{path: leftNav.hospital.url}">
          <span>{{leftNav.hospital.title}}</span>
         </el-menu-item>
       
         <el-menu-item index="/depart" :route="{path: leftNav.depart.url}">
          <span> {{leftNav.depart.title}}</span>
         </el-menu-item>
       
         <el-menu-item index="/user" :route="{path: leftNav.user.url}">
          <span> {{leftNav.user.title}}</span>
         </el-menu-item>   
      </el-submenu>
     
      <el-menu-item v-if="(_role===1||_role===2)" class="tab-nav" index="/setup" >
        <img src="../../assets/06.png"><span>系统设置</span>
      </el-menu-item>
    </el-menu>
    <!--导航菜单-折叠后--> 
    <!-- <el-menu :default-active="$route.path" class="el-menu-vertical-demo collapsed" router v-show="collapsed" ref="menuCollapsed">
      <div v-if="(setUp.expert_allow_apply) || !( _role===3||(_role===2 && hospital_role===1))">
        <el-menu-item class="tab-nav" index="/newapply" >
          <img src="../../assets/01.png">
        </el-menu-item>
    
        <el-menu-item class="tab-nav" index="/applyrecord" >
          <img src="../../assets/02.png">
        </el-menu-item>
      </div>
    
      <el-menu-item 
       v-if="(setUp.user_allow_receive) || !(_role===5||_role===4|| hospital_role===0)" 
       class="tab-nav" index="/receiverecord" >
        <img src="../../assets/03.png">
      </el-menu-item>
      
      <el-menu-item class="tab-nav" index="4" :route="{path:'/applyrecord'}">
        <img src="../../assets/04.png">统计分析
      </el-menu-item>
     
      <el-submenu v-if="(_role===1||_role===2)" class="tab-nav " index="5">
         <template slot="title" >
           <img src="../../assets/05.png">
         </template>
         <el-menu-item index="/hospital" :route="{path: leftNav.hospital.url}">
           {{leftNav.hospital.title}}
         </el-menu-item>
       
         <el-menu-item index="/depart" :route="{path: leftNav.depart.url}">
           {{leftNav.depart.title}}
         </el-menu-item>
       
         <el-menu-item index="/user" :route="{path: leftNav.user.url}">
           {{leftNav.user.title}}
         </el-menu-item>   
      </el-submenu>
    
      <el-menu-item v-if="(_role===1||_role===2)" class="tab-nav" index="/5" >
        <img src="../../assets/05.png">
      </el-menu-item>
     
      <el-menu-item v-if="(_role===1||_role===2)" class="tab-nav" index="/setup" >
        <img src="../../assets/06.png">
      </el-menu-item> 
    </el-menu>  -->
  </aside>  
</template>

<script>
  import { mapGetters, mapActions,mapMutations } from 'vuex';
    export default {  
    data(){
      return{
        index:'',
        _role:'',
        hospital_role:'',
        collapsed:false
      }
    },
    methods: {
      ...mapActions([
          'getSetUpData'
        ]),
      //折叠导航栏
      collapse:function(){
        this.collapsed=!this.collapsed;
      }/*,
      showMenu(i,status){
        this.$refs.menuCollapsed.getElementsByClassName('submenu')[0].style.display=status?'block':'none';
      }*/
    },
    computed:{
      ...mapGetters({
        leftNav:'leftNav',
        userInfo:'getUserInfo',
        setUp:'getSetup'
      })
    },
    created() {
      this.getSetUpData();
      this._role = this.userInfo.role;
      this.hospital_role = this.userInfo.hospital_role;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only-->
<style scoped lang="scss">
  @import './nav.css';
  .nav {
    //width:1.42rem;
    height:100%;
    background:#f3f3f3;
    float:left;
    overflow:hidden;
    .tools{
      padding:0rem .15rem;
      height: .30rem;
      line-height: .30rem;
      cursor: pointer;
      margin:0 auto;
      border-bottom:.01rem solid #dcdcdc;

    }
    .is-active{background:#e0ecff}
    .tab-nav {
      min-height:.70rem;
      list-style:none;
      float:left;
      line-height:.70rem;
      font-size: .16rem;
      border-bottom:.01rem solid #dcdcdc;
      a{
        border-bottom:.01rem solid #dcdcdc;
        text-decoration:none;
        width:1.30rem;
        height:.70rem;
        display:inline-block;
        padding:0.06rem;
        font-size:.16rem;color:#3c92db;
      }   
  	  img{
  			display:inline-block;
  			vertical-align:middle;
        width:0.2rem;height:0.2rem;
  			padding: 0 0.06rem 0 0;
  	  } 
      span{
        width:auto;height:0.18rem;
      }
      .el-submenu__title{
        padding-right:0rem!important;

      } 
    }
    .account{
      span{
        width:auto;height:0.16rem;
      }
    }
  }
  .content {
    aside {
      flex:0 0 1.2rem;
      width: 1.2rem;
    /*   .el-menu{
      height: 100%;
    }
    .collapsed{
      width:.60rem;
      .tab-nav{
        position: relative;
        padding:0 .10rem!important;
        .submenu{
          position:absolute;
          top:0rem;
          left:.60rem;
          z-index:99999;
          width:.80rem;
          height:auto;
          display:none;background:#abcdef;
          :hover{background:#48576a;}
        }
      }
    } */
    }
    .menu-collapsed{
      flex:0 0 .60rem;
      width: .60rem;
    }
    .menu-expanded{
      flex:0 0 1.2rem;
      width: 1.2rem;
    }
  }
</style>
<style lang="scss">
  .el-menu-item{height: 0.70rem;line-height: 0.70rem;padding: 0 .15rem!important;font-size: 0.14rem;}
  .account{
    .el-menu-item{height: .50rem!important;line-height: .50rem!important;padding: 0 .15rem!important;}
    .el-submenu__title{
      font-size:0.16rem;
      height: 0.70rem;
      line-height: 0.70rem;
      padding: 0 .15rem!important;
    }
    .el-submenu__icon-arrow{
      right:0.02rem; margin-top: -0.07rem;
      font-size:.12rem;
    }
  }
</style>
