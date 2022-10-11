<template>
<div>
    <textarea  ref="textArea"></textarea>
</div>
</template>

<script lang="ts"  setup>
import {ref,onMounted,onUnmounted} from 'vue'
import {defineProps,defineEmits} from 'vue'
import easyMDE, { Options} from 'easymde'
import EasyMDE from 'easymde'
//对应的类型
interface EditorProps{
 modelValue?:string,
 options?:Options;
}
interface EditorEvent {
 (type:'update:modelValue',value:string):void;
 (tye:'change',value:string):void;
 (type:'blur'):void;
}

const props=defineProps<EditorProps>()
const emit =defineEmits<EditorEvent>()
//有了模板需要初始的数据
const textArea=ref<null|HTMLTextAreaElement>(null)
let easyMDEInstance:EasyMDE|null=null
const innerValue=ref(props.modelValue||'')

onMounted(()=>{
    if(textArea.value){
        //组装options
        const config:Options={
            ...(props.options||{}),
            element:textArea.value,
            initialValue:innerValue.value
        }
        easyMDEInstance=new EasyMDE(config)
        //监控对应的事件
        easyMDEInstance.codemirror.on("change",()=>{
            if(easyMDEInstance){
               //拿到当前的值
               const updatedValue=easyMDEInstance.value()
               innerValue.value=updatedValue
               emit('update:modelValue',updatedValue)
               emit('change',updatedValue)
            } 
        })
        easyMDEInstance.codemirror.on("blur",()=>{
            if(easyMDEInstance){
                emit('blur')
            }
        })
    }

})
//销毁对应的实例
onUnmounted(()=>{
    if(easyMDEInstance){
        easyMDEInstance.cleanup()
    }
    easyMDEInstance=null
})

//清空
const clear =()=>{
    //判断实例存在
    if(easyMDEInstance){
        //如果value不加任何的参数是取值 如果加上参数是赋值
        //我们要清空 直接给里面加上个空字符串
        easyMDEInstance.value('')
    }

}
//返回的对应的实例
const getMDEInstance=()=>{
    return easyMDEInstance
}

//如果不是使用setup语法糖的话 就都要return
//如果是使用了setup语法糖(就是我在那个script标签里面写了setup) 我们上面的对应定义的属性和方法都是外面无法访问的
// 需要暴露 使用defineExpose 编译器宏去暴露 
defineExpose({
    clear,
    getMDEInstance
})


</script>

<style>
</style>