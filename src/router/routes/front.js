

  const routes =[
    {
      path: '/login',
      name: '首页',
      component: resolve => require(['@/components/Login/Login.vue'], resolve),
      hidden: true
    },
    {
      path: '/404',
      component: resolve => require(['@/components/Index/Error/404.vue'], resolve),
      name: '',
      hidden: true
    },
    {
      path: '/',
      component: resolve => require(['@/components/Index/Index.vue'], resolve),
      name: '',
      children: [
        { 
          path: '/newapply', 
          component: resolve => require(['@/components/Index/NewApply/NewApply.vue'], resolve), 
          name: '新增申请' 
        },
        { 
          path: '/applyrecord', 
          component: resolve => require(['@/components/Index/ApplyRecord/ApplyRecord.vue'], resolve), 
          name: '申请记录' 
        },
        { 
          path: '/applydetailes', 
          component: resolve => require(['@/components/Index/ApplyRecord/ApplyDetails.vue'], resolve), 
          name: '申请详情' 
        },
        { 
          path: '/receiverecord', 
          component: resolve => require(['@/components/Index/ReceiveRecord/ReceiveRecord.vue'], resolve), 
          name: '接收记录' 
        },
        { 
          path: '/modifyapply', 
          component: resolve => require(['@/components/Index/NewApply/ModifyApply.vue'], resolve), 
          name: '修改申请' 
        },
        { 
          path: '/hospital', 
          component: resolve => require(['@/components/AccountManage/Hospital.vue'], resolve), 
          name: '医院管理' 
        },
        { 
          path: '/depart', 
          component: resolve => require(['@/components/AccountManage/Depart.vue'], resolve), 
          name: '科室管理' 
        },
        { 
          path: '/user', 
          component: resolve => require(['@/components/AccountManage/User.vue'], resolve), 
          name: '医生管理' 
        },
        { 
          path: '/setup', 
          component: resolve => require(['@/components/Other/SetUp.vue'], resolve), 
          name: '系统设置' 
        }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]

export default routes

 

/*import Login from '@/components/Login/Login';
  import Index from '@/components/Index/Index';
  import NewApply from '@/components/Index/NewApply/NewApply';
  import ApplyRecord from '@/components/Index/ApplyRecord/ApplyRecord';
  import ApplyDetails from '@/components/Index/ApplyRecord/ApplyDetails';
  import ReceiveRecord from '@/components/Index/ReceiveRecord/ReceiveRecord';
  import ModifyApply from '@/components/Index/NewApply/ModifyApply';
  import SetUp from '@/components/Other/SetUp';
  import NotFound from '@/components/Index/Error/404.vue';
  import Index from '@/components/Index/Index';
  import Hospital from '@/components/AccountManage/Hospital.vue';
  import Depart from '@/components/AccountManage/Depart.vue';
  import User from '@/components/AccountManage/User.vue';

  const routes =[
    {
      path: '/login',
      name: '首页',
      component: Login,
      hidden: true
    },
    {
      path: '/404',
      component: NotFound,
      name: '',
      hidden: true
    },
    {
      path: '/',
      component: Index,
      name: '',
      children: [
        { path: '/newapply', component: NewApply, name: '新增申请' }
      ]
    },
    {
      path: '/',
      component: Index,
      name: '',
      children: [
        { path: '/applyrecord', component: ApplyRecord, name: '申请记录' }
      ]
    },
    {
      path: '/',
      component: Index,
      name: '',
      children: [
        { path: '/applydetailes', component: ApplyDetails, name: '申请详情' }
      ]
    },
    {
      path: '/',
      component: Index,
      name: '',
      children: [
        { path: '/receiverecord', component: ReceiveRecord, name: '接收记录' }
      ]
    },
    {
      path: '/',
      component: Index,
      name: '',
      children: [
        { path: '/modifyapply', component: ModifyApply, name: '修改申请' }
      ]
    },
    {
      path: '/',
      component: Index,
      name: '',
      children: [
        { path: '/setup', component: SetUp, name: '系统设置' }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]*/
  
/*
  {
      path: '/',
      meta: {
        //meta元素
        requireAuth: true,  
      },
      component: Index,
      children:[
        {
          path: '/newapply',
          name: '新增申请',
          component: NewApply
        },
        {
          path: '/applyrecord',
          name: '申请记录',
          component: ApplyRecord
        },
        {
          path: '/applydetailes',
          name: '申请详情',
          component:ApplyDetails
        },
        {
          path: '/receiverecord',
          name: '接收记录',
          component:ReceiveRecord
        },
        {
          path: '/modifyapply',
          name: '修改申请',
          component:ModifyApply
        },
        {
          path: '/setup',
          name: '系统设置',
          component:SetUp
        }
 
      ]
    },*/