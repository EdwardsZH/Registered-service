<template>
  <div class="content">

    <slot></slot>
  
  </div>
</template>

<script>
  import Levelbar from './Levelbar';
  export default {
    
    data() {
      return {
      }
    },
    components:{
      Levelbar,
    },
    mounted(){

    },
    computed:{
      key() {
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.content {
  display: flex;
  width:100%;//height:5.95rem;overflow: hidden;
  position: absolute;
  top: 0.66rem;
  bottom:0.0rem;
  overflow: hidden;
}
</style>