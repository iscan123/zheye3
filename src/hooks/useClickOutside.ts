import{ref,onUnmounted,onMounted,Ref} from 'vue'

//确定你需要传入什么函数
//仅仅传入一个dom节点在setup中调用 它是不会变化的
//我们需要传入一个响应式对象 ref的对象 的节点
const useClickOutside=(elementRef:Ref<null|HTMLElement>)=>{
//创建一个ref对象 并且最终要返回告诉用户我们是否点到了外面
const isClickOutside=ref(false);
const handler=(e:MouseEvent)=>{
    if(elementRef.value){
        if(elementRef.value.contains(e.target as HTMLElement)){
            isClickOutside.value=false
        }else{
            isClickOutside.value=true
        }
    }
}
onMounted(()=>{
    document.addEventListener('click',handler) 
 });
 onUnmounted(()=>{
     document.removeEventListener('click',handler)
 })
     return isClickOutside
}

export default useClickOutside