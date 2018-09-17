<template>
	<div id="">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	      	<span slot="title">{{title}}</span>
	      	<div class="button button-icon company companyname" slot="right">{{company_msg.company_name}}</div>
		</von-header>
		<!--<div class="intergaltop">
			<div class="pickdate" id="pickdate">
				<input class="pickdates" type="month" v-model="dates" @click="off()" ref="dateInp" />
				<input type="text" v-model="dates"  ref="textInp"/>
				<span v-if="usersocre">{{usersocre.user_name}}</span>
				<i class="ion-chevron-down"></i>
			</div>
		</div>-->
		<div id="pickdate">
			<div class="picleft">
				<head-portrait :userInfo="userInfo" :size="'small'"></head-portrait>
				<p>{{userInfo.name}}</p>
				<!--<img :src='src' v-if="userInfo.head_image_id&&userInfo.head_image_id!=' '" />
				<div v-else>{{userInfo.name | lastword}}</div>
				<p>{{userInfo.name}}</p>-->
			</div>
			<div class="chosemonths">
				<Monthselection @nexts="next" @prevs="prev" @moren="morens" :routermonth="routermonth"></Monthselection>
			</div>
		</div>
		
		<div class="allscore" id="allscore" v-if="usersocre">
			<div class="picleft">
				<p class="addsocre">加分：
					<span v-if="usersocre.add_score">{{usersocre.add_score}}分</span>
					<span v-else>0分</span>
					
				</p>
				<p class="remorescore">减分：<span>{{usersocre.all_sub_score}}分</span></p>
			</div>
			<div class="chosemonth">
				总分：<span>{{usersocre.total_score}}分</span>
			</div>
		</div>
		<div class="scrollout" ref="scrollout">
		<scroll class="page-content scroll-view staydo-scroll" :on-infinite="onInfinite" :on-refresh="onRefresh">
			<div class="intergalbom" v-if="lists!=''">
					<div class="intergalbom_lates" v-for="item in lists" @click="go(item)">
							<div class="Smilingface">
								<p class="texts">{{item.score_item}}</p>
								<p  class="times">{{item.remarks}}</p>
								<p class="times">{{item.app_date |times}}</p>
							</div>
						<p class="scorefen"><span v-if="item.score>0">+</span><span :class="item.score<0?'smallscore':''">{{item.score}}分</span></p>
					</div>
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
				title:'',
				company_msg:{},
				nomore:false,
				page:1,
				dates:"",
				userInfo:{},
				usersocre:{},
				lists:[
					
				],
				routermonth:"",
				src:""
				
			}
		},
		filters:{
			times(val) {
				let nowDate = Number(new Date().getDate());
				let valDate = Number(new Date(val).getDate())
				// let differDate = (nowDate - valDate) / 1000 / 60 / 60 / 24 ;
				let differDate = (nowDate - valDate);
				if(differDate >= 1 && differDate < 2){
					return "昨天"
				}else if(differDate >= 0 && differDate < 1){
					if(new Date(val).getMinutes()<10){
						return new Date(val).getHours() + ":0" + new Date(val).getMinutes()
					}else{
						return new Date(val).getHours() + ":" + new Date(val).getMinutes()
					}
				}else{
					return val.split('T')[0]
				}
				// return val.split('T')[0] + ' ' + val.split('T')[1].split('').splice(0, 8).join('');
			},
			lastword(val){
				if(val){
					return val.slice(val.length-1)
				}
			}
		},
		mounted(){
			var topheight=document.getElementsByClassName("bar")[0].offsetHeight
			var dateheight=document.getElementById("pickdate").offsetHeight
			var allscoreheight=document.getElementById("allscore").offsetHeight
			var windowheight=document.documentElement.clientHeight;
			//allscore
			this.$refs.scrollout.style.height=windowheight-dateheight-topheight-allscoreheight+"px"
			let company_msg=utrl.getCompany()
			this.company_msg=company_msg
			if(this.$route.params.val){
				console.log(this.$route.params.val)
				this.title="个人积分"
				this.userInfo=this.$route.params.val
				this.userInfo.id=this.userInfo.user_id
				this.userInfo.name=this.userInfo.user_name
				
				//head_img_url_medium
				let dates=this.$route.params.val.score_month.split("T")[0]
				//this.dates
				let index=dates.lastIndexOf("-")
				this.dates=dates.slice(0,index)
				this.routermonth=this.dates
				this.src=this.$route.params.val.src
			}else{
				console.log(api.userInfo)
				this.src=api.domain+"files/"+api.userInfo.head_image_id+"/thumbnail/180?token="+api.token+"&company_id="+company_msg.company_id
				this.title="我的积分"
				this.userInfo=api.userInfo
				this.userInfo.user_name=this.userInfo.name
				var date=new Date();
				let month=date.getMonth() + 1<10?"0"+(date.getMonth()+1):date.getMonth()+1
				this.dates=date.getFullYear()+"-"+month
			}
		},
		methods:{
			go(val){
				if(val.TaskID){
					utrl.routerGo("scoremodifys",val.TaskID,"Scoremodifys")
					let childPath = "/index/news/scoremodifys";
					$router.push({
						path:childPath,
						name:"scoremodifys",
						params:{
							id:val.TaskID,
							interface:"scoremodifys"
						}
					})
				}else{
					$toast.show('没有详情页',3000)
				}
					
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
			searchs(){
				//this.dates="2018-09-01"
				this.getscros()
				this.getlists()
			},
			back: function() {
				//$router.go(-1)
				this.$router.replace('/index')
			},
			off(){
				this.$refs.textInp.blur();
				 this.$refs.dateInp.focus()
			},
			onInfinite(done){
				if(this.nomore==true){
					done()
					return
				}else{
					this.page++
					this.getlists(done)
				}
			},
			onRefresh(done){
				this.page=1;
				this.lists=[]
				this.getlists(done)
				done()
			},
			//获取数据
			async getscros(){
				let dates=this.dates+"-01"
				let url="scores?token="+api.token+"&filter=user_id="+this.userInfo.id+",score_month="+dates+"&company_id="+this.company_msg.company_id
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					this.usersocre=res.data[0]
					
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
			},
			//获取列表
			async getlists(done){
				this.nomore=false
				let dates=this.dates+"-01"
				let url="scoremodifys/scoredetails?score_month="+dates+"&token="+api.token+"&page="+this.page+"&size=20&company_id="+this.company_msg.company_id+"&filter=person_id="+this.userInfo.id
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					if(res.data!=""){
						this.lists=this.lists==[]?res.data:this.lists.concat(res.data)
					}
					
					if(res.data.length<20||res.data==""){
						this.nomore=true
						if(done)done()
					}
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
			}
		},
		watch:{
			dates(){
				this.lists=[]
				this.page=1
				this.getscros()
				this.getlists()
			}
		}
	}
</script>

<style scoped>
	.wushu{
		width:100%;
		height:100%;
		margin-top:6rem;
	}
	.pickdate i{
		width:1rem;
		text-align:right;
		display:block;
		position:absolute;
		top:0;
		right:0rem;
		z-index:33;
		font-size:1rem;
		height:2.1rem;
		display:flex;
		align-items: center;
	}
	.scorefen{
		width:3rem;
		height:100%;
		text-align:right;
	}
	.smallscore{
		color:red;
	}
</style>