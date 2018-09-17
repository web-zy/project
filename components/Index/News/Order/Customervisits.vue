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
	        			<span class="name">{{orderData.app_user_name}}  11111111  </span>
	        			<span><i style="opacity:0;">：</i>{{orderData.app_date | time}}</span>
	        		</div>
	        		<div class="a-single">
	        			<span class="name">单号  11111111 </span>
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
	        	<div class="content-warp" v-else-if="tabIndex == 'information'">
	        		<scroll>
	        			<div style="margin-bottom:0.25rem" v-for="val in informationlist">
							<item v-for="item in val">
								<div class="info-list">
									<label>{{item.name}}</label>
									<span>{{item.content | time}}</span>
								</div>
							</item>
						</div>
					</scroll>
	        	</div>
	        	<div class="content-warp" id="content-warp-settlement" v-else-if="tabIndex == 'settlement'">
	        		<scroll>
	        			<div style="margin-bottom:0.25rem" v-for="item in settlementlist">
							<item v-for="val in item">
								<div class="info-list">
									<label>{{val.name}}</label>
									<span>{{val.content | time}}</span>
								</div>
							</item>
						</div>
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
	import TabItem from "./utrl/Tab.vue";
	import Flowchart from "./utrl/Flowchart.vue";
	import api from "../../../../asset/api.js"
	import "./utrl/style.less"
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: '客户互动记录',
				userMsg:"",
				// 公司简称
				menuButtonText: "",
				// taskid & 接口名字
				del_info:{name:"",id:0},
				// tab标题
				tabs: [
					{name:"基本信息",id:"basic"},
					{name:"已关注产品",id:"information",username:"crm_customer_products"},
					{name:"咨询产品",id:"settlement",username:"products"},
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
					{name:"客户",content:"",sing:"customer_abb_name"},
					{name:"互动类型",content:"",sing:"type_name"},
					{name:"日期",content:"",sing:"date"},
					{name:"联系人",content:"",sing:"contact_name"},
					{name:"联系电话",content:"",sing:"contact_phone"},
					{name:"内容",content:"",sing:"content"},
					{name:"结果",content:"",sing:"result"}

				],
				information:[
					{name:"品牌",content:"",sing:"brand_name"},
					{name:"产品名称",content:"",sing:"product_name"},
					{name:"规格型号",content:"",sing:"specification_type"},
					{name:"关注次数",content:"",sing:"atten_number"},
					{name:"最后一次报价",content:"",sing:"clast_quote_amt"}
				],
				informationlist:[

				],
				meyhodlist:[
					{name:"品牌",content:"",sing:"brand_name"},
					{name:"产品名称",content:"",sing:"product_name"},
					{name:"规格型号",content:"",sing:"specification_type"},
					{name:"数量",content:"",sing:"qty"},
					{name:"报价",content:"",sing:"quote_amt"},
					{name:"备注",content:"",sing:"remarks"},
				],
				settlementlist:[
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
				res=res[0]

				this.orderData = res;
				this.menuButtonText=res.company_name
				//this.settlementlist = utrl.setJson(this.settlementlist,this.meyhodlist)
				//crm_customer_products_t
				for(var k in res){
					//获取基本信息
					for(var i=0;i<this.basiclist.length;i++){
						if(this.basiclist[i].sing==k){
							this.basiclist[i].content=res[k]
						}
					}
				}
				//设置无数据导航不显示
				for(var k in res){
					for(var i=0;i<this.tabs.length;i++){
						if(this.tabs[i].username == k && res[k][0]== null){
							this.tabs.splice(i,1)
						}
					}
				}
				this.informationlist=res.crm_customer_products;
				this.informationlist = utrl.setJson(this.informationlist,this.information);
				//crm_customer_products
				//获取  本次咨询产品明细  数据本次咨询产品明细
				//meyhodlist
				this.settlementlist=res.products;
				this.settlementlist = utrl.setJson(this.settlementlist,this.meyhodlist);
				// console.log(this.settlementlist);

				//转换千分制
				utrl.thousand(this.settlementlist,'qty')
				utrl.thousand(this.settlementlist,'quote_amt')
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
