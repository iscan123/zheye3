import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import store from './store'
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
        path: '/signup',
        name: 'signup',
        component: Signup,
        meta: { redirectAlreadyLogin: true }
      },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    }
  ]
})
router.beforeEach((to, from, next) => {
  const {user,token} = store.state
  const {requiredLogin,redirectAlreadyLogin}=to.meta
  if(!user.isLogin){
    if(token){
       //没有login 有token 我们就需要发请求
       //并且要添加那个头部 
       axios.defaults.headers.common.Authorization=`Bearer ${token}`
       //添加默认头部之后开始发请求了
       store.dispatch('fetchCurrentUser').then(()=>{
        if(redirectAlreadyLogin){
            next('/')
        }else{
            next()
        }
       }).catch(e=>{
        console.log(e)
        //它到这失败了说明token没有用了
        store.commit('logout')
        next('login')
       })
    }else{
        if(requiredLogin){
            next('login')
        }else{
            next()
        }
    }
  }else{
    if(redirectAlreadyLogin){
        next('/')
    }else{
        next()
    }
  }
})

export default router