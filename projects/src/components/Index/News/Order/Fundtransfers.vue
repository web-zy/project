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
            <span><i style="opacity:0">：</i>{{data.app_date | time}}</span>
          </div>
          <div class="a-single">
            <span class="name">单号 11111</span>
            <span>：{{data.code}}</span>
          </div>
          <div class="a-single">
            <span class="name">金额 11111</span>
            <span>：¥{{data.out_amt | formatNum}}</span>
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
          <scroll>
            <item v-for="item in out">
              <div class="info-list">
                <label>{{item.name}}</label>
                <span v-if="item.sign == 'out_amt'">{{item.content | formatNum}}</span>
                <span v-else>{{item.content}}</span>
              </div>
            </item>
          </scroll>
        </div>
        <div class="content-warp" v-show="tabIndex == 'inbank'">
          <scroll>
            <item v-for="item in insert">
              <div class="info-list">
                <label>{{item.name}}</label>
                <span v-if="item.sign == 'in_amt'">{{item.content | formatNum}}</span>
                <span v-else>{{item.content}}</span>
              </div>
            </item>
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
        title: '资金划拨',
        // stepId & 接口名字
        userMsg:null,
        del_info:{name:"",id:0},
        data:[],
        tabs: [
          {name:"基本信息",id:"basic"},
          {name:"转出账户",id:"detailed"},
          {name:"转入账户",id:"inbank"},
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
        basic:[
          {name:"部门",content:"",sign:"app_dept_name"},
          {name:"申请日期",content:"",sign:"app_date"},
        ],
        out:[
          {name:"摘要",content:"",sign:"remarks"},
          {name:"转出银行",content:"",sign:"outbank_name"},
          {name:"转出银行账号",content:"",sign:"outaccount_name"},
          {name:"转出金额",content:"",sign:"out_amt"},
        ],
        insert:[
          {name:"转入银行",content:"",sign:"inbank_name"},
          {name:"转入银行账号",content:"",sign:"inaccount_name"},
          {name:"转入金额",content:"",sign:"in_amt"},
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
    mounted(){
        this.del_info = {
            name:this.$route.params.interface,
            id:this.$route.params.id,
            stepId:this.$route.params.stepId
        };
        this.init();
        this.userMsg = api.userInfo;
        this.userMsg.user_name = api.userInfo.name;
    },
    methods: {
      async init(){
        let id = this.del_info.id;
        let url = `fundtransfers?token=${api.token}&filter=TaskID=${id}`;
        let res = await api.get(url);
        console.log(res);
        if(res.status >= 200 && res.status < 300){
          this.data = res.data[0];
          console.log(this.data);
        }else{
          $toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {});
          return;
        }
        this.loopfunc(this.basic);
          this.loopfunc(this.out);
          this.loopfunc(this.insert);
      },
      //a为完整数据，b为对比数据
      loopfunc(param){
        let len = param.length;
        let data = this.data;
        for(let v in data){
          for(let i=0; i<len;i++){
            if(v == param[i].sign){
              param[i].content = data[v];
            }
          }
        }
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
      onTabClick(index){
        this.tabIndex = index;
      }
    },
    components:{
      ApprovalButton,TabItem,Flowchart
    }
  }
</script>
