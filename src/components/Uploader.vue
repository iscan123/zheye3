<template>
    <div class="file-upload">
        <div class="file-upload-container"
         @click.prevent="triggerUpload"
        >
        <slot name="loading" v-if="fileStatus==='loading'">
        <button class="btn btn-primary" disabled>正在上传</button>
        </slot>
        <slot name="uploaded" v-else-if="fileStatus==='success'" :upLoadedData="uploadedData">
        <button class="btn btn-primary" disabled>上传成功</button>
        </slot>
        <slot name="default">
            <button class="btn btn-primary">点击上传</button>
        </slot>
        
        
        </div>
        <input type="file" class="file-input d-none" ref="fileInput"
        @change.prevent="handleFileChange"
        >
    </div>
</template>

<script lang="ts">
import { defineComponent, ref,PropType} from 'vue';
import axios from 'axios'

type UploadStatus='ready'|'loading'|'success'|'error'
type CheckFunction=(file:File)=>boolean;
export default defineComponent({
    props:{
      action:{
        type:String,
        required:true
      },
      beforeUpload:{
        type:Function as PropType<CheckFunction>
      }
    },
    emits:['file-uploaded','file-uploaded-error'],
    setup(props,context){
        const fileInput=ref<null|HTMLInputElement>(null)
        const fileStatus=ref<UploadStatus>('ready')
        const uploadedData=ref()
        const triggerUpload=()=>{
            //如果节点存在 
            if(fileInput.value){
                fileInput.value.click()
            }
        }
        const handleFileChange=(e:Event)=>{
            const currentTarget=e.target as HTMLInputElement
            if(currentTarget.files){
                const files=Array.from(currentTarget.files)
                //在loading之前我们应该检查是否满足用户自定义的需求
                if(props.beforeUpload){
                    const result = props.beforeUpload(files[0])
                    //假如不满足条件 就直接return 就完成了我们整个检查的流程
                    if(!result){
                        return
                    }
                }
                fileStatus.value='loading'
                const formData=new FormData()
                //这样才可以去取到文件
                formData.append('file',files[0])
                axios.post(props.action,formData,{
                    headers:{
                        'Content-Type':'multipart/form-data'
                    }
                }).then(resp=>{
                    uploadedData.value=resp.data
                    fileStatus.value='success'
                    context.emit('file-uploaded',resp.data)
                }).catch((error)=>{
                    fileStatus.value='error'
                    context.emit('file-uploaded-error',{error})
                }).finally(()=>{
                    if(fileInput.value){
                        //fileInput.value是拿到那个dom节点
                        //再来个.value是拿到直接的值
                        fileInput.value.value=''
                    }
                })
            }
            
        }
        return{
            uploadedData,
            fileInput,
            triggerUpload,
            handleFileChange,
            fileStatus
        }
    }
})
</script>