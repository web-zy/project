<template>
    <div>
      <von-header>
        <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="$router.go(-1)"></button>
        <span slot="title" style="line-height: 2.5rem;">关于小蜜蜂</span>
        <div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
      </von-header>
      <div class="center">
        <div class="container">
          <img class="image" src="../../../../../static/work_images/logo-small.png" />
          <p class="title">小蜜蜂V{{version}}</p>
          <p class="text">
            普及小微企业内部信息化管理为核心，致力于打通企业与企业内部信息的交互和深度融合企业和企业之间、
            企业和客户之间、企业和供应商之间社交理念，开发全套的小微企业信息化SaaS平台。公司现已开发小微
            企业实用的进销存管理、合同管理、客户管理、财务管理一体化应用平台，已应用在众多小微企业实际业务中。
          </p>
          <!--<p class="foot">-->
            <!--1、显示版本，可以检测新版本。<br>-->
            <!--2、显示简单介绍。-->
          <!--</p>-->
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        data(){
          return {
            version:"1.0.0"
          }
        }
    }
</script>

<style lang="less" scoped="">
  .center{
    z-index:1;
    position:fixed;
    width:100%;
    height:calc(100vh);
    top:6rem;
    left:0;
    .container{
      width:12rem;
      text-align:center;
      margin:0 auto;
      line-height:1.4;
      .image{
        width:6rem;
      }
      .title{
        font-size:1rem;
        margin-top:.2rem;
      }
      .text{
        font-size:.8rem;
        text-indent:1.6rem;
        text-align: left;
        margin-top:1rem;
        margin-bottom:.4rem;
      }
      .foot{
        font-size:.8rem;
        text-align: left;
      }
    }
  }
</style>
