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
        			<span class="name">付款金额 11111111</span>
        			<span>：¥{{orderData.total_amt | formatNum}}</span>
        			<!-- <span style="font-weight:600;">
        				共<em style="display:inline-block;width:5px;"></em>{{orderData.total_qty}}<em style="display:inline-block;width:5px;"></em>件<em style="display:inline-block;width:10px;"></em>¥{{orderData.total_amt | formatNum}}
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
        	<!-- 合同明细 -->
        	<div class="content-warp" id="content-warp-detailsList" v-if="tabIndex == 'contract'">
        		<scroll>
        			<div style="margin-bottom:0.45rem" v-for="(val,index) in contractList" :keys="index">
        				<item v-for="item in val">
							<div class="info-list">
								<label>{{item.name}}</label>
								<span>{{item.content}}</span>
							</div>
						</item>
        			</div>
        		</scroll>
        	</div>
        	<!-- 采购明细 -->
        	<div class="content-warp" id="content-warp-detailsList" v-if="tabIndex == 'detailed'">
        		<scroll>
        			<div style="margin-bottom:0.45rem" v-for="(val,index) in detailsList" :keys="index">
        				<item v-for="item in val">
							<div class="info-list">
								<label>{{item.name}}</label>
								<span>{{item.content}}</span>
							</div>
						</item>
        			</div>
				</scroll>
        	</div>
        	<!-- 结算方式 -->
        	<div class="content-warp" id="content-warp-detailsList" v-if="tabIndex == 'settlement'">
        		<scroll>
        			<div style="margin-bottom:0.45rem" v-for="(val,key) in settlementlist">
        				<item>
        					<div class="info-list">
								<label>{{val.settle_name}}支付</label>
								<span>{{val.csettle_amt | formatNum}}</span>
							</div>
        				</item>
        				<item v-for="item in val.vallist" v-if="val.settle_name=='银行'">
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
	import ApprovalButton from "./utrl/Approvalbutton.vue";
	import TabItem from "./utrl/Tab.vue";
	import api from "../../../../asset/api.js";
	import "./utrl/style.less";
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: '供应商付款申请',
				// 公司简称
				menuButtonText: "",
                userMsg:'',
				// src:'',
				// taskid & 接口名字
				del_info:{name:"",id:0,stepId:0},
				// tab标题
				tabs: [
					{name:"基本信息",id:"basic"},
					{name:"合同明细",id:"contract",username:"cont"},
					{name:"采购明细",id:"detailed",username:"purchase"},
					{name:"结算方式",id:"settlement",username:"settle"},
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
					{name:"供应商",content:"",sign:"supplier_name"},
					{name:"发票登记信息",content:"",sign:"invoice_register"},
					{name:"付款类别",content:"",sign:"payment_type"},
					{name:"款项性质",content:"",sign:"money_nature"},
					{name:"备注",content:"",sign:"remarks"}
				],
				contract:[
					{name:"合同单号",content:"",sing:"cont_code"},
					{name:"合同名称",content:"",sing:"cont_name"},
					{name:"总金额",content:"",sing:"total_obj_amt"},
					{name:"已付金额",content:"",sing:"paid_amt"},
					{name:"本次付款金额",content:"",sing:"pay_amt"},
					{name:"备注",content:"",sing:"details_remarks"}
				],
				contractList:[

				],
				itemlist:[
					{name:"采购订单号",content:"",sing:"puorder_code"},
					{name:"总金额",content:"",sing:"total_obj_amt"},
					{name:"已付金额",content:"",sing:"paid_amt"},
					{name:"本次付款金额",content:"",sing:"pay_amt"},
					{name:"备注",content:"",sing:"details_remarks"}
				],
				detailsList:[

				],
				alonelist:[
					{name:"支付方式",content:"",sing:"settle_name"},
					{name:"金额",content:"",sing:"settle_amt"}
				],
				meyhodlist:[
					{name:"结算方式",content:"",sing:"settle_name"},
					{name:"结算金额",content:"",sing:"settle_amt"},
					{name:"开户行-省",content:"",sing:"province_name"},
					{name:"开户行-市",content:"",sing:"city_name"},
					{name:"收款人",content:"",sing:"payee_name"},
					{name:"收款人开户行",content:"",sing:"bank_account_name"},
					{name:"收款人账号",content:"",sing:"bank_account_code"}
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
			showTime(val){
				return val.split('T')[0] + " " + val.split('T')[1];
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
				if(res.status >= 200 && res.status < 300){
					res = res.data;
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				let data = res[0];

				this.orderData = res[0];
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

				if(data.payment_type != "采购付款"){
					this.tabs.splice(2,1)
				}else{
					this.tabs.splice(1,1)
				}
				//设置无数据导航不显示
				/*for(var k in res[0]){
					for(var i=0;i<this.tabs.length;i++){
						console.log(data.payment_type)
						// if(this.tabs[i].username==k && res[0][k][0]==null){
						// 	this.tabs.splice(i,1)
						// 	console.log(this.tabs.splice(i,1));
						// }
						if(data.payment_type == "采购付款"){
							// this.tabs.splice(i,1)
						}
					}
				}*/
				//获取合同明细数据
				this.contractList=res[0].cont;
				this.contractList = utrl.setJson(this.contractList,this.contract);

				utrl.thousand(this.detailsList,"total_obj_amt");
				utrl.thousand(this.detailsList,"paid_amt");
				utrl.thousand(this.detailsList,"pay_amt");

				//获取采购明细数据
				this.detailsList=res[0].purchase;
				// console.log(this.detailsList);
				this.detailsList = utrl.setJson(this.detailsList,this.itemlist);
				utrl.thousand(this.detailsList,"total_obj_amt");
				utrl.thousand(this.detailsList,"paid_amt");
				utrl.thousand(this.detailsList,"pay_amt");


				//获取结算方式数据
				this.settlementlist=res[0].settle;
				this.settlementlist = utrl.setJson(this.settlementlist,this.meyhodlist)
				var arr=[];
				var brr=[];
				var crr=[];
				//settle_name val.csettle_amt  alonelist
				for(var i=0;i<this.settlementlist.length;i++){
					arr.push(this.settlementlist[i].splice(0,1));
					crr.push(this.settlementlist[i].splice(0,1));
					brr.push({
						settle_name:arr[i][0].content,
						csettle_amt:crr[i][0].content,
						vallist:this.settlementlist[i]
					})
				}
				this.settlementlist=brr;

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
			// Flowchart
		}
		// ApprovalButton,TabItem,
	// 		import ApprovalButton from "./utrl/Approvalbutton.vue";
	// import TabItem from "./utrl/Tab.vue";
	}
</script>

<style lang="less" scoped>
#content-warp-detailsList{
	background:#eee;
}
</style>
