<template>
  <div class="outOf">
    <div id="saleorders">
      <von-header>
        <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
        <span slot="title">{{title}}</span>
        <div class="button button-icon company" slot="right">{{data.company_name}}</div>
      </von-header>
      <div class="subInfo">
          <head-portrait :userInfo="{'user_name':orderData.app_user_name,'head_image_id':$route.params.head_image_id}" :size="'large'"></head-portrait>
        <div class="info">
          <div class="a-single">
            <span class="name">{{data.app_user_name}} 11111</span>
            <span><i style="opacity: 0">：</i>{{data.app_date | time}}</span>
          </div>
          <div class="a-single">
            <span class="name">单号 11111</span>
            <span>：{{data.code}}</span>
          </div>
          <div class="a-single">
            <span class="name">支付总额 11111</span>
            <span>：¥{{data.total_amt | formatNum}}</span>
          </div>
        </div>
      </div>
      <div class="tabsWarp">
        <tab-item :tabArr="tabs" @clickIndex="onTabClick"></tab-item>
      </div>
      <div class="content">
        <div class="content-warp" v-show="tabIndex == 'basic'">
          <scroll>
            <item v-for="item in basic">
              <div class="info-list">
                <label>{{item.name}}</label>
                <span v-if="item.sign == 'app_date'">{{item.content | time}}</span>
                <span v-else>{{item.content}}</span>
              </div>
            </item>
          </scroll>
        </div>
        <div class="content-warp" v-show="tabIndex == 'detailed'">
          <scroll class="content-warp-detailsList">
            <div style="margin-bottom:0.25rem" v-for="(val,index) in detailArrList" :key="index">
              <item v-for="item in val">
                <div class="info-list">
                  <label>{{item.name}}</label>
                  <span v-if="item.sing == 'amt'">{{item.content | formatNum}}</span>
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
  import "./utrl/style.less";
  import Vue from "vue";

  export default {
    data() {
      return {
        title: '财务支付申请',
        // 公司简称
        menuButtonText: "",
        userMsg:null,
        // stepId & 接口名字
        del_info:{name:"",id:0},
        data:[],
        tabs: [
          {name:"申请人信息",id:"basic"},
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
        orderData:{
          app_dept_name:"",
          code:"",
          app_user_name:"",
          app_date:"",
        },
        basic:[
          {name:"部门",content:"",sign:"app_dept_name"},
          {name:"申请日期",content:"",sign:"app_date"},
          {name:"备注",content:"",sign:"remarks"},
        ],
        detailArrList:[

        ],
        detail:[
          {name:"支付原因",content:"",sing:"details_remarks"},
          {name:"单位",content:"",sing:"customer_name"},
          {name:"支付明细",content:"",sing:"expenditure_details"},
          {name:"支付金额",content:"",sing:"amt"},
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
      this.init();
      this.userMsg = api.userInfo;
      this.userMsg.user_name = api.userInfo.name;
    },
    methods: {
      async init(){
        let _this = this;
        let id = this.del_info.id;
        let url = `financialpays?token=${api.token}&filter=TaskID=${id}`;
        let res = await api.get(url);

        if(res.status >= 200 && res.status < 300){
          res = res.data;
          this.data = res[0];
          if(this.data.remarks != undefined) this.basic.content = this.data.remarks;
        }else{
          $toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {});
          return;
        }
        let data = res[0];

        this.orderData = res[0];
        this.detailArrList = res[0].details;

        for(let val in data){
          for(let i=0;i<_this.basic.length;i++){
            if(_this.basic[i].sign == val){
              _this.basic[i].content = data[val];
            }
          }
        }
      //出库单明细数据
        this.detailArrList = utrl.setJson(this.detailArrList,this.detail);
      },
      approvalClcik(val){
        utrl.approvalClcik(val,{
          name:this.del_info.name,
          stepId:this.del_info.stepId,
          id:this.del_info.id
        })
      },
      back: function() {
        $router.go(-1)
        //          @click="$router.forward('/Mines/myMessage')"
      },
      onTabClick(index) {
        this.tabIndex = index;
      },
    },
    components:{
      ApprovalButton,TabItem,Flowchart
    }
  }
</script>
