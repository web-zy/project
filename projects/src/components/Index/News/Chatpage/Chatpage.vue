<template>
    <div class="chatpage">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title">兜某人</span>
            <div class="button button-icon" slot="right"></div>
        </von-header>
        <div class="scrollView">
          <scroll class="page-content scroll-view"
            :on-refresh="onRefresh"
            :on-infinite="onInfinite">
              <item v-for="(val,index) in msg" v-bind:class='val.info == "me" ? "me" : "other" '>
                {{val.name}} <span class="message">{{val.message}}</span>
              </item>
          </scroll>
        </div>
        

        <div class="bottom">
            <von-input
              type="text"
              style="width:80%;display:inline-block;"
              v-model="mySay"
              placeholder="请输入消息">
            </von-input>
            <md-button class="button button-positive" @click.native="clicked()">Send</md-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
          msg: [
            {
              "name":"哈哈",
              "info":"other",
              "message":"你拍一，我拍一"
            },{
              "name":"略略",
              "info":"me",
              "message":"两个小孩做游戏"
            },{
              "name":"略略",
              "info":"me",
              "message":"两个小孩做游戏"
            },{
              "name":"哈哈",
              "info":"other",
              "message":"你拍一，我拍一"
            }
          ],
          mySay:""

        }
    },
    mounted(){
      // this.frinendSay()
    },
    methods:{
      back(){
        $router.go(-1)
      },
      onRefresh(done){
        setTimeout(()=>{
          done()
        },1000)
      },
      onInfinite(done){
        done()
      },
      clicked(){
        let nowMySay = this.mySay;
        this.msg.push({
          "name":"略略",
          "info":"me",
          "message":nowMySay
        })
        this.mySay = ""
      },
      frinendSay(){
        let _this = this;
        let msg = this.msg;
        setInterval(function(){
          msg.push({
              "name":"哈哈",
              "info":"other",
              "message":"我又说话了哦~"
          })
          _this.msg = msg
        },4000)
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.chatpage{
  position:relative;
  width:100vw;
  height:100vh;
  .scrollView{
    position:absolute;
    top: 2.5rem;
    left:0;
    right:0;
    bottom:2.5rem;
  }
}
.bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    right:0;
}
ul{
  padding: 1rem;
}
ul li{
  font-size: 0.6rem;
}
.message{
  display: block;
  color: #fff;
  width: 80%;
  height:1rem;
  background: pink;
  border-radius: 0.3rem;
  padding:0.2rem;
  box-sizing: content-box;
}
.other{
  text-align: left;
}
.me{
  text-align: right;
}
.me .message{
  margin-left: 20%;
}
</style>
