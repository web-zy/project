<template>
	<div id="content">
		<von-header>
		      <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
		      <span slot="title">{{title}}</span>
		      <div class="button button-icon company companyname" slot="right">{{Customerinformation.company_name}}</div>
		</von-header>
		<scroll>
			<div class="reference reference_top">
				<p class="required">*</p>
				<p>公司名称</p>
				<input type="text" v-model="Customerinformation.company_name"/>
			</div>
			<div class="reference">
				<p class="required">*</p>
				<p>助记码</p>
				<input type="text" v-model="Customerinformation.mark_code"/>
			</div>
			<div class="reference">
				<p class="required">*</p>
				<p>客户全称</p>
				<input type="text"  v-model="Customerinformation.name"/>
			</div>
			<div class="reference">
				<p class="required">*</p>
				<p>客户简称</p>
				<input type="text"  v-model="Customerinformation.abb_name"/>
			</div>
			<div class="reference">
				<p>客户分类</p>
				<input type="text" placeholder="请选择客户分类" v-model="Customerinformation.class_name" disabled="false"/>
				<p class="fuhao"><i class="ion-chevron-right"></i></p>
			</div>
			<div class="reference">
				<p>联系人</p>
				<input type="text" placeholder="请输入联系人" v-model="Customerinformation.contact_name"/>
			</div>
			<div class="reference">
				<p>电话</p>
				<input type="text" placeholder="请输入电话" v-model="Customerinformation.phone"/>
			</div>
			<div class="reference">
				<p>邮箱</p>
				<input type="text" placeholder="请输入邮箱" v-model="Customerinformation.email"/>
			</div>
			<div class="reference">
				<p>QQ</p>
				<input type="text" placeholder="请输入QQ" v-model="Customerinformation.qq"/>
			</div>
			<div class="reference">
				<p>微信</p>
				<input type="text" placeholder="请输入微信" v-model="Customerinformation.wechat"/>
			</div>
			<div class="reference">
				<p>客户地址</p>
				<!--<input type="text" placeholder="请输入客户地址" v-model="Customerinformation.delivery_address"/>
			-->
				<div contenteditable="true">
				{{Customerinformation.delivery_address}}
				</div>
			</div>
			<div class="reference" @click="chosePerson1">
				<p>业务员</p>
				<input type="text" placeholder="请选择业务员" v-model="Customerinformation.salesmen_name" disabled="false"/>
				<p class="fuhao"><i class="ion-chevron-right"></i></p>
			</div>
			<!--<div class="reference">
				<p>拜访次数</p>
				<input type="text" placeholder="请输入拜访次数" v-model="Customerinformation.visit_number" style="background:transparent" readonly="readonly"/>
			</div>-->
			<div class="reference">
				<p>纳税人识别号</p>
				<input type="text" placeholder="请输入纳税人识别号" v-model="Customerinformation.taxpayer_identification_no"/>
			</div>
			<div class="reference">
				<p>公司注册地址</p>
				<input type="text" placeholder="请输入公司注册地址" v-model="Customerinformation.company_register_address"/>
			</div>
			<div class="reference">
				<p>开户行账号</p>
				<input type="text" placeholder="请输入开户行账号" v-model="Customerinformation.bank_account_code"/>
			</div>
			<div class="reference">
				<p>开户地</p>
				<input type="text" placeholder="请输入开户地" v-model="Customerinformation.bank_account_place"/>
			</div>
			<div class="reference">
				<p>开户行</p>
				<input type="text" placeholder="请输入开户行" v-model="Customerinformation.bank_account_name"/>
			</div>
			<div class="reference">
				<p>联系人</p>
				<input type="text" placeholder="请输入联系人" v-model="Customerinformation.invoice_contact_name"/>
			</div>
			<div class="reference  reference_bom">
				<p>联系电话</p>
				<input type="text" placeholder="请输入电话" v-model="Customerinformation.invoice_contact_phone"/>
			</div>
			</scroll>
			<div class="btnsub">
				<button @click="btnsub">提交</button>
			</div>
	</div>
</template>

<script>
	import api from '../../../asset/api.js'
	import utrl from '../../../controller/utrl.js'
	import '../reference/commoncss/common.css'
	export default{
		data(){
			return {
				title:"完善客户信息",
        user_id:"",
				Customerinformation:{
					invoice_contact_phone:"",
					invoice_contact_name:"",
					bank_account_name:"",
					bank_account_place:"",
					bank_account_code:'',
					company_register_address:"",
					taxpayer_identification_no:"",
				//	visit_number:"",
					salesmen_name:"",
					delivery_address:"",
					wechat:"",
					customer_id:"",
					qq:"",
					email:"",
					phone:"",
					contact_name:"",
					contact_id:"",
					class_id:"111",       //客户分类id
					class_name:"123",
					abb_name:"",
					name:"",
					mark_code:"",
					company_name:"",
					company_id:"",
					app_user_id:"",
					app_user_name:"",
					app_dept_name:"111",
					app_dept_id:"222"
				},
				bizid:"",

			}
		},
		mounted(){



		},
		activated(){
			this.Customerinformation.customer_id=this.$route.params.val.id
			this.Customerinformation.app_user_id=api.userInfo.id
			this.Customerinformation.app_user_name=api.userInfo.name
			this.Customerinformation.company_name=this.$route.params.val.company_name
			this.Customerinformation.name=this.$route.params.val.name
			this.Customerinformation.abb_name=this.$route.params.val.abb_name
			this.Customerinformation.company_id=this.$route.params.val.company_id
			this.Customerinformation.mark_code=this.$route.params.val.mark_code
			this.bizid=utrl.setbizid();
			let personData1 = JSON.parse(sessionStorage.getItem('selectPerson'));
			this.user_id=""
			this.Customerinformation.salesmen_name=""
            if(personData1 !== null){
            	this.Customerinformation.salesmen_name=personData1[0].user_name
            	this.user_id=personData1[0].user_id
            	sessionStorage.removeItem("selectPerson")
            }else{
            	this.user_id="empty"
            }
		},
		methods:{
			back: function() {
				$router.go(-1)
			},
			chosePerson1(){
                this.$router.push({name:"chooseCharges",params:{
                	  id:1,
                	  name:"完善客户信息",
                    user_id:this.user_id
                }});
                //回到本页面获取数据执行JSON.parse(sessionStorage.getItem('radioselect'));
			},
			async btnsub(){
				let url="crmcustomerscomplete?token="+api.token+"&bizid="+this.bizid
				let res=await api.post(url,this.Customerinformation)
				if(res.status >= 200 && res.status < 300){
						$toast.show("提交成功", 1000).then(() => {})
						this.$router.go(-1)
					}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
					}
			}
		}
	}
</script>

<style scoped>

</style>
