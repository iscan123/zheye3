<template>
    <h1></h1>
</template>
  
<script lang="ts">
  import { defineComponent, PropType ,computed} from 'vue'
  export interface UserProps{
    isLogin:boolean;
    name?:string;
    id?:number;
  }
  
  export default defineComponent({
    name:'GlobalHeader'
  })
</script>