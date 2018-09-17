<template>
  <div class="outOf">
    <div id="saleorders">
      <von-header>
        <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
        <span slot="title">{{title}}</span>
        <div class="button button-icon company" slot="right">{{menuButtonText}}</div>
      </von-header>
      <div class="subInfo">
                <head-portrait :userInfo="{'user_name':orderData.app_user_name,'head_image_id':$route.params.head_image_id}" :size="'large'"></head-portrait>
        <div class="info">
          <div class="a-single">
            <span class="name">{{orderData.app_user_name}} 11111</span>
            <span><i style="opacity:0;">：</i>{{orderData.app_date | time}}</span>
          </div>
          <div class="a-single">
            <span class="name">单号 11111</span>
            <span>：{{orderData.resource_code}}</span>
          </div>
          <div class="a-single">
            <span class="name">支出金额 11111</span>
            <span>：¥{{orderData.total_amt | formatNum}}</span>
          </div>
        </div>
      </div>
      <div class="tabsWarp">
        <tab-item :tabArr="tabs" @clickIndex="onTabClick"></tab-item>
      </div>
      <div class="content">
        <div class="content-warp" v-show="tabIndex == 'basic'">
          <scroll>
            <item v-for="(val,index) in essInfo" :key="index">
              <div class="info-list">
                <label>{{val.name}}</label>
                <span v-if="val.sign == 'total_amt'">{{val.content | formatNum}}</span>
                <span v-else>{{val.content}}</span>
              </div>
            </item>
          </scroll>
        </div>
        <div id="content-warp-detailsList" class="content-warp" v-show="tabIndex == 'mode'" >
          <scroll class="content-warp-detailsList">
            <div style="margin-bottom:0.25rem" v-for="(val,index) in orderData2" :key="index">
               <item>
                    <div class="info-list">
                          <label>{{val.settle_name}}支付</label>
                          <span>{{val.csettle_amt | formatNum}}</span>
                    </div>
              </item>
              <item v-for="item in val.vallist" v-if="val.settle_name=='银行'">
                    <div class="info-list">
                        <label>{{item.name}}</label>
                        <span>{{item.content}}</span>
                    </div>
              </item>
            </div>
          </scroll>
        </div>
        <div class="content-warp" v-show="tabIndex == 'detailed'">
          <scroll class="content-warp-detailsList">
            <div style="margin-bottom:0.25rem" v-for="(val,index) in orderData3" :key="index">
              <item v-for="item in val">
                <div class="info-list">
                  <span v-if="item.sing == 'pay_amt'">{{item.content | formatNum}}</span>
                  <span v-else>{{item.content}}</span>
                </div>
              </item>
            </div>
          </scroll>
        </div>
        <div class="content-warp" v-show="tabIndex == 'trial'">
          <scroll>
            <!-- 流程图的组件 -->
            <Flowchart></Flowchart>
          </scroll>
        </div>
      </div>
      <ApprovalButton :btns=buttons @clickBack="approvalClcik"></ApprovalButton>
    </div>
  </div>
</template>

<script>
  import ApprovalButton from "./utrl/Approvalbutton.vue";
  import Flowchart from "./utrl/Flowchart.vue";
  import TabItem from "./utrl/Tab.vue";
  import api from "../../../../asset/api.js";
  import utrl from "../../../../controller/utrl.js";
  import "./utrl/style.less"
  export default {
    data() {
      return {
        title: '支付凭单',
        // 公司简称
        menuButtonText: "",
        userMsg:null,
        // taskid & 接口名字
        del_info:{name:"",id:0,stepId:0},
        // tab标题4
        tabs: [
          {name:"基本信息",id:"basic"},
          {name:"结算方式",id:"mode",username:"details"},
          {name:"支付明细",id:"detailed",username:"settle"},
          {name:"审批进程",id:"trial"}
        ],
        // 审批按钮s
        buttons:[
          // btnid为审批接口名称
          {name:"同意",btnId:"quickagree",icon:"icon-Agree"},
          {name:"拒绝",btnId:"reject",icon:"icon-Disagree"},
          //{name:"退回",btnId:"return",icon:"icon-Return"},
        ],
        tabIndex: "basic",
        orderData:{
          app_dept_name:"",
          code:"",
          app_user_name:"",
          app_date:"",
        },
        orderData2:[],
        orderData3:[],
        essInfo:[
          {name:"部门",content:"",sign:"app_dept_name"},
          {name:"来源类型",content:"",sign:"resource_type"},
          {name:"来源单号",content:"",sign:"resource_code"},
          {name:"支出金额",content:"",sign:"total_amt"},
          {name:"备注",content:"",sign:"remarks"},
        ],
        alonelist:[
          {name:"支付方式",content:"",sing:"settle_name"},
          {name:"金额",content:"",sing:"settle_amt"}
        ],
        modeList:[
          {name:"结算方式",content:"",sing:"settle_name"},
          {name:"结算金额",content:"",sing:"settle_amt"},
          {name:"开户行所在省",content:"",sing:"province_name"},
          {name:"开户行所在市",content:"",sing:"city_name"},
          {name:"收款人",content:"",sing:"payee_name"},
          {name:"收款人开户行",content:"",sing:"bank_account_name"},
          {name:"收款人账号",content:"",sing:"bank_account_code"},
        ],
        detailsList:[
          {name:"支出银行",content:"",sing:"bank_name"},
          {name:"支出金额",content:"",sing:"pay_amt"},
          {name:"开户行",content:"",sing:"open_account_name"},
          {name:"银行账号",content:"",sing:"account_name"}
        ]
      }
    },
    filters:{
      time: function(val) {
        if(typeof val=="string"){
          return val.split('T')[0]
        }else{
          val=String(val)
          if(val.indexOf("T")!=-1){
            return val.split('T')[0]
          }else{
            return val
          }
        }
      },
      showTime(val){
        return val.split('T')[0] + " " + val.split('T')[1];
      },
        formatNum: function(val) {
            val = String(val)
            return utrl.formatNum(val)
        }
    },
    mounted() {
      this.del_info = {
        name:this.$route.params.interface,
        id:this.$route.params.id,
        stepId:this.$route.params.stepId
      }
      this.getDelData();
      this.userMsg = api.userInfo;
      this.userMsg.user_name = api.userInfo.name;
    },
    methods: {
      back: function() {
        $router.go(-1)
      },
      //补0
      repairZero(num){
        return num < 10 ? "0" + num : num;
      },
      //获取详细信息
      async getDelData(){
        let _this = this;
        let id = this.del_info.id;
        let url = `fapaymentbills?token=${api.token}&filter=TaskID=${id}`;
        let res = await api.get(url);
        console.log(res)
        if(res.status >= 200 && res.status < 300){
          res = res.data;
        }else{
          $toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
          return
        }
        let data = res[0];

        this.orderData = res[0];
        // this.orderData2 = res[0].settle;
        this.orderData3 = res[0].details;
        console.log(res[0]);
        //设置右上角公司名字
        this.menuButtonText = data.company_name;
        for(let val in data){
          for(let i=0;i<_this.essInfo.length;i++){
            if(_this.essInfo[i].sign == val){
              _this.essInfo[i].content = data[val]
            }
          }
        }
        //设置无数据导航不显
        for(var k in res[0]){
          for(var i=0;i<this.tabs.length;i++){
            if(this.tabs[i].username==k && res[0][k][0]==null){
              this.tabs.splice(i,1)
            }
          }
        }


          // if(this.orderData2[0] !== null){
          //     this.orderData2 = utrl.setJson(this.orderData2,this.modeList);
          // }
          this.orderData2 = res[0].settle;
          this.orderData2 = utrl.setJson(this.orderData2,this.modeList)
          var arr=[];
          var brr=[];
          var crr=[];
          //settle_name val.csettle_amt  alonelist
          for(var i=0;i<this.orderData2.length;i++){
            arr.push(this.orderData2[i].splice(0,1));
            crr.push(this.orderData2[i].splice(0,1));
            brr.push({
              settle_name:arr[i][0].content,
              csettle_amt:crr[i][0].content,
              vallist:this.orderData2[i]
            })
          }
          this.orderData2=brr;


          if(this.orderData3[0] !== null){
              this.orderData3 = utrl.setJson(this.orderData3,this.detailsList);
          }
      },
      onTabClick(index) {
        this.tabIndex = index
      },
      approvalClcik(val){
        utrl.approvalClcik(val,{
          name:this.del_info.name,
          stepId:this.del_info.stepId,
          id:this.del_info.id
        })
      },
    },
    components:{
      ApprovalButton,TabItem,Flowchart
    }
    // ApprovalButton,TabItem,
    // 		import ApprovalButton from "./utrl/Approvalbutton.vue";
    // import TabItem from "./utrl/Tab.vue";
  }
</script>

<style lang="less" scoped>

</style>
