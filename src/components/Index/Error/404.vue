<template>
  <div style="background:#f0f2f5;height:100%;">
    <div class="wscn-http404">
      <div class="pic-404"> 
         <img class="pic-404__parent" src="../../../assets/404.png" alt="404">
      </div>
      <div class="error">
        <div class="error__oops">404!</div>
        
        <div class="error__headline">{{ message }}</div>
        <div class="error__info">请检查您输入的网址是否正确，可点击以下按钮返回主页</div>
        <p class=""><el-button @click="back">返回首页</el-button></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods:{
      back(){
        this.$router.push('/login');
      }
    },
    computed: {
      message() {
        return '未找到相关页面......'
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .wscn-http404 {
    position: relative;
    width: 10.00rem;
    margin: 0 auto;
    padding: .10rem 1.00rem;
    overflow: hidden;
    .pic-404 {
      position: relative;
      float: left;
      width: 6.00rem;
      padding: 1.50rem 0;
      overflow: hidden;
      &__parent {
        width: 100%;
      }
      &__child {
        position: absolute;
        &.left {
          width: .80rem;
          top: .17rem;
          left: 2.20rem;
          opacity: 0;
          animation-name: cloudLeft;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
        &.mid {
          width: .46rem;
          top: .10rem;
          left: 4.20rem;
          opacity: 0;
          animation-name: cloudMid;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1.2s;
        }
        &.right {
          width: .62rem;
          top: 1.00rem;
          left: 5.00rem;
          opacity: 0;
          animation-name: cloudRight;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
        @keyframes cloudLeft {
          0% {
            top: .17rem;
            left: 2.20rem;
            opacity: 0;
          }
          20% {
            top: .33rem;
            left: 1.88rem;
            opacity: 1;
          }
          80% {
            top: .81rem;
            left: .92rem;
            opacity: 1;
          }
          100% {
            top: .97rem;
            left: .60rem;
            opacity: 0;
          }
        }
        @keyframes cloudMid {
          0% {
            top: .10rem;
            left: 4.20rem;
            opacity: 0;
          }
          20% {
            top: .40rem;
            left: 3.60rem;
            opacity: 1;
          }
          70% {
            top: 1.30rem;
            left: 1.80rem;
            opacity: 1;
          }
          100% {
            top: 1.60rem;
            left: 1.20rem;
            opacity: 0;
          }
        }
        @keyframes cloudRight {
          0% {
            top: 1.00rem;
            left: 5.00rem;
            opacity: 0;
          }
          20% {
            top: 1.20rem;
            left: 4.60rem;
            opacity: 1;
          }
          80% {
            top: 1.80rem;
            left: 3.40rem;
            opacity: 1;
          }
          100% {
            top: 2.00rem;
            left: 3.00rem;
            opacity: 0;
          }
        }
      }
    }
    .error {
      position: relative;
      float: left;
      width: 3.00rem;
      padding: 1.50rem 0;
      overflow: hidden;
      &__oops {
        font-size: .32rem;
        font-weight: bold;
        line-height: .40rem;
        color: #1482f0;
        opacity: 0;
        margin-bottom: .20rem;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }
      &__headline {
        font-size: .20rem;
        line-height: .24rem;
        color: #1482f0;
        opacity: 0;
        margin-bottom: .10rem;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
      }
      &__info {
        font-size: .13rem;
        line-height: .21rem;
        color: grey;
        opacity: 0;
        margin-bottom: .30rem;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
      }
      &__return-home {
        display: block;
        float: left;
        width: 1.10rem;
        height: .36rem;
        background: #1482f0;
        border-radius: 1.00rem;
        text-align: center;
        color: #ffffff;
        opacity: 0;
        font-size: .14rem;
        line-height: .36rem;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
      }
      @keyframes slideUp {
        0% {
          transform: translateY(.60rem);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
</style>
