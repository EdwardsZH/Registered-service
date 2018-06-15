<template>
  <div class="container">
    <v-head></v-head>
    <v-content>
      <v-nav></v-nav>
      <transition name="fade" mode="out-in">
        
          <router-view></router-view>
        
      </transition>
    </v-content>
  </div>
</template>

<script>
import vHead from '../Common/Head';
import vNav from '../Common/Nav';
import vContent from '../Common/Content';

export default {
  name: 'Index',
  data () {
    return {
    }
  },
  components:{
    vHead,
    vNav,
    vContent
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
  }
</style>
