<template>
	<div id="content">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
			<span slot="title">{{title}}</span>
		</von-header>
		<div class="user">
			<div class="userpic">
				123
			</div>
			<div class="username">李文强</div>
			<div class="userdepartment">部门：技术部</div>
		</div>
		<div class="slogan">
			<p>重复是学习之母</p>
		</div>
		<div class="sign" v-if="isshow" @click="sign">
			<p>上班时间00: {{time}}</p>
			<p>上班地点: {{address}} {{lat}}  {{lng}}</p>
			
		</div>
		<div>
			{{position}}
		</div>
		<div class="signpic">
			<img src="../../static/mine_images/add.png" height="200" width="200" @click="sign" />
		</div>
		<div id="iCenter">

		</div>
		<navlist :navlists="navlists"></navlist>
	</div>
</template>

<script>
	import axios from 'axios';
	import navlist from './navlist'
	export default {
		data() {
			return {
				title: "H5定位",
				isshow: true,
				time: "",
				address: "",
				lat: "",
				lng: "",
				navlists:[
					{pic:1,name:"打卡",path:""},
					{pic:2,name:"申请",path:""},
					{pic:3,name:"统计",path:""},
				],
				position:null
			}
		},
		methods: {
		back() {
            $router.go(-1)
        },
			sign() {
				//获取时间
				//val.getHours()+":"+val.getMinutes()
				var nowtime = new Date();
				this.gethour(nowtime)
				this.time = this.gethour(nowtime)
				//定位  key d931cfebb3e848d8e5cdfe61103964de
				this.get()

			},
			get(){
				var that=this
				if (navigator.geolocation) {
					console.log("浏览器支持")
				    navigator.geolocation.getCurrentPosition(locationSuccess, locationError,{
				        enableHighAccuracy: true,
				    });
				}else{
				    console.log("Your browser does not support Geolocation!");
				}
				 function locationSuccess(position){
				 	//alert(position.coords.latitude)
				 	//longitude
				 	//alert(position.coords.longitude)
				 	that.position = position
				 		function toRad(d) {  return d * Math.PI / 180; }
							function getDisance(lat1, lng1, lat2, lng2) { 
							    var dis = 0;
							    var radLat1 = toRad(lat1);
							    var radLat2 = toRad(lat2);
							    var deltaLat = radLat1 - radLat2;
							    var deltaLng = toRad(lng1) - toRad(lng2);
							    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
							    return (dis * 6378137).toFixed(0);
							}
							alert( getDisance(position.coords.longitude,position.coords.latitude,114.425912,38.0225,114.42583333333333) );
				      console.log(position)
				 }
				 function locationError(err){
				       console.log(err.code)
				       console.log(err)
				 }
	
		},
			gethour(val) {
				if(val.getMinutes() < 10) {
					return val.getHours() + ":0" + val.getMinutes()
				} else {
					return val.getHours() + ":" + val.getMinutes()
				}
			}
		},
		components:{
			navlist
		}
	}
</script>

<style scoped>
	* {
		margin: 0;
		padding: 0;
	}
	
	#content {
		width: 100vw;
		height: 100vh;
		background: #eeeeee;
	}
	
	.user {
		width: 100vw;
		height: 7.5rem;
		background: #fafafa;
		margin-top: 2.5rem;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		font-size: 0.8rem;
	}
	
	.userpic {
		width: 2.95rem;
		height: 2.95rem;
		border-radius: 50%;
		border: 1px solid #160f11;
		margin-top: 1rem;
		line-height: 2.95rem;
		text-align: center;
		margin-bottom: 0.7rem;
	}
	
	.username {
		margin-top: 0;
		margin-bottom: 0.3rem;
	}
	
	.sign p {
		width: 100%;
		height: 2rem;
		text-indent: 2.2rem;
		background: #fafafa;
		margin-top: 0.5rem;
		line-height: 2rem;
		font-size: 0.55rem;
	}
	
	.slogan {
		width: 100%;
		height: 2.2rem;
		line-height: 2.2rem;
		text-indent: 2.2rem;
		font-size: 0.75rem;
		margin-top: 0.5rem;
		background: #fafafa;
	}
	
	.signpic {
		width: 100%;
		height: 4.45rem;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 4.15rem;
		img {
			height: 4.45rem;
		}
	}
</style>