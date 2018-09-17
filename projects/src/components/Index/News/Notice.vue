<template>
  <div id="Notice" class="newsList">
      <scroll class="page-content scroll-view staydo-scroll" :on-refresh="onRefresh" :on-infinite="onInfinite">
          <ul>
              <li class="lis" v-for="(item,index) in arr" :class="item.ExtDeleted ? 'toLeft' : ''">

                  <div class="cen" @click.stop="routerGo(item.process_english_name,item.TaskID,item.process_vue_name,item.ProcessName,item.Description,item.head_img_url_medium,item.DisplayName,
                  item.CreateAt,item.SerialNum,item.StepID)">
                    <!-- <router-link v-bind:to="{path:item.process_english_name,params:{'id':item.TaskID}}" style="text-decoration: none;color: #666;"> -->
                      <div class="a">
                          <font>{{item.DisplayName}}<span v-if="item.DisplayName">的</span>{{item.ProcessName}}</font>
                          <font class="time">{{item.CreateAt | time}}</font>
                      </div>
                      <div class="text-wrap" v-if="item.Description">
                          <div class="pad">
                              <span v-if="item.is_show_code !== 0" class="spaceFont">单号：{{item.SerialNum}}</span>
                          </div>
                          <div v-for="n,i in item.Description">
                              <div class="pad" v-if="n != item.Description['公司名称']">
                                  <span class="spaceFont">{{i}}</span>：{{n}}
                              </div>
                          </div>
                          <div class="seeDetails">查看详情 <i class="ion-ios-arrow-forward"></i></div>
                      </div>
                    <!-- </router-link> -->
                      <!--<div style="margin: 0.3rem 0;height: 1px;background:#eee;"></div>-->
                      <div class="btns">
                          <div class="divs" style="display: flex;" v-if="item.Description!=-1">
                              <div class="ran">{{item.Description['公司名称'] ? item.Description['公司名称'] : '小蜜蜂' | strExclude}}</div>
                              <div class="company">
                                  <ul style="color:#333;font-size:0.7rem;line-height: 1.58rem;background-color:#fff;">
                                      <li>&nbsp;{{item.Description['公司名称'] ? item.Description['公司名称'] : '小蜜蜂'}}</li>
                                  </ul>
                              </div>
                          </div>
                        <div v-else></div>
                        <div class="divs">
                            <input class="onlyOne" type="button" value="我知道了" @click.stop="fastAgree(item.StepID,item.process_english_name,index)"/>
                        </div>
                      </div>
                  </div>
              </li>
          </ul>
        <div v-if="infiniteCount" slot="infinite" class="text-center">没有更多数据</div>
      </scroll>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
    import "./utrl/style.less"
  import Vue from "vue"
  import api from "../../../asset/api.js"
  import utrl from "../../../controller/utrl.js"
    export default {
        data() {
            return {
                msg: [],
                arr: [],
                infiniteCount: false,
                page:1,
                searchMode:false,//搜索模式
                totals:0
            }
        },
        inject: ['unread'],
        filters: {
            time: function(val) {
              let dataYear = Number(val.split('-')[0])
              let nowYear = Number(new Date().getFullYear())
              // let time = ''
              // time = (nowYear - dataYear) > 0 ? val.split('T')[0] : val.split('T')[0].split('-')[1] + "-" + val.split('T')[0].split('-')[2];
              if((nowYear - dataYear) > 0){
                return val.split('T')[0]
              }
              let dataMonth = Number(new Date(val).getMonth()+1)
              let nowMonth = Number(new Date().getMonth()+1)
              if((nowMonth - dataMonth) > 0){
                return val.split('T')[0].split('-')[1] + "-" + val.split('T')[0].split('-')[2]
              }
              let nowDate = Number(new Date().getDate());
              let valDate = Number(new Date(val).getDate())
              let differDate = (nowDate - valDate);
              if(differDate >= 1 && differDate < 2){
                return "昨天"
              }else if(differDate >= 0 && differDate < 1){
                console.log(new Date(val).getMinutes())
                if(new Date(val).getMinutes()<10){
                  return new Date(val).getHours() + ":0" + new Date(val).getMinutes()
                }else{
                  return new Date(val).getHours() + ":" + new Date(val).getMinutes()
                }
              }else{
                return val.split('T')[0].split('-')[1] + "-" + val.split('T')[0].split('-')[2]
              }
              // return val.split('T')[0] + ' ' + val.split('T')[1].split('').splice(0, 8).join('');
            },
            strExclude: function(val){
                val.replace(/(有限|股份|软件|技术|电子|公司)/g,'');
                return val.substr(-1);
            }
        },
      activated(){
        let _this = this;
        if(api.loginStatus){
                  console.log(11);
                  this.cartView();
        }else{
                  console.log(22);
          let loginStatusTimer = setInterval(function(){
            if(api.loginStatus)
              _this.cartView()
              clearInterval(loginStatusTimer)
          }, 500)
        }
      },
        mounted() {
          let _this = this;
          if(api.loginStatus){

          	this.cartView();
          }else{
          	let loginStatusTimer = setInterval(function(){
          		if(api.loginStatus)
          			_this.cartView()
          			clearInterval(loginStatusTimer)
          	}, 500)
          }
        },
        destroyed(){
            this.searchMode = false;
            // this.$destroy()
        },
        methods: {
            routerGo(path,id,vue_name,processname,description,src,displayName,createAt,serialNum,StepID){
                utrl.routerGo(path,id,vue_name,processname,description,src,displayName,createAt,serialNum,StepID)
                // let vName = "";
                // if(vue_name == undefined){
                //   vName = "Allorder";
                // }else{
                //   vName = vue_name;
                // }
                // let childPath = "/index/news/" + path
                // let tmpRouter = this.$router.options.routes[0].children.push({
                //     path: childPath,
                //     name: path,
                //     component: resolve => require(['./Order/' + vName + '.vue'], resolve)
                // });
                // // this.$router.addRoutes(this.$router.options.routes)
                // this.$router.addRoutes([
                //   {
                //       path: childPath,
                //       name: path,
                //       component: resolve => require(['./Order/' + vName + '.vue'], resolve)
                //       // component: Vue.extend({template:"<div>我是一个测试呦</div>"}),
                //       // meta: {title: '测试Demo'}
                //   }
                // ])
                this.$router.push({
                    path:path,
                    name:path,
                    params:{
                        id:id,
                        stepId:StepID,
                        interface:path,
                        po:processname,
                        form:description,
                        buttons:[
                            {name:"我知道了",btnId:"indicatesubmit",icon:"icon-OhLSee"}
                        ],
                        src:src,
                        displayName:displayName,
                        createAt:createAt,
                        serialNum:serialNum
                    }
                })
            },
            // routerGo(path,id,vue_name,processname,description,src,displayName,createAt,serialNum,stepId){
            //   utrl.routerGo(path,id,vue_name,processname,description,src,displayName,createAt,serialNum,stepId)
            // },
            //获取列表noticetasks
            async cartView(done) {
                let _this = this;
                var url = "";
                var key = this.keyword;

                if(key !== undefined) {                         //搜索模式
                    key = "keyword=" + key;
                    if(this.searchMode === false){                //防止第一次进页面加载数据。
                        this.searchMode = true;
                        this.infiniteCount = true;
                        return;
                    }
                }else{
                    this.searchMode = false;
                    key = "";
                }

                url = "noticetasks?"+ key +"&page=" + this.page + "&size=10" + "&token=" + api.token;
                let res = await api.get(url);

                if(res.status === 204 || res.status === 504){
                    // if(this.searchMode === true){
                    //   $toast.show('没有查询到有关信息', 2000);
                    // }
                    if(this.searchMode === true) this.arr = [];
                    this.infiniteCount = true;
                    return;
                }
                if(res.status >= 200 && res.status < 300){
                    res = res.data;
                    this.totals = res.length > 0 ? res[0].totals : 0
                    this.unread.setUnread(1,this.totals)
                    // 获取详细信息
                    for(let i = 0; i < res.length; i++){
                        if(res[i].Description == undefined){
                            res[i].Description={公司名称:""}
                        }else{
                            try{
                                res[i].Description=JSON.parse(res[i].Description);// 转换成对象
                            }catch(err){
                                res[i].Description="{\"错误描述\":\"json转换错误\"}";
                                res[i].Description=JSON.parse(res[i].Description);// 转换成对象

                            }
                        }

                    }
                    if(res[0].totals > this.arr.length){
                        if(this.onCk === true){
                            this.page = 1;
                            this.arr = res;
                            this.$emit("ck-off",false);
                        }else{
                            this.arr.length == 0 ? this.arr = res : this.arr = this.arr.concat(res);
                        }
                        if(done)done();
                        if(res[0].totals > this.arr.length){
                            this.infiniteCount = false
                        }else{
                            this.page = 1;
                            this.infiniteCount = true;
                        }
                    }else{
                        this.infiniteCount = true;
                    }
                }else{
                    //$toast.show(res.data.errmsg, 2000);
                    this.infiniteCount = true;
                }

                // _this.arr = res;
                _this.$nextTick(function() {
                    _this.$emit('domload', true);
                })
            },
            // 刷新
            onRefresh(done) {
                if(this.searchMode === false){
                    this.page = 1;
                    this.arr = [];
                    this.cartView();
                }else{
                    if(this.keyword !== ''){
                        this.page = 1;
                        this.arr = [];
                        this.cartView();
                    }
                }
                done();
            },
            // 下一页
            onInfinite(done) {
                if(this.infiniteCount){
                    done()
                    return
                }
                this.page = this.page+1;
                this.cartView(done)
            },
            // 同意
            async fastAgree(id,inter,index) {
                let bizid= utrl.setbizid()
                let url = inter + "/0/indicatesubmit/"+id+"?bizid="+bizid+"&token=" + api.token;
                let res = await api.patch(url);
                console.log(res)
                if(res.status >= 200 && res.status < 300){
                    res = res.data;
                }else{
                    $toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
                    return
                }
                if(res.taskid){
                    this.deleteData(index)
                }
            },
            // 删除数据方法
            deleteData(index,text){
                let _this = this;
                this.arr[index].ExtDeleted = true;
                setTimeout(function(){
                    _this.arr.splice(index, 1)
                },500)
                this.totals--
                this.unread.setUnread(1,this.totals)
                $toast.show(text ? text : "成功！", 3000).then(() => {})
            }
        },
        watch:{
            keyword(curVal){
                if(curVal == ""){
                    this.arr = [];
                    this.infiniteCount = true;
                }
            }
        },
        props:{
            keyword:{
                type:String
            },
            onCk:{
                type:Boolean
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
