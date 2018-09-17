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
	        			<span class="name">单号   11111111   </span>
	        			<span>：{{orderData.code}}</span>
	        		</div>
	        	</div>
	        </div>
	        <div class="tabsWarp">
	        	<tab-item :tabArr="tabs" @clickIndex="onTabClick"></tab-item>
	        </div>
	        <div class="content">
	        	<div class="content-warp" v-if="tabIndex == 'basic'">
	        		<scroll>
						<item v-for="item in basiclist">
							<div class="info-list">
								<label>{{item.name}}</label>
								<span>{{item.content | time}}</span>
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
	import Vue from "vue";
	import ApprovalButton from "./utrl/Approvalbutton.vue";
	import Flowchart from "./utrl/Flowchart.vue";
	import TabItem from "./utrl/Tab.vue";
	import api from "../../../../asset/api.js"
	import "./utrl/style.less"
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: '快速客户报备',
                userMsg:"",
				// 公司简称
				menuButtonText: "",
				// taskid & 接口名字
				del_info:{name:"",id:0},
				// tab标题
				tabs: [
					{name:"客户信息",id:"basic"},
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
				basiclist:[
					{name:"客户全称",content:"",sing:"name"},
					{name:"客户简称",content:"",sing:"abb_name"},
					{name:"助理码",content:"",sing:"mark_code"},
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

			}
		},
		mounted() {
			//console.log(this.$route.params)
			this.userMsg = api.userInfo;
			this.userMsg.user_name = api.userInfo.name;
			this.del_info = {
				name: this.$route.params.interface,
				id: this.$route.params.id,
				stepId:this.$route.params.stepId
			}
			this.getDelData()//this.getProcsteps()
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
				res=res[0]
				this.orderData = res;
				this.menuButtonText=res.company_name
				//this.settlementlist = utrl.setJson(this.settlementlist,this.meyhodlist)
				//获取基本信息
				for(var k in res){
					for(var i=0;i<this.basiclist.length;i++){
						if(this.basiclist[i].sing==k){
							this.basiclist[i].content=res[k]
						}
					}
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
