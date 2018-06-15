
<template>
  <div class="depart Cont">
    <!-- 标题栏搜索等 -->
    <div class="title">
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
      <span>科室名
          <el-input v-model="departmentName" placeholder="输入查询科室名"></el-input>
        </span>
      <span>
          <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
          <el-button type="primary" icon="edit" @click="handleCreate">添加</el-button>
        </span>
    </div>
    <!-- table栏主要内容 -->
    <el-table :data="departData.data" element-loading-text="加载中">
      <el-table-column align="center" prop="hospitalname" label="医院名称"></el-table-column>
      <el-table-column align="center" prop="departmentname" label="科室名称"></el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">           
            <el-button size="small" :plain="true" type="success" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="small" :plain="true" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
</template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination 
       @size-change="sizeChange"
       @current-change="pageIndexChange"      
       v-bind:current-page="departData.currentPage"
       v-bind:page-size="departData.numbersPrePage"
       v-bind:page-sizes="pageSizes"
       v-bind:page-count="departData.totalPages"
       v-bind:total="departData.count"
       layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog class="newdepart" v-bind:title="dialogtitle" :visible.sync="dialogFormVisible" :before-close="handleCreateCancel">
      <el-form ref="form" :model="form" label-width="80"> 
        <el-form-item label="所属医院">
          <el-select   v-model="form.hospitalid" placeholder="选择所属医院">
            <el-option
              v-for="item in hospData"
              :key="item.hospitalid"
              :label="item.hospitalname"
              :value="item.hospitalid">
            </el-option>
          </el-select>
        </el-form-item> 

        <el-form-item label="科室名称">
          <el-input v-model="form.departmentname"></el-input>
        </el-form-item>

        <el-form-item label="介绍" class="introduce">
          <el-input type="textarea" resize="none" v-model="form.description"></el-input>
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
        hospData: '',
        pageSizes: this.pagesizes,
        hospitalId: '',
        departmentId: '',
        departmentName: '',
        numsPerPage: 10, //每页条数
        currentPage: 1, //当前页
        dialogtitle: '',
        form: {
          hospitalid: '',
          departmentname: '',
          description: ''
        },
        method: 'post',
        currenthospitalid: '',
        dialogFormVisible: false,
      }
    },
    computed: {
      ...mapGetters({
        UserInfo: 'getUserInfo',
        departData: 'departData'
      })
    },
    created() {},
    methods: {
      ...mapActions([
        'getHospitalData',
        'getDepartData'
      ]),
      //alert(JSON.stringify(row));
      sizeChange(numbersPrePage) {
        let vm = this;
        vm.departData.numsPerPage = numbersPrePage;
        vm.getDepart();
      },
      //翻页
      pageIndexChange(currentPage) {
        let vm = this;
        vm.departData.currentPage = currentPage;
        vm.getDepart();
      },
      //获取查询医院信息
      getHospital(params) {
        api.getHospital(params)
          .then(rep => {
            this.hospData = rep.data;
          })
      },
      getDepart() {
        let vm = this;
        let params = {};
        if (vm.hospitalId != '') {
          params['hospitalid'] = vm.hospitalId;
        }
        if (vm.UserInfo.role === 2)
          params['hospitalid'] = vm.UserInfo.hospitalid;
        if (vm.departmentId != '') {
          params['departmentid'] = vm.departmentId;
        }
        if (vm.departmentName != '') {
          params['departmentname'] = vm.departmentName;
        }
        if (typeof(vm.departData.count) == "undefined") {
          params['page'] = vm.currentPage;
          params['per_page'] = vm.numsPerPage;
          //alert("a");
        } else {
          params['page'] = vm.departData.currentPage;
          params['per_page'] = vm.departData.numsPerPage;
          //  alert(vm.hospData.numbersPrePage);
        }
        vm.getDepartData(params);
      },
      //医院类型选择
      hospitalChange(value) {
        let vm = this;
        vm.hospitalId = value;
        vm.departmentId = '';
        vm.departmentName = '';
        vm.departData.page = 1;
        vm.getDepart();
      },
      handleSearch() {
        let vm = this;
        vm.hospitalId = '';
        vm.departmentId = '';
        vm.departData.page = 1;
        vm.getDepart();
      },
      //修改的方法
      handleEdit(index, row) {
        let vm = this;
        vm.form.hospitalid = row.hospitalid;
        vm.form.departmentname = row.departmentname;
        vm.form.description = row.description;
        vm.currentdepartmentid = row.departmentid;
        vm.method = 'put';
        vm.dialogFormVisible = true;
        vm.dialogtitle = '修改科室';
      },
      //单个删除
      handleDelete(index, row) {
        let vm = this;
        vm.$confirm('此操作将删除该科室信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delDepart(row.departmentid)
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.$message({
                message: '删除科室信息成功!',
                type: 'success'
              });
              vm.getDepart()
            })
        })
      },
      handleCreate() {
        // alert(JSON.stringify(this.departData));
        let vm = this;
        vm.dialogFormVisible = true;
        vm.method = 'post';
        vm.dialogtitle = '增加科室'
      },
      handleCreateCancel() {
        let vm = this;
        vm.dialogFormVisible = false;
        for (var i in vm.form) {
          vm.form[i] = ''
        };
      },
      //新增提交
      handleCreateSubmit() {
        var vm = this;
        // alert(JSON.stringify(this.departData));
        if (vm.form.hospitalid == '') {
          vm.$message({
            message: '必须选择所属医院!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.departmentname == '') {
          vm.$message({
            message: '科室名不能为空!',
            type: 'warning'
          });
          return;
        }
        // alert(JSON.stringify(vm.form));
        if (vm.method == 'post') {
          let params = vm.form;
          params['creatorid'] = vm.UserInfo.userid;
          api.postDepart(vm.form)
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.$message({
                message: '添加科室成功!',
                type: 'success'
              });
              vm.hospitalId = '';
              vm.departmentId = '';
              vm.departmentName = '';
              vm.departData.page = 1;
              vm.getDepart()
              for (var i in vm.form) {
                vm.form[i] = ''
              };
              vm.dialogFormVisible = false;
            })
        }
        if (vm.method == 'put') {
          let params = vm.form;
          params['modifierid'] = vm.UserInfo.userid;
          api.putDepart(vm.currentdepartmentid, vm.form)
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.$message({
                message: '修改科室成功!',
                type: 'success'
              });
              vm.hospitalId = '';
              vm.departmentId = '';
              vm.departmentName = '';
              vm.getDepart()
              for (var i in vm.form) {
                vm.form[i] = ''
              };
              vm.dialogFormVisible = false;
            })
        }
      }
    },
    created() {
      let vm = this;
      if (this.UserInfo.role === 1)
        vm.getHospital();
      if (this.UserInfo.role === 2) {
        vm.hospitalId = vm.UserInfo.hospitalid;
        vm.getHospital({
          hospitalid: vm.hospitalId
        });
      }
      this.getDepart();
    }
  }
</script>
<style scoped lang="scss">
  .title {
    float: left;
    box-sizing: border-box;
    width: 100%;
    text-align: left;
    padding: .1rem 0.15rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .block {
    float: right;
    padding: .10rem .50rem 0 0;
  }
  .dialog-footer {
    width: 3rem;
    min-height: .4rem;
    margin: 0 auto;
    text-align: center;
  }
</style>
<style lang="scss">
   .depart {
     .el-table {
       border: none;
       font-size: .14rem;
     }
     .el-table::before {
       background-color: rgba(255, 255, 255, 0.1);
     }
     .el-table::after {
       width: 0rem;
     }
     .title {
       .el-input__inner {
         height: 0.36rem!important;
       }
       .el-input {
         width: 1.53rem;
       }
       .el-button {
         padding: 0 .1rem!important;
         font-size: 0.16rem;
         height: 0.36rem;
       } //.el-input__inner{width:1.53rem;}
     }
     .newdepart {
       .el-dialog--small {
         width: 30%;
       }
       .el-dialog__body {
         padding: .2rem .2rem 0 .2rem;
         overflow: hidden;
       }
       .el-dialog__footer {
         padding: .10rem .20rem .15rem;
         .el-button {
           padding: 0.1rem .15rem;
           font-size: .14rem;
         }
       }
       .el-form-item {
         margin-bottom: .10rem;
         float: left;
         box-sizing: border-box;
         display: flex;
         align-items: center;
         justify-content: center;
         width: 90%;
       }
       .el-form-item__content {
         float: none;
         display: flex;
       }
       .el-input__inner {
         width: 2.3rem!important;
       }
       .el-form-item__label {
         width: 1rem;
       } // 介绍
       .el-textarea__inner {
         width: 2.3rem;
         height: 1.2rem;
       }
     }
   }
</style>