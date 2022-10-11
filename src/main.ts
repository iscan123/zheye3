import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'

import App from './App.vue'
import 'easymde/dist/aesymde.min.css'

//要写这个 不然拿不到token
// 替换 baseURL
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// 下面的 icode 值是从慕课网获取的 token 值，可以在课程右侧的项目接口校验码找到
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode:'7D7AD0EA2392E62E'}
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', '7D7AD0EA2392E62E')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '7D7AD0EA2392E62E' }
  }
  return config
})


axios.interceptors.request.use(config=>{
    store.commit('setLoading',true)
    store.commit('setError',{status:false,message:''})
    return config
}
)
axios.interceptors.response.use(config=>{
    store.commit('setLoading',false)
    return config
},e=>{
    const {error}=e.response.data;
    store.commit('setError',{status:true,message:error})
    store.commit('setLoading',false)
    return Promise.reject(error)
}
)
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

