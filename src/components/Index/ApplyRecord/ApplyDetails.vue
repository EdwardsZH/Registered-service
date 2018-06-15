<!-- 申请记录详情 -->
<template>
  <div class="Cont applydetails">
    <el-tabs type="border-card" class="tab-title">
      <el-tab-pane label="申请信息">
        <div class="modify">
          <ul class="requisition">
            <li><b>专家医院</b>{{tableData.expert_hospital_name}}</li>
            <li><b>病人姓名</b>{{tableData.patient_name}}</li>
            <li><b>专家科室</b>{{tableData.expert_department_name}}</li>
            <li><b>年龄</b>{{tableData.age}}</li>
            <li><b>会诊专家</b>{{tableData.expert_user_name}}</li>
            <li><b>性别</b>{{tableData.sex==1?"男":"女"}}</li>
            <li><b>会诊类型</b>{{tableData.apply_type==1?"普通会诊":"专家会诊"}}</li>
            <li><b>民族</b>{{getNation(tableData.nation)}}</li>
            <li><b>会诊方式</b>{{tableData.apply_method==1?"视频会诊":"普通会诊"}}</li>
            <li><b>婚否</b>{{tableData.marriage==1?"未婚":"已婚"}}</li>
            <li><b>申请医生</b>{{tableData.apply_user_name}}</li>
            <li><b>工作单位</b>{{tableData.company}}</li>
            <li class="patientinfo"><b>病史摘要</b><textarea>{{tableData.medical_hostory}}</textarea></li>
            <li class="patientinfo"><b>诊断以及依据</b><textarea>{{tableData.diagnosis}}</textarea></li>
            <li class="patientinfo"><b>目前诊断与治疗</b><textarea>{{tableData.treatment}}</textarea></li>
            <li class="patientinfo"><b>申请会议目的</b><textarea>{{tableData.apply_purpose}}</textarea></li>
          </ul>
          <el-button v-if="currentData.cmd==2" class="modifyapply" type="primary" @click="handModify">修改申请单</el-button> 
        </div>
      </el-tab-pane>
      <!--病历信息-->
      <el-tab-pane label="病历信息">
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
            <el-badge :value="medicalRecord.totalCount" class="item">
              <el-button class="dge" size="small" type="primary" @click="handleTotal">全部</el-button>
            </el-badge>
          </div>
          <el-table :data="medicalRecord.current" style="width: 1000" height="280" element-loading-text="加载中">
            <el-table-column align="left" prop="originalname" :formatter="formatToSize" label="文件名" width="518"></el-table-column>
            <el-table-column align="center" prop="uploadtime" :formatter="formatDateTime" label="上传日期" width="210"></el-table-column>
            <el-table-column align="center" prop="type" :formatter="formatFiletype" label="文件类型" width="140"></el-table-column>
            <el-table-column align="left" label="操作" class="operation" width="160">
              <template scope="scope">                  
                <div v-if="typeof(scope.row.url)!='undefined'" class="delete">
                    <div v-if="scope.row.type==5">
                      <a :href="scope.row.url+scope.row.dicom_property.patientid" target="_blank">查看</a> 
                    </div>
                    <div v-else>
                      <a :href="scope.row.url+scope.row.newname" target="_blank">查看</a> 
                    </div>
                </div>
                <div v-if="currentData.cmd==2" class="delete">
                  <a href="javascript:;" @click="handleDelete(scope.$index, scope.row)">删除</a>
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
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
          :on-error="handleError"
          :before-upload="beforeAvatarUpload">
          <div v-if="currentData.cmd==2">
            <el-button size="small" type="info" icon="upload2">上传文件</el-button>
          </div>
        </el-upload>
            
      </el-tab-pane>
     <!--会诊报告-->
      <el-tab-pane label="会诊报告">
        <el-form  ref="form" :model="form">
          <div class="report">
            <div v-if="currentData.cmd==1 && tableData.state<2">
              <el-form-item class="diseasename" label="疾病名称">
                <el-input  type="input" v-model="form.disease">
                </el-input>
              </el-form-item> 

              <el-form-item label="诊断意见" >
                <el-input type="textarea" resize="none" v-model="form.diagnosis"></el-input>
              </el-form-item>

              <el-form-item label="处理意见">
                <el-input type="textarea" resize="none" v-model="form.suggestion"></el-input>
              </el-form-item>

              <el-form-item label="建议转诊" >
                <span class="proposal">
                  <el-radio class="radio" v-model="form.referral" label="0">否</el-radio>
                  <el-radio class="radio" v-model="form.referral" label="1">是</el-radio>
                </span>  
              </el-form-item> 
            </div> 
            <div v-else-if="tableData.state==2" class="applyreport">
              <el-form-item class="diseasename" label="疾病名称">
                 {{form.disease}}
              </el-form-item> 

              <el-form-item label="诊断意见" >
                {{form.diagnosis}}
              </el-form-item>

              <el-form-item label="处理意见">
                {{form.suggestion}}
              </el-form-item>

              <el-form-item label="是否转诊" >
                <span class="proposal">
                  <div v-if="form.referral==0">
                     否
                  </div>
                  <div v-else>
                     是
                  </div>
                </span>  
              </el-form-item> 
            </div> 
            <div v-else>
              无可查看报告!
            </div> 

            <div v-if="currentData.cmd==1 && tableData.state<2" class="uploaddemo">        
              <el-upload
                class="uploaddemo"
                :action=medicalRecord.uploadUrl 
                :on-success="handleAvatarSuccess_1"
                :on-remove="handleRemove_1"
                :before-upload="beforeAvatarUpload_1">
                <el-form-item label="附件" style="width=90" ></el-form-item>
                <el-button class="file" size="small" icon="upload2" type="primary"></el-button>
              </el-upload> 
              <el-button class="save" size="small" type="primary" @click="handReport">保存报告
              </el-button>
            </div>
            <div v-else-if="tableData.state==2">
              <el-table :data="form.attachData" height="150" element-loading-text="加载中">
                <el-table-column align="left" prop="originalname" :formatter="formatToSize" label="附件">
                </el-table-column>
                <el-table-column align="left" label="" width="80">
                  <template scope="scope">
                    <a :href="medicalRecord.uploadUrl+scope.row.newname" target="_blank">查看</a> 
                    <a :href="medicalRecord.uploadUrl+scope.row.newname" download="">下载</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else>
              
            </div>   
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="sub">
      <el-button class="submit" type="primary" @click="handPrint">打印申请单</el-button>
      <el-button class="submit" type="primary" @click="handExport">导出病历</el-button>
      
      <div v-if="currentData.cmd==2">        
          <div v-if="tableData.state==0">
            <el-button class="submit" type="primary" @click="handCancel">取消申请单</el-button>
          </div>
          <div v-else>
            <el-button class="submit" :disabled="true"  @click="handCancel">取消申请单</el-button>  
          </div>
      </div>
      <div v-if="currentData.cmd==1">   
          <div v-if="tableData.state==0">       
            <el-button class="submit" type="primary" @click="handRefuse">拒绝申请单</el-button>
          </div>
          <div v-else>
            <el-button class="submit" :disabled="true"  @click="handRefuse">拒绝申请单</el-button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from 'Vuex';
  import api from '../../../api/api.js'
  import pdfmake from '../../../../pdfmake/build/pdfmake.min.js'
  import vfs_fonts from '../../../../pdfmake/build/vfs_fonts.js'
  pdfmake.vfs = vfs_fonts.pdfMake.vfs;
  export default {
    name: 'v-ApplyRecord',
    data() {
      return {
        tableData:'',
        medicalRecord: {
          allData: [],
          pdf: [],
          picture: [],
          video: [],
          text: [],
          dicom: [],
          other: [],
          current: [],
          pdfCount: 0,
          pictureCount: 0,
          videoCount: 0,
          textCount: 0,
          dicomCount: 0,
          otherCount: 0,
          totalCount:0,
          uploadUrl: process.env.API_ROOT + '/upload/',
          pdfAddress: '/static/pdfjs/web/viewer.html?file=',
          //  vedioAdd: '',
          //  picureAdd: '',
          // textAdd: '',
          dicomAdd: process.env.DICOM_ROOT+'/oviyam2/oviyam?patientID='
        }, //病历信息
        uploadinfo: [], //上传文件数组
        uploadattach: [], //附件数组
        form: { //报告表单
          Data: '',
          attachData: [],
          disease: '',
          referral: '0',
          diagnosis: '',
          suggestion: ''
        },
        id: '', //$route.params路由传参的id,
        timeid:-1,
        reftimes:0,
        currentIndex:0
      }
    },
    computed: {
      ...mapGetters({
        currentData: 'getCurrent',
        aAData: 'getAppplyRecordData',
        aRData: 'getReceiveRecordData',
        Nation:'getNation'
      })
    },
    methods: {
      ...mapActions([
        'getAppplyRecord'
      ]),
      formatToSize(row, column) {
        let bytes = row.size;
        let filesize;
        if (bytes === 0) filesize = '0 B';
        var k = 1000, // or 1024
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
        filesize = (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        return (row.originalname + '   (' + filesize + ')')
      },
      //时间日期格式化,,,
      formatDateTime(row, column) {
        var d = new Date(row.uploadtime);
        //var d2 = d.getFullYear() + "年"+ (d.getMonth() + 1) +"月"+ d.getDate() +"日";
        var d3 = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日" + d.getHours() + "时" + d.getMinutes() + "分";
        return d3
      },
      formatDateTimePreint(time) {
        var d = new Date(time);
        var d3 = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日" + d.getHours() + "时" + d.getMinutes() + "分";
        return d3
      },
      formatFiletype(row, column) {
        let typestring;
        switch (row.type) {
          case 1:
            typestring = 'pdf'
            break;
          case 2:
            typestring = '图片'
            break;
          case 3:
            typestring = '视频'
            break;
          case 4:
            typestring = '文本'
            break;
          case 5:
            typestring = 'DICOM'
            break;
          default:
            typestring = '其它文件'
        }
        return typestring;
      },
      saveMedicalrecord(id) {
        let vm = this;
        if (vm.uploadinfo.length == 0)
          return;
        // alert(vm.uploadinfo.length);
        for (let i in vm.uploadinfo) {
          vm.uploadinfo[i].applyrecordid = id
          // alert(JSON.stringify(vm.uploadinfo[i]));
          api.postMedicalrecord(vm.uploadinfo[i])
            .then(res => {
              if (res.errno != 0) {
                vm.$message.error('保存病历信息失败！');
                return;
              }
            })
        }
      },
      handleRemove(file, fileList) {
        let vm = this;
        let name = file.response.data.name;
        for (let i in vm.uploadinfo) {
          if (vm.uploadinfo[i].newname == name) {
            vm.uploadinfo.splice(i, 1);
            return;
          }
        }
      },
      handleError(err, file, fileList){
          this.$message.error(err);
      },
      handleAvatarSuccess(res, file, fileList) {
       if (res.errno != 0) {
            vm.$message.error('上传病历信息失败！');
            return;
        }

        let vm = this;
        let params = {
          'originalname': res.data.originalFilename,
          'newname': res.data.name,
          'type':-1,
          'size': res.data.size,
          'applyrecordid': vm.id
        };
        // vm.uploadinfo.push(params);
        api.postMedicalrecord(params)
          .then(res => {
            if (res.errno != 0) {
              vm.$message.error('保存病历信息失败！');
              return;
            }
            if(this.timeid!=-1)
             clearInterval(this.timeid); 
             this.setTime(res.data);
          });   
          for (let i in fileList) {
            if(fileList[i].status=='success')
              fileList.splice(i, 1);
          }
      },
      setTime(id){
       // alert(1)
      this.reftimes=0;
      this.medicalCurrentid=id;
       this.timeid=setInterval(this.updateDateMedicalState, 1000); 
      },
      updateDateMedicalState(){
         let vm=this;
         this.reftimes++;
       //  alert(this.reftimes);
         api.getMedicalRecord({'medicalrecordid':this.medicalCurrentid})
         .then(rep=>{
            if (rep.errno == 0) {
             if(vm.reftimes>20){
                clearInterval(this.timeid);
                this.timeid=-1;             
              }
              if(rep.data[0].type!=-1){
                clearInterval(this.timeid);
                this.timeid=-1;
                this.getmedicalrecord(this.id)
              }
            }
         })
      },
      beforeAvatarUpload(file) {

        const isLt2G = file.size / 1024 / 1024 /1024< 2;

        if (!isLt2G ) {
          this.$message.error('上传病历文件大小不能超过 2G!');
        }
        return isLt2G ;
      },
      handleRemove_1(file, fileList) {
        let vm = this;
        let name = file.response.data.name;
        for (let i in vm.uploadattach) {
          if (vm.uploadattach[i].newname == name) {
            vm.uploadattach.splice(i, 1);
            return;
          }
        }
      },
      handleAvatarSuccess_1(res, file, fileList) {
        let vm = this;
        let params = {
          'originalname': res.data.originalFilename,
          'newname': res.data.name,
          'size': res.data.size
        };
        vm.uploadattach.push(params);
      },
      beforeAvatarUpload_1(file) {
         const isLt2G = file.size / 1024 / 1024 /1024< 2;
        if (!isLt2G ) {
          this.$message.error('上传附件文件大小不能超过 2G!');
        }
        return isLt2G ;
      },
      //获取记录
      getmedicalrecord(recordid) {
        let vmm = this.medicalRecord;
        api.getMedicalRecord({
            'applyrecordid': recordid
          })
          .then(rep => {
            if (rep.errno == 0) {
              vmm.allData=[];
              vmm.pdf=[];
              vmm.picture=[];
              vmm.video=[];
              vmm.text=[];
              vmm.dicom=[];
              vmm.other=[];
              vmm.current=[];
              vmm.pdfCount=0;
              vmm.pictureCount= 0;
              vmm.videoCount=0;
              vmm.textCount=0;
              vmm.dicomCount=0;
              vmm.otherCount=0;
              vmm.totalCount=0;
              for (let i in rep.data) {
                vmm.allData = rep.data;
                 vmm.totalCount +=1;
                if (rep.data[i].type == 1) {
                  rep.data[i].url = process.env.API_ROOT + vmm.pdfAddress;
                  vmm.pdf.push(rep.data[i])
                  vmm.pdfCount += 1;
                } else if (rep.data[i].type == 2) {
                  rep.data[i].url = vmm.uploadUrl;
                  vmm.picture.push(rep.data[i])
                  vmm.pictureCount += 1;
                } else if (rep.data[i].type == 3) {
                  rep.data[i].url = vmm.uploadUrl;
                  vmm.video.push(rep.data[i])
                  vmm.videoCount += 1;
                } else if (rep.data[i].type == 4) {
                  rep.data[i].url = vmm.uploadUrl;
                  vmm.text.push(rep.data[i])
                  vmm.textCount += 1;
                } else if (rep.data[i].type == 5) {
                  rep.data[i].url =vmm.dicomAdd;
                  vmm.dicom.push(rep.data[i])
                  vmm.dicomCount += 1;
                } else if (rep.data[i].type == 0) {
                  vmm.other.push(rep.data[i])
                  vmm.otherCount += 1;
                } else {}
              }
              if(this.currentIndex==0)
                  vmm.current = vmm.allData;
              else if(this.currentIndex==1)
                  vmm.current = vmm.pdf;
              else if(this.currentIndex==2)
                  vmm.current = vmm.picture;
              else if(this.currentIndex==3)
                  vmm.current = vmm.video;
              else if(this.currentIndex==4)
                  vmm.current = vmm.text;
              else if(this.currentIndex==5)
                  vmm.current = vmm.dicom;
              else if(this.currentIndex==6)
                  vmm.current = vmm.other;
              else{}
            }
          })
      },
      getReport(id) {
        let vm = this.form;
        api.getReport({
          'applyrecordid': id
        }).then(rep => {
          // alert(JSON.stringify(rep));
          if (rep.errno == 0) {
            this.tableData.state = 2; //如果报告存在
            vm.Data = rep.data;
            vm.disease = rep.data.disease;
            vm.referral = rep.data.referral;
            vm.diagnosis = rep.data.diagnosis;
            vm.suggestion = rep.data.suggestion;
            this.getReportAttach(rep.data.reportid) //获取附件
          }
        })
      },
      getReportAttach(id) {
        let vm = this.form;
        api.getReportAttach({
          'reportid': id
        }).then(rep => {
          if (rep.errno == 0) {
            vm.attachData = rep.data;
          }
        })
      },
      getNation(key) {
        let vm = this;
        for (var i in vm.Nation) {
          if (vm.Nation[i].key = key) {
            return vm.Nation[i].value;
          }
        }
      },
      getTableData() {
        let vm = this;
        if (vm.currentData == '') {
          alert('currentData 数据不对')
          return;
        }
      //  alert(JSON.stringify(vm.currentData));
        var Data;
        this.id = vm.currentData.applyrecordid;
        if (vm.currentData.cmd == 1) { //接收申请处理
          Data = vm.aRData.data
        } else if (vm.currentData.cmd == 2) { //申请处理
          Data = vm.aAData.data
        }
        if (typeof(Data) != "undefined") { 
          for (let i = 0; i < Data.length; i++) {
            if (Data[i].applyrecordid == this.id) {
              this.tableData = Data[i];
              this.tableData.nation = this.tableData.nation.toString()
              break;
            }
          }
        } 
        //如果因为刷新原因数据丢失根据id重新请求数据
        if(this.tableData==''){
          api.getAppplyRecordById(this.id)
          .then(rep=>{
            if(rep.errno==0){
               this.tableData=rep.data;
                this.tableData.nation = this.tableData.nation.toString()
            }
           
            //alert(JSON.stringify(rep));
          })
        }
      },
      //保存会诊报告
      handReport() {
        let vm = this;
        if (vm.form.disease == '') {
          vm.$message({
            message: '病例名称不能为空!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.diagnosis == '') {
          vm.$message({
            message: '诊断意见不能为空!',
            type: 'warning'
          });
          return;
        }
        if (vm.form.suggestion == '') {
          vm.$message({
            message: '处理意见不能为空!',
            type: 'warning'
          });
          return;
        }
        api.postReport({
            applyrecordid: vm.id,
            disease: vm.form.disease,
            referral: vm.form.referral,
            diagnosis: vm.form.diagnosis,
            suggestion: vm.form.suggestion
          })
          .then(res => {
            if (res.errno != 0) {
              vm.$message.error('保存报告失败！');
              return;
            }
            vm.saveAttch(res.data);
            //修改报告状态
            api.putApplyInfo(vm.id, {
              'state': 2
            }); //会诊已经结束
            vm.tableData.state = 2;
            this.getReport(this.id);
          })
      },
      saveAttch(id) {
        let vm = this;
        //alert(JSON.stringify(vm.uploadattach));
        for (let i in vm.uploadattach) {
          vm.uploadattach[i].reportid = id
          api.postReportAttach(vm.uploadattach[i])
            .then(res => {
              if (res.errno != 0) {
                vm.$message.error('保存附件失败！');
                return;
              }
            })
        }
      },
      dpfmake(cmd,name){
        var dd = {
          content: [{
              text: this.tableData.apply_hospital_name + '远程会诊申请单',
              style: 'header'
            },
            ' \n ',
            ' \n ',
            {
              table: {
                headerRows: 2,
                widths: ['*', '*'],
                body: [
                  ['专家医院: ' + this.tableData.expert_hospital_name, '病人姓名: ' + this.tableData.patient_name],
                  ['专家科室: ' + this.tableData.expert_department_name, '年龄: ' + this.tableData.age],
                  ['会诊专家: ' + this.tableData.expert_user_name, '性别: ' + (this.tableData.sex == 1 ? "男" : "女")],
                  ['专家科室: ' + this.tableData.expert_department_name, '年龄: ' + this.tableData.age],
                  ['会诊类型: ' + (this.tableData.apply_type == 1 ? "普通会诊" : "专家会诊"), '名族: ' + this.getNation(this.tableData.nation)],
                  ['会诊方式: ' + (this.tableData.apply_method == 1 ? "视频会诊" : "普通会诊"), '婚否: ' + (this.tableData.marriage == 1 ? "未婚" : "已婚")],
                  ['申请医生: ' + this.tableData.apply_user_name, '工作单位: ' + this.tableData.company]
                ]
              },
              style: 'body'
            },
            {
              table: {
                headerRows: 0,
                widths: ['*'],
                body: [
                  ['病史摘要: ' + this.tableData.medical_hostory],
                  ['诊断以及依据: ' + this.tableData.diagnosis],
                  ['目前诊断与治疗: ' + this.tableData.treatment],
                  ['申请会议目的: ' + this.tableData.apply_purpose]
                ]
              }
            },
            ' \n ',
            ' \n ',
            ' \n ',
            ' \n ',
            {
              text: '申请日期:' + this.formatDateTimePreint(this.tableData.apply_time),
              style: 'header'
            }
          ],
          styles: {
            header: {
              fontSize: 14,
              bold: true,
              alignment: 'center'
            },
            body: {
              fontSize: 14,
              bold: true,
            },
            anotherStyle: {
              italic: true,
              alignment: 'left'
            }
          },
          defaultStyle: {
            font: 'simsun'
          }
        };
        pdfmake.fonts = {
          simsun: {
            normal: 'simsun.ttf',
            bold: 'simsun.ttf',
            italics: 'simsun.ttf',
            bolditalics: 'simsun.ttf'
          }
        };
        if(cmd==1)
         pdfmake.createPdf(dd).print();
        if(cmd==2)
         pdfmake.createPdf(dd).download(name);
      },
      handPrint() {
        this.dpfmake(1);
      },
      handExport() {
      let name=this.tableData.apply_user_name+'_'+(new Date()).valueOf();
      this.dpfmake(2,name)
      },
      downloadReport() {
        alert('报告')
      },
      handModify() {
        //alert(this.id)
        this.$store.commit("SET_CURRENT", {
          'applyrecordid': this.id,
          'cmd': 2
        });
        this.$router.push('/modifyapply')
      },
      handCancel() {
        let vm = this;
        vm.$confirm('此操作将取消该申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.putApplyInfo(vm.id, {
              state: -1
            })
            .then(res => {
              if (res.errno != 0) {
                vm.$message.error('提交取消申请失败！');
                return;
              }
              vm.tableData.state=-1;
             // vm.$confirm('取消该申请单成功!')
            })
        })
      },
      handRefuse() {
        let vm = this;
        vm.$confirm('此操作将退回该申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.putApplyInfo(vm.id, {
              state: -2
            })
            .then(res => {
              if (res.errno != 0) {
                vm.$message.error('提交取消申请失败！');
                return;
              }
              vm.tableData.state=-2;
              //vm.$confirm('拒绝该申请单成功!')
            })
        })
      },
      handleSee(index, row) {
        this.$router.push('/pdfview')
        //alert(JSON.stringify(row));
      },
      handleDelete(index, row) {
        let vm = this;
        vm.$confirm('此操作将删除此病例信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delMedicalRecord(row.medicalrecordid, {})
            .then(rep => {
              if (rep.errno != 0) {
                vm.$message.error(rep.errmsg);
                return;
              }
              vm.getmedicalrecord(this.id);
            })
        })
      },
      handlePdf() {
        this.medicalRecord.current = this.medicalRecord.pdf;
        this.currentIndex=1;
      },
      handlePicture() {
        this.medicalRecord.current = this.medicalRecord.picture;
        this.currentIndex=2;
      },
      handleVideo() {
        this.medicalRecord.current = this.medicalRecord.video;
        this.currentIndex=3;
      },
      handleText() {
        this.medicalRecord.current = this.medicalRecord.text;
        this.currentIndex=4;
      },
      handleDicom() {
        this.medicalRecord.current = this.medicalRecord.dicom;
        this.currentIndex=5;
      },
      handleOther() {
        this.medicalRecord.current = this.medicalRecord.other;
        this.currentIndex=6;
      },
      handleTotal() {
        this.medicalRecord.current = this.medicalRecord.allData;
        this.currentIndex=0;
      }
    },
    mounted()
    {
     this.timeid1=setInterval(()=>{
     // this.getTableData();
      this.getmedicalrecord(this.id);
    //  this.getReport(this.id);
      }, 1000*30); 
    },
    beforeDestroy()
    {
       clearInterval(this.timeid1);
       clearInterval(this.timeid);
    },
    created() {
      this.getTableData();
      this.getmedicalrecord(this.id);
      this.getReport(this.id);

    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .Cont {
    background: #fff;
    //min-height: 5.60rem;
    font-size: .16rem;
    padding: .20rem;
    .tab-title {
      border: none;
      min-height: 4.60rem;
      overflow: hidden;
      .modify{
        display:flex; justify-content: flex-start;align-items: flex-end;
        .modifyapply{width: 1.20rem;height: .36rem;float: left;margin:0 0 .10rem .20rem;padding:0;font-size:.14rem;}
      }
      .requisition {
        width: 7.00rem;
        height: 4.00rem; border:.01rem solid #becef5;
        border-right:none;
        border-bottom:none;
        margin:.15rem 0rem .05rem .30rem;
        overflow: auto;
          li{
            text-indent:.10rem;
            box-sizing:border-box;
            border:0.01rem solid #becef5;
            border-left:none;
            border-top:none;
            line-height:.32rem;
            width:50%;height:.33rem;
            float:left;
            text-align:left;
            font-size:.14rem;
            b{
              line-height:.32rem;
              width:1.30rem;
              float:left;
              color:#20a0ff;
              background:#eef3ff;
            }
          }
          .patientinfo{
            width:100%;
            height:.50rem;
            padding:0rem!important;
            b{height:.49rem;
            line-height:.40rem;}
            textarea{
              float:left;text-indent:.10rem;line-height:.35rem;
              width:5.68rem;height:.48rem;display:inline-block;
              resize:none;outline:none;border:none;
            }
          }         
      }
      .diseasename {
        height: .35rem!important;
      }
      .operation {
        a {padding:0 .05rem;}
      }
      .file {
        position: relative;
        top: -.36rem;
        left: .55rem;
        z-index: 99;
      }
      .save {
        position: relative;
        bottom: .15rem;
        left: .20rem;
        z-index: 99;
      }
    }
    .sub {
      padding: .20rem;
      margin: 0 auto;
      width: 6.00rem;
      overflow: hidden;
      .submit {
        width: 1.20rem;
        height: .36rem;
        background: #64b8ff;
        float: left;
        margin-right: .20rem;
        display: inline-block;  
      }
    }
   .caseinfo{
      padding-top:.20rem;display: flex;justify-content: flex-start;
      .badge {
        width: 1.20rem;
        float:left;
        .dge {
          margin:.06rem.05rem;
          width:.72rem;
          min-height:.30rem;
        }
      }
    }
    .delete {
      display: inline-block;
    }
    .report {
      border-radius:.05rem;
      min-height: 3.80rem;
      float: left;
    }
    .proposal {
      float: left;.el-radio__label{font-size:.14rem;}
    }
  }
</style>
<style lang="scss">
  .applydetails {
    .el-tabs__item.is-active {
      background-color: #abcdef!important;
    }
    .el-table {
      max-width: 10.3rem !important;
      flex: 1;
      border-radius:.08rem;
      margin-top: .10rem;
    }
    //病例信息的上传样式..
    .upload-demo {
      border: none;
      width: 100%;
      height: 1.00rem;
      margin: 0 auto;
      overflow: auto;
      .el-upload {
        width: 1.03rem;text-align: center;cursor: pointer;float: left;margin: .65rem 0 0 .10rem;
      }
      .el-upload-list {
        width: 9.60rem;
        display: inline-block;
        float: left;margin-left: .05rem;
        overflow: auto;
        min-height: .90rem; 
      }
    }
    .el-table__body-wrapper {
      //height: 2.60rem!important;
      overflow:auto;
    }
    .el-table td {
      border-bottom: none;
    }
    .el-table__row {
      width: 10.00rem!important;
    }
    .el-form {
      padding: .15rem 1.50rem 0 .10rem;
      float: left;
    }
    .el-form-item {
      margin:.05rem .10rem;
      display: inline-block;
      vertical-align: middle;
      width: 96%;
      float: left;
    }
    .el-form-item__content {
      float: left;    line-height: 0.35rem;
    }
    .el-input__inner {
      width: 2.33rem!important;height: .36rem;
      float: left;
    }
    .el-input {
      width: 3.00rem;
    }
    .el-textarea__inner {
      height: .60rem;
      width: 5.00rem;
    }
    .el-form-item__label {
      //text-align: justify;
      //text-align-last: justify;
      padding: .10rem .12rem;
      font-size: .14rem;
    }
    .el-table__row {
      border: none;
    }
  }
  //会诊报告的上传样式..
  .uploaddemo {
    border: none;
    width: 8.00rem;
    height: 1.00rem;
    float:left;
    //margin: 0 auto; overflow:hidden;
    .el-upload {
      width: 1.03rem;text-align: center;cursor: pointer;float: left;
    }
    .upload {
      display: inline-block;
    }
    .el-upload-list {
      width: 4.60rem;
      display: inline-block;
      float: left;margin-left: .25rem;
     // border:.01rem solid #ccc;// border-radius:.08rem;
      overflow: auto;
      height: .90rem; 
    }
    .el-upload-list__item {
      font-size:0.14rem!important;
      text-align: left;
    }
  } 
  //申请记录接收到会诊报告后(input默认不显示.)
  .applyreport {
    .el-input__inner {
      background-color: #fff!important;
      outline: none;
      border-color: #fff!important;
    }
    .el-textarea__inner {
      background-color: #fff!important;
      outline: none;
      border-color: #fff!important;
      border: none;
    }
  }
  //申请记录接收到会诊报告后
  .report {
    .el-table {
      //border-radius:.08rem;
      width: 8.00rem!important;
      margin: .22rem;
      border:none;
      border:.01rem solid #dfe6ec;
    }
    .el-table th.is-left{
      border:none;
      //background: #fff;
    }
    .el-table .cell {
     // background: #fff;
    }
  }
  .sub {
    .el-button {padding:0rem!important;font-size:0.16rem;}
  }
  .caseinfo{
    .cell {
      padding:0.05rem 0.25rem!important;
      a {padding:0 0.03rem;}
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
