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
			<p>上班时间: {{time}}</p>
			<p>上班地点: {{address}}</p>
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
				title: "高德定位",
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
			get() {
				/*axios.post("http://restapi.amap.com/v3/ip?key=d931cfebb3e848d8e5cdfe61103964de").then(function(res){
						console.log(res)
					}).catch(function(){
						alert(3)
					})*/
				var map, geolocation;
				var that = this
				//加载地图，调用浏览器定位服务
				var mapObj = new AMap.Map('iCenter');
				mapObj.plugin('AMap.Geolocation', function() {
					geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, //是否使用高精度定位，默认:true
						timeout: 10000, //超过10秒后停止定位，默认：无穷大
						maximumAge: 0, //定位结果缓存0毫秒，默认：0
						convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
						GeoLocationFirst:true, //默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
						noIpLocate:0,  //是否禁止使用IP定位，默认值为0，可选值0-3
						noGeoLocation:0,///是否禁止使用浏览器Geolocation定位，默认值为0，可选值0-3
						useNative:true //是否使用安卓定位sdk用来进行定位，默认：false

					});
					geolocation.getCurrentPosition(function(status, result) {
						if(status == "complete") {
							console.log(result);
							that.position = result
							that.lat = result.position.lat
							that.lng = result.position.lng
							that.address = result.formattedAddress
							console.log("lat",that.lat);
							console.log("lng",that.lng);
							//比较两个经纬度之间的差距
							//单位为米

							/*axios.get("http://restapi.amap.com/v3/assistant/coordinate/convert?key=92b804a38063a22a44367ba90df5cfe0&locations="+that.lat+","+that.lng+"&coordsys=gps&output=json").then(function(res){
								console.log(res)
								console.log(111)
							}).catch(function(err){
								console.log(err)
								console.log(222)
							})
							*/

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
							console.log("from:"+result.location_type)
							console.log( getDisance(that.lng,that.lat,114.425912,38.0225,114.42583333333333) );



						/*
							var lnglatXY = [that.lng, that.lat]; //地图上所标点的坐标
							//根据经纬度转换地址
							//先引用Geocoder插件
							AMap.service('AMap.Geocoder', function() { //回调函数
								//实例化Geocoder
								//new AMap.Map('iCenter')
								var geocoder = new AMap.Geocoder({

								});
								console.log(lnglatXY)
								console.log(geocoder)
								geocoder.getAddress(lnglatXY, function(status, result) {
									console.log(status)
									console.log(result)
									if(status === 'complete' && result.info === 'OK') {
										//获得了有效的地址信息:
										//即，result.regeocode.formattedAddress
										console.log(status)
										that.address = result.regeocode.formattedAddress
									} else {
										//获取地址失败
										console.log(result)
									}
								});
							})*/

						} else {
							console.log(result.message)
							console.log("定位失败")
						}
					})
				});
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