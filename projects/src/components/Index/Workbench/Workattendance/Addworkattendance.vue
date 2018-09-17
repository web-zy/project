<template>
	<div class="outof">
		<von-header class="titles">
			 <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	      <span slot="title">{{title}}</span>
	      <div class="button button-icon company companyname" slot="right">{{company_msg.company_name}}</div>
		</von-header>
		<div class="workattend">
			<bee-form v-model="json" ref="form" :rules="rules">
					<bee-form-item>
						<input-text :name="'迟到日期'" :edit=false :alert="''" v-model="json.work_date">
							
						</input-text>
					</bee-form-item>
					<bee-form-item>
						<input-text :name="'迟到分钟'" :edit=false  :alert="''" v-model="json.diff_time">
							
						</input-text>
					</bee-form-item>
					<bee-form-item>
						<input-datepicker :name="'补卡日期'" :alert="''" v-model="json.work_date"></input-datepicker>
					</bee-form-item>
					<bee-form-item>
						<Timetext :name="'补卡时间'"  :alert="''" v-model="json.repair_time"
						>
						</Timetext>
					</bee-form-item>
					<bee-form-item>
						<input-text :name="'理由'" :alert="'快速录入'" 
							@click="chosereason"
							>
							<i class="icon-right ion-ios-arrow-forward"></i>
						</input-text>
						<textarea class="reason" v-model="json.reason"></textarea>
					</bee-form-item>
			</bee-form >
			<Reason v-if="isshow" :costparameter="costparameter" @emit-cost="getreason"></Reason>
			<div class="btnsub">
				<ButtonBottom :loading="loading" @call-back="btnsub">提交</ButtonBottom>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return{
				title:"补考勤",
				company_msg:{},
				loading:false,
				reason:"",
				json:{
					work_date:"",
					diff_time:"",
					repair_time:"",
					reason:"",
					app_user_name:"",
					app_user_id:"",
					app_date:"",
					company_id:"",
					company_name:""
				},
				rules:{
					name:{ 
	                    regular:false, 
	                    message: '',
	                    must:false
						}
				},
				isshow:false,
				costparameter:{
					detail_id:123
				}
			}
		},
		mounted(){
			this.company_msg=utrl.getCompany()
			this.json.company_id=this.company_msg.company_id
			this.json.company_name=this.company_msg.company_name
			this.json.app_user_name=api.userInfo.user_name
			this.json.app_user_id=api.userInfo.id
			this.json.app_date="2018-06-05"
			this.json.work_date=this.$route.params.val.app_date.split("T")[0]
			this.json.diff_time=this.$route.params.val.diff_minutes
		},
		methods:{
			back(){
				$router.go(-1)
			},
			chosereason(){
				this.isshow=true
			},
			getreason(val){
				this.isshow= false
				if(val == false){
					return
				}
				console.log(val)
				this.json.reason=val.name
			},
			async btnsub(){
				this.loading = true;
				$loading.show('提交中..')
				let bizid=utrl.setbizid()
				let url="kqrepairattends?token="+api.token+"&bizid="+bizid+"&company_id="+this.company_msg.company_id
				let res=await api.post(url,this.json)
				console.log(this.json)
				console.log(res)
				if(res.status >= 200 && res.status < 300){
					$toast.show('修改成功')
					$loading.hide()
					$router.go(-1)
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000)
				}
			}
		}
	}
</script>

<style scoped>
	.outof{
		width:100%;
		height:100vh;
		background:#eee;
	}
	.companyname{
		display:block;
		max-width: 5rem;
	    height: 100%;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    white-space: nowrap;
	    display: block;
	    line-height: 40px;
	    text-align: right;
	}
	.workattend{
		width:100%;
		height:85vh;
		position:relative;
		margin-top:2.5rem;
	}
	.bee-form-item{
		padding-bottom:1px;
	}
	.reason{
		display:block;
		width:90%;
		height:2.5rem;
		border:1px solid #333333;
		margin:0.5rem auto 0.5rem;
		padding-top:0.2rem;
		line-height:1rem;
		word-break: break-all;
		text-indent:0.1rem;
	}
	.btnsub{
		position:fixed;
		width:100%;
		left:0;
		bottom:0rem;
		background:#eee;
		border:0;
		height:2.95rem;
		display:flex;
		justify-content: space-around;
		padding:0 0.5rem;
		z-index:33;
	}
	.btnsub button{
		flex:1;
		background:#f2be06;
		border:0;
		height:1.86rem;
		border-radius:0.15rem;
		font-size:0.8rem;
		color:#333;
		margin-top:0.36rem;
	}
</style>