<template>
  <div class="beemobile-setting">
    <von-header>
      <button class="button button-icon ion-ios-arrow-back" slot="left" @click="$router.go(-1)"></button>
      <span slot="title" style="line-height: 2.5rem;">设置</span>
      <div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
    </von-header>
    <div class="center">
      <ul class="com-list">
        <li class="com-item" @click="$router.forward('/Mines/safe/Safe')">
          账号与安全
        </li>
        <li class="com-item" @click="$router.forward('/Mines/aboutUs/AboutUs')">
          关于小蜜蜂
        </li>
      </ul>
      <div class="quit" @click="quitLogin">退出登录</div>
    </div>
  </div>
</template>

<script>
    export default {
        methods:{
          quitLogin(){
                let _this = this;
                $dialog.confirm({
                  theme: 'ios',
                  title: '确定要退出吗？',
                  cancelText: '取消',
                  okText: '确定'
                }).then(async (res) => {
                  if(res){
                    localStorage.removeItem('pass');
                    localStorage.removeItem('_AMap_mainmcvw');
                    sessionStorage.clear();
                    _this.$router.push({
                        name: 'login',
                    });
                  }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.beemobile-setting{
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color: #eee;
  .center{
    padding-top:2.5rem;
    .com-list{
      margin-top:.5rem;
      .com-item{
        height: 2.2rem;
        line-height:2.2rem;
        margin-top:.25rem;
        padding-left:.5rem;
        background-color:#fff;
        font-size:.7rem;
        color:rgb(85,85,85);
        box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
      }
    }
    .quit{
      height:2.5rem;
      line-height:2.51rem;
      background-color: #fff;
      text-align:center;
      color:rgb(85,85,85);
      font-size: .75rem;
      margin-top:.85rem;
      box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
    }
  }
}
</style>
