<template>
	<div id="content" @click="hide">
		<von-header>
		      <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
		      <span slot="title">{{title}}</span>								 <!--@click.stop="showcompony"-->
		      <div class="button button-icon company companyname" slot="right" >{{company_msg.company_name}}</div>
		</von-header>
		<div class="reference reference_top">
			<p>客户全称</p>
			<input type="text" placeholder="请输入全称" v-model="subobj.name"/>
		</div>
		<div class="reference">
			<p>客户简称</p>
			<input type="text" placeholder="请输入简称" v-model="subobj.abb_name"/>
		</div>
		<div class="reference">
			<p>助记码</p>
			<input type="text" placeholder="请输入助记码" v-model="subobj.mark_code"/>
		</div>
		<div class="reference">
			<p>备注</p>
			<input type="text" placeholder="请输入助备注" v-model="subobj.remarks"/>
		</div>
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
				title:"快速客户报备",
				isgetcommpy:false,
				company_msg:{
					company_name:"",
					company_id:""
				},
				subobj:{
					name:"",
					abb_name:"",
					mark_code:"",
					remarks:"",
					app_user_id:"",
					app_user_name:""
				},
				bizid:"",
			}
		},
		mounted(){
			this.subobj.app_user_id=api.userInfo.id;
			this.subobj.app_user_name=api.userInfo.name
			//this.company_msg=this.$route.params.company_msg
			let company_msg=utrl.getCompany()
			this.subobj.company_name=company_msg.company_name
			this.subobj.company_id=company_msg.company_id
			this.company_msg.company_name=company_msg.company_name
			this.company_msg.company_id=company_msg.company_id
			this.bizid=utrl.setbizid()	
		},
		methods:{
			back: function() {
				$router.go(-1)
				
			},
			hide(){
				this.isgetcommpy=false
			},
			addcompy(){
				this.isgetcommpy=false
				this.$router.push({name:"createCompany",params:{
					company_msg:this.company_msg
				}})
			},
			showcompony(e){
				this.componparameter=e.currentTarget
				this.isgetcommpy=!this.isgetcommpy
			},
			componyobj(obj,componparameter){
				this.isgetcommpy=!this.isgetcommpy
				this.company_msg=obj
				this.subobj.company_name=obj.company_name
				this.subobj.company_id=obj.company_id
			},
			async btnsub(){
				if(this.subobj.mark_code.length>10){
					$toast.show("字数不能超过10个哦", 1000).then(() => {})
				}else{
					var url ="crmcustomers?token="+api.token+"&bizid="+this.bizid+"&company_id="+this.company_msg.company_id;
					let res=await api.post(url,this.subobj);
					if(res.status >= 200 && res.status < 300){
							$toast.show("提交成功", 1000).then(() => {})
							// this.$destroy()
							this.$router.push({name:"Crmcustomer"})
						}else{
							$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
							return
					}
				}
				
				
			}
		},
		components:{
			
		}
	}
</script>

<style scoped>
	#content .companyname{
		display:block;
		width: 5.5rem;
	    height: 100%;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    white-space: nowrap;
	    display: block;
	    line-height: 40px;
	    text-align: right;
	}
	#content .reference p{
		margin-left:0.5rem;
	}
	#content .reference input{
		margin-right:0.5rem;
	}
</style>