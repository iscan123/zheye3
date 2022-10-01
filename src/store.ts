import { createStore,Commit } from 'vuex'
import axios from 'axios'

export interface UserProps {
  isLogin: boolean;
  nickName?:string;
  _id?:string;
  column?:string;
  email?:string;
}
interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}
export interface GlobalErrorProps{
    status:boolean;
    message?:string;
}
export interface GlobalDataProps {
  error:GlobalErrorProps,
  token:string,
  loading:boolean,
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
//抽取的加载的延时函数
const getAndCommit=async(url:string,mutationName:string,commit:Commit)=>{
    const{data}=await axios.get(url)
    commit(mutationName,data)
}

const postAndCommit=async(url:string,mutationName:string,commit:Commit,payload:any)=>{
    const{data}=await axios.post(url,payload)
    commit(mutationName,data)
    return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error:{status:false},
    token:localStorage.getItem('token')||'',
    loading:false,
    columns: [],
    posts: [],
    user: { isLogin: false}
  },
  mutations: {
    // login(state) {
    //   state.user = { ...state.user, isLogin: true, name: 'viking' }
    // },
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    fetchCurrentUser(state,rawData){
        state.user={isLogin:true,...rawData.data}
    },
    setLoading(state,status){
        state.loading=status
    },
    setError(state,e:GlobalErrorProps){
        state.error=e
    },
    login(state, rawData) {
        const {token} =rawData.data
        state.token = token
        localStorage.setItem('token',token)
        axios.defaults.headers.common.Authorization=`Bearer ${token.value}`
       
    },
    
    
  },
  actions: {
    //这个fetchColumns里面本来是一个context
    //然后需要要用context.commit去拿出来这个commit 它直接结构赋值了
    fetchColumns({commit}) {
    //抽象成一个通用的函数
    getAndCommit('/columns','fetchColumns',commit)
    //异步
    //   const {data}=await axios.get('/columns')
    //   commit('fetchColumns',data)
    //同步
    //   axios.get('/columns').then(resp => {
    //     context.commit('fetchColumns', resp.data)
    //   })
    },
    fetchColumn({ commit }, cid) {
    getAndCommit(`/columns/${cid}`,'fetchColumn',commit)
    },
    fetchPosts({ commit }, cid) {
    getAndCommit(`/columns/${cid}/posts`,'fetchPosts',commit)
    },
    fetchCurrentUser({commit}){
    getAndCommit('/user/current','fetchCurrentUser',commit)
    },
    login({commit},payload){
     return postAndCommit('/user/login','login',commit,payload)
    },
    //要返回promise的 记得return
    loginAndFetch({dispatch},loginData){
       return dispatch('login',loginData).then(()=>{
        return dispatch('fetchCurrentUser')
       })
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    }
  }
})

export default store
