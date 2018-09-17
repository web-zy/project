<template>
  <div class="news_warp outOf">
    <div class="bar bar-header bar-light">
      <div class="buttons">
        <button class="button button-icon ion-ios-arrow-back" @click="back"></button>
      </div>
      <div class="title">
        <div class="search_wrap">
          <i class="icon ion-ios-search img"></i>
          <input v-model="keywords" class="inp" type="search" placeholder="请输入搜索内容">
          <i v-show="keywords" class="close icon ion-ios-close" @click="keywords = ''"></i>
        </div>
      </div>
      <div class="buttons">
        <div class="button button-icon" style="line-height: 2rem; font-size: 0.75rem;" @click="startSearch">{{msg}}</div>
      </div>
    </div>
    <div id="tge" class="news_nav">
      <a v-for="(v,i) in buttons" :class="[i === navIndex? 'active':'']" :key="i" @click="tabShow(i)">{{v.name}}</a>
    </div>
    <vue-stay v-show="navIndex === 0" ref="childStay" :keyword="keywords" :on-ck="clk" @ck-off="ckOff"></vue-stay>
    <vue-notice v-show="navIndex === 1" ref="childNotice" :keyword="keywords" :on-ck="clk" @ck-off="ckOff"></vue-notice>
    <vue-myapply v-show="navIndex === 2" ref="childMyApply" :keyword="keywords" :on-ck="clk" @ck-off="ckOff"></vue-myapply>
    <!-- <transition name="slide-fade" mode="out-in"></transition> -->
  </div>
</template>

<script>
  import stayDo from '../Staydo.vue';
  import notice from '../Notice.vue';
  import myApply from '../Myapply.vue';

  export default {
    data() {
      return {
        msg: '搜索',
        navIndex: 0,
        buttons: [
          {name:'待办'},
          {name:'通知'},
          {name:'我的申请'}
        ],
        keywords:"",                                     //搜索框关键字
        clk:true
      }
    },
    methods: {
      back(){
        $router.go(-1)
      },
      navTab: function(index) {
        this.navIndex = index;
      },
      startSearch(){
        if(this.keywords == ""){
          $toast.show('请输入要搜索的内容', 1000);
          return;
        }
        let i = this.navIndex;
        this.clk = true;
        i === 0 ? this.$refs.childStay.cartView()   :
        i === 1 ? this.$refs.childNotice.cartView() :
                  this.$refs.childMyApply.cartView();
      },
      tabShow(i){
        this.navIndex = i;
      },
      ckOff(res){
        this.clk = res;
      }
    },
    components:{
      'vue-stay'    : stayDo,
      'vue-notice'  : notice,
      'vue-myapply' : myApply
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .news_warp {
    padding: 4.5rem 0 0;
    width:100vw;
    height: 100vh;
    box-sizing: border-box;
    background:#F5F5F5;
    .search_wrap{
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 14rem;
      height:2.5rem;
      line-height: 2.5rem;
      margin-left: 1.5rem;
      .img{
        position:absolute;
        top:1px;
        left:.6rem;
        font-size:1rem;
      }
      .inp{
        height: 1.5rem;
        line-height: 1.5rem;
        width:100%;
        padding-left: 1.8rem;
        border-radius: 20px;
      }
      .close{
        position:absolute;
        top:1px;
        right:.6rem;
        font-size:1rem;
        color:#666;
      }
    }
    .news_nav {
      display: flex;
      background-color: #f1f1f1;
      margin: 0;
      position: fixed;
      top: 2.5rem;
      z-index: 10;
      width: 100%;
      left: 0;
      height: 2rem;
      line-height: 2rem;
      font-size: 16px;
      justify-content: space-around;
      a {
        flex: 1;
        width: 25%;
        display: block;
        text-align: center;
        background-color: #f1f1f1;
        color: #000000;
        text-decoration: none;
        span {
          display: block;
          width: 100%;
          height: 100%;
        }
        &.active {
          color: black;
          border-bottom: solid 2px #F3C41F;
        }
        span{
          position:relative;
          em{
            display:block;
            position:absolute;
            top: 0;
            right:0.5rem;
          }
        }
      }
    }
  }
</style>
