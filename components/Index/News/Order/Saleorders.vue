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
        			<span>共<em style="display:inline-block;width:5px;"></em>{{orderData.total_qty}}<em style="display:inline-block;width:5px;"></em>件<em style="display:inline-block;width:10px;"></em>¥{{orderData.total_real_amt | formatNum}}
        			</span>
        		</div>
        	</div>
        </div>
        <div class="tabsWarp">
        	<tab-item :tabArr="tabs" @clickIndex="onTabClick"></tab-item>
        </div>
        <div class="content">
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
        	<div class="content-warp" v-if="tabIndex == 'detailed'">
        		<scroll>
					<div class="detailed-list" v-for="(val,index) in details" :key="index" @click="showDetailed(index)">
						<div class="brief-warp">
							<div class="detailed-head">商品</div>
							<div class="detailed-info">
								<span>{{val.topobj.product_name}} {{val.topobj.specification_type}} </span>
								<!-- <span>{{val.warehouse_name}} {{val.remarks}} </span> -->
								<span>{{val.topobj.qty}}¥{{val.topobj.real_amt | formatNum}}</span>
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
	import api from "../../../../asset/api.js";
	import "./utrl/style.less"
	import utrl from '../../../../controller/utrl.js'
    import orderFun from "./utrl/orderFun.js"
	export default {
		data() {
			return {
				title: '客户订单',
				// 公司简称
                userMsg:'',
				menuButtonText: "",
				// taskid & 接口名字
				del_info:{name:"",id:0,stepId:0},
				// tab标题
				tabs: [
					{name:"基本信息",id:"basic"},
					{name:"商品明细",id:"detailed"},
					{name:"审批进程",id:"trial"}
				],
				// 审批按钮
				buttons:[
					// btnid为审批接口名称

					{name:"同意",btnId:"quickagree",icon:"icon-Agree"},
					{name:"拒绝",btnId:"reject",icon:"icon-Disagree"},
					//{name:"退回",btnId:"return",icon:"icon-Return"}
					// {
					// 	name:"更多",
					// 	btnId:"more",
					// 	subBtn:[
					// 		{name:"知会",btnId:"inform"},
					// 	]
					// }

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
						name:"业务员",
						content:"",
						sing:"saleman_name"
					},
					{
						name:"交货日期",
						content:"",
						icon:"",
						sing:"plan_delivery_date",
						hasData:true
					},
					{name:"发票类型",content:"",sing:"invoice_type"},
					{name:"部门",content:"",sing:"app_dept_name"},
					{name:"业务部门",content:"",sing:"dept_name"},
					{name:"合同号",content:"",sing:"contract_code"},
					{name:"发货详细地址",content:"",sing:"delivery_address"},
					{name:"客户简称",content:"",sing:"customer_abb_name"},
					{name:"联系电话",content:"",sing:"contact_phone"},
					{name:"联系人",content:"",sing:"contact_name"},
					{name:"备注",content:"",sing:"remarks"},
					{name:"仓库",content:"",sing:"warehouse_name"}
				],
				detailsList:[
					{name:"产品名称",content:"",sing:"product_name"},
					{name:"规格型号",content:"",sing:"specification_type"},
					{name:"仓库",content:"",sing:"warehouse_name"},
					{name:"赠品",content:"",sing:"is_free_gifts"},
					{name:"数量",content:"",sing:"qty"},
					{name:"单位",content:"",sing:"unit_name"},
					{name:"包装单位",content:"",sing:"packing_unit"},
					{name:"单价",content:"",sing:"price"},
					{name:"金额",content:"",sing:"amt"},
					{name:"折扣(%)",content:"",sing:"discount"},
					{name:"折扣额",content:"",sing:"discount_amt"},
					{name:"结算金额",content:"",sing:"real_amt"},
					{name:"备注",content:"",sing:"remarks"}
				],
				details:[]
			}
		},
		filters:{
			time: function(val) {
				val=String(val)
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
//                 this.userMsg = orderFun.setUserData(this.orderData)
//                 console.log(this.userMsg)
				this.details=res[0].details
				this.setTrialList()
		        //设置右上角公司名字
				this.menuButtonText = data.company_name;
				for(let val in data){
					for(let i=0;i<_this.essInfo.length;i++){
						if(_this.essInfo[i].sing == val){
							_this.essInfo[i].content = data[val]
						}
					}
				}
				utrl.qianfens(this.details,"price","topobj")
				// utrl.qianfens(this.details,"qty","bomobj")
				utrl.qianfens(this.details,"price","bomobj")
				utrl.qianfens(this.details,"amt","bomobj")
				utrl.qianfens(this.details,"real_amt","bomobj")
				utrl.qianfens(this.details,"discount_amt","bomobj")
				// for(let i=0;i<this.details.length;i++){
				// 	for(let j=0;j<this.details[i].bomobj.length;j++){
				// 		// Vue.set(this.details[i].topobj,k,this.details[i].topobj[k]+"%")
				// 		if(this.details[i].bomobj[j].sing=="discount"){
				// 			Vue.set(this.details[i].bomobj[j],'content',this.details[i].bomobj[j].content+"%")
				// 		}
				// 	}
				// }
			},
			setTrialList(v){
				var brr=[];
				var arr=this.details;
				this.details = utrl.setJson(this.details,this.detailsList);
				for(var i=0;i<this.details.length;i++){
					//合拼数量和单位
					let tmpName = "";
					let index = 0;
					let removeIndex = 0;
					for(let j in this.details[i]){
						if(this.details[i][j].sing == 'unit_name'){
							tmpName = this.details[i][j].content;
							removeIndex = j;
						}
						if(this.details[i][j].sing == "qty"){
							index = j;
						}
					}
					this.details[i][index].content = this.details[i][index].content + tmpName
					// 删除单位
					this.details[i].splice(removeIndex,1)
					// 添加数据
					brr.push({
						topobj:arr[i],
						bomobj:this.details[i]
					})
				}
				this.details=brr;
			},
			// 详细信息展示
			showDetailed(index){
				//details
				for(let i in this.details){
					if(i == index){
						continue
					}
					Vue.set(this.details[i], 'showDrop', false)
				}
				if(this.details[index].showDrop){
					Vue.set(this.details[index], 'showDrop', false)
				}else{
					Vue.set(this.details[index], 'showDrop', true)
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
			// Flowchart
		}
		// ApprovalButton,TabItem,
	// 		import ApprovalButton from "./utrl/Approvalbutton.vue";
	// import TabItem from "./utrl/Tab.vue";
	}
</script>

<style lang="less" scoped>

</style>
