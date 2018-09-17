<template>
	<div class="mouthreport">
		<div class="picktop">
			<div class="pickdate pickdate_top">
				<Monthselection @nexts="next" @prevs="prev" @moren="morens" :routermonth="routermonth"></Monthselection>
			</div>
		</div>
		<div class="mouthcontent">
			<scroll :on-infinite="more">
				<div class="picktop">
					<template v-for="(item,index) in lists">
						<div class="pickdate" @click="show(item,index)">
							<!--<img v-if="item.head_img_url_medium" :src="src"/>-->
							<!--<p v-else class="pickpic">{{item.app_user_name | texts}}</p>-->
							<p class="pickname">{{item.app_user_name}}</p>
							<div class="pickname_right">
								<span v-if="item.late_num!=0">迟到{{item.late_num}}次</span> <span v-if="item.early_num!=0">早退{{item.early_num}}次</span>
								<span v-if="(item.on_unclock_num + item.off_unclock_num)!=0">缺勤{{item.on_unclock_num + item.off_unclock_num}}次</span>
							</div>
							<i :class="indexs==index?'ion-chevron-up':'ion-chevron-down'"></i>
						</div>
						<div class="clockfail" v-if="indexs==index">
							<div v-if="latelist.length==0" class="clockno">
								暂无数据
							</div>
							<div class="late" v-for="val in latelist" v-else>
								<p v-if="val.status_flag==0" class="late_left">缺勤</p>
								<p v-else class="late_left">{{val.status_name}}</p>
								<p class="late_right">{{val.app_date | time}}<span v-if="val.diff_minutes"> {{val.status_name}}{{val.diff_minutes}}分钟</span></p>
							</div>
					</div>
					</template>
				</div>
				 <div v-if="nomore==true"  slot="infinite" class="text-center">没有更多数据</div>
			</scroll>
		</div>
		<!--<div class="clockfail" v-if="!isclass">
			<div class="late">
				<p class="late_left">迟到</p>
				<p class="late_right">2018.04.05 迟到10分钟</p>
			</div>
			<div class="late">
				<p class="late_left">早退</p>
				<p class="late_right">2018.04.05 迟到10分钟</p>
			</div>
			<div class="late">
				<p class="late_left">漏打卡</p>
				<p class="late_right">2018.04.05 迟到10分钟</p>
			</div>
		</div>-->
	</div>
</template>

<script>
	import api from '../../../../../asset/api.js'
	import utrl from '../../../../../controller/utrl.js'
	export default{
		data(){
			return{
				pickdate:"",
				isclass:false,
				userInfo:{},
				company_name:"",
				company_id:"",
				src:"",
				lists:[],
				latelist:[],
				indexs:"-1",
				page:1,
				nomore:false,
				infiniteCount:false,
				routermonth:""
			}
		},
		filters:{
			texts(val){
				val=val.substring(0,1)
				return val
				
			},
			time(val){
				val=String(val)
				val=val.split("T")[0]
				return val
			},
			nums(val){
				val=parseFloat(val)
				
				return val
			},
			minutes(val){
				val=String(val)
				if(val.lastIndexOf("-")!=-1){
					val=val.split("-")[1]
					return val
				}else{
					return val
				}
			}
		},
		mounted(){
			this.src=api.headUrl+api.userInfo.head_img_url_medium
			this.userInfo=api.userInfo
			//let company_msg = JSON.parse(sessionStorage.getItem('company_msg'));
			let company_msg=utrl.getCompany()
			this.company_name=company_msg.company_name
			this.company_id=company_msg.company_id
//			var date=new Date();
//			let month=date.getMonth() + 1<10?"0"+(date.getMonth()+1):date.getMonth()+1
//			this.pickdate=date.getFullYear()+"-"+month
		
			this.page=1;
		},
		methods:{
			morens(e){
				this.pickdate=e
			},
			next(e){
				this.pickdate=e
			},
			prev(e){
				this.pickdate=e
			},
			more(){
				this.page++
				
				if(this.nomore==false){
					this.Late()
				}
			},
			async show(obj,index){
				if(this.indexs==index){
					this.indexs=-1
				}else{
					this.indexs=index
				}
				let dates=this.pickdate+"-01"																										  //",isnull(status_flag,0)!1"
				let url="kqclocks/cache?token="+api.token+"&size=999&timestr="+dates+"&company_id="+this.company_id+"&filter=app_user_id="+obj.app_user_id+",status_flag!1"                       
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					
					this.latelist=res.data
				}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
				}
				
			},
			async Late(){
				this.nomore=false
				let dates=this.pickdate+"-01"	
				let url="kq_attendances?token="+api.token+"&company_id="+this.company_id+"&page="+this.page+"&filter=year_month="+dates+"&size=12"
				let res=await api.get(url);
				if(res.status >= 200 && res.status < 300){
					if(res.data!=""){
						this.lists=this.lists==[]?res.data:this.lists.concat(res.data)
					}
					
					//this.lists=this.lists.concat(res.data)
					if(res.data.length<12){
						this.nomore=true
					}
				}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
				}
				
			}
		},
		watch:{
			pickdate(){
//				let index=this.pickdate.lastIndexOf("-")
//				console.log(index)
//				var str=this.pickdate.substr(0,index)
//				this.pickdate+="-01"
				this.lists=[]
				this.page=1;
				this.Late()
			}
		}
	}
</script>

<style scoped>
	#content .scroll{
		top:0;
		bottom:2.5rem;
	}
	#content .pickdate_top{
		margin-bottom:0.1rem;
		padding:0 0.5rem;
	}
	.mouthreport{
		font-size:0.75rem;
		width:100%;
		margin-top:0.25rem;
		margin-bottom:2.5rem;
	}
	.picktop{
		width:100%;
	}
	.pickdate{
		width:100%;
		height:2.85rem;
		display:flex;
		align-items: center;
		justify-content: space-between;
		font-size:0.75rem;
		position:relative;
		border-bottom:1px solid #eee;
		margin-top:0;
	}
	.mouthreport .pickdates{
		width:100%;
		height:2.85rem;
		position:absolute;
		top:0;
		left:0;
		opacity:0;
		
	}
	.pickdate input{
		background:transparent;
		width:6rem;
		padding:0;
		text-indent:0.5rem;
	}
	.pickdate img{
		width:1.67rem;
		border-radius:50%;
	}
	.pickdate{
		background:white;
	}
	.clockfail{
		width:100%;
		margin-top:0.25rem;
		background:white;
		margin-top:0.25rem;
		margin-bottom:0.25rem;
	}
	.pickpic{
		margin-left:0.4rem;
		width:1.67rem;
		height:1.67rem;
		border-radius:50%;
		border:1px solid #f7f7f7;
		display:flex;
		justify-content: center;
		align-items: center;
	}
	.pickname{
		width:3rem;
		margin-left:0.5rem;
	}
	.picknum{
		width:8.5rem;
		display:flex;
		justify-content: space-around;
		flex-wrap: wrap;
		align-items: center;
		height:100%;
		margin-right:0.1rem;
	}
	.late{
		width:100%;
		display:flex;
		justify-content: space-between;
		align-items: center;
		min-height:2.1rem;
		border-bottom:1px solid #eee;
	}
	.late_left{
		margin-left:0.5rem;
	}
	.late_right{
		margin-right:0.5rem;
	}
	.clockno{
		width:100%;
		height:2rem;
		display:flex;
		justify-content: center;
		align-items: center;
		background:#eee;
		margin-top:-0.25rem;
		color:#999;
	}
	.mouthcontent{
		position:relative;
		width:100%;
		height:77vh;
		flex:1;
	}
	i{
		margin-right:0.5rem;
	}
	.pickname_right{
		width:60%;
		height:100%;
		margin-right:1.75rem;
		text-align:right;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height:2.85rem;
	}
</style>