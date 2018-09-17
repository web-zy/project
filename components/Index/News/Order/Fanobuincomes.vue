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
        			<span class="name">{{orderData.app_user_name}} 1111</span>
        			<span><i style="opacity:0;">：</i>{{orderData.app_date | time}}</span>
        		</div>
        		<div class="a-single">
        			<span class="name">单号 1111</span>
        			<span>：{{orderData.code}}</span>
        		</div>
        		<div class="a-single">
        			<span class="name">收入金额 1111</span>
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
							<span v-if="!val.hasData">{{val.content}}</span>
							<span v-if="val.hasData">{{val.content | time}}</span>
						</div>
					</item>
				</scroll>
        	</div>
        	<!-- 收款明细 -->
        	<div class="content-warp" v-if="tabIndex == 'detailed'">
        		<scroll>
        			<div style="margin-bottom:0.45rem" v-for="(val,index) in details" :keys="index">
        				<item v-for="item in val">
							<div class="info-list">
								<label>{{item.name}}</label>
								<span>{{item.content}}</span>
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
	import api from "../../../../asset/api.js";
	import "./utrl/style.less";
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: '非业务收款单',
				// src:'',
				// 公司简称
                userMsg:'',
				menuButtonText: "",
				// taskid & 接口名字
				del_info:{name:"",id:0,stepId:0},
				// tab标题
				tabs: [
					{name:"基本信息",id:"basic"},
					{name:"收款明细",id:"detailed"},
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
				details:[],
				detailsList:[
					{name:"到款单位",content:"",sing:"pay_company"},
					{name:"收入明细",content:"",sing:"income_detail"},
					{name:"收入金额",content:"",sing:"income_amt"},
					{name:"收入银行",content:"",sing:"bank_account_name"},
					{name:"银行账号",content:"",sing:"bank_account_code"},
					{name:"收款原因",content:"",sing:"income_reason"}
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
				console.log(res)
				if(res.status >= 200 && res.status < 300){
					res = res.data;
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				let data = res[0];
				for(let a in res[0].fa_nobuincome_t){
					res[0].fa_nobuincome_t[a].showDrop = false;
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
				//收款明细
				this.details=res[0].details;
				this.details = utrl.setJson(this.details,this.detailsList);
			},

			// 详细信息展示
			/*showDetailed(index){
				console.log(1)
				if(this.orderData.fa_nobuincome_t[index].showDrop){
					this.orderData.fa_nobuincome_t[index].showDrop = false;
				}else{
					this.orderData.fa_nobuincome_t[index].showDrop = true;
				}
				for(let i in this.orderData.fa_nobuincome_t){
					if(i == index){
						continue
					}
					this.orderData.fa_nobuincome_t[i].showDrop = false;
				}
			},*/
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
			// Flowchart
		}
		// ApprovalButton,TabItem,
	// 		import ApprovalButton from "./utrl/Approvalbutton.vue";
	// import TabItem from "./utrl/Tab.vue";
	}
</script>

<style lang="less" scoped>

</style>
