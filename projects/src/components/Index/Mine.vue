<template>
  <div>
    <von-header>
      <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
    </von-header>
    <div class="center">
      <div class="person" @click="$router.forward('/myMessage')">
        <div class="person-img">
          <head-portrait class="img" :userInfo="data" :size="'large'"></head-portrait>
          <!--<img :src="headUrl + 'files/' + data.head_image_id-->
                        <!--+ '/thumbnail/88?token=' + token + '&company_id=' + company_id" alt=""-->
               <!--v-if="data.head_image_id !== undefined && data.head_image_id.replace(/\s+/g,'') !== ''">-->
          <div class="lastFont" else><span>{{data.name | interception}}</span></div>
        </div>
        <div class="person-wrap">
          <p class="name" v-if="data.name">{{data.name}}</p>
          <p>手机号<span class="phone">：{{data.uid}}</span></p>
        </div>
        <!--<img src="/static/work_images/ma.png">-->
      </div>
      <div class="message" @click="$router.forward('/Mines/companyMessage/CompanyHomepage')">
        <i class="img iconfont icon-CompanyInformation"></i>
        <div class="desc">
          	我的公司
        </div>
        <!--<router-link to="/Mines/workMessage/work">-->
      </div>
      <div class="message" @click="$router.forward('/backwrong')">
        <i class="img iconfont icon-Feedback"></i>
        <div class="desc">
          问题反馈
        </div>
        <!--<span class="right">&gt</span>-->
      </div>
      <div class="message" @click="$router.forward('/Mines/Setting')">
        <i class="img iconfont icon-SetUp" style="font-size: 0.959rem;"></i>
        <div class="desc">
          设置
        </div>
        <!--<span class="right">&gt</span>-->
      </div>
    </div>
  </div>
</template>

<script>
    import api from "../../asset/api.js";
    import utrl from "../../controller/utrl.js";

    export default {
        data () {
            return {
                msg: '我的',
                data:{},
                token:api.token,
                headUrl:api.domain
            }
        },
        filters:{
            interception(val){
                if(val) return val.substr(-1);
            }
        },
        async mounted(){
            let mine2 = await api.get("users/current?token=" + api.token)
            if(mine2.status >= 200 && mine2.status < 300)api.userInfo = mine2.data;
            else $toast.show(mine2.data.errmsg, 1000).then(() => {})
            this.data = api.userInfo;
            this.data.user_name = api.userInfo.name;
        },
        // created(){
        //     console.log(api.userInfo);
        // }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped="">
  .center{
    z-index:1;
    position:fixed;
    width:100%;
    background-color: rgb(238,238,238);
    height:calc(100vh-6rem);
    padding-top:2.57rem;
    margin-bottom:3rem;
    .person{
      height:4.1rem;
      background-color:#fff;
      margin-top:0.5rem;
      font-size: 0;
      padding-top:.4rem;
      padding-left:.25rem;
      box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
      .person-img{
        display:inline-block;
        font-size:.75rem;
        width:3.3rem;
        height:3.3rem;
        border-radius:50%;
        overflow:hidden;
        vertical-align: top;
        background-color:#f39800;
        img{
          width:100%;
          height:100%;
        }
        .lastFont{
          width:100%;
          height:100%;
          display: flex;
          justify-content: center;
          align-items: center;
          >span{
            color: #fff;
            font-size:1rem;
          }

        }
      }
      .person-wrap{
        display:inline-block;
        margin-left:1.1rem;
        font-size:.85rem;
        p{
          line-height:1.45rem;
          letter-spacing: .1rem;
          color:rgb(51,51,51);
          .phone{
            letter-spacing:0;
            font-size:.75rem;
            color:rgb(51,51,51);
          }
        }
      }
    }
    .message {
      height: 2.5rem;
      line-height: 2.5rem;
      background-color: #fff;
      margin-top: .25rem;
      font-size: 0;
      box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
      .img {
        display: inline-block;
        font-size: 1rem;
        margin-left: .8rem;
        margin-right: .75rem;
        vertical-align: top;
        line-height:2.5rem;
      }
      .desc {
        display: inline-block;
        font-size: .8rem;
        color:rgb(51,51,51);
      }
    }
  }
</style>
