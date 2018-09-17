<template>
	<div id="content">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
			<span slot="title">{{titles}}</span>
			<!-- <div class="button button-icon company companyname" slot="right" @click.stop="showcompony">{{company_name}}</div> -->
			<div class="button button-icon" slot="right">
				<ChoiceCompany :getcommpyObj="{id:json.company_id,type:json.company_name}" @give-company="setCompony"></ChoiceCompany>
			</div>
		</von-header>
		<scroll>
			<bee-form v-model="json" class="reference_top" ref="form" :rules="rules">
				<!--<div class="reference  reference_top">
				<p class="required">*</p>
				<p>请假事由</p>
				<input type="text" v-focus="focusState" v-model="json.leave_reason" placeholder="请输入请假事由"/>
			</div>-->
				<bee-form-item prop="name">
					<input-text :name="'请假事由'" :alert="'请输入请假事由'" v-model="json.leave_reason">
					</input-text>
				</bee-form-item>
				<!--<div class="reference">
					<p>待办事项</p>
					<input type="text" v-model="json.backlog" placeholder="请输入未完成的工作" />
					
				</div>-->
				<bee-form-item prop="name">
					<input-text :name="'待办事项'" :alert="'请输入未完成的工作'" v-model="json.backlog">
					</input-text>
				</bee-form-item>
				<div class="leva">
					<assembly_leave v-for="(val,index) in costlists" :costlists="val" @showcost="showcost" @deletss="deletes">

					</assembly_leave>
				</div>
				<p class="addcost" @click="addcost"><i class="ion-ios-plus-outline"></i> 添加请假明细</p>
				<div class="footer">
					<set-flow :name="'审批人'" :viceName="''" v-model="json.userflow.users"></set-flow>
					<set-flow :name="'抄送人'" :viceName="''" v-model="json.userflow.ccs"></set-flow>
				</div>
			</bee-form>
		</scroll>
		<div class="btnsub">
			<ButtonBottom :loading="loading" @call-back="btnsub">提交</ButtonBottom>
		</div>
		<leaves v-if="leaves" :parameters="parameters" @emit-leave="leaveobj"></leaves>
		<!-- <getcommpy v-if="isgetcommpy"  :componparameter="componparameter"   @emit-getcommpys="componyobj"></getcommpy> -->
	</div>
</template>

<script>
	import Vue from 'vue'
	import api from '../../../asset/api.js'
	import utrl from '../../../controller/utrl.js'

	// import {formatDate} from '../../../controller/utrl.js'
	import assembly_leave from './utrl/assembly_leave.vue'
	import '../../establish/commoncss/common.css'
	export default {
		data() {
			return {
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
				titles: "请假单",
				loading: false,
				sp: {
					userflow: {
						"users": []
					}
				},

				indexs: 1,
				// 公司简称
				json: {
					company_name: "",
					company_id: "",
					app_user_name: "",
					app_user_id: "",
					app_date: new Date,
					app_dept_name: "",
					app_dept_id: "",
					backlog: "",
					leave_days_all: 0,
					leave_reason: "",
					hr_askleave_t: [],
					userflow: {
						users: [],
						ccs: []
					},
					attachment: "",
					picture: "",
					bizid: ""
				},
				costlists: [{
					//id:0,
					// 开始时间
					start_date: "",
					// 结束时间
					end_date: "",
					// 请假类型
					holidaytype: "",
					// 请假天数
					leave_days: "",
					// 备注
					details_remarks: ""

				}],
				//一张请假单的请假天数总和

				// 请假类型的组件
				parameters: "",
				leaves: false,
				// isgetcommpy:false,
				// isbackground:false,
				focusState: false,
				isshow: false,

			}
		},
		// 时间
		/*filters: {
	        formatDate(app_date) {
	            var date = new Date(app_date);
	            return formatDate(date, "yyyy-MM-dd");
	        }
	    },*/
		directives: {
			focus: {
				update: function(el, {
					value
				}) {
					if(value) {
						el.focus()
					}
				}
			}
		},
		activated() {

		},
		mounted() {
			this.getlogo();
			this.json.bizid = utrl.setbizid();
			/*this.company_name=JSON.parse(window.sessionStorage.getItem("company_name"))
			this.company_id=JSON.parse(window.sessionStorage.getItem("company_id"))*/
			// this.init();
		},
		methods: {
			back() {
				$router.go(-1);
			},
			addcost() {
				this.indexs++;
				this.costlists.push({
					//id:this.indexs,
					start_date: "",
					// 结束时间
					end_date: "",
					holidaytype: "",
					leave_days: "",
					details_remarks: ""
				})
			},
			deletes(index) {
				this.costlists.splice(index, 1)
			},
			async getlogo() {
				// 用户信息
				let userInfo = api.userInfo;
				this.json.app_user_id = userInfo.id;
				this.json.app_user_name = userInfo.name;

				// // 公司信息
				let mycompanies = utrl.getCompany()
				this.json.company_id = mycompanies.company_id
				this.json.company_name = mycompanies.company_name
			},
			// 请假类型
			hide() {
				this.leaves = false,
					this.isgetcommpy = false
				this.isbackground = false
			},
			showcost(val) {
				this.parameters = val
				this.parameters.holidaytype = val.holidaytype //传给选中的name
				console.log(val)
				this.leaves = !this.leaves
			},
			leaveobj(obj, parameters) {
				this.leaves = !this.leaves
				parameters.holidaytype = obj.name
				// console.log()
			},
			setCompony(obj) {
				this.json.company_id = obj.company_id;
				this.json.company_name = obj.company_name;
				// this.costlists.holidaytypeId = obj.id
				//	sessionStorage.company_id = obj.company_id;
				//以后数据都要为空
				this.costlists = [{
					//id:0,
					start_date: "",
					// 结束时间
					end_date: "",
					holidaytype: "",
					leave_days: "",
					holidaytypeId: "",
					details_remarks: ""
				}]
				this.json.leave_days_all = 0;
				this.json.leave_reason = "";
				this.json.backlog = "";
			},
			/*showcompony(e){
				this.componparameter=e.currentTarget
				// console.log(this.componparameter)
				this.isgetcommpy=!this.isgetcommpy
				this.isbackground=!this.isbackground
			},
			componyobj(obj,componparameter){
				this.isgetcommpy=!this.isgetcommpy
				this.isbackground=!this.isbackground
				// componparameter.value=obj.company_name
				// console.log(componparameter.value);
				this.company_name=obj.company_name
				this.company_id=obj.company_id
				//以后数据都要为空

				this.costlists=[{
					id:0,
					start_date:"",
					end_date:"",
					holidaytype:"",
					leave_days:"",
					details_remarks:""
				}]
				this.leave_reason=""
				this.backlog=""
			},*/

			async btnsub() {
				$loading.show('提交中..')
				//判断数据是否为空
				var isempty = false,
					isnum = true,
					start = false,
					end = false,
					leave = false,
					date = false;
				for(var i = 0; i < this.costlists.length; i++) {
					if(this.costlists[i].holidaytype == "") {
						isempty = true
					}
					if(this.costlists[i].start_date == "") {
						start = true
					}
					if(this.costlists[i].end_date == "") {
						end = true
					}
					if(this.costlists[i].leave_days == "") {
						leave = true
					}
					if(this.costlists[i].start_date > this.costlists[i].end_date) {
						date = true
					}
				}

				if(this.json.leave_reason == "") {
					$toast.show("请输入请假事由", 1000).then(() => {})
					this.focusState = true;
				} else if(isempty == true) {
					$toast.show("请输入请假类型", 1000).then(() => {})
				} else if(start == true) {
					$toast.show("请输入请假开始日期", 1000).then(() => {})
				} else if(end == true) {
					$toast.show("请输入请假结束日期", 1000).then(() => {})
				} else if(leave == true) {
					$toast.show("请输入请假天数", 1000).then(() => {})
				} else if(date == true) {
					$toast.show("开始日期不能小于结束日期", 1000).then(() => {})
				} else {
					this.loading = true;
					this.json.hr_askleave_t = []
					this.json.leave_days_all = 0
					for(var i = 0; i < this.costlists.length; i++) {
						this.costlists[i].rowno = i + 1
						this.costlists[i].OrderIndex = i + 1
						this.json.leave_days_all += parseFloat(this.costlists[i].leave_days);
						this.json.hr_askleave_t.push(this.costlists[i])
					}
					let url = "hraskleaves?token=" + api.token + "&bizid=" + this.json.bizid + "&company_id=" + this.json.company_id;
					// console.log(this.company_id)
					let res = await api.post(url, this.json)
					if(res.status >= 200 && res.status < 300) {
						$toast.show("提交成功", 1000)
						$loading.hide()
						this.$destroy()
						this.json.userflow.users = this.json.userflow.css = [];
						this.$router.push({
							path: '/index'
						})
					} else {
						$loading.hide()
						$toast.show(res.data.errmsg + "，请重试！", 3000)
					}
					this.loading = false;
				}

			}
		},

		components: {
			assembly_leave
		},
		watch: {
			costlists() {
				for(var i = 0; i < this.costlists.length; i++) {
					this.costlists[i].index = i + 1
					if(this.costlists.length == 1) {
						Vue.set(this.costlists[i], "isshow", false)
					} else {
						Vue.set(this.costlists[i], "isshow", true)
					}
				}
			},
			/*company_id(){
				console.log("ioiii")
				console.log(this.costparameter)
			}*/
		}
	}
</script>

<style lang="less" scoped>
	.reference span {
		margin-right: 1.2rem;
	}
	
	.reference .date {
		position: absolute;
		left: 39%;
		opacity: 0;
	}
	
	.footer {
		margin-bottom: 4rem;
		.flow-warp {
			background-color: #fff;
			margin: .75rem 0;
		}
	}
	
	.addcost {
		margin-bottom: 0;
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
</style>