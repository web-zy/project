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
        			<span class="name">{{orderData.app_user_name}} 11111111</span>
        			<span><i style="opacity:0;">：</i>{{orderData.app_date | time}}</span>
        		</div>
        		<div class="a-single">
        			<span class="name">单号 11111111</span>
        			<span>：{{orderData.code}}</span>
        		</div>
        		<div class="a-single">
        			<span class="name">共计 11111111</span>
        			<span>：¥{{orderData.total_amt | formatNum}}</span>
        			<!-- <span>
        				共<em style="display:inline-block;width:5px;"></em>{{orderData.qty}}<em style="display:inline-block;width:5px;"></em>件<em style="display:inline-block;width:10px;"></em>¥{{orderData.total_amt | formatNum}}
        			</span> -->
        		</div>
        	</div>
        </div>
        <div class="tabsWarp">
        	<tab-item :tabArr="tabs" @clickIndex="onTabClick"></tab-item>
        </div>
        <div class="content">
        	<!-- 基本信息 -->
        	<div class="content-warp" v-show="tabIndex == 'basic'">
        		<scroll class="list-ios">
					<item v-for="(val,index) in essInfo" :key="index">
						<div class="info-list">
							<label>{{val.name}}</label>
							<span v-if="!val.hasData">{{val.content}}</span>
							<span v-if="val.hasData">{{val.content | time}}</span>
						</div>
					</item>
				</scroll>
        	</div>
        	<!-- 开票信息 -->
        	<div class="content-warp" v-if="tabIndex == 'detailed'">
        		<scroll>
					<item v-for="(val,index) in detailsList" :key="index">
						<div class="info-list">
							<label>{{val.name}}</label>
							<span v-if="!val.hasData">{{val.content}}</span>
							<span v-if="val.hasData">{{val.content | time}}</span>
						</div>
					</item>
				</scroll>
        	</div>
        	<!-- 邮寄信息 -->
        	<div class="content-warp" v-if="tabIndex == 'mail'">
        		<scroll v-if="(mail[0].content == 1)">
					<item v-for="(val,index) in mail" :key="index" v-if="index == mail.length-1">
						<div class="info-list" >
							<label>{{mail[index].name}}</label>
							<span v-if="!val.hasData">{{val.content}}</span>
							<span v-if="val.hasData">{{val.content | time}}</span>
						</div>
					</item>
				</scroll>
				<scroll v-if="(mail[0].content == 0)">
					<item v-for="(val,index) in mail" :key="index" v-if="index != 0">
						<div class="info-list">
							<label>{{val.name}}</label>
							<span v-if="!val.hasData">{{val.content}}</span>
							<span v-if="val.hasData">{{val.content | time}}</span>
						</div>
					</item>
				</scroll>
        	</div>

        	<!-- 发票明细 -->
        	<div class="content-warp" id="content-warp-detailsList" v-if="tabIndex == 'settlement'">
        		<scroll>
        			<!-- <div style="margin-bottom:0.45rem" v-for="(val,key) in settlementlist">
        				<item v-for="item in val">
							<div class="info-list">
								<label>{{item.name}}</label>
								<span>{{item.content}}</span>
							</div>
						</item>
        			</div> -->
        			<div class="detailed-list" v-for="(val,index) in settlementlist" :key="index" @click="showDetailed(index)">
						<div class="brief-warp">
							<div class="detailed-head">产品</div>
							<div class="detailed-info">
								<span>{{val.topobj.product_name}} {{val.topobj.specification_type}} </span>
								<!-- <span>{{val.warehouse_name}} {{val.remarks}} </span> -->
								<span>{{val.topobj.qty}}{{val.topobj.unit_name}} ¥{{val.topobj.amt | formatNum}}</span>
							</div>
							<div class="rightBtn button-icon " :class="val.showDrop ? 'ion-ios-arrow-up' : 'ion-ios-arrow-down'"></div>
						</div>
						<div class="drop-down list-ios" id="drop-down1" :class="val.showDrop ? 'show-this' : 'hide-this'">
							<item v-for="s_val in val.bomobj">
								<div class="info-list">
									<label>{{s_val.name}}</label>
									<span>{{s_val.content}}</span>
								</div>
							</item>
						</div>
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
	import Vue from "vue";
	import ApprovalButton from "./utrl/Approvalbutton.vue";
	import TabItem from "./utrl/Tab.vue";
	import api from "../../../../asset/api.js";
	import "./utrl/style.less";
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: '客户发票申请',
				// 头像
                userMsg:"",
				// src:"",
				// 公司简称
				menuButtonText: "",
				// taskid & 接口名字
				del_info:{name:"",id:0,stepId:0},
				// tab标题
				tabs: [
					{name:"基本信息",id:"basic"},
					{name:"开票信息",id:"detailed"},
					{name:"邮寄信息",id:"mail"},
					{name:"发票明细",id:"settlement"},
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
					{name:"部门",content:"",sign:"app_dept_name"},
					{name:"申请日期",content:"",sign:"app_date",hasData:true},
					{name:"发票号",content:"",sign:"invoice_code"},
					{name:"客户",content:"",sign:"customer_name"},
					{name:"发票抬头",content:"",sign:"invoice_name"}
				],
				detailsList:[
					{name:"公司注册地址",content:"",sign:"company_register_address"},
					{name:"纳税人识别号",content:"",sign:"taxpayer_identification_no"},
					{name:"联系人",content:"",sign:"invoice_contact_name"},
					{name:"联系人电话",content:"",sign:"invoice_contact_phone"},
					{name:"开户行账号",content:"",sign:"bank_account_code"},
					{name:"开户地",content:"",sign:"bank_account_place"},
					{name:"开户行",content:"",sign:"bank_account_name"}
				],
				mail:[
					{name:"是否邮寄",content:"",sign:"is_post"},
					{name:"邮寄地址",content:"",sign:"post_address"},
					{name:"收件联系人",content:"",sign:"post_contact_name"},
					{name:"收件联系电话",content:"",sign:"post_contact_phone"},
					{name:"物流公司",content:"",sign:"logistics_company_name"},
					{name:"物流单号",content:"",sign:"logistics_no"},
					{name:"备注",content:"",sign:"remarks"}
				],
				meyhodlist:[
					{name:"产品",content:"",sing:"product_name"},
					{name:"规格型号",content:"",sing:"specification_type"},
					{name:"数量",content:"",sing:"qty"},
					{name:"单位",content:"",sing:"unit_name"},
					{name:"单价",content:"",sing:"price"},
					{name:"金额",content:"",sing:"amt"},
					{name:"备注",content:"",sing:"details_remarks"}
				],

				settlementlist:[

				]

			}
		},
		// 时间转换
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
			// this.src=this.$route.params.src
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
				let data = res[0];
				this.orderData = res[0];
				// console.log(this.orderData)
				//设置右上角公司名字
				this.menuButtonText = data.company_name;
				// 基本信息
				for(let val in data){
					for(let i=0;i<_this.essInfo.length;i++){
						if(_this.essInfo[i].sign == val){
							_this.essInfo[i].content = data[val]
						}
					}
				};
				//获取开票信息数据
				for(let val in data){
					for(let i=0;i<_this.detailsList.length;i++){
						if(_this.detailsList[i].sign == val){
							_this.detailsList[i].content = data[val]
						}
					}
				};
				//获取邮寄信息数据
				for(let val in data){
					for(let i=0;i<_this.mail.length;i++){
						if(_this.mail[i].sign == val){
							_this.mail[i].content = data[val]
						}
					}
				};
				// 获取发票明细数据
				this.settlementlist=res[0].details;
				this.setTrialList()
				//console.log(this.settlementlist);
				// this.settlementlist = utrl.setJson(this.settlementlist,this.meyhodlist);
				// utrl.thousand(this.settlementlist,"price");
				utrl.qianfens(this.settlementlist,"price","topobj")
				// utrl.qianfens(this.details,"qty","bomobj")
				utrl.qianfens(this.settlementlist,"amt","bomobj")
				utrl.qianfens(this.settlementlist,"amt","bomobj")
				utrl.eights(this.settlementlist,"price","bomobj")
				// utrl.thousand(this.settlementlist,"amt");
				// utrl.thousand(this.settlementlist,"qty");
				// utrl.eights(this.settlementlist,"price");




			},
			setTrialList(v){
				var brr=[];
				var arr=this.settlementlist;
				this.settlementlist = utrl.setJson(this.settlementlist,this.meyhodlist);
				for(var i=0;i<this.settlementlist.length;i++){
					//合拼数量和单位
					let tmpName = "";
					let index = 0;
					let removeIndex = 0;
					for(let j in this.settlementlist[i]){
						if(this.settlementlist[i][j].sing == 'unit_name'){
							tmpName = this.settlementlist[i][j].content;
							removeIndex = j;
						}
						if(this.settlementlist[i][j].sing == "qty"){
							index = j;
						}
					}
					this.settlementlist[i][index].content = this.settlementlist[i][index].content + tmpName
					// 删除单位
					this.settlementlist[i].splice(removeIndex,1)
					// 添加数据
					brr.push({
						topobj:arr[i],
						bomobj:this.settlementlist[i]
					})
				}
				this.settlementlist=brr;
			},
			// 详细信息展示
			showDetailed(index){
				//details
				for(let i in this.settlementlist){
					if(i == index){
						continue
					}
					Vue.set(this.settlementlist[i], 'showDrop', false)
				}
				if(this.settlementlist[index].showDrop){
					Vue.set(this.settlementlist[index], 'showDrop', false)
				}else{
					Vue.set(this.settlementlist[index], 'showDrop', true)
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
		}
	}
</script>

<style lang="less" scoped>
#content-warp-detailsList{
	background:#eee;
}
</style>
