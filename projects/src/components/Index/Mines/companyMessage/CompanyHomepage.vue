<template>
  <div class="page">
      <von-header>
          <button class="button button-icon ion-ios-arrow-back" slot="left" @click="$router.go(-1)"></button>
          <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
          <div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
      </von-header>
      <div class="content">
          <scroll class="page-content padding-top" :on-refresh="onRefresh" :on-infinite="onInfinite">
              <item v-for="(item,index) in arr" :key="index" class="com-item">
                  <div class="name">{{item.company_name}}</div>
                  <div class="btn" @click="goManage(index)">管理</div>
              </item>
              <div v-if="infiniteCount"
                   slot="infinite" class="text-center">没有更多信息~</div>
          </scroll>
      </div>
      <div class="btnsub">
          <button @click="$router.push({name:'createCompany',params:{type:'创建公司'}})">创建公司</button>
      </div>
  </div>
</template>

<script>
  import api from '../../../../asset/api.js';
  import Vue from 'vue';

  export default {
      data () {
          return {
              msg:'公司信息',
              page:1,                                                                                      //默认当前页码
              size:20,                                                                                  //每页显示条数
              arr:[],
              infiniteCount:false,
          }
      },
      mounted(){
          this.init();
      },
      methods:{
          async init(done){
              let url = `users/current/mycompanies?token=${api.token}&page=${this.page}&size=${this.size}`;
              let res = await api.get(url);

              if(res.status === 204 || res.status === 504){
                  $toast.show("没有数据",3000);
              }else if(res.status >= 200 && res.status < 300){
                  res = res.data;
                  if(res[0].totals > this.arr.length){
                    this.arr.length == 0 ? this.arr = res : this.arr = this.arr.concat(res);
                    if(done) done();
                    res[0].totals > this.arr.length ? this.infiniteCount = false : this.infiniteCount = true;
                  }
                  return;
              }else{
                  console.log(res.data.errmsg);                         //服务器返回的错误信息
              }
              this.infiniteCount = true;
          },
          onRefresh(done){                                  //刷新
              this.page = 1;
              this.arr = [];
              this.init();
              done();
          },
          onInfinite(done){                             //加载
              if(this.infiniteCount){
                  done();
              }else{
                  this.page = this.page+1;
                  this.init(done);
              }
          },
          goManage(i){
              this.$router.forward({
                  name:"addManagerAndOrgnize",
                  params: {
                    data: this.arr[i]
                  }
              })
          },
      }
  }
</script>


<style lang="less" scoped>
    @import url("../../../establish/commoncss/common.css");
    .page{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100vw;
        height: 100vh;
        padding-top: unset;
    }
    .page .content{
        flex: 1;
        position: relative;
        z-index: 0;
        box-sizing: border-box;
        width: 100vw;
        margin-top: 0.5rem;
    }
    .page-content{
        background-color: #eee;
        padding-top: 0;
        .com-item{
            position:relative;
            height:3rem;
            padding-top:.3rem;
            margin-top:.25rem;
            line-height:1.3rem;
            padding-left:.5rem;
            background-color:#fff;
            box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
            .name{
                font-size:.75rem;
                /*color:#333333;*/
                /*margin-top:2px;*/
                position:absolute;
                height:1.35rem;
                top:.825rem;
            }
            .btn{
                position:absolute;
                width:2.4rem;
                height:1.35rem;
                right:.5rem;
                top:.825rem;
                border:1px solid rgb(243,164,25);
                border-radius: 6px;
                font-size: .7rem;
                text-align:center;
            }
        }
        .com-item:first-child{
            margin-top:.5rem;
        }
        .empty-hint{
            font-size:.9rem;
            text-align: center;
            height:8rem;
            line-height: 8rem;
        }
    }
    .padd_bot_3r{
        padding-bottom:3rem;
    }
</style>
<style>
    .scroll-inner:after{
        content: '';
        display: block;
        width: 100%;
        height: 3rem;
    }
</style>

