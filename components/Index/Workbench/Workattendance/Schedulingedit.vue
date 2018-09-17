<template>
	<div id="content">
		<von-header class="titles">
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
			<span slot="title">{{title}}</span>
			<div class="button button-icon company companyname" slot="right">{{kq_scheduleset.company_name}}</div>
		</von-header>

		<iframe v-if="isaddress" id="test" @load.stop="loadiframe" class="maps" :src="src"></iframe>
		<scroll>
			<!--<div class="reference reference_top">
					<p class="required">*</p>
					<p>排班类型</p>
					<input type="text" placeholder="请填写排班类型"  ref="schedule_type" v-model="kq_scheduleset.schedule_type" />
				</div>-->
			<bee-form v-model="kq_scheduleset" ref="form" :rules="rules">
				<bee-form-item prop="name">
					<input-text class="reference_top" :name="'排班类型'" :alert="'请填写排班类型'" v-model="kq_scheduleset.schedule_type">

					</input-text>
				</bee-form-item>
				<!--<div class="reference">
					<p class="required">*</p>
					<p>排班名称</p>
					<input type="text" placeholder="请填写排班名称" ref="schedule_name" v-model="kq_scheduleset.schedule_name" />
				</div>-->
				<bee-form-item prop="name">
					<input-text :name="'排班名称'" :alert="'请填写排班名称'" v-model="kq_scheduleset.schedule_name">

					</input-text>
				</bee-form-item>
				<!--<div class="reference">
					<p>备注</p>
					<input type="text" placeholder="请填写备注" v-model="kq_scheduleset.remarks" />
				</div>-->
				<bee-form-item>
					<input-text :name="'备注'" :alert="'请填写备注'" v-model="kq_scheduleset.remarks">

					</input-text>
				</bee-form-item>
				<!--<div class="reference" @click="getholiday">
					<p>法定节假日</p>
					<input type="text" placeholder="请填写法定节假日" v-model="kq_scheduleset.legal_holiday" />
					<p class="fuhao"><i class="ion-chevron-right"></i></p>
				</div>-->
				<bee-form-item>
					<input-text :name="'法定节假日'" :edit="false" :alert="'请填写法定节假日'" v-model="kq_scheduleset.legal_holiday" @click="getholiday">
						<i class="icon-right ion-ios-arrow-forward"></i>
					</input-text>
				</bee-form-item>
				<div>
					<!--<div class="reference"  @click="workdayshow">
						<p class="required">*</p>
						<p>工作日</p>
						<input type="text" placeholder="请选择工作日" v-model="kq_scheduleset.kq_scheduleset_workday" readonly="readonly" style="background:transparent;"/>
						<p class="fuhao"><i class="ion-chevron-right"></i></p>
					</div>-->
					<bee-form-item prop="name">
						<input-text :name="'工作日'" :edit="false" :alert="'请选择工作日'" v-model="kq_scheduleset.kq_scheduleset_workday" @click="workdayshow">
							<i class="icon-right ion-ios-arrow-forward"></i>
						</input-text>
					</bee-form-item>
					<div v-if="isshow" :class="isshow?'show':'hide'">
						<!--<div class="reference" v-for="item in workdaylists" @click.stop="getworkday(item)">
							<p>{{item.working_day}}</p>
							<input type="text"  v-model="item.working_time" readonly="readonly" style="background:transparent;"/>
							<p class="fuhao"><i class="ion-chevron-right"></i></p>
						</div>-->
						<bee-form-item>
							<input-text v-for="item in workdaylists" :name="item.working_day" :edit="false" :alert="''" v-model="item.working_time" @click="getworkday(item)">
								<i class="icon-right ion-ios-arrow-forward"></i>
							</input-text>
						</bee-form-item>
					</div>
				</div>
				<!--<div class="reference" @click="chosePerson1">
					<p class="required">*</p>
					<p>排班人员</p>
					<input type="text" placeholder="请选择排班人员" v-model="person_names" readonly="readonly" style="background:transparent;"/>
					<p class="fuhao"><i class="ion-chevron-right"></i></p>
				</div>-->
				<bee-form-item>
					<input-text :name="'排班人员'" :edit="false" :alert="'请选择排班人员'" v-model="person_names" @click="chosePerson1">
						<i class="icon-right ion-ios-arrow-forward"></i>
					</input-text>
				</bee-form-item>
				<Cardlocation v-for="(item,index) in cardlocation" :cardlocation="item" @deletes="deletecard" :key="index" @getmaps="getaddress(item,index)"></Cardlocation>
				<p class="addcost" @click="addcardlocation"><i class="ion-ios-plus-outline"></i> 添加打卡地点</p>
				<bee-form-item>
					<input-toggle class="lastchose" :name="'立即生效(默认明天生效)'" v-model="iseffect"></input-toggle>
				</bee-form-item>
			</bee-form>
		</scroll>

		<div class="btnsub">
			<button @click="btnsub">提交</button>
		</div>
		<Workingday v-if="isworkday" :workdayname="workdayname" @emit-workday="workday"></Workingday>
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	import '../../../establish/commoncss/common.css'
	export default {
		data() {
			return {
				title: "排班设置",
				company_name: "",
				isaddress: false,
				isshow: false,
				iseffect: false,
				lat: "",
				lng: "",
				src: "",
				isaddress: false,
        user_id: "",
				person_names: "",
				rules: {
					name: {
						regular: false,
						message: '',
						must: true
					}
				},
				cardlocation: [{
					location_name: "",
					address: "",
					valid_range: "",
					longitude: "",
					latitude: "",
					isone: false
				}],
				workdaylists: [{
						working_day: "星期一",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期二",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期三",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期四",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期五",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期六",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期日",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
				],
				kq_scheduleset: {
					company_id: "",
					company_name: "",
					app_user_id: "",
					app_user_name: "",
					app_date: "",
					schedule_type: '',
					schedule_description: "",
					schedule_name: "",
					legal_holiday: "",
					remarks: "",
					id: "",
					//工作日
					workday: [

					],
					//排班人员
					staff: [

					],
					//打卡地点
					location: [{
						location_name: "",
						address: "",
						valid_range: "",
						longitude: "",
						latitude: ""
					}],
					//法定节假日
					holiday: [

					]
				},
				bizid: "",
				isworkday: false,
				workdayname: "",
				addressindexs: "",
				focusState: false,
				focusStates: false,
				company_msg: {},
				routerparams: null
				//userlistid:""
			}
		},
		mounted() {

		},
		activated() {
			let Schedulinglist = JSON.parse(sessionStorage.getItem("Schedulinglist"))
			if(Schedulinglist) {
				this.routerparams = Schedulinglist
				this.isshow = true
				for(let k in Schedulinglist) {
					for(let key in this.kq_scheduleset) {
						if(k == key) {
							this.kq_scheduleset[key] = Schedulinglist[k]
						}
					}
				}
				this.workdaylists = this.kq_scheduleset.workday
				this.cardlocation = this.kq_scheduleset.location
				this.kq_scheduleset.id = Schedulinglist.id
				//this.userlistid=this.kq_scheduleset.staff[0].id
				this.user_id = ""
				this.person_names = ""
				for(var i = 0; i < this.kq_scheduleset.staff.length; i++) {
					if(i == this.kq_scheduleset.staff.length - 1) {
						this.user_id += this.kq_scheduleset.staff[i].person_id
						this.person_names += this.kq_scheduleset.staff[i].person_name
					} else {
						this.user_id += this.kq_scheduleset.staff[i].person_id + ","
						this.person_names += this.kq_scheduleset.staff[i].person_name + ","
					}
				}
				//sessionStorage.removeItem("Schedulinglist")
			}
			this.isaddress = false
			this.bizid = utrl.setbizid()
			let company_msg = utrl.getCompany()
			this.company_msg = company_msg
			this.kq_scheduleset.company_name = company_msg.company_name
			this.kq_scheduleset.company_id = company_msg.company_id
			this.get()
			this.src = "https://m.amap.com/picker/?keywords=写字楼,小区,学校&zoom=15&center=" + this.lng + "," + this.lat + "&radius=1000&total=20&key=92b804a38063a22a44367ba90df5cfe0"
			let personData1 = JSON.parse(sessionStorage.getItem('selectPerson'));
			if(personData1 !== null) {
				this.user_id = ""
				this.person_names = ""
				if(personData1.length == 0) {
					this.user_id = "empty"
				} else {

					this.kq_scheduleset.staff = []
					//{OrderIndex:1,rowno:1,person_id:"",person_code:"",person_name:""}
					//this.kq_scheduleset.staff=personData1
					for(var i = 0; i < personData1.length; i++) {
						this.kq_scheduleset.staff.push({
							id: this.kq_scheduleset.id,
							OrderIndex: i + 1,
							rowno: i + 1,
							person_id: personData1[i].id,
							person_name: personData1[i].DisplayName,
							//person_code:personData1[i].employee_no
						})

						if(i == personData1.length - 1) {
							this.user_id += personData1[i].id
							this.person_names += personData1[i].DisplayName
						} else {
							this.user_id += personData1[i].id + ","
							this.person_names += personData1[i].DisplayName + ","
						}
					}
					sessionStorage.removeItem("selectPerson")
				}

			}
			let hoildaylists = JSON.parse(sessionStorage.getItem("hoildaylist"))
			if(hoildaylists !== null) {
				this.kq_scheduleset.holiday = []
				//this.kq_scheduleset.holiday=hoildaylists
				var hoildaystr = ""
				for(var i = 0; i < hoildaylists.length; i++) {
					//{OrderIndex:1,rowno:1,plt_holiday_id:"",holiday_name:""}
					this.kq_scheduleset.holiday.push({
						id: this.kq_scheduleset.id,
						OrderIndex: i + 1,
						rowno: i + 1,
						plt_holiday_id: hoildaylists[i].id,
						holiday_name: hoildaylists[i].name
					})
					if(i == hoildaylists.length - 1) {
						hoildaystr += hoildaylists[i].name
					} else {
						hoildaystr += hoildaylists[i].name + ","
					}
				}
				this.kq_scheduleset.legal_holiday = hoildaystr
				sessionStorage.removeItem("hoildaylist")
			}

		},
		directives: {
			focus: {
				inserted: function(el) {
					el.focus()
				}
			}
		},
		methods: {
			back: function() {
				//$router.go(-1)
				this.cardlocation = [{
					location_name: "",
					address: "",
					valid_range: "",
					isone: false
				}]
				this.workdaylists = [{
						working_day: "星期一",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期二",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期三",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期四",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期五",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期六",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
					{
						working_day: "星期日",
						working_time_id: "",
						working_time: "",
						working_description: ""
					},
				]
				this.kq_scheduleset = {
					person_id: "",
					company_id: "",
					company_name: "",
					app_user_id: "",
					app_user_name: "",
					app_date: "",
					schedule_type: '',
					schedule_description: "",
					schedule_name: "",
					legal_holiday: "",
					remarks: "",
					id: "",
					//工作日
					workday: [

					],
					//排班人员
					staff: [

					],
					//打卡地点
					location: [{
						location_name: "",
						address: "",
						valid_range: "",
						longitude: "",
						latitude: ""
					}],
					//法定节假日
					holiday: [

					]
				}

				this.$router.replace('/index')
			},
			//跳转假日
			getholiday() {
				this.$router.push({
					name: "holiday"
				})
			},
			workdayshow() {
				this.isshow = !this.isshow
			},
			chosePerson1() {
				this.$router.push({
					name: "choseSchedulingperson",
					params: {
						val: this.kq_scheduleset.staff
					}
				})
				//              this.$router.push({name:"Shiftstaff",params:{
				//              	id:2,
				//              	name:"排班设置",
				//              	user_id:this.user_id
				//              }});
				//回到本页面获取数据执行JSON.parse(sessionStorage.getItem('radioselect'));
			},
			workday(obj, workdayname) {
				this.isworkday = false
				if(obj == false) {
					return
				}
				this.workdayname.time_name = obj.time_name
				//	workdayname.content=obj.time_name+obj.work_time
				if(!obj.work_time) {
					obj.work_time = ""
					workdayname.working_time = obj.time_name
					workdayname.working_description = workdayname.working_day + ":" + obj.time_name
				} else {
					workdayname.working_time = obj.time_name + "(" + obj.work_time + ")"
					workdayname.working_description = workdayname.working_day + ":" + obj.time_name + "(" + obj.work_time + ")"
				}
				workdayname.working_time_id = obj.id

			},
			getworkday(e) {
				this.isworkday = true
				this.workdayname = e
			},
			addcardlocation() {
				var arr = {
					location_name: "",
					address: "",
					valid_range: ""
				}
				this.cardlocation.push(arr)
			},
			deletecard(e) {
				$dialog.confirm({
					// 设置为ios样式
					theme: 'ios',
					// 标题
					title: '确定删除吗?',
					// 取消按钮文本
					cancelText: '取消',
					// 确定按钮文本
					okText: '确定'
				}).then(async(res) => {
					//console.log('confirm result: ', res)
					if(res == true) {
						this.cardlocation.splice(e - 1, 1)

					}
				})
			},
			get() {
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
						GeoLocationFirst: true, //默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
						noIpLocate: 0, //是否禁止使用IP定位，默认值为0，可选值0-3
						noGeoLocation: 0, ///是否禁止使用浏览器Geolocation定位，默认值为0，可选值0-3
						useNative: true //是否使用安卓定位sdk用来进行定位，默认：false

					});
					geolocation.getCurrentPosition(function(status, result) {
						if(status == "complete") {
							that.position = result
							that.lat = parseFloat(result.position.lat)
							that.lng = parseFloat(result.position.lng)
							//that.address = result.formattedAddress
						} else {
							console.log(result.message)
						}
					})
				});
			},
			loadiframe(e) {
				var that = this
				let iframe = document.getElementById('test').contentWindow;
				iframe.postMessage('hello', 'https://m.amap.com/picker/');
				window.addEventListener("message", function(e) {
					if(e.data.command != "COMMAND_GET_TITLE") {
						//业务代码
						let arrlocation = e.data.location.split(",")
						for(let i = 0; i < that.cardlocation.length; i++) {
							if(i == that.addressindexs) {
								that.cardlocation[i].location_name = e.data.name
								that.cardlocation[i].address = e.data.address
								that.cardlocation[i].longitude = arrlocation[0]
								that.cardlocation[i].latitude = arrlocation[1]
								that.cardlocation[i].id = this.kq_scheduleset.id
							}
						}
						// that.address=e.data.address
						// that.cardlocation.location_name=e.data.name
						//  that.cardlocation.address=e.data.address
						that.isaddress = false
					}

				}.bind(this), false);
			},
			getaddress(obj, val) {
				this.addressindexs = val
				// val.cardlocation.location_name=e.data.name
				//  val.cardlocation.address=e.data.address
				this.isaddress = true
				if(obj.valid_range == "") {
					obj.valid_range = 1000
				}
				this.src = "https://m.amap.com/picker/?keywords=写字楼,小区,学校&zoom=15&center=" + this.lng + "," + this.lat + "&radius=" + obj.valid_range + "&total=20&key=92b804a38063a22a44367ba90df5cfe0"
			},
			async btnsub() {
				this.focusState = false
				this.focusStates = false
				if(this.kq_scheduleset.schedule_type == "") {
					$toast.show("排班类型不能为空", 1000).then(() => {})
					this.$refs.schedule_type.focus()
				} else if(this.person_names == "") {
					$toast.show("排班人员不能为空", 1000).then(() => {})
				} else if(this.kq_scheduleset.schedule_name == "") {
					$toast.show("排班名称不能为空", 1000).then(() => {})
					this.$refs.schedule_name.focus()
				} else {
					$loading.show('提交中..')
					this.loading = true
					var date = new Date()
					date = utrl.gettime(date)
					this.kq_scheduleset.app_date = date
					let workdaystr = ""
					for(var i = 0; i < this.workdaylists.length; i++) {
						this.workdaylists[i].OrderIndex = i + 1
						this.workdaylists[i].rowno = i + 1
						if(i == this.workdaylists.length - 1) {
							workdaystr += "</br>" + this.workdaylists[i].working_description
						} else {
							workdaystr += "</br>" + this.workdaylists[i].working_description + ","
						}
					}
					//workdaystr+="</br>法定节假日:("+this.kq_scheduleset.legal_holiday+")休息"
					for(var i = 0; i < this.cardlocation.length; i++) {
						this.cardlocation[i].OrderIndex = i + 1
						this.cardlocation[i].rowno = i + 1
						this.cardlocation[i].id = this.kq_scheduleset.id
						if(this.cardlocation.length == 1) {
							this.cardlocation[i].isone = false
						} else {
							this.cardlocation[i].isone = true
						}
					}
					this.kq_scheduleset.location = this.cardlocation
					this.kq_scheduleset.schedule_description = workdaystr
					this.kq_scheduleset.workday = this.workdaylists
					var res = null
					if(this.routerparams != null) {
						//修改
						if(this.iseffect == true) {
							this.iseffect = 1
						} else {
							this.iseffect = 0
						}
						this.kq_scheduleset.id = this.routerparams.id
						let url = "kqschedulesets/" + this.routerparams.id + "?token=" + api.token + "&bizid=" + this.bizid + "&iseffect=" + this.iseffect
						res = await api.put(url, this.kq_scheduleset)
					}
					if(res.status >= 200 && res.status < 300) {
						sessionStorage.removeItem("Schedulinglist")
						this.cardlocation = [{
							location_name: "",
							address: "",
							valid_range: "",
							isone: false
						}]
						this.workdaylists = [{
								working_day: "星期一",
								working_time_id: "",
								working_time: "",
								working_description: ""
							},
							{
								working_day: "星期二",
								working_time_id: "",
								working_time: "",
								working_description: ""
							},
							{
								working_day: "星期三",
								working_time_id: "",
								working_time: "",
								working_description: ""
							},
							{
								working_day: "星期四",
								working_time_id: "",
								working_time: "",
								working_description: ""
							},
							{
								working_day: "星期五",
								working_time_id: "",
								working_time: "",
								working_description: ""
							},
							{
								working_day: "星期六",
								working_time_id: "",
								working_time: "",
								working_description: ""
							},
							{
								working_day: "星期日",
								working_time_id: "",
								working_time: "",
								working_description: ""
							},
						]
						this.kq_scheduleset = {
							person_id: "",
							company_id: "",
							company_name: "",
							app_user_id: "",
							app_user_name: "",
							app_date: "",
							schedule_type: '',
							schedule_description: "",
							schedule_name: "",
							legal_holiday: "",
							remarks: "",
							//工作日
							workday: [

							],
							//排班人员
							staff: [

							],
							//打卡地点
							location: [{
								location_name: "",
								address: "",
								valid_range: "",
								longitude: "",
								latitude: ""
							}],
							//法定节假日
							holiday: [

							]
						}

						$toast.show("提交成功", 1000)
						this.loading = false;
						$loading.hide()
						$router.go(-1)
					} else {
						$toast.show(res.data.errmsg + "，请重试！", 3000)
						this.loading = false;
						$loading.hide()
						return
					}
				}

			}
		},
		watch: {
			cardlocation() {
				for(var i = 0; i < this.cardlocation.length; i++) {
					this.cardlocation[i].OrderIndex = i + 1
					this.cardlocation[i].rowno = i + 1
					this.cardlocation[i].id = this.kq_scheduleset.id
					if(this.cardlocation.length == 1) {
						this.cardlocation[i].isone = false
					} else {
						this.cardlocation[i].isone = true
					}
				}
			},

		}
	}
</script>

<style lang="less" scoped>
	.titles {
		z-index: 10008;
	}

	.maps {
		display: block;
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background: white;
		z-index: 33;
	}

	.workday {
		display: block;
		width: 100%;
		height: auto;
		max-height: 100rem;
		transition: all .3s ease;
		overflow: hidden;
	}

	.hide {
		height: 0;
	}

	.show {
		max-height: 50rem;
		margin-top: 12px;
	}

	.companyname {
		display: block;
		max-width: 5rem;
		height: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		display: block;
		line-height: 40px;
		text-align: right;
	}

	#contents {
		height: 100%;
	}
</style>
