<template>
  <div class="dropdown" ref="dropdownRef" >
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
        {{title}}</a>

  <ul class="dropdown-menu" :style="{display:'block'}" v-if="isOpen">
    <slot></slot>
  </ul>
</div>

</template>
  
<script lang="ts">
import { defineComponent, PropType ,computed,ref,onMounted,onUnmounted,watch} from 'vue'
import useClickOutside from '../hooks/useClickOutside'  
  export default defineComponent({
    name:'Dropdown',
    props:{
        title:{
            type:String,
            required:true
        }
    },
    setup(){
        const isOpen=ref(false);
        const dropdownRef=ref<null|HTMLElement>(null);
        const toggleOpen=()=>{
            isOpen.value=!isOpen.value
        };
        const isClickOutside=useClickOutside(dropdownRef)
        //如果在这直接写如果这个isOpen.value和isClickOutside 都是为true的话就关掉
        //是没有意义的 因为这写的函数在setup里面就是挂载的时候只执行一次就不再执行了 更新的时候不会再执行
        //要写可以监测的
        watch(isClickOutside,()=>{
            if(isOpen.value&&isClickOutside.value){
                isOpen.value=false;
            }
        })

        return {
            isOpen,
            toggleOpen,
            dropdownRef
        }

    }
  })
</script>