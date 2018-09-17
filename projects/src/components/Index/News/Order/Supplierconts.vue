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
	        			<!-- <span class="name">合同总额 11111111 </span>
	        			<span>：¥{{orderData.total_amt | formatNum}}</span> -->
	        			<span>共<em style="display:inline-block;width:5px;"></em>{{orderData.total_qty}}<em style="display:inline-block;width:5px;"></em>件<em style="display:inline-block;width:10px;"></em>¥{{orderData.total_bd_amt | formatNum}}
        			</span>
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
	        	<div class="content-warp" v-if="tabIndex == 'custconts'">
	        		<scroll>
						<div class="detailed-list" v-for="(val,index) in custcontslist" :key="index" @click="showDetailed(index)">
							<div class="brief-warp">
								<div class="detailed-head">商品</div>
								<div class="detailed-info">
									<span>{{val.topobj.product_name}} {{val.topobj.specification_type}} </span>
									<span>{{val.topobj.warehouse_name}} {{val.topobj.remarks}} </span>
									<span>{{val.topobj.qty}}{{val.topobj.measure_name}} ¥{{val.topobj.amt}}</span>
								</div>
								<!-- <div class="rightBtn button-icon ion-ios-arrow-down"></div> -->、
								<div class="rightBtn button-icon " :class="val.showDrop ? 'ion-ios-arrow-up' : 'ion-ios-arrow-down'"></div>
							</div>

								<div class="drop-down" id="drop-down1" :class="val.showDrop ? 'show-this' : 'hide-this'">
									<item v-for="item in val.bomobj">
										<div class="info-list">
											<label>{{item.name}}</label>
											<span>{{item.content}}</span>
										</div>
									</item>
								</div>

						</div>
					</scroll>
	        	</div>
	        	<div class="content-warp" id="content-warp-settlement" v-else-if="tabIndex =='settlement'">
	        		<scroll>
	        				<div style="margin-bottom:0.25rem" v-for="(val,key) in settlementlist">
		        				<item v-for="item in val">
									<div class="info-list" >
										<label>{{item.name}}</label>
										<span>{{item.content | time}}</span>
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
				title: '供应商合同',
				userMsg:"",
				// 公司简称
				menuButtonText: "",
				// taskid & 接口名字
				del_info:{name:"",id:0},
				// tab标题
				tabs: [
					{name:"合同信息",id:"basic"},
					{name:"合同标的",id:"custconts"},
					{name:"付款方式",id:"settlement"},
					{name:"审批流程",id:"trial"}
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
					{name:"合同名称",content:"",sing:"name"},
					{name:"甲方",content:"",sing:"A"},
					{name:"乙方",content:"",sing:"B"},
					{name:"合同类别",content:"",sing:"type_name"},
					{name:"合同归档号",content:"",sing:"filing_no"},
					{name:"合同总金额",content:"",sing:"total_amt"},
					{name:"合同签订日期",content:"",sing:"sign_date"},
					{name:"合同开始日期",content:"",sing:"start_date"},
					{name:"合同结束日期",content:"",sing:"end_date"},
					{name:"合同签订人",content:"",sing:"sign_person_name"},
					{name:"合同负责人",content:"",sing:"principal_person_name"},
					{name:"备注",content:"",sing:"remarks"}
				],
				//合同标的
				custcontslist:[],
				custconts:[
					{name:"品牌",content:"",sing:"brand_name"},
					{name:"产品名称",content:"",sing:"product_name"},
					{name:"规格型号",content:"",sing:"specification_type"},
					{name:"数量",content:"",sing:"qty"},
					{name:"单位",content:"",sing:"measure_name"},
					{name:"单价",content:"",sing:"price"},
					{name:"金额",content:"",sing:"amt"},
					{name:"备注",content:"",sing:"remarks"},
				],
				meyhodlist:[
					{name:"付款节点",content:"",sing:"note_name"},
					{name:"付款描述",content:"",sing:"description"},
					{name:"付款比例(%)",content:"",sing:"ratio"},
					{name:"付款金额",content:"",sing:"amt"},
					{name:"预计付款时间",content:"",sing:"pre_date"},
					{name:"备注",content:"",sing:"remarks"}
				],
				settlementlist:[

				],
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
			// this.src=api.headUrl+this.$route.params.src;
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
				console.log(res)
				this.menuButtonText=res.company_name
				//this.settlementlist = utrl.setJson(this.settlementlist,this.meyhodlist)
				//获取基本信息
				for(var k in res){
					for(var i=0;i<this.basiclist.length;i++){
						if(this.basiclist[i].sing==k){
							this.basiclist[i].content=res[k]
							if(this.basiclist[i].sing=='total_amt'){
								this.basiclist[i].content=utrl.formatNum(this.basiclist[i].content)
							}
						}
					}
				}
				//获取合同标的
				this.custcontslist=res.bd
				this.setTrialList()
				//获取付款方式数据  ct_supplier_cont_pay_t
				this.settlementlist=res.pay;
				this.settlementlist = utrl.setJson(this.settlementlist,this.meyhodlist)

				utrl.qianfens(this.custcontslist,"qty","topobj")
				utrl.qianfens(this.custcontslist,"amt","topobj")
				utrl.qianfens(this.custcontslist,"qty","bomobj")
				utrl.qianfens(this.custcontslist,"amt","bomobj")
				utrl.qianfens(this.custcontslist,"price","bomobj")
				utrl.thousand(this.settlementlist,'amt')
			},
			// 配置商品详细信息
			setTrialList(v){
				var brr=[];
				var arr=this.custcontslist;
				this.custcontslist = utrl.setJson(this.custcontslist,this.custconts)
				console.log(this.custcontslist);
				for(var i=0;i<this.custcontslist.length;i++){
					brr.push({
						topobj:arr[i],
						bomobj:this.custcontslist[i]
					})
				}
				this.custcontslist=brr;
			},
			// 详细信息展示
			showDetailed(index){
				//Vue.set(object, key, value)
				for(let i in this.custcontslist){
					if(i == index){
						continue
					}
					//注意不用set会数组更新dom不更新
					Vue.set(this.custcontslist[i], 'showDrop', false)
					//this.custcontslist[i].showDrop = false;
				}
				if(this.custcontslist[index].showDrop){
					Vue.set(this.custcontslist[index], 'showDrop', false)
				}else{
					Vue.set(this.custcontslist[index], 'showDrop', true)
				}
				//this.settlementlist = utrl.setJson(this.settlementlist,this.meyhodlist)
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
.outOf #saleorders .content .content-warp  #drop-down1{
	padding:0;
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
.fade-enter-active, .fade-leave-active {
	opacity:1;
   transition:1s;
}
.fade-enter, .fade-leave-active {
	opacity:0;
   transition:1s;
}

</style>
