<template>
	<div id="content">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
			<span slot="title">{{title}}</span>
			<div class="button button-icon companyname" slot="right">
				{{company_name}}
			</div>
		</von-header>
		<scroll>
			<!--<div class="reference reference_top">
				<p class="required">*</p>
				<p>时间段名称</p>
				<input type="text" placeholder="请填写时间段" v-model="timesobj.time_name" />
			</div>-->
			<bee-form v-model="timesobj" ref="form" :rules="rules">
				<bee-form-item class="reference_top" prop="name">
					<input-text :name="'时间段名称'" :alert="'请填写时间段'" v-model="timesobj.time_name">
					</input-text>
				</bee-form-item>

				<!--<div class="reference">
				<p>打卡次数</p>
				<input type="text" placeholder="请填写打卡次数" v-model="timesobj.clock_frequency" style="background:transparent" readonly="readonly"/>
			</div>-->
				<bee-form-item>
					<input-text :name="'打卡次数'" :alert="'请填写打卡次数'" v-model="timesobj.clock_frequency">
					</input-text>
				</bee-form-item>
				<!--<div class="reference">
				<p>备注</p>
				<input type="text" placeholder="请填写备注" v-model="timesobj.remarks" />
			</div>-->
				<bee-form-item>
					<input-text :name="'备注'" :alert="'请填写备注'" v-model="timesobj.remarks">
					</input-text>
				</bee-form-item>
				<Timeslot v-for="item in kq_worktimeset" :timesoltobj="item" @deletss="deletes"></Timeslot>
				<p class="addcost" @click="addtimesolt"><i class="ion-ios-plus-outline"></i> 添加时间段</p>
			</bee-form>
		</scroll>
		<div class="btnsub">
			<ButtonBottom :loading="loading" @call-back="btnsub">提交</ButtonBottom>
			<!--<button @click="btnsub">提交</button>-->
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	import '../../../establish/commoncss/common.css'
	export default {
		data() {
			return {
				title: "工作时间",
				company_name: "",
				company_id: "",
				loading: false,
				rules: {
					name: {
						regular: false,
						message: '',
						must: true
					}
				},
				kq_worktimeset: [{
					OrderIndex: 1,
					rowno: 1,
					onduty_time: "",
					offduty_time: "",
					is_nextday: false,
					duration: "",
					time_period: "",
					details_remarks: ""
				}],
				timesobj: {
					time_name: "",
					company_name: "",
					company_id: "",
					app_user_id: "",
					app_user_name: "",
					clock_frequency: "2",
					remarks: "",
					work_time: "",
					app_date: "",
					work_time: "",
					total_duration: "",
					details: [

					]
				},
				bizid: ""
			}
		},
		mounted() {
			//let company_msg = JSON.parse(sessionStorage.getItem('company_msg'));

			if(this.$route.params.val) {
				for(let k in this.$route.params.val) {
					for(let key in this.timesobj) {
						if(k == key) {
							this.timesobj[key] = this.$route.params.val[k]
						}
					}
				}
				this.kq_worktimeset = this.timesobj.details
			} else {

			}
			let company_msg = utrl.getCompany()
			this.company_name = company_msg.company_name
			this.company_id = company_msg.company_id
			this.timesobj.app_user_id = api.userInfo.id
			this.timesobj.app_user_name = api.userInfo.name
			this.bizid = utrl.setbizid()
		},
		methods: {
			back: function() {
				//$router.go(-1)
				this.$router.replace('/index')
			},
			deletes(index) {
				$dialog.confirm({
					theme: 'ios',
					title: '确认删除吗?',
					cancelText: '取消',
					okText: '确定'
				}).then((res) => {
					if(res == true) {
						//	this.costlists.splice(index,1)
						this.kq_worktimeset.splice(index, 1)
						//var ss=document.getElementsByClassName("contents")[0]
						//ss.style.transition="height 2s"
					}
				})

			},
			addtimesolt() {
				var timeobj = {
					OrderIndex: "",
					rowno: "",
					onduty_time: "",
					offduty_time: "",
					is_nextday: false,
					duration: "",
					time_period: "",
					details_remarks: ""
				}
				this.kq_worktimeset.push(timeobj)
			},
			async btnsub() {
				$loading.show('请稍等..')
				var istrim = false
				var date = new Date()
				let timestr = utrl.gettime(date).split(" ")[0]
				this.timesobj.app_date = timestr
				let work_time = ""
				let total_duration = 0;
				for(var i = 0; i < this.kq_worktimeset.length; i++) {
					if(this.kq_worktimeset[i].is_nextday == true) {
						this.kq_worktimeset[i].is_nextday = 1
					} else {
						this.kq_worktimeset[i].is_nextday = 0
					}
					if(this.kq_worktimeset[i].onduty_time == "" || this.kq_worktimeset[i].offduty_time == "") {
						istrim = true
					}
					if(i == this.kq_worktimeset.length - 1) {
						work_time += this.kq_worktimeset[i].onduty_time + "-" + this.kq_worktimeset[i].offduty_time
					} else {
						work_time += this.kq_worktimeset[i].onduty_time + "-" + this.kq_worktimeset[i].offduty_time + ","
					}
					total_duration += parseFloat(this.kq_worktimeset[i].duration)
				}
				this.timesobj.work_time = work_time
				this.timesobj.total_duration = total_duration

				if(this.timesobj.time_name == "") {
					$toast.show("时间段名称不能为空", 1000).then(() => {})
				} else if(istrim == true) {
					$toast.show("上下班时间不能为空", 1000).then(() => {})
				} else {
					this.loading = true;
					this.timesobj.details = this.kq_worktimeset
					this.timesobj.company_name = this.company_name
					this.timesobj.company_id = this.company_id
					if(this.$route.params.val) {
						//修改
						let url = "kqworktimesets/" + this.$route.params.val.id + "?token=" + api.token + "&bizid=" + this.bizid
						this.timesobj.id = this.$route.params.val.id
						let res = await api.put(url, this.timesobj)
						if(res.status >= 200 && res.status < 300) {
							$toast.show("修改成功", 1000)
							this.loading = false;
							$loading.hide()
							$router.go(-1)
						} else {
							this.loading = false;
							$loading.hide()
							$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
							return
						}

					} else {
						//添加
						let url = "kqworktimesets?token=" + api.token + "&bizid=" + this.bizid + "&company_id=" + this.company_id
						let res = await api.post(url, this.timesobj)
						if(res.status >= 200 && res.status < 300) {
							$toast.show("提交成功", 1000)
							this.loading = false;
							$loading.hide()
							$router.go(-1)
						} else {
							this.loading = false;
							$loading.hide()
							$toast.show(res.data.errmsg + "，请重试！", 3000)
							return
						}
					}
				}

			}
		},
		watch: {
			kq_worktimeset() {
				for(var i = 0; i < this.kq_worktimeset.length; i++) {
					this.kq_worktimeset[i].OrderIndex = i + 1
					this.kq_worktimeset[i].rowno = i + 1
					if(this.kq_worktimeset.length == 1) {
						Vue.set(this.kq_worktimeset[i], "isshow", false)
					} else {
						Vue.set(this.kq_worktimeset[i], "isshow", true)
					}
				}
				this.timesobj.clock_frequency = this.kq_worktimeset.length * 2
			}
		}
	}
</script>

<style scoped>
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
	
	#content .reference input {
		margin-right: 0.5rem;
	}
</style>