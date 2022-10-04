<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
          <uploader action="/upload" :beforeUpload="beforeUpload" 
          @file-uploaded-error="onFileUploadedError"
          @file-uploaded="onFileUploaded">
          <template #uploaded="dataProps">
            <img src="dataProps.uploadedData.data.url" width="500"/>
          </template>
        
        </uploader>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps,ResponseType,ImageProps } from '../store'
import ColumnList from '../components/ColumnList.vue'
import Uploader from '@/components/Uploader.vue'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList,
    Uploader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    const list = computed(() => store.state.columns)
    const beforeUpload=(file:File)=>{
      const isJPG=true;
      // const isJPG=file.type==='jpeg/png'
      // if(!isJPG){
      //  createMessage('上传图片只能是jpg格式','error')
      // }
      return isJPG
    }
    //返回到给你的数据都会有通用的格式 
    //去 swagger那个网站看  所以我们可以直接在store.ts里面去定义类
    //然后就可以通过那个类 他自动给我们提示里面有哪些属性了 就能更享受到ts类型的帮助

    const onFileUploaded=(rawData:ResponseType<ImageProps>)=>{
          createMessage(`上传图片id${rawData.data._id}`,'success')
    }
    const onFileUploadedError=(error:any)=>{
            createMessage(`上传图片失败,原因为${error}`,'error')
    }
    return {
      list,
      beforeUpload,
      onFileUploaded,
      onFileUploadedError
    }
  }
})
</script>
