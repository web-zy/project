<template>
	<div id="">
		<von-header ref="headname">
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	      	<span slot="title">{{title}}</span>
	      	<div class="button button-icon company companyname" slot="right">{{company_msg.company_name}}</div>
		</von-header>
		<!--<div class="intergaltop">
			<div class="pickdate" id="pickdate">
				<input class="pickdates" type="month" v-model="dates"/>
				<input type="text" v-model="dates" />
				<i class="ion-chevron-down"></i>
			</div>
		</div>-->
		<div id="pickdate">
			<Monthselection @nexts="next" @prevs="prev" @moren="morens" :routermonth="routermonth"></Monthselection>
		</div>
		<div class="scrollout" ref="scrollout">
			<scroll class="page-content scroll-view staydo-scroll" :on-infinite="onInfinite" :on-refresh="onRefresh">
				<div class="intergaltop">
					<div class="intergalbom_lates"  v-for="item in lists" @click="todetails(item)">
						<div class="Smilingfaces">
							<head-portrait :userInfo="item.userInfo" :size="'small'"></head-portrait>
							<!--<img :src='item.src' v-if="item.head_image_id" />
							<p v-else>{{item.user_name | lastword}}</p>-->
							<div class="nametext">{{item.user_name}}</div>
						</div>
						<p>{{item.total_score}}分 <i class="ion-chevron-right"></i></p></div>
					</div>
					 <div v-if="nomore==true" slot="infinite" class="text-center">没有更多数据</div>
				</scroll>
		</div>
			
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import './intergalcss/intercommon.css'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return {
				title:"积分统计",
				company_msg:{},
				dates:"",
				userInfo:{},
				lists:[],
				nowdates:"",
				page:1,
				nomore:false,
				routermonth:""
			}
		},
		filters:{
			lastword(val){
				if(val){
					return val.slice(val.length-1)
				}
			}
		},
		mounted(){
			//this.company_msg=JSON.parse(sessionStorage.getItem('company_msg'))
			var topheight=document.getElementsByClassName("bar")[0].offsetHeight
			var dateheight=document.getElementById("pickdate").offsetHeight
			var windowheight=document.documentElement.clientHeight;
			this.$refs.scrollout.style.height=windowheight-dateheight-topheight+"px"
			let company_msg=utrl.getCompany()
			this.company_msg=company_msg
			this.userInfo=api.userInfo
			var date=new Date();
			let month=date.getMonth() + 1<10?"0"+(date.getMonth()+1):date.getMonth()+1
			this.dates=date.getFullYear()+"-"+month
			this.nowdates=date.getFullYear()+"-"+month
			
		},
		methods:{
			back: function() {
				//$router.go(-1)
				this.$router.replace('/index')
			},
			morens(e){
				this.dates=e
			},
			next(e){
				this.dates=e
			},
			prev(e){
				this.dates=e
			},
			//获取积分报表
			async getReportform(done){
				this.nomore=false
				let dates=this.dates+"-01"
				let url="scores?token="+api.token+"&page="+this.page+"&size=14"+"&company_id="+this.company_msg.company_id+"&filter=score_month="+dates
				let res=await api.get(url)
				console.log(res)
				if(res.status >= 200 && res.status < 300){
					this.lists=this.lists==[]||res.data==""?res.data:this.lists.concat(res.data)
					//api.domain+"files/"+api.userInfo.head_image_id+"/thumbnail/180?token="+api.token+"&company_id="+company_msg.company_id
					for(var i=0;i<this.lists.length;i++){
						this.lists[i].src=api.domain+"files/"+this.lists[i].head_image_id+"/thumbnail/180?token="+api.token+"&company_id="+this.company_msg.company_id
						this.lists[i].userInfo={
							head_image_id:this.lists[i].head_image_id,
							user_name:this.lists[i].user_name
						}
					
					}
					if(res.data.length<14){
						this.nomore=true
						if(done)done()
					}
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
			},
			onRefresh(done) {
		        this.page=1
		        this.lists=[]
		        this.nomore=false
		        this.getReportform(done)
		         done()
		       },
			onInfinite(done){
				if(this.nomore==true){
					done()
					return
				}else{
					this.page++;
					this.getReportform(done)
				}
			},
			todetails(e){
				this.$router.push({name:"Personalintegral",params:{
					val:e
				}})
			}
			
		},
		watch:{
			dates(){
				if(this.dates==""){
					this.dates=this.nowdates
				}
				this.lists=[]
				this.page=1
				this.getReportform()
			}
		}
	}
</script>

<style scoped>
	.crysize{
		font-size:1.36rem;
		margin-left:0.1rem;
	}
	.Smilingfaces img{
		width:1.25rem;
		height:1.25rem;
		border-radius:50%;
		margin-right:0.5rem;
	}
	/*.Smilingfaces i{
		color:#555;
	}*/
	
	
</style>