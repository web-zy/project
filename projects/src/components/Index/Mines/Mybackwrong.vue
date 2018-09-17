<template>
    <div class="outOf backwrong">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
        </von-header>
        <div class="center">
            <scroll class="page-content scroll-view" :on-refresh="onRefresh" :on-infinite="onInfinite">
                <div class="dialogue" v-for="(val,index) in arr">
                    <p class="mySay">
                        <span class="headPic"><img src="./../../../../static/images/entry.52284a2.png" height="582" width="700" alt=""></span>
                        <span class="time">{{val.app_date | time}}</span>
                        <span class="words">{{val.description}}</span>
                    </p>
                    <p class="Reply" v-if="val.answer">
                        <span class="headPic"><img src="./../../../../static/images/entry.52284a2.png" height="582" width="700" alt=""></span>
                        <span class="time">{{val.app_date | time}}</span>
                        <span class="words">{{val.answer}}</span>
                    </p>
                </div>
                <div v-if="infiniteCount" slot="infinite" class="text-center">没有更多数据</div>
            </scroll>
        </div>
    </div>
</template>

<script>
import api from "./../../../asset/api.js"
import utrl from "./../../../controller/utrl.js"
export default {
    data () {
        return {
            msg:'我的反馈',
            info:{},
            arr:[],
            page:1,
            infiniteCount:false
        }
    },
    filters:{
        time:function(val){
            var dt = new Date(Date.parse(val));
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            var date = dt.toISOString().slice(0, -5).replace(/[T]/g, ' ');
            return date
        }
    },
    mounted(){
        this.info = api.userInfo;
        this.getFeedbacks()
    },
    methods:{
        back: function() {
            $router.go(-1)
        },
        async getFeedbacks(done){
            let url = "feedbacks?token=" + api.token + "&filter=app_user_account=" + this.info.uid + "&page="+ this.page + "&size=10";
            let res = await api.get(url);
            console.log(res);
            if(res.status === 204 || res.status === 504){
              this.infiniteCount = true;
              return;
            }
            if(res.status >= 200 && res.status < 300){
                res = res.data;
                if(res[0].totals > this.arr.length){
                    this.arr.length == 0 ? this.arr = res : this.arr = this.arr.concat(res);
                    if(done)done();
                    res[0].totals > this.arr.length ? this.infiniteCount = false : this.infiniteCount = true;
                }else{
                    this.infiniteCount = true;
                }
            }else{
              this.infiniteCount = true;
            }
        },
        onRefresh(done){
          this.page = 1;
          this.arr = [];
          this.getFeedbacks(done);
          done();
        },
        onInfinite(done){
          if(this.infiniteCount){
            done();
            return
          }
          this.page = this.page+1;
          this.getFeedbacks(done);
          done()
        }
    }
}
</script>

<style lang="less" scoped>
.backwrong{
    background:#eee;
}
.center{
    width: 100vw;
    height:100vh;
    padding-top:2.5rem;
    .page-content{
      top: 0.25rem;
    }
    .dialogue{
        width:100vw;
        min-height: 2.5rem;
        background:#fff;
        margin: 0.25rem 0;
        padding:0 0.5rem;
        text-align: right;
        p{
            padding:0.5rem 0;
            padding-right: 2.3rem;
            position:relative;
            span{
                display:block;
            }
            .headPic{
                display:block;
                width:1.7rem;
                height:1.7rem;
                overflow:hidden;
                border-radius:50%;
                position: absolute;
                right:0;
                top:0.68rem;
                img{
                    display:block;
                    width:100%;
                    height:100%;
                }
            }
        }
        .Reply{
            border-top: 1px solid #eee;
            text-align:left;
            padding-right: 0rem;
            padding-left: 2.3rem;
            .headPic{
                left:0;
            }
        }
        .words{
            font-size:0.65rem;
            color: #555;
            // padding-top:0.2rem;
        }
        .time{
            font-size: 0.6rem;
            color:#aaa;
        }
    }
}
</style>
