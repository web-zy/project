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
            <span>：{{orderData.code}}</span>
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
                <span v-if="val.sign == 'app_date'">{{val.content | time}}</span>
                <span v-else>{{val.content}}</span>
              </div>
            </item>
          </scroll>
        </div>
        <div class="content-warp" v-if="tabIndex == 'detailed'">
          <scroll class="content-warp-detailsList">
            <div style="margin-bottom:0.25rem" v-for="(item,index) in orderData2" :key="index">
              <item v-for="val in item">
                <div class="info-list">
                  <span>{{val.name}}</span>
                  <span v-if="val.sing == 'trade_amt'">{{val.content | formatNum}}</span>
                  <span v-else-if="val.sing == 'receive_date'">{{val.content | time}}</span>
                  <span v-else>{{val.content}}</span>
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
  import "./utrl/style.less";
  export default {
    data() {
      return {
        title: '到款清单导入',
        // 公司简称
        menuButtonText: "",
          userMsg:null,
        // taskid & 接口名字
        del_info:{name:"",id:0,stepId:0},
        // tab标题
        tabs: [
          {name:"申请人",id:"basic"},
          {name:"明细",id:"detailed"},
          {name:"审批进程",id:"trial"}
        ],
        // 审批按钮
        buttons:[
          // btnid为审批接口名称
          {name:"同意",btnId:"quickagree",icon:"icon-Agree"},
          {name:"拒绝",btnId:"reject",icon:"icon-Disagree"},
          //{name:"退回",btnId:"return",icon:"icon-Return"},
        ],
        tabIndex: "basic",
        orderData:{},
        orderData2:{

        },
        essInfo:[
          {name:"部门",content:"",sign:"app_dept_name"},
          {name:"申请日期",content:"",sign:"app_date"},
        ],
        detailsList:[
          {name:"交易银行",content:"",sing:"receivebank_name"},
          {name:"交易卡号",content:"",sing:"receivebank_account"},
          {name:"付款方",content:"",sing:"payment_name"},
          {name:"付款银行",content:"",sing:"paymentbank_name"},
          {name:"付款账号",content:"",sing:"paymentbank_account"},
          {name:"交易时间",content:"",sing:"receive_date"},
          {name:"到款金额",content:"",sing:"trade_amt"},
          {name:"银行摘要",content:"",sing:"bank_abstract"},
          {name:"交易类型",content:"",sing:"trade_type"},
          {name:"交易备注",content:"",sing:"trade_remarks"},
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
        let url = `fapaymentlists?token=${api.token}&filter=TaskID=${id}`;
        let res = await api.get(url);
        if(res.status >= 200 && res.status < 300){
          res = res.data;
        }else{
          $toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
          return
        }
        let data = res[0];
          console.log(res);
        this.orderData = res[0];
        this.orderData2 = res[0].details;
        //设置右上角公司名字
        this.menuButtonText = data.company_name;
        //申请人信息
        for(let val in data){
          for(let i=0;i<_this.essInfo.length;i++){
            if(_this.essInfo[i].sign == val){
              _this.essInfo[i].content = data[val]
            }
          }
        }

        //明细

          if(this.orderData2[0] !== null){
              this.orderData2 = utrl.setJson(this.orderData2,this.detailsList);
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
