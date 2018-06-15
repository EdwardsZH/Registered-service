<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb class="app-levelbar" separator="/">
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key="index">
      <router-link v-if='item.redirect==="noredirect"||index==levelList.length-1' to="" class="no-redirect">{{item.name}}</router-link>
      <router-link v-else :to="item.path">{{item.name}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
    export default {
      name:'Levelbar',
      created() {
        this.getBreadcrumb()
      },
      data() {
        return {
          levelList: null
        }
      },
      methods: {
        getBreadcrumb() {
          let matched = this.$route.matched.filter(item => item.name);
          const first = matched[0];
          if (first && (first.name !== '首页' || first.path !== '')) {
            matched = [{ name: '首页', path: '/login' }].concat(matched)
          }
          // console.log('面包屑:',matched);
          this.levelList = matched;
        }
      },
      watch: {
        $route() {
          this.getBreadcrumb();
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .app-levelbar.el-breadcrumb {
        display: block;
        width:100%;
        font-size: 14px;
        line-height: 50px;
        padding-left: 20px;
        float:left;
        border-bottom:1px solid #abcdef;
        .no-redirect{
          color: #97a8be;
          cursor:text;
        }
    }
</style>
