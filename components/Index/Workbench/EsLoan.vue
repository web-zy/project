<template>
	<div id="content">
		<von-header>
		      <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
		      <span slot="title">{{titles}}</span>
		      <!-- <div class="button button-icon company companyname" slot="right" @click.stop="showcompony">{{company_name}}</div> -->
		      <div class="button button-icon" slot="right">
				<ChoiceCompany :getcommpyObj="{id:company_id,type:company_name}" @give-company="setCompony"></ChoiceCompany>
			</div>
		</von-header>
		<scroll>
			<!-- <div class="reference">
				<p class="required">*</p>
				<p>公司简称</p>
				<input type="text" placeholder="请选择" v-model="company_name" disabled="false"/>
				<p class="fuhao"><i class="ion-chevron-right"></i></p>
			</div> -->
			<div class="reference  reference_top">
				<p class="required">*</p>
				<p>借款日期</p>
				<input class="date" type="date" v-model="app_date"/>
				<input type="text" placeholder="请选择借款日期" v-model="app_date" disabled="false"/>
				<p class="fuhao"><i class="ion-chevron-right"></i></p>
			</div>
			<div class="reference">
				<p class="required">*</p>
				<p>预计归还日期</p>
				<input class="date" type="date" v-model="plan_repayment_date"/>
				<input type="text" placeholder="请选择预计归还日期" v-model="plan_repayment_date" disabled="false"/>
				<p class="fuhao"><i class="ion-chevron-right"></i></p>
			</div>
			<div class="reference">
				<p class="required">*</p>
				<p>借款类型</p>
				<input type="text" placeholder="请选择借款类型" value="" @click.stop="getobjs"  name="loan_type_name" v-model="loan_type_name" />
				<!-- <input type="text" @click.stop="getobjs" placeholder="请选择" value="" v-model="loan_type_name" disabled="false"/> -->
				<p class="fuhao"><i class="ion-chevron-right"></i></p>
			</div>
			<div class="reference">
				<p class="required">*</p>
				<p>标题</p>
				<input type="text" v-model="title" placeholder="请输入借款标题"/>
			</div>
			<div class="reference">
				<p class="required">*</p>
				<p>借款金额</p>
				<input type="text" v-model="amt" placeholder="请输入借款金额"/>
			</div>
			<div class="reference">
				<p class="required">*</p>
				<p>借款事由</p>
				<input type="text" v-model="loan_reason" placeholder="请输入借款事由"/>
			</div>
			<div class="loan">
				<Assemblyloan v-for="(val,index) in costlists" :costlists="val" @showloan="showloan" @deletss="deletes">
					
				</Assemblyloan>
			</div>
			<p class="addcost" @click="addcost"><i class="ion-ios-plus-outline"></i> 添加结算方式</i></p>
		</scroll>
		<div class="btnsub">
			<button @click="btnsub">提交</button>
		</div>
		<!-- 借款类型 -->
		<Loanpopup v-if="canzhao" :parameter="parameter" @my-event="getobj"></Loanpopup>
		<!-- 结算方式 -->
		<Settlemethods v-if="Settlemethods" :methods="methods" @emit-methods="method"></Settlemethods>
	</div>
</template>
	
<script>
	import Vue from 'vue'
	import api from '../../../asset/api.js'
	import utrl from '../../../controller/utrl.js'
	import Assemblyloan from './utrl/Assemblyloan.vue'
	// import Settlemethods from '../../Parts/reference/Referencedetails/Settlemethods.vue'
	import '../../Parts/reference/commoncss/common.css'
	export default{
		data(){
			return {
				titles:"借款申请单",
				parameter:"",
				canzhao:false,
				Settlemethods:false,
				// isgetcommpy:false,
				isbackground:false,
				indexs:1,
				// 公司简称
				company_name:"",
				// 公司ID
				company_id:"",
				// 申请人ID
				app_user_id:"",
				// 申请人
				app_user_name:"",
				// 借款日期
				app_date:"",
				// 预计归还日期
				plan_repayment_date:"",
				// 借款类型
				loan_type_name:"",
				// 借款类型ID
				loan_type_id:"",
				// 标题
				title:"",
				// 借款金额
				amt:"",
				// 借款事由
				loan_reason:"",
				user_id:"",
				// 结算方式
				ce_loan_app_settles_t:[],
				costlists:[{
					id:1,
					// 结算方式
					settle_name:"",
					//结算方式id
					settle_id:"",
					// 结算金额
					settle_amt:"",
					// 收款人开户省
					province_name:"",
					// 收款人开户市
					city_name:"",
					// 收款人
					payee_account_name:"",
					// 收款人开户行
					payee_account_bank:"",
					// 收款人账号
					payee_account_code:""
				}],
				isshow:true,
				bizid:""
			}
		},
		components:{
	    	Assemblyloan
	    },
		mounted(){
			this.getlogo();
			this.bizid=utrl.setbizid();
		},
		deactivated(){
			this.$destroy()
		},
		methods:{
			back: function() {
				$router.go(-1)
			},
			addcost(){
				this.indexs++
				this.costlists.push({
					id:this.indexs,
					// 结算方式
					settle_name:"",
					//结算方式id
					settle_id:"",
					// 结算金额
					settle_amt:"",
					// 收款人开户省
					province_name:"",
					// 收款人开户市
					city_name:"",
					// 收款人
					payee_account_name:"",
					// 收款人开户行
					payee_account_bank:"",
					// 收款人账号
					payee_account_code:""

				})
			},
			deletes(index){
				this.costlists.splice(index,1)
			},
			// 借款类型
			hide(){
				this.canzhao=false
				// this.Settlemethods=false
				this.isbackground=false
			},
			getobjs(val){
				this.parameter=val.currentTarget
				this.canzhao=!this.canzhao
				this.loan_type_name=this.parameter.value
				
			},
			getobj(obj,parameter){
				this.canzhao=!this.canzhao
				console.log(obj)
				// parameter.loan_type_name=obj.name
				this.loan_type_name=obj.name
			},
			//借算方式
			showloan(val){
				this.methods=val
				this.settle_id=val.settle_id
				this.Settlemethods=!this.Settlemethods
			},
			method(obj,methods){
				// console.log(obj)
				this.Settlemethods=!this.Settlemethods
				methods.settle_name=obj.name
				methods.settle_id=obj.id
				// console.log()
			},
			setCompony(obj){
				this.company_id = obj.company_id
				this.company_name = obj.company_name
				sessionStorage.company_id = obj.company_id
				//以后数据都要为空
				this.costlists=[{
					id:0,
					settle_name:"",
					settle_id:"",
					settle_amt:"",
					province_name:"",
					city_name:"",
					payee_account_name:"",
					payee_account_bank:"",
					payee_account_code:""
				}],
				this.app_date="",
				this.plan_repayment_date="",
				this.loan_type_name="",
				this.title="",
				this.amt="",
				this.loan_reason=""
			},
			async getlogo(){
				// 用户信息
				let userInfo = api.userInfo
				// user_id
				this.app_user_id=userInfo.id;
				this.app_user_name=userInfo.name;
				// // 公司信息
				let mycompanies = api.mycompanies
				let data = mycompanies[0];
				this.company_name=data.company_name;
				this.company_id=data.company_id;
				this.user_id=data.user_id;
			},
			// 
			async btnsub(){
				//判断数据是否为空
				var isempty=false;
				var isid=false;
				var isnum=true;
				var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
				for(var i=0;i<this.costlists.length;i++){
					if(this.costlists[i].settle_amt==""){
						isempty=true
					}
					if(this.costlists[i].settle_id==""){
						isid=true
					}
					if(!reg.test(this.costlists[i].settle_amt)){
						isnum=false
					}
				}
				var strSD = this.app_date;
				var strED = this.plan_repayment_date;
				if(this.app_date==""){
					$toast.show("请输入借款日期", 3000).then(() => {})
				}else if(this.plan_repayment_date==""){
					$toast.show("请输入预计归还日期", 3000).then(() => {})
				}else if(new Date(strSD.replace(/\-/g, '\/')) > new Date(strED.replace(/\-/g, '\/'))){
					$toast.show("借款日期不能小于预计还款日期", 3000).then(() => {})
				}else if(this.loan_type_name==""){
					$toast.show("请输入借款类型", 3000).then(() => {})
				}else if(this.title==""){
					$toast.show("请输入标题", 3000).then(() => {})
				}else if(this.amt==""){
					$toast.show("请输入借款金额", 3000).then(() => {})
				}else if(this.loan_reason==""){
					$toast.show("请输入借款事由", 3000).then(() => {})
				}else if(isid==true){
					$toast.show("请输入结算方式", 3000).then(() => {})
				}else if(isempty==true){
					$toast.show("请输入结算金额", 3000).then(() => {})
				}else if(isnum==false || !reg.test(this.amt)){
					$toast.show("金额必须是数字或保留两位小数", 3000).then(() => {})
				}else{

					this.ce_loan_app_settles_t=[]
					for(var i=0;i<this.costlists.length;i++){
						this.costlists[i].rowno=i+1
						this.costlists[i].OrderIndex=i+1
						// this.costlists[i].company_name=this.company_name
						// this.costlists[i].company_id=this.company_id
						// this.costlists[i].app_user_id=this.app_user_id
						// this.costlists[i].app_user_name=this.app_user_name
						this.ce_loan_app_settles_t.push(this.costlists[i])
					}
					console.log(this.ce_loan_app_settles_t)
					let url="loanapps?token="+api.token+"&bizid="+this.bizid
					let res=await api.post(url,{
						company_name:this.company_name,
						company_id:this.company_id,
						app_user_name:this.app_user_name,
						app_user_id:this.app_user_id,
						app_date:this.app_date,
						plan_repayment_date:this.plan_repayment_date,
						loan_type_name:this.loan_type_name,
						loan_type_id:this.loan_type_id,
						title:this.title,
						amt:this.amt,
						loan_reason:this.loan_reason,
						settles:this.ce_loan_app_settles_t
					})
					if(res.status >= 200 && res.status < 300){
						$toast.show("提交成功", 3000).then(() => {})
						console.log(res)
						this.$router.push({
							path: '/index'
						})
					}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
					}
				}
				
			},
		},
		watch:{
			costlists(){
				for(var i=0;i<this.costlists.length;i++){
					this.costlists[i].index=i+1
					if(this.costlists.length==1){
						Vue.set(this.costlists[i],"isshow",false)
					}else{
						Vue.set(this.costlists[i],"isshow",true)
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.reference .date{
		position: absolute;
    	left: 39%;
    	opacity: 0;
	}
	.loan input{
		background: none;
	}
	.posback{
		position:fixed;
		width:100%;
		height:100vh;
		background:rgba(0,0,0,.2);
		top:0;
		left:0;
		z-index:33;
	}
</style>