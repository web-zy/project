<template>
	<div class="mouthreport">
		<div class="picktop">
			<div class="pickdate">
				<Monthselection @nexts="next" @prevs="prev" @moren="morens" :routermonth="routermonth"></Monthselection>
			</div>
		</div>
		<div v-if="lateslist!=''" class="mouthcontents">
			<scroll>
			<div class="lates late" @click="latesshow" v-if="lateslist[0].late_num!=0">
				<p>迟到</p>
				<p>{{lateslist[0].late_num}}次 </p>
			</div>
			<div class="mouthlist">
				<div v-for="item in latelists" class="latelists" v-if="islatesshow">
					<p class="latename">{{userInfo.name}}</p>
					<p class="latetime">{{item.clock_time | time}}<span>{{item.status_name}}</span></p>
				</div>
			</div>
			<div class="lates late" @click="earlyshow" v-if="lateslist[0].early_num!=0">
				<p>早退</p>
				<p>{{lateslist[0].early_num}}次 </p>
			</div>
			<div class="mouthlist">
				<div v-for="item in earlylist" class="latelists" v-if="isearlyshow">
					<p class="latename">{{userInfo.name}}</p>
					<p class="latetime">{{item.clock_time | time}}<span>{{item.status_name}}</span></p>
				</div>
			</div>
			<div class="lates late" @click="Lackcard" v-if="lateslist[0].on_unclock_num+lateslist[0].off_unclock_num!=0">
				<p>缺勤</p>
				<p>{{lateslist[0].on_unclock_num+lateslist[0].off_unclock_num}}次 </p>
			</div>
			<div class="mouthlist">
				<div v-for="item in cardlist" class="latelists" v-if="iscardshow">
					<p class="latename">{{userInfo.name}}</p>
					<p class="latetime">{{item.app_date | time1}}<span>缺勤</span></p>
				</div>
			</div>	
			<!--<div class="lates late" @click="latesshow">
				<p>晚漏打卡</p>
				<p>{{lateslist[0].off_unclock_num}}次 </p>
			</div>-->
			</scroll>
		</div>
	</div>
</template>

<script>
	import api from '../../../../../asset/api.js'
	import utrl from '../../../../../controller/utrl.js'
	export default{
		data(){
			return{
				pickdates:"",
				islate:false,
				isearly:false,
				lateslist:[],
				company_name:'',
				company_id:"",
				latelists:[],
				earlylist:[],
				cardlist:[],
				islatesshow:false,
				isearlyshow:false,
				iscardshow:false,
				routermonth:""
			}
		},
		filters:{
			time(val){
				val=String(val)
				val=val.split("T")[0]+" "+val.split("T")[1]
				return val
			},
			time1(val){
				val=String(val)
				val=val.split("T")[0]
				return val
			}
		},
		mounted(){
			this.userInfo=api.userInfo
			//let company_msg = JSON.parse(sessionStorage.getItem('company_msg'));
			let company_msg=utrl.getCompany()
			this.company_name=company_msg.company_name
			this.company_id=company_msg.company_id
//			var date=new Date();
//			let month=date.getMonth() + 1<10?"0"+(date.getMonth()+1):date.getMonth()+1
//			this.pickdates=date.getFullYear()+"-"+month
		},
		methods:{
			morens(e){
				this.pickdates=e
			},
			next(e){
				this.pickdates=e
			},
			prev(e){
				this.pickdates=e
			},
			async latesshow(){
				this.islatesshow=!this.islatesshow
				this.isearlyshow=false
				this.iscardshow=false
				//this.islate=!this.islate
				let dates=this.pickdates+"-01"
				let url="kqclocks/cache?token="+api.token+"&timestr="+dates+"&company_id="+this.company_id+"&filter=app_user_id="+this.userInfo.id+",status_name=迟到"
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					this.latelists=res.data
				}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
				}
			},
			async earlyshow(){
				this.islatesshow=false
				this.isearlyshow=!this.isearlyshow
				this.iscardshow=false
				let dates=this.pickdates+"-01"
				let url="kqclocks/cache?token="+api.token+"&timestr="+dates+"&company_id="+this.company_id+"&filter=app_user_id="+this.userInfo.id+",status_name=早退"
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					this.earlylist=res.data
				}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
				}
			},
			async Lackcard(){
				this.islatesshow=false
				this.isearlyshow=false
				this.iscardshow=!this.iscardshow
				let dates=this.pickdates+"-01"
				let url="kqclocks/cache?token="+api.token+"&timestr="+dates+"&company_id="+this.company_id+"&filter=app_user_id="+this.userInfo.id+",status_flag=0"
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					this.cardlist=res.data
				}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
				}
			},
			
			async Late(){
				let dates=this.pickdates+"-01"
				let url="kq_attendances?token="+api.token+"&company_id="+this.company_id+"&filter=year_month="+dates+",app_user_id="+this.userInfo.id
				let res=await api.get(url);
				if(res.status >= 200 && res.status < 300){
					this.lateslist=res.data
				}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
				}
				
			}
			
		},
			watch:{
			pickdates(){
//				let index=this.pickdate.lastIndexOf("-")
//				console.log(index)
//				var str=this.pickdate.substr(0,index)
//				this.pickdate+="-01"
				this.Late()
			}
		}
	  
		
	}
</script>

<style scoped>
	p{
		margin:0;
		padding:0;
	}
	.mouthreport{
		margin-top:0.25rem;
		font-size:0.75rem;
	}
	.content{
		width:100%;
		height:100vh;
		background:#eee;
	}
	.picktop{
		width:100%;
		padding:0 0.5rem;
		background:white;
	}
	.pickdate{
		width:100%;
		height:2.85rem;
		display:flex;
		align-items: center;
		justify-content: space-between;
		font-size:0.75rem;
		position:relative;
		margin-top:0;
	}
	.mouthreport .pickdates{
		width:100%;
		height:100%;
		position:absolute;
		top:0;
		left:0;
		opacity:0;
	}
	.pickdate input{
		background:transparent;
		width:6rem;
		padding:0;
	}
	.content .late{
		margin-top:0;
	}
	.lates{
		width:100%;
		height:2.1rem;
		display:flex;
		justify-content: space-between;
		align-items: center;
		padding:0 0.5rem;
		background:white;	
		box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
		margin-top:0.1rem;
		margin-bottom:0.25rem;
	}
	.latescontent{
		width:100%;
		box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
		padding:0 0.5rem;
		background:white;
		margin-top:0.1rem;
	}
	.latescontent div{
		width:100%;
		height:2rem;
		display:flex;
		justify-content: flex-start;
		border-bottom:1px solid #eee;
		align-items: center;
	}
	.latescontent div:last-child{
		border:0;
	}
	.pickdate i{
		width:1rem;
		text-align:right;
		display:block;
		position:absolute;
		top:0;
		right:0.5rem;
		z-index:33;
		font-size:1rem;
		height:2.85rem;
		display:flex;
		align-items: center;
	}
	.latelists{
		display:flex;
		justify-content: space-between;
		background:white;
		border-bottom:1px solid #eee;
		height:2.85rem;
		align-items: center;
	}
	.mouthreport .latelists>.latename{
		padding-left:0.5rem;
	}
	.mouthreport .latelists>.latetime{
		padding-right:0.5rem;
	}
	.mouthreport .latelists>.latetime span{
		margin-left:0.5rem;
	}
	.mouthcontents{
		position:relative;
		width:100%;
		height:70vh;
	}
	.mouthcontents .scroll{
		top:0;
	}
	.mouthlist{
		margin-bottom:0.25rem;
	}
</style>