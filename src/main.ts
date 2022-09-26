import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'

import App from './App.vue'

axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config=>{
    config.params={...config.params,icode:'7D7AD0EA2392E62E'}
    return config
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

