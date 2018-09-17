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
	        			<span class="name">报销总额</span>
        				<span>：¥{{orderData.total_amt | formatNum}}</span>
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
								<span>{{val.content}}</span>
							</div>
						</item>
						<div class="fujian" style="border:1px solid white;">
							<label>图片</label>
						</div>
						<div class="picfiles">
							<img :src="item.src" v-for="item in piclist" @click="preview(item)"/>
						</div>
						<div class="fujian" style="border:1px solid white;">
							<label>附件</label>
						</div>
						<div v-for="item in filelist" class="files" @click.stop="down(item)">
							<i class="icon-AccountTable"></i><span>{{item.filename}}</span>
						</div>
					</scroll>
	        	</div>
	        	<div class="content-warp"  id="content-warp-detailsList" v-else-if="tabIndex == 'detailed'">
	        		<scroll>
	        			<div style="margin-bottom:0.25rem" v-for="(val,index) in detailsList" :keys="index">
	        				<item v-for="item in val">
								<div class="info-list">
									<label>{{item.name}}</label>
									<span>{{item.content}}</span>
								</div>
							</item>
	        			</div>
					</scroll>
	        	</div>

	        	<!--<div class="content-warp" id="content-warp-detailsList" v-else-if="tabIndex =='borrowMoney'">-->
	        		<!--<scroll>-->
	        			<!--<div style="margin-bottom:0.25rem" v-for="(val,key) in borrowMoneylist">-->
	        				<!--<item v-for="item in val">-->
								<!--<div class="info-list">-->
									<!--<label>{{item.name}}</label>-->
									<!--<span>{{item.content | time}}</span>-->
								<!--</div>-->
							<!--</item>-->
	        			<!--</div>-->
					<!--</scroll>-->
	        	<!--</div>-->
	        	<!--<div class="content-warp" id="content-warp-settlement" v-else-if="tabIndex =='settlement'">-->
	        		<!--<scroll>-->
	        			<!--<div style="margin-bottom:0.25rem" v-for="(val,key) in settlementlist">-->
	        				<!--<item>-->
	        					<!--<div class="info-list">-->
									<!--<label>{{val.settle_name}}支付</label>-->
									<!--<span>{{val.csettle_amt | formatNum}}</span>-->
								<!--</div>-->
	        				<!--</item>-->
	        				<!--<item v-for="item in val.vallist" v-if="val.settle_name=='银行'">-->
								<!--<div class="info-list">-->
									<!--<label>{{item.name}}</label>-->
									<!--<span>{{item.content}}</span>-->
								<!--</div>-->
							<!--</item>-->
	        			<!--</div>-->
					<!--</scroll>-->
	        	<!--</div>-->
	        	<div class="content-warp" v-else-if="tabIndex == 'trial'">
	        		<scroll>
						<Flowchart></Flowchart>
					</scroll>
	        	</div>
	        </div>
			<ApprovalButton  :btns=buttons @clickBack="approvalClcik"></ApprovalButton>
		</div>
		<preview v-if="picshow" :picdetails="picdetails" @picturhide="pichide"></preview>
	</div>
</template>

<script>
	import ApprovalButton from "./utrl/Approvalbutton.vue";
	import TabItem from "./utrl/Tab.vue";
	import Flowchart from "./utrl/Flowchart.vue";
	import api from "../../../../asset/api.js"
	import "./utrl/style.less"
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: '费用报销',
				// 公司简称
				menuButtonText: "",
				// taskID & 接口名字
				del_info:{name:"",id:0},
				userInfo:{},
				picshow:false,
				picdetails:"",
				src:"",
				// tab标题
				tabs: [
					{name:"基本信息",id:"basic"},
					{name:"费用明细",id:"detailed",username:"details"},
					{name:"冲借款",id:"borrowMoney",username:"loans"},
					{name:"结算方式",id:"settlement",username:"settles"},
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
						name:"费用承担部门",
						content:"",
						sing:"exp_dept_name"
					},
					{name:"费用承担部人",content:"",sing:"exp_people_name"},
					{name:"标题",content:"",sing:"title"},
					{name:"备注",content:"",sing:"remarks"}
				],
				trialList:[],
				itemlist:[
					{name:"实际用途",content:"",sing:"actual_use"},
					{name:"费用类别",content:"",sing:"expense_class_detail_name"},
					{name:"报销金额",content:"",sing:"amt"},
					{name:"备注",content:"",sing:"remarks"}
				],
				detailsList:[

				],
				alonelist:[
					{name:"支付方式",content:"",sing:"settle_name"},
					{name:"金额",content:"",sing:"settle_amt"}
				],
				// meyhodlist:[
				// 	{name:"支付方式",content:"",sing:"settle_name"},
				// 	{name:"金额",content:"",sing:"settle_amt"},
				// 	{name:"开户行地区",content:"",sing:"province_name"},
				// 	{name:"开户行城市",content:"",sing:"city_name"},
				// 	{name:"收款人",content:"",sing:"payee_account_name"},
				// 	{name:"开户行",content:"",sing:"payee_account_bank"},
				// 	{name:"收款人账号",content:"",sing:"payee_account_code"}
				// ],
				// settlementlist:[
                //
				// ],
				// borrowMoneylist:[],
				// borrowMoney:[
				// 	{name:"借款单号",content:"",sing:"loan_code"},
				// 	{name:"借款日期",content:"",sing:"loan_date"},
				// 	{name:"借款事由",content:"",sing:"loan_reason"},
				// 	{name:"剩余借款金额",content:"",sing:"balance_amt"},
				// 	{name:"本次报销金额",content:"",sing:"repayment_amt"}
				// ],
				bank:"银行",
				moneynum:"123",
				uniqueid:"",
				filelist:[],
				piclist:[],
				company_id:""
			}
		},
		filters:{
			time: function(val) {
					val=String(val)
					if(val.indexOf("T")!=-1){
						return val.split('T')[0]
					}else{
						return val
					}

			},
			showTime(val){
				if(val.indexOf("T")!=-1){
					return val.split('T')[0] + " " + val.split('T')[1];
				}
				
      },
      formatNum: function(val) {
        val = String(val)
        return utrl.formatNum(val)
      }
    },
    mounted() {
    	//head_image_id
    	console.log(this.$route.params)
      this.userInfo.head_image_id =this.$route.params.head_image_id;
      this.del_info = {
        name: this.$route.params.interface,
        id: this.$route.params.id,
        stepId:this.$route.params.stepId
      }
      this.getDelData();
      //this.buttons=this.$route.params.buttons
	},

		methods: {
			preview(val,e){
				this.picshow=true
				this.picdetails=val
				history.pushState(null, null, document.URL);
           	 window.addEventListener("popstate", this.pichide, false);
			},
			pichide(){
				this.picshow=false	
				// if(e.toString() === '[object MouseEvent]') history.go(-1);
           		 window.removeEventListener("popstate", this.pichide, false);
			},
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
                    // //设置无数据导航不显示
                    for(var k in res[0]){
                        for(var i=0;i<this.tabs.length;i++){
                            if(this.tabs[i].username==k && res[0][k][0]==null){
                                this.tabs.splice(i,1);
                            }
                        }
                    }
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				let data = res[0];
				console.log(data);
				 this.userInfo.user_name=data.app_user_name
				this.orderData = res[0];
				this.menuButtonText = data.company_name;
				this.company_id=data.company_id
				let picstr=[]
				if(data.picture){
					if(data.picture.indexOf(",")!=-1){
						let picture=data.picture.split(",")
						picstr=picture
					}else{
						picstr.push(data.attachment)
					}
				}
					//获取图片
					for(let i=0;i<picstr.length;i++){
						let picurl="images/"+picstr[i]+"/thumbnail/66?token="+api.token+"&company_id="+this.company_id
						let picres=await api.get(picurl)
						if(picres.status >= 200 && picres.status < 300){
							//this.filelist=response.data
							let urls="images/meta/"+picstr[i]+"?token="+api.token+"&company_id="+this.company_id
							let ress=await api.get(urls)
							
							//获取原图
							let Customaryurl="images/"+picstr[i]+"?token="+api.token+"&company_id="+this.company_id
							let Customaryres=await api.get(Customaryurl)
							if(Customaryres.status >= 200 && Customaryres.status < 300){
				               	//this.src="data:"+this.picdetails.type+";base64,"+res.data
				               	this.piclist.push({
									src:"data:image/png;base64,"+picres.data,
									id:picstr[i],
									Customarsrc:"data:"+ress.data.content_type+";base64,"+Customaryres.data
								})
							}else{
								$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
								return
							}
						}else{
							$toast.show(response.data.errmsg + "，请重试！", 3000).then(() => {})
							return
						}
					}
				
				
				let attachmentstr=""
				if(data.attachment){
					if(data.attachment.indexOf(",")!=-1){
						let attachment=data.attachment.split(",")
						for(var i=0;i<attachment.length;i++){
							if(i==attachment.length-1){
								attachmentstr+=attachment[i]
							}else{
								attachmentstr+=attachment[i]+"|"
							}
						}
					}else{
						attachmentstr=data.attachment
					}
				}
//
				//获取附件数据
				let listurl="files/meta?token="+api.token+"&company_id="+this.company_id+"&filter=id~"+attachmentstr
				let response=await api.get(listurl)
				if(response.status >= 200 && response.status < 300){
					this.filelist=response.data
				}else{
					$toast.show(response.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				for(var key in res[0]){
					for(var i=0;i<this.essInfo.length;i++){
						if(this.essInfo[i].sing==key){
							this.essInfo[i].content=res[0][key]
						}
					}
				}

				//获取报销明细数据
			//	console.log(res[0])
			//details
				//this.detailsList=res[0].ce_cost_expense_details_t;
				this.detailsList=res[0].details;
//				this.tmp
				this.detailsList = utrl.setJson(this.detailsList,this.itemlist)
				// console.log(this.detailsList)
				utrl.thousand(this.detailsList,"amt")
				//获取结算方式数据
				// this.settlementlist=res[0].settles;
				// this.settlementlist = utrl.setJson(this.settlementlist,this.meyhodlist)
				// var arr=[];
				// var brr=[];
				// var crr=[];
				// //settle_name val.csettle_amt  alonelist
				// for(var i=0;i<this.settlementlist.length;i++){
				// 	arr.push(this.settlementlist[i].splice(0,1));
				// 	crr.push(this.settlementlist[i].splice(0,1));
				// 	brr.push({
				// 		settle_name:arr[i][0].content,
				// 		csettle_amt:crr[i][0].content,
				// 		vallist:this.settlementlist[i]
				// 	})
				// }
				// this.settlementlist=brr;
				//获取冲借款数据
				// this.borrowMoneylist=res[0].loans;
				// this.borrowMoneylist = utrl.setJson(this.borrowMoneylist,this.borrowMoney);
                // console.log(this.borrowMoneylist);
                // utrl.thousand(this.borrowMoneylist,"balance_amt")
				// utrl.thousand(this.borrowMoneylist,"repayment_amt")
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
			},
			async down(e){
				window.location.href=api.headUrl+e.id+"?token="+api.token+"&company_id="+this.company_id
				//let url="files/"+e.id+"?token="+api.token+"&company_id="+this.company_id
				//let res=await api.get(url)
				//console.log(res)
			}
		},
		components:{
			ApprovalButton,TabItem
		}
	}
</script>

<style lang="less" scoped>
#content-warp-detailsList{
	background:#eee;
}
#content-warp-settlement{
	background:#eee;
}
.content-warp .fujian{
	margin-top:0.5rem;
	border:0;
	width:100%;
	height:2.4rem;
	background:white;
	display:flex;
	align-items: center;
	text-indent:18px;
}
.picfiles{
	display:flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-items: center;
	background:white;
	padding:0.4rem 18px;
}
.picfiles img{
	width:2rem;
	height:2rem;
	border-radius:50%;
	margin-right:0.5rem;
}
.files{
	width:100%;
	height:2.4rem;
	border-bottom:1px solid #eee;
	background:white;
	text-indent:18px;
	display:flex;
	align-items: center;
	font-size:1.3em;
	justify-content: flex-start;
}

.files>i{
	margin-right:0.5rem;
	font-size:1rem;
}
.files span{
	color:#777;
	text-indent:0;
}
</style>
