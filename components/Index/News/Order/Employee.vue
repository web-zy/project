<template>
	<div class="outOf">
		<div id="saleorders">
			<von-header>
	            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	            <span slot="title">{{title}}</span>
	            <div class="button button-icon company" slot="right">{{menuButtonText}}</div>
	        </von-header>
	        <div class="subInfo">
	        	<div class="head-por">客户</div>
	        	<div class="info">
	        		<div class="a-single">
	        			<span class="name">{{orderData.app_user_name}}</span>
	        			<span>{{orderData.app_date | time}}</span>
	        		</div>
	        		<div class="a-single">
	        			<span class="name">单号</span>
	        			<span>{{orderData.code}}</span>
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
						<div class="trial-list" v-for="(val,index) in trialList"
						 :key="index"
						 :class="index == 0 ? 'last' : index == trialList.length-1 ? 'first' : ''">
							<div class="headPic">头</div>
							<label>
								{{val.OwnerAccount}}
								<em class="color">{{val.SelAction || val.NodeName}}</em>
								<span class="comments" v-if="val.Comments"><br/>{{val.Comments}}</span>
							</label>
							<div class="timer">
								<span class="wait" v-if="val.wait">{{val.wait}}</span>
								<span v-if="!val.wait">{{val.year}}</span>
								<em v-if="!val.wait">{{val.hour}}</em>
							</div>
						</div>
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
	import api from "../../../../asset/api.js"
	import "./utrl/style.less"
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: '添加员工',
				// 公司简称
				menuButtonText: "",
				// taskid & 接口名字
				del_info:{name:"",id:0},
				// tab标题
				tabs: [
					{name:"申请人信息",id:"basic"},
					{name:"审批进程",id:"trial"}
				],
				// 审批按钮
				buttons:[
					// btnid为审批接口名称
					{name:"同意",btnId:"quickagree"},
					{name:"拒绝",btnId:"reject"},
					//{name:"退回",btnId:"return"},

				],
				tabIndex: "basic",
				orderData:{
					app_dept_name:"",
					code:"",
					app_user_name:"",
					app_date:"",
				},
				basiclist:[
					{name:"加入公司",content:"",sing:"company_name"},
					{name:"姓名",content:"",sing:"user_name"},
					{name:"手机号",content:"",sing:"user_account"},
					{name:"操作日期",content:"",sing:"app_date"},
					{name:"员工编号",content:"",sing:"employee_no"},
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
			}
		},
		mounted() {
			//console.log(this.$route.params)
			this.del_info = {name:this.$route.params.interface,id:this.$route.params.id};
			console.log(this.del_info)
			this.getDelData()
			this.getProcsteps()
		},
		methods: {
			back: function() {
				$router.go(-1)
			},
			//补0
			repairZero(num){
				return num < 10 ? "0" + num : num;
			},
			//获取审批进度
			async getProcsteps(){
				let _this = this;
				let url = "procsteps?filter=TaskID=" + this.del_info.id + "&token=" + api.token;
				let res = await api.get(url);
				if(res.status >= 200 && res.status < 300){
					res = res.data;
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				this.trialList = res;
				for(let i in this.trialList){
					if(_this.trialList[i].FinishAt){
						let newTime = new Date(_this.trialList[i].FinishAt);
						_this.trialList[i].year = _this.trialList[i].FinishAt.split("T")[0]
						_this.trialList[i].hour = this.repairZero(newTime.getHours()) + ":" + this.repairZero(newTime.getMinutes());
						_this.trialList = _this.trialList;
					}else{
						let nowTime = Date.parse(new Date());
						let newTime = Date.parse(new Date(_this.trialList[i].ReceiveAt))
						let waitTime = (nowTime - newTime);
						let Hours = waitTime / 1000 / 60 / 60 % 24;
						let Minutes = waitTime / 1000 / 60 % 60;
						let Seconds = waitTime / 1000 & 60;
						// setInterval(function(){
							_this.trialList[i].wait = "已等待" + parseInt(Hours) + "小时" + parseInt(Minutes) + "分" ; //+ parseInt(Seconds) + "秒"
						// },1000)
					}
				}
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
				console.log(11)
				console.log(res)
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
