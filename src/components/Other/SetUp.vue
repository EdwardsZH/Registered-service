<!-- 新增申请记录 -->        
<template>
  <div class="Cont">
    <el-tabs type="border-card" class="tab-title setUp">
      <el-tab-pane label="基本设置">
        <el-form class="tab-cont" ref="form" :model="setUp" label-width="120">
          <el-form-item label="专家医院新增申请">
            <el-switch on-text="" off-text="" v-model="setUp.expert_allow_apply"></el-switch>
          </el-form-item>
          <el-form-item label="申请医院接受申请">
            <el-switch on-text="" off-text="" v-model="setUp.user_allow_receive"></el-switch>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <p class="sub">
      <el-button class="submit" type="primary" @click="handleBaseOk">确定</el-button>
      <el-button class="submit" @click="handleBaseCancel">取消</el-button>
    </p>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'Vuex';
  import api from '../../api/api.js'
  export default {
    data() {
      return {
        
      }
    },
    computed: {
      ...mapGetters({
        setUp: 'getSetup'
      })
    },
    methods: {
      onSubmit(params) {

      },
      handleBaseOk() {
        let vm=this
        let params={
          'expert_allow_apply':Number(vm.setUp.expert_allow_apply),
          'user_allow_receive':Number(vm.setUp.user_allow_receive)
          }
         //alert(JSON.stringify(params));
        api.postSetUp(params)
          .then(res => {
            //console.log(res)
            if (res.errno != 0) {
              vm.$message.error('修改设置失败！');
              return;
            }
          });
        vm.$message({
          message: '修改设置成功!',
          type: 'success'
        });
      },
      handleBaseCancel() {
        this.$router.go(-1);
       
      }
    },
    created(){},
    mounted(){}
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .Cont {
    background: #fff; height: 5.60rem; font-size: .16rem;padding: .20rem;
    .tab-title {border: none;height: 4.60rem;overflow: hidden;}
    .tab-cont {padding: .55rem 1.35rem 0 2.00rem; overflow: hidden;}//申请信息style
    .sub { width: 8.00rem;margin: .30rem auto;
      .submit {font-size: .18rem;width: 1.00rem;height: .40rem;}
    }
  }
</style>
<style lang="scss">
  .setUp {
    .is-active {background-color: #abcdef!important;}
    .el-form-item {margin: 0 .30rem .18rem 0;display: inline-block;vertical-align: middle;width: 45%;float:left;box-sizing: border-box;}
    .el-form-item__content {float: none;}
    .el-form-item__label {padding: .11rem 0;}
  }
</style>