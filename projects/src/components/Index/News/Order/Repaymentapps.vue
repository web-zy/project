<template>
	<div class="outOf">
		<div id="saleorders">
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
	        			<span class="name">{{orderData.app_user_name}} 11111111 </span>
	        			<span><i style="opacity:0;">：</i>{{orderData.app_date | time}}</span>
	        		</div>
	        		<div class="a-single">
	        			<span class="name">单号 11111111 </span>
	        			<span>：{{orderData.code}}</span>
	        		</div>
	        		<div class="a-single">
	        			<span class="name">还款总额 11111111 </span>
	        			<span>：¥{{orderData.repayment_amt | formatNum}}</span>
	        		</div>
	        	</div>
	        </div>
	        <div class="tabsWarp">
	        	<tab-item :tabArr="tabs" @clickIndex="onTabClick"></tab-item>
	        </div>
	        <div class="content">
	        	<div class="content-warp" v-if="tabIndex == 'basic'">
	        		<scroll>
						<item v-for="(val,index) in essInfo" :key="index">
							<div class="info-list">
								<label>{{val.name}}</label>
								<span>{{val.content | time}}</span>
							</div>
						</item>
					</scroll>
	        	</div>
	        	<div class="content-warp" v-else-if="tabIndex == 'trial'">
	        		<scroll>
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
	import TabItem from "./utrl/Tab.vue";
	import api from "../../../../asset/api.js"
	import Flowchart from "./utrl/Flowchart.vue";
	import "./utrl/style.less"
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: '还款单',
                userMsg:"",
				// 公司简称
				menuButtonText: "",
				// taskid & 接口名字
				del_info:{name:"",id:0},
				// tab标题
				tabs: [
					{name:"基本信息",id:"basic"},
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
				essInfo:[
					{name:"单号",content:"",sing:"code"},
					{name:"借款单号",content:"",sing:"loan_code"},
					{name:"还款日期",content:"",sing:"app_date"},
					{name:"借款日期",content:"",sing:"loan_date"},
					{name:"借款标题",content:"",sing:"loan_title"},
					{name:"借款金额",content:"",sing:"loan_amt"},
					{name:"本次还款金额",content:"",sing:"repayment_amt"},
					{name:"还款事由",content:"",sing:"loan_reason"},
					{name:"备注",content:"",sing:"remarks"}
				]
			}
		},
		filters:{
			time: function(val) {
						val=String(val)
						if(val.indexOf("T0")!=-1){
							return val.split('T')[0]
						}else{
							return val
						}

				},
			formatNum:function(val){
				val=String(val)
				return utrl.formatNum(val)
			}
		},
		mounted() {
			this.userMsg = api.userInfo;
			this.userMsg.user_name = api.userInfo.name;
			//console.log(this.$route.params)
			this.del_info = {
				name:this.$route.params.interface,
				id:this.$route.params.id,
				stepId:this.$route.params.stepId
			}
			this.getDelData()
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
				this.menuButtonText=res[0].company_name
				let data = res[0];
				//total_real_amt
				this.orderData = res[0];
				this.menuButtonText=res[0].company_name
				console.log(data)
				for(var k in data){
					for(var i=0;i<this.essInfo.length;i++){
						if(this.essInfo[i].sing==k){
							this.essInfo[i].content=data[k];
							if(this.essInfo[i].sing=='loan_amt'||this.essInfo[i].sing=='repayment_amt'){
								this.essInfo[i].content=utrl.formatNum(this.essInfo[i].content)
							}
						}
					}
				}

			},
			onTabClick(index) {
				this.tabIndex = index
			},
			approvalClcik(val){
				console.log(1)
				utrl.approvalClcik(val,{
					name:this.del_info.name,
					stepId:this.del_info.stepId,
					id:this.del_info.id
				})
			}
		},
		components:{
			ApprovalButton,TabItem
		}
	}
</script>

<style lang="less" scoped>
.content-warp{
	margin-bottom:3.5rem;
}
#content-warp-detailsList{
	background:#eee;
}
#content-warp-settlement{
	background:#eee;
}
.saleorders{
	width:100%;
	height:100vh;
	background:red;
}
.detailed_list{
	width:100%;
	height:1.95rem;
	border-bottom:1px solid #888888;
}
</style>
