<template>
	<div id="content">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
			<span slot="title">{{title}}</span>
			<!--<div class="button button-icon company" slot="right" @click.stop="showcompony">{{obj.company_name}}</div>-->
			<div class="button button-icon" slot="right">
				<ChoiceCompany @give-company="setCompony"></ChoiceCompany>
			</div>
		</von-header>
		<div class="user">
			<div class="user_information">
				<!--userInfo.head_image_id-->
				<div class="user_pics" v-if="userInfo.head_image_id">
					<!--<img :src="src"/>-->
					<head-portrait :userInfo="userInfo" :size="'small'"></head-portrait>
				</div>
				<div class="user_pic" v-else>
					{{userInfo.name | lastword}}
				</div>
				<div class="user_name">
					<p>{{userInfo.name}}</p>
					<p class="worktime" v-for="item in worktimelist">上班:{{item.onduty_time}}<span>下班:{{item.offduty_time}}</span></p>
				</div>
			</div>
			<bee-form v-model="date" class="chosedate" ref="form" :rules="rules">
				<bee-form-item>
					<input-datepicker :name="'日期'" :alert="'请选择时间'" v-model="date"></input-datepicker>
				</bee-form-item>
			</bee-form>
			<p>{{showdate}}<i class="ion-chevron-down drop-down"></i></p>
		</div>
		<scroll>
			<div class="punckclock" v-for="item in list">
				<i class="icon-Spot"></i>
				<div class="punckclockin">
					<div class="punckclock_left">
						<p><i class="ion-ios-clock-outline"></i>{{item.app_date |time}}</p>
					</div>
					<div>
						<button class="Fieldpersonnel" v-if="item.unfield_name">{{item.unfield_name}}</button>
						<!--<button v-if="item.status_name=='正常'">{{item.status_name}}</button>-->
						<!--<button class="invalid" v-else-if="item.status_name=='已更新打卡'">{{item.status_name}}</button>-->
						<button class="invalid" v-if="item.status_name=='已打卡'">{{item.status_name}}</button>
						<button class="late" v-else-if="item.status_name=='迟到'">{{item.status_name}}</button>
						<button class="early" v-else-if="item.status_name=='早退'">{{item.status_name}}</button>
						<button class="Scheduling" v-else-if="item.status_name=='未排班'">{{item.status_name}}</button>
					</div>
				</div>
			</div>
		</scroll>
		<div @click="clock" class="pushclock_top" v-if="clockshow">
			{{nowtimes}}
		</div>
		<div v-if="isbackground" class="posback">

		</div>
		<div id="iCenter">

		</div>
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: "考勤",
				isgetcommpy: false,
				isbackground: false,
				isshow: false,
				list: [

				],
				worktimelist: [],
				date: "",
				dates: "",
				nowtimes: "",
				src: "",
				userInfo: {},
				clockshow: true,
				obj: {
					company_id: "",
					company_name: "",
					app_user_id: "",
					app_user_name: "",
					app_date: "08:20",
					location: "",
					longitude: "",
					latitude: "",
					phone_ip: "",
					phone_name: ""
				},
				rules: {
					name: {
						regular: "^([\u2E80-\u9FFF]){3,5}$",
						message: '长度在 3 到 5 个字符',
						must: true
					},
					age: {
						regular: "^(?:0|[1-9][0-9]?|100)$",
						message: '请输入 0 - 100 之间的数字',
						must: false
					},
					email: {
						regular: "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$",
						message: "请输入正确的邮箱格式",
						must: true
					}
				},
				timer: null
			}
		},
		filters: {
			lastword(val) {
				if(val) {
					return val.slice(val.length - 1)
				}
			},
			time(val) {
				if(val.indexOf('.') != -1) {
					val = val.split(".")[0]
					val = val.split("T")[1]
					return val
				}

			}
		},
		mounted() {
			var that = this

			function plusReady() {
				that.obj.phone_ip = plus.device.uuid
				that.obj.phone_name = plus.device.model
			}
			if(window.plus) {
				plusReady();
			} else {
				//document.addEventListener("plusready",plusReady,false);
				//$toast.show("buzhichi", 1000)

			}

			this.userInfo = api.userInfo
			var date = new Date()
			this.date = utrl.gettime(date).split(" ")[0]
			this.dates = utrl.gettime(date).split(" ")[0]
			this.nowtimes = utrl.gettime(date).split(" ")[1]
			var that = this
			this.timer = setInterval(function() {
				that.nowtime()
			}, 1000)

			//			let company_msg = JSON.parse(sessionStorage.getItem('company_msg'));
			//			if(company_msg!==null){
			//				console.log(company_msg)
			//				console.log("zou")
			//				this.obj.company_name=company_msg.company_name
			//				this.obj.company_id=company_msg.company_id
			//			}
			let company_msg = utrl.getCompany()
			this.obj.company_name = company_msg.company_name
			this.obj.company_id = company_msg.company_id
			this.obj.app_user_id = api.userInfo.id
			this.obj.app_user_name = api.userInfo.name
			this.src = api.domain + "files/" + api.userInfo.head_image_id + "/thumbnail/180?token=" + api.token + "&company_id=" + company_msg.company_id
			this.getworktime()

		},
		methods: {
			back: function() {
				//$router.go("-1")
				this.$router.replace('/index')
			},
			//获取上下班
			async getworktime() {
				let url = "kqclocks/dutytime?token=" + api.token + "&app_date=" + this.date + "&company_id=" + this.obj.company_id + "&filter=person_id=" + this.userInfo.id
				let res = await api.get(url)
				this.worktimelist = res.data
			},
			//获取现在时间
			nowtime() {
				let date = new Date()
				this.nowtimes = utrl.gettime(date).split(" ")[1]
				//this.nowtimes = "111"
			},
			setCompony(e) {
				this.obj.company_name = e.company_name
				this.obj.company_id = e.company_id
				sessionStorage.setItem('company_msg', JSON.stringify(e));
				this.$parent.Jurisdiction()
				this.getclocklist()
				this.getworktime()
			},
			//获取打卡列表
			async getclocklist() {
				let url = "kqclocks?token=" + api.token + "&size=130&company_id=" + this.obj.company_id + "&app_date=" + this.date + "&filter=app_user_id=" + this.userInfo.id
				let res = await api.get(url)
				if(res.status >= 200 && res.status < 300) {
					this.list = res.data
				} else {

					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
			},
			clock() {
				$loading.show('打卡中..')
				var that = this
				this.isshow = true
				let bizid = utrl.setbizid()
				let url = "kqclocks?token=" + api.token + "&bizid=" + bizid;
				//获取时间
				var date = new Date()
				let timestr = utrl.gettime(date);
				this.obj.app_date = timestr
				//获取坐标
				var map, geolocation;
				//加载地图，调用浏览器定位服务
				var mapObj = new AMap.Map('iCenter');
				mapObj.plugin('AMap.Geolocation', function() {
					geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, //是否使用高精度定位，默认:true
						timeout: 10000, //超过10秒后停止定位，默认：无穷大
						maximumAge: 0, //定位结果缓存0毫秒，默认：0
						convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
						showButton: true, //显示定位按钮，默认：true
						buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
						buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
						showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
						showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
						panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
						zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					});
					geolocation.getCurrentPosition(async function(status, result) {
						if(status == "complete") {
							that.position = result
							that.obj.latitude = parseFloat(result.position.lat)
							that.obj.longitude = parseFloat(result.position.lng)
							that.obj.location = result.formattedAddress

							let res = await api.post(url, that.obj)
							if(res.status >= 200 && res.status < 300) {
								setTimeout(() => {
									$loading.hide()
								}, 500)
								$toast.show("打卡成功", 1000)
								that.getclocklist()
							} else {
								$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
								return
							}

							//$toast.show( "定位成功", 1000).then(() => {})
						} else {
							$toast.show("定位失败", 3000).then(() => {})

						}
					})

				});
			},
			showcompony() {
				this.isbackground = !this.isbackground
				this.isgetcommpy = !this.isgetcommpy
			},
			componyobj(obj) {
				this.isbackground = !this.isbackground
				this.isgetcommpy = !this.isgetcommpy
				this.obj.company_name = obj.company_name
				this.obj.company_id = obj.company_id
				window.sessionStorage.setItem("company_name", obj.company_name)
				window.sessionStorage.setItem("company_id", obj.company_id)
			}
		},
		computed: {
			showdate() {
				if(this.date.slice(0, 5) == this.dates.slice(0, 5)) {
					return this.date.slice(5)
				} else {
					return this.date
				}
			}
		},
		watch: {
			date() {
				if(this.date == this.dates) {
					this.clockshow = true
					//this.date=this.date.slice(5)
				} else {
					this.clockshow = false
				}
				this.getclocklist()
			}
		}
	}
</script>

<style scoped>
	#content {
		width: 100%;
		height: 100vh;
		background: #ffffff;
	}
	
	#content .button {
		top: 0;
		bottom: 0;
	}
	
	.user {
		width: 100%;
		min-height: 3.75rem;
		position: relative;
		margin-top: 2.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.75rem;
		margin-bottom: 0.25rem;
		background: #fafafa;
		padding: 0.5rem 0;
	}
	
	.chosedate {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
	}
	
	.dates {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
	}
	
	#content .scroll {
		top: 6.75rem;
		bottom: 2.5rem;
		background: #ffffff;
	}
	
	.user_information {
		width: 12rem;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-left: 0.5rem;
		font-size: 0.75rem;
	}
	
	.worktime {
		font-size: 0.5rem;
		color: #aaa;
	}
	
	.worktime span {
		margin-left: 0.75rem;
	}
	
	.drop-down {
		color: #aaa;
	}
	
	.user_name {
		margin-left: 0.65rem;
		min-height: 2.25rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	
	.user_pic {
		width: 2.25rem;
		height: 2.25rem;
		border: 1px solid #0a0205;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.user_pics {
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
	
	.user_pics img {
		width: 100%;
		height: 100%;
	}
	
	.user>p {
		margin-right: 0.5rem;
	}
	
	.punckclock {
		width: 100%;
		height: 2.5rem;
		margin-top: 0.5rem;
		font-size: 0.75rem;
		padding: 0 0.75rem 0 1.4rem;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	
	.punckclock>i {
		position: absolute;
		top: 0;
		left: 0.75rem;
		display: flex;
		align-items: center;
		height: 100%;
		font-size: 0.5rem;
		color: #eee;
	}
	
	.punckclockin {
		width: 100%;
		background: #eee;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		border-radius: 0.2rem;
	}
	
	.punckclock button {
		padding: 0 0.5rem;
		height: 1.2rem;
		border: 1px solid #f2ad06;
		color: #f2ad06;
		border-radius: 0.2rem;
		margin-right: 0.5rem;
		background: transparent;
		font-size: 0.63rem;
	}
	
	.punckclock .Fieldpersonnel {
		border: 1px solid #4cbed7;
		color: #4cbed7;
	}
	
	.punckclock .invalid {
		border: 1px solid #aaa;
		color: #aaa;
	}
	
	.punckclock .late {
		border: 1px solid #4a90e1;
		color: #4a90e1;
	}
	
	.punckclock .early {
		border: 1px solid #45a377;
		color: #45a377;
	}
	
	.punckclock .Scheduling {
		border: 1px solid #deb727;
		color: #deb727;
	}
	
	.punckclock_left {
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		flex-direction: column;
	}
	
	.punckclock_left>p {
		display: flex;
		align-items: center;
		margin: 0.1rem 0;
	}
	
	.punckclock_left>p>i {
		display: block;
		text-align: center;
		font-size: 1rem;
		margin-left: 1rem;
		margin-right: 0.3rem;
	}
	
	.pushclock_top {
		width: 6.5rem;
		height: 6.5rem;
		position: absolute;
		bottom: 5rem;
		left: 50%;
		margin-left: -3.25rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #f29011;
		border-radius: 50%;
		font-size: 1rem;
		color: white;
	}
	
	.posback {
		position: fixed;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, .2);
		top: 0;
		left: 0;
		z-index: 33;
	}
	
	.handbtn .icon-Button:before {
		font-size: 3.5rem;
		color: white;
	}
	
	.drop-down {
		margin-left: 0.5rem;
	}
</style>