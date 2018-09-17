<template>
	<div id="">
		<div class="pushclock_bom">
			 <!--v-if="val.show"-->
				<router-link tag="div" v-if="val.show" class="bomnav" v-for="val in navlist" :to="val.path" >
					<i :class="val.class"></i>
					<p>{{val.name}}</p>
				</router-link>
		</div>
		 <router-view></router-view>
		
	</div>
</template>

<script>
	import Vue from 'vue'
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return{
				navlist:[
				//Workattendance
					{class:"ion-ios-location",name:"打卡",path:"/Workattendance/clocknav/Punchclock",show:false,id:"1004020"},
					{class:"ion-ios-clock-outline",name:"报表",path:"/Workattendance/clocknav/Reportform",show:true,id:"1004050"},
					{class:"ion-ios-clock-outline",name:"补考勤",path:"/Workattendance/clocknav/Workattendance",show:true,id:"1004030"},
					{class:"ion-ios-time-outline",name:"时间设置",path:"/Workattendance/clocknav/worktimelist",show:false,id:"1004010"},
					{class:"ion-ios-gear-outline",name:"排班设置",path:"/Workattendance/clocknav/Schedulinglist",show:false,id:"1004010"}
				],
				company_msg:{}
			}
		},
		mounted(){
			//this.company_msg=utrl.getCompany()
			this.Jurisdiction()
		},
		methods:{
			async Jurisdiction(){
				this.company_msg=utrl.getCompany()
				this.navlist=[
					{class:"ion-ios-location",name:"打卡",path:"/Workattendance/clocknav/Punchclock",show:false,id:"1004020"},
					{class:"ion-ios-clock-outline",name:"报表",path:"/Workattendance/clocknav/Reportform",show:true,id:"1004050"},
					{class:"ion-ios-clock-outline",name:"补考勤",path:"/Workattendance/clocknav/Workattendance",show:true,id:"1004030"},
					{class:"ion-ios-time-outline",name:"时间设置",path:"/Workattendance/clocknav/worktimelist",show:false,id:"1004010"},
					{class:"ion-ios-gear-outline",name:"排班设置",path:"/Workattendance/clocknav/Schedulinglist",show:false,id:"1004010"}
				]
				let url="usermenus/"+api.userInfo.id+"?token="+api.token+"&company_id="+this.company_msg.company_id
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
						for(let i=0;i<res.data.length;i++){
							for(let j=0;j<this.navlist.length;j++){
								if(this.navlist[j].id==res.data[i].id){
									Vue.set(this.navlist[j],"show",true)
								}
							}
						}
				}else{
					
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
				}
			}
			
		},
		
		
	}
</script>

<style scoped>
	.pushclock_bom{
		position:fixed;
		bottom:0;
		left:0;
		width:100%;
		height:2.48rem;
		background:#f5f5f5;
		display:flex;
		justify-content: space-around;
		align-items: center;
		z-index:2;
		color:#666;
	}
	.pushclock_bom i{
		font-size:1rem;
	}
	.bomnav{
		display:flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
	.router-link-active{
		color:#f29011;
	}
</style>