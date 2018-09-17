<template>
	<div id="outof">
		<von-header class="titles">
			 <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	      <span slot="title">{{title}}</span>
	      <div class="button button-icon company companyname" slot="right">{{company_msg.company_name}}</div>
		</von-header>
		<div class="workattend">
			<scroll>
				<div class="abnormal" v-for="item in lists">
					<p>{{item.status_name}}</p>
					<div class="addabnormal">
						<p>{{item.app_date | time}}
							<span v-if="item.status_name=='迟到'">迟到{{item.diff_minutes}}分钟</span>
							<span v-else-if="item.status_name=='早退'">早退{{item.diff_minutes}}分钟</span>
						</p>
						<button @click="addclock(item)">补考勤</button>
					</div>
					
					
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return {
				title:"补考勤",
				company_msg:{},
				lists:[],
				page:1
			}
		},
		filters:{
			time(val){
				return val.split("T")[0]
			}
		},
		mounted(){
			this.company_msg=utrl.getCompany()
			this.getlist()
		},
		methods:{
			back(){
				$router.go(-1)
			},
			async getlist(){
				let url="kqclocks/cache?token="+api.token+"&size=800"+"&timestr="+'2018-05-01'+"&company_id="+this.company_msg.company_id+"&filter=app_user_id="+api.userInfo.id+",status_name!正常"
				let res=await api.get(url)
				this.lists=res.data
			},
			addclock(val){
				this.$router.push({
					name:"Addworkattendance",
					params:{
						val:val
					}
				})
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
	.workattend .scroll{
		top:0;
	}
	.abnormal{
		width:100%;
		height:2.1rem;
		margin-top:0.25rem;
		display:flex;
		justify-content: space-between;
		align-items: center;
		padding:0 1rem;
		background:white;
	}
	.addabnormal{
		display:flex;	
		text-align:left;
		align-items: center;
	}
	.addabnormal>p{
		width:8.5rem;
	}
	.addabnormal button{
		padding:0 0.5rem;
		height:1.2rem;
		color:#f2ae08;
		border:1px solid #f2ae08;
		background:transparent;
		border-radius:0.2rem;
		margin-left:0.8rem;
	}
	.addabnormal span{
		margin-left:0.5rem;
	}
</style>