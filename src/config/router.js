import Vue from'vue'
import Router from 'vue-router'

Vue.use(Router);
const routes = [
  {
    path:'/',
    meta: {id:'main',icon:'',name:'主页'},
    redirect:'/main',
    component: () => import('@/views/Index'),
    children:[
      {
        path: '/main', name: 'main', meta: {id:'home',icon: 'home', name: '首页'}, component: () => import('@/views/main/Main')
      },
      {
        path: '/member', name: 'member', meta: {id:'member',icon: 'user', name: '会员'}, component: () => import('@/views/member/Index')
      },
      {
        path: '/drugs', name: 'drugs', meta: {id:'drugs',icon: 'medicine-box', name: '药品'}, component: () => import('@/views/drugs/Index'),children: [
          {
            path: '', name: 'drugs', meta: {id:'table', icon: 'medicine-box', name:'药品'}, component: () => import('@/views/drugs/Drugs')
          }
        ]
      },
      {
        path: '/statistics', name: 'statistics', meta: {id:'statistics',icon: 'radar-chart', name: '销售统计'}, component: () => import('@/views/statistics/Index')
      },
      {
        path: '/workers', name: 'workers', meta: {id:'workers',icon: 'solution', name: '员工管理', isShow:false}, component: () => import('@/views/workers/Index')
      },
      {
        path: '/sale', name: 'sale', meta: {id:'sale',icon: 'rise', name: '销量记录'}, component: () => import('@/views/sale/Index')
      }
    ]
  },
  // 登陆页面
  {
    path: '/login', name: 'login', meta: {id:'login',icon:'login',name:'登录'}, component: () => import('@/views/Login')
  }
];


export default new Router({
  mode: 'history',
  routes: routes
})
