<template>
<div class="outOf">
	<div id="saleoutstorages">
		<von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title">{{title}}</span>
            <div class="button button-icon company" slot="right">{{menuButtonText}}</div>
        </von-header>
        <div class="subInfo">
        	<div class="head-por">
                <head-portrait :userInfo="{'user_name':orderData.app_user_name,'head_image_id':$route.params.head_image_id}" :size="'large'"></head-portrait>
        	</div>
        	<div class="info">
        		<div class="a-single">
        			<span class="name">{{orderData.app_user_name}} 1111</span>
        			<span><i style="opacity:0;">：</i>{{orderData.app_date | time}}</span>
        		</div>
        		<div class="a-single">
        			<span class="name">单号 1111</span>
        			<span>：{{orderData.code}}</span>
        		</div>
        		<div class="a-single">
        			<span class="name">开票金额 1111</span>
        			<span>：¥{{orderData.total_amt | formatNum}}</span>
        		</div>
        	</div>
        </div>
        <div class="tabsWarp">
        	<tab-item :tabArr="tabs" @clickIndex="onTabClick"></tab-item>
        </div>

        <div class="content">
        	<!-- 基本信息 -->
        	<div class="content-warp" v-if="tabIndex == 'basic'">
        		<scroll>
					<item v-for="(val,index) in essInfo" :key="index">
						<div class="info-list">
							<label>{{val.name}}</label>
							<span v-if="!val.hasData">{{val.content}}</span>
							<span v-if="val.hasData">{{val.content | time}}</span>
						</div>
					</item>
				</scroll>
        	</div>
        	<!-- 发票信息 -->
        	<div class="content-warp" id="content-warp-detailsList" v-else-if="tabIndex == 'detailed'">
	        		<scroll>
	        			<div style="margin-bottom:0.25rem" v-for="(val,index) in detailsList" :keys="index">
	        				<item v-for="item in val">
								<div class="info-list">
									<label>{{item.name}}</label>
									<span v-if="!item.hasData">{{item.content}}</span>
									<span v-else>{{item.content | time}}</span>
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
	import "./utrl/style.less";
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: '采购发票登记',
				// 公司简称
				menuButtonText: "",
                userMsg:"",
				// src:'',
				// taskID & 接口名字
				del_info:{name:"",id:0,stepId:0},
				// tab标题
				tabs: [
					{name:"基本信息",id:"basic"},
					{name:"发票明细",id:"detailed"},
					{name:"审批进程",id:"trial"}
				],
				// 审批按钮
				buttons:[
					// btnid为审批接口名称
					{name:"同意",btnId:"quickagree",icon:"icon-Agree"},
					{name:"拒绝",btnId:"reject",icon:"icon-Disagree"},
					//{name:"退回",btnId:"return",icon:"icon-Return"}
				],

				tabIndex: "basic",
				orderData:{
					app_dept_name:"",
					code:"",
					app_user_name:"",
					app_date:"",
				},
				essInfo:[
					{
						name:"部门",
						content:"",
						sign:"app_dept_name"
					},
					{
						name:"申请日期",
						content:"",
						sign:"app_date",
						hasData:true
					},
					{name:"备注",content:"",sign:"remarks"}
				],
				trialList:[],
				itemlist:[
					{name:"供应商",content:"",sing:"supplier_name"},
					{name:"发票类型",content:"",sing:"invoice_type"},
					{name:"发票号",content:"",sing:"invoice_code"},
					{name:"开票日期",content:"",sing:"date",hasData:true},
					{name:"开票金额",content:"",sing:"amt"},
					{name:"备注",content:"",sing:"details_remarks"}
				],
				detailsList:[

				]
			}
		},
		filters:{
			time: function(val) {
				return val.split('T')[0];
			},
			formatNum:function(val){
					val=String(val)
					return utrl.formatNum(val)
			}
		},

        mounted() {
        	this.guid = utrl.setbizid()
        	this.userMsg = api.userInfo;
        	this.userMsg.user_name = api.userInfo.name;
			this.del_info = {
				name:this.$route.params.interface,
				id:this.$route.params.id,
				stepId:this.$route.params.stepId
			};
			this.getDelData();
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
				let url = this.del_info.name + "?token=" + api.token + "&filter=TaskID=" + this.del_info.id;
				let res = await api.get(url);
				if(res.status >= 200 && res.status < 300){
					res = res.data;
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				let data = res[0];
				for(let a in res[0].details){
					res[0].details[a].showDrop = false;
				}
				this.orderData = res[0];
				//设置右上角公司名字
				this.menuButtonText = data.company_name;
				for(let val in data){
					for(let i=0;i<_this.essInfo.length;i++){
						if(_this.essInfo[i].sign == val){
							_this.essInfo[i].content = data[val]
						}
					}
				}
				//获取发票信息数据
				this.detailsList=res[0].details;
				this.detailsList = utrl.setJson(this.detailsList,this.itemlist)
				utrl.thousand(this.detailsList,"remarks")
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
			}
		},
		components:{
			ApprovalButton,TabItem,Flowchart
		}
	}
</script>

<style lang="less" scoped>
.content{
	background:#eee;
}
#content-warp-detailsList{
	background:#eee;
}
</style>
