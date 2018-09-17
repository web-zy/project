<template>
	<div class="times">
		<i class="ion-chevron-left" @click="prev()"></i>
		<div ref="lefts" class="timeleft">
			 <div v-for="item in lists">
			    <h1>{{year}}-{{item}}</h1>
			  </div>
		</div>
<!--		
		  <swiper-item>
		    <h1 style="color: #44cc00;">Item 2</h1>
		  </swiper-item>
		
		  <swiper-item>
		    <h1 style="color: #ffc900;">Item 3</h1>
		  </swiper-item>-->
		<i class="ion-chevron-right" @click="next()"></i>
	</div>
</template>

<script>
	import Vue from 'vue'
	import Vonic from "vonic"
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return {
				lists:[],
				index:"",
				year:"",
				month:"",
				i:0,
				dates:""
			}
		},
		props:['routermonth'],
		mounted(){
			var that=this
			setTimeout(function(){
				if(that.routermonth){
					let routerdates=that.routermonth.split("-")
					that.year=routerdates[0]
					that.month=routerdates[1]
					that.lists.push(that.month)
					that.dates=that.year+"-"+that.month
				}else{
					var date=new Date()
					that.year=date.getFullYear()
					that.month=date.getMonth()+1;
					let momonth=that.month<10?"0"+that.month:that.month
					that.lists.push(momonth)
					that.dates=that.year+"-"+momonth
				}
				that.$emit("moren",that.dates)
				//列表数据展示的是第二条，第一条用margin值不显现主要是为了左边点击数据立马出来，不会先显示空白再出现数据。
				if(that.month==1){
					that.lists.unshift('12')
					for(var i=0;i<10;i++){
						that.month++;
						let mouth=that.month<10?"0"+that.month:that.month+""
						that.lists.push(mouth)
					}
				}else{
					let fristmouth=that.month-1<10?"0"+(that.month-1):that.month-1+""
					that.lists.unshift(fristmouth)
					for(var i=0;i<10;i++){
						that.month++;
						let mouth=that.month<10?"0"+that.month:that.month+""
						that.lists.push(mouth)
						if(that.month>=12){
							that.month=0
						}
					}
				}
			},0)
			
			
			
		},
		methods:{
			prev(){
					var that=this
					this.$refs.lefts.style.marginLeft="0"
					this.$refs.lefts.style.transition="all 0.5s";
					setTimeout(function(){
						let lastone=that.lists.pop();
							if(lastone==11){
								that.year--
							}
						that.lists.unshift(lastone)
						that.$refs.lefts.style.transition="all 0s";
						that.$refs.lefts.style.marginLeft="-100%"
						that.dates=that.year+"-"+that.lists[1]
						//console.log(that.dates)
						that.$emit("prevs",that.dates)
					},500)
					//获取时间数据
					
			},
			next(){		
				this.$refs.lefts.style.marginLeft="-200%"
				this.$refs.lefts.style.transition="all 0.5s";
				var that=this
				setTimeout(function(){
					let fristone=that.lists.shift();
					if(fristone==11){
						that.year++
					}
					that.lists.push(fristone)
					that.$refs.lefts.style.transition="all 0s";
					that.$refs.lefts.style.marginLeft="-100%"
					that.dates=that.year+"-"+that.lists[1]
					//console.log(that.dates)
					that.$emit("nexts",that.dates)
				},500)
			},
			
		},
		watch:{
			month(){
				//this.$refs.swiper.go(5)
			}
		}
	}
</script>

<style scoped>
	.times{
		width:100%;
		height:100%;
		z-index:444;
		overflow:hidden;
		position:relative;
		background:wgite;
		color:#ccc;
	}
	.times h1{
		color:#ccc;
	}
	.times div{
		width:100%;
		height:100%;
	}
	.times i{
		position:absolute;
		padding:0 0.2rem;
		height:100%;
		display:flex;
		align-items: center;
		top:0;
	}
	.times i:frist-child{
		left:0;
	}
	.times .ion-chevron-left{
		left:0;
	}
	.times i:last-child{
		right:0;
	}
	.times .timeleft{
		width:1200%;
		height:100%;
		display:flex;
		transition:all 2s;
		margin-left:-100%;
	}
	.times .timeleft>div{
		flex:1;
		height:100%;
		display:flex;
		justify-content: center;
		align-items: center;
	}
</style>