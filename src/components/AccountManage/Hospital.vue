
<template>
  <div class="hospital Cont">
    <!-- 标题栏搜索等 -->
    <div v-if="UserInfo.role===1">
      <div class="title">
        <div class="titlel">
          <el-radio-group v-model="hospitalType" @change="hosptypeChange">
            <el-radio class="radio" v-model="hospitalType" label="0">申请医院</el-radio>
            <el-radio class="radio" v-model="hospitalType" label="1">专家医院</el-radio>
          </el-radio-group>
          <span>医院等级
            <el-select  @change="hospGradeChange" v-model="hospitalGrade" placeholder="请选择活动区域">
              <el-option label="全部等级" value=""></el-option>
              <el-option label="一级医院" value="1"></el-option>
              <el-option label="二级医院" value="2"></el-option>
              <el-option label="三级医院" value="3"></el-option>
            </el-select>
          </span>
        </div>
        <div class="titler">
          <span>医院名称
            <el-input v-model="hospitalName" placeholder="请输入内容"></el-input>
          </span>
          <span>
            <el-button  type="primary" icon="search" @click="handleSearch">查询</el-button>
            <el-button  type="primary" icon="edit" @click="handleCreate">添加</el-button>
          </span>
        </div>
      </div>
    </div>
    
    <!-- table栏主要内容 -->
    <el-table  :data="hospData.data" element-loading-text="加载中">
      <el-table-column align="center" prop="hospitalname" label="医院名称"></el-table-column>
      <el-table-column align="center" prop="grade" :formatter="formatGrade" label="医院等级"></el-table-column>
      <el-table-column align="center" prop="role" :formatter="formatSex" label="医院类别"></el-table-column>
      <el-table-column align="center" prop="contacts" label="联系人"></el-table-column>
      <el-table-column align="center" prop="mobilephone" label="电话"></el-table-column>
      <el-table-column align="center" prop="createtime" :formatter="formatDateTime" label="创建时间" width="200"></el-table-column>
      <el-table-column align="center" label="操作" width="300">
         <template scope="scope">           
          <el-button size="small" :plain="true" type="success" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <div class="delete" v-if="UserInfo.role===1">
            <el-button size="small" :plain="true" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </div>
          <el-button size="small" :plain="true" type="warning" @click="handleResetPsd(scope.$index, scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div v-if="UserInfo.role===1">
      <div class="block">
        <el-pagination 
            @size-change="sizeChange"
            @current-change="pageIndexChange"      
            v-bind:current-page="hospData.currentPage"
            v-bind:page-size="hospData.numbersPrePage"
            v-bind:page-sizes="pageSizes"
            v-bind:page-count="hospData.totalPages"
            v-bind:total="hospData.count"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    
    <!-- 新增弹窗 --> 
    <el-dialog class="newhospital" v-bind:title="dialogtitle" :visible.sync="dialogFormVisible"  :before-close="handleCreateCancel">
      <el-form ref="form" :model="form">
        <el-form-item label="医院类别" class="hospitaltype">
          <el-radio-group v-model="form.role" >
            <el-radio class="radio" v-model="form.role" label="0">申请医院</el-radio>
            <el-radio class="radio" v-model="form.role" label="1">专家医院</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="医院名称">
          <el-input v-model="form.hospitalname"></el-input>
        </el-form-item>

          <el-form-item v-if="method ==='post'" label="管理员密码">
            <el-input v-model="form.password"></el-input>
          </el-form-item>

        <el-form-item label="医院等级">
          <el-select v-model="form.grade" placeholder="请选择医院等级" >
            <el-option label="一级医院" value="1"></el-option>
            <el-option label="二级医院" value="2"></el-option>
            <el-option label="三级医院" value="3"></el-option>
          </el-select>
        </el-form-item>
                
        <el-form-item label="联系人">
          <el-input v-model="form.contacts"></el-input>
        </el-form-item>

        <el-form-item label="手机">
          <el-input v-model="form.mobilephone"></el-input>
        </el-form-item>

        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>

        <el-form-item label="邮编">
          <el-input v-model="form.zipcode"></el-input>
        </el-form-item>

        <el-form-item label="介绍" class="hospitaltype">
          <el-input type="textarea" resize="none" v-model="form.introduce"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCreateSubmit">确 定</el-button>
        <el-button @click="handleCreateCancel">取 消</el-button>
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
        pageSizes: this.pagesizes,
        hospitalType: '1',
        hospitalGrade: '',
        hospitalName: '',
        numsPerPage: 10, //每页条数
        currentPage: 1, //当前页
        dialogtitle: '',
        form: {
          hospitalname: '',
          password:'',
          grade: '',
          role: '',
          contacts: '',
          mobilephone: '',
          address: '',
          zipcode: '',
          introduce: ''
        },
        method: 'post',
        currenthospitalid: '',
        dialogFormVisible: false,
      }
    },
    computed: {
      ...mapGetters({
        UserInfo: 'getUserInfo',
        hospData: 'hospitalTableDataS',
      })
    },
    created() {},
    methods: {
      ...mapActions([
        'getHospitalData',
      ]),
      formatSex(row, column) {
        return row.role == 1 ? '专家医院' : row.role == 0 ? '申请医院' : '未知';
      },
      formatGrade(row, column) {
        if (row.grade == 1)
          return "一级医院"
        else if (row.grade == 2)
          return "二级医院"
        else if (row.grade == 3)
          return "三级医院"
      },
      formatDateTime(row, column) {
          var d = new Date(row.createtime);
          //var d2 = d.getFullYear() + "年"+ (d.getMonth() + 1) +"月"+ d.getDate() +"日";
          var d3 = d.getFullYear() + "年"+ (d.getMonth() + 1) +"月"+ d.getDate() +"日"+d.getHours()+"时"+d.getMinutes()+"分";
          return d3
      },
      //修改每页条数
      sizeChange(numbersPrePage) {
        let vm = this;
        vm.hospData.numsPerPage = numbersPrePage;
        vm.getHospital();
      },
      //翻页
      pageIndexChange(currentPage) {
        let vm = this;
        vm.hospData.currentPage = currentPage;
        vm.getHospital();
      },
      //获取查询医院信息
      getHospital() {
        let vm = this;
        let params = {};
        if(this.UserInfo.role==2){
           params['hospitalid'] =this.UserInfo.hospitalid;
        }else{
          params['hospitalid'] ="";
        }

       
        if (vm.hospitalName != '') {
          params['hospitalname'] = vm.hospitalName;
        }
        if (vm.hospitalType != '') {
          params['role'] = vm.hospitalType;
        }
        if (vm.hospitalGrade != '') {
          params['grade'] = vm.hospitalGrade;
        }
       

        if (JSON.stringify(vm.hospData) == "{}") {
          params['page'] = vm.currentPage;
          params['per_page'] = vm.numsPerPage;
          //alert("a");
        } else {
          params['page'] = vm.hospData.currentPage;
          params['per_page'] = vm.hospData.numsPerPage;
          //  alert(vm.hospData.numbersPrePage);
        }
        vm.getHospitalData(params);
      },
      //医院类型选择
      hosptypeChange(value) {
        let vm = this;
        vm.hospitalType = value;
 
        vm.hospData.page = 1;
        vm.getHospital()
      },
      hospGradeChange(value) {
        let vm = this;
        vm.hospitalName = '';
        vm.hospitalGrade = value;
        vm.hospData.page = 1;
        vm.getHospital()
      },
      handleSearch() {
        let vm = this;
        vm.hospitalGrade = '';
        vm.hospData.page = 1;
        vm.getHospital()
        //alert(vm.hospitalName);
      },
      //修改的方法
      handleEdit(index, row) {
        let vm = this;
        vm.form.hospitalname = row.hospitalname;
        vm.form.grade = row.grade.toString();
        vm.form.role = row.role.toString();
        vm.form.contacts = row.contacts;
        vm.form.mobilephone = row.mobilephone;
        vm.form.address = row.address;
        vm.form.zipcode = row.zipcode;
        vm.form.introduce = row.introduce;
        vm.currenthospitalid = row.hospitalid;
        vm.form.password='';
        vm.method = 'put';
        vm.dialogFormVisible = true;
        vm.dialogtitle = '修改医院';
      },
      handleResetPsd(index, row){
           let vm=this;
            api.moddifyPsd({order:0,hospitalid:row.hospitalid,password:'123456'})
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
      //单个删除
      handleDelete(index, row) {
        let vm = this;
        vm.$confirm('此操作将删除该医院信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delHospital(row.hospitalid)
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.$message({
                message: '删除医院信息成功!',
                type: 'success'
              });
              vm.getHospital()
            })
        })
      },
      handleCreate() {
        let vm = this;
        vm.dialogFormVisible = true;
        vm.method = 'post';
        vm.dialogtitle = '增加医院'
      },
      handleCreateCancel(){
        let vm=this;
          vm.dialogFormVisible = false;
            for (var i in vm.form) {
                vm.form[i] = ''
              };
      },
      //新增提交
      handleCreateSubmit() {
        var vm = this;
        if (vm.form.hospitalname == '') {
          vm.$message({
            message: '医院名不能为空!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.grade == '') {
          vm.$message({
            message: '必须选择医院等级!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.role == '') {
          vm.$message({
            message: '必须选择医院类别!',
            type: 'warning'
          });
          return;
        }
  
        // alert(JSON.stringify(vm.form));
        if (vm.method == 'post') {

         if (vm.form.password== '') {
            vm.form.password='123456';
          }
          let params = vm.form;
          params['creatorid'] = vm.UserInfo.userid;
          api.postHospital(vm.form)
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.$message({
                message: '恭添加医院成功!',
                type: 'success'
              });
             
              vm.hospitalGrade = '';
              vm.hospitalname = '';
              vm.hospData.page = 1;
              vm.getHospital()
              for (var i in vm.form) {
                vm.form[i] = ''
              };
              vm.dialogFormVisible = false;
            })
        }
        if (vm.method == 'put') {
          let params = vm.form;
          params['modifierid'] = vm.UserInfo.userid;
          api.putHospital(vm.currenthospitalid, vm.form)
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.$message({
                message: '修改医院成功!',
                type: 'success'
              });
           
              vm.hospitalGrade = '';
              vm.hospitalname = '';
              vm.hospData.page = 1;
              vm.getHospital()
              for (var i in vm.form) {
                vm.form[i] = ''
              };
              vm.dialogFormVisible = false;
            })
        }
      }
    },
    created() {
    this.getHospital()
    }
  }
</script>
<style scoped lang="scss"> 
  .title {float: left;box-sizing: border-box;width: 100%;text-align: left;padding:.1rem 0.15rem;display:flex;justify-content: space-around;}
  .titlel{width:50%;display:flex;justify-content: space-around;align-items: center;}
  .titler{width:50%;display:flex;justify-content: space-around;align-items: center;}
  /* 分页器 */
  .block {float: right;padding:.10rem .50rem 0 0;}
  .delete{display:inline-block;margin:0 .10rem;}
  .dialog-footer{width:4rem;min-height:.4rem;margin:0 auto;text-align:center;}
</style>
<style lang="scss"> 
  .hospital{
    .el-table {
      border:none;font-size: .14rem;
    }
    /* 标题头部 */
    .title{  
      .el-input__inner {height:0.36rem!important;font-size: .14rem;}
      .el-input {width: 1.53rem;}
      .el-input__icon+.el-input__inner {padding-right: .05rem;}
      .el-button {padding: 0 .1rem!important;font-size:0.16rem;height:0.36rem;}
      //.el-input__inner{width:1.53rem;}
      .el-radio-group {
         .el-radio__label {font-size: .14rem;}
      }
    }
    .el-form{
      height:2.50rem;
    } 
    /* 新增医院。。。 */
    .newhospital{
      .hospitaltype{
        width:90%!important;
        float:left;box-sizing: border-box;display:flex;justify-content: flex-start!important;align-items: center;
        .el-form-item__label{  width:1.15rem;}
      }
      .el-form-item {
        width: 45%;
        float: left;box-sizing:border-box;
        display:flex;align-items: center;justify-content: center;
        margin-bottom:0.2rem;
      }
      .el-form-item__content {
        float: none; display: flex;
      }
      .el-form-item__label {
        width:1.3rem;
      }
      .el-input__inner {
        width:1.7rem!important; font-size:.14rem!important;
      }
       .el-textarea__inner{
        height:.80rem; width:4.55rem!important; font-size:.14rem!important;
      }
      .el-dialog__body{
        padding: .30rem .20rem 0 .2rem;overflow:auto;
      }
      .el-dialog__footer {
        padding: .10rem .20rem .15rem;
        .el-button {
           padding: 0.1rem .15rem;font-size: .14rem;
        }
      }
      .el-radio-group {
        // display: inline-block;
        // float: left;
        .el-radio__label {font-size: .14rem!important;}
      }
    }
    /* 分页器 */
    .block{
      .el-input__inner{
        width:1.10rem;  
      }
    }
  }
</style>