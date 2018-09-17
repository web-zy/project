<template>
	<div id="contents" @click="hide">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
			<span slot="title">{{titles}}</span>
			<div class="button button-icon  companyname" slot="right">
				<ChoiceCompany @give-company="setCompony"></ChoiceCompany>
			</div>
		</von-header>
		<div class="scrollout" style="overflow-y: scroll;" ref="Approver">
			<bee-form v-model="json" class="reference_top" ref="form" :rules="rules">
				<bee-form-item prop="name">
					<input-text :name="'费用承担人'" :edit=false :alert="'请选择'" v-model="json.exp_people_name" @click="chosePerson1">
					</input-text>
				</bee-form-item>
				<bee-form-item prop="name">
					<input-text :name="'费用承担部门'" :edit=false :alert="'请选择'" v-model="json.exp_dept_name" @click="chosedepartment">
					</input-text>
				</bee-form-item>
				<div class="kkjk">
					<costDetailed v-for="(val,index) in costlists" :costlists="val" @showcost="showcosts" @deletss="deletes"></costDetailed>
				</div>
				<p class="addcost addcosts" @click="addcost"><i class="ion-ios-plus-outline"></i> 添加费用明细</p>
				<picfile @getpiclist="pictures" :piclist="piclist"></picfile>
				<Uploadfile @getattachment="nowattachment" :filelist="filelist"></Uploadfile>
				<div  @click="getscrolltop">
					<bee-form-item>
						<set-flow @gettop="gettops" :name="'审批人'" :viceName="''" v-model="json.userflow.users"></set-flow>
					</bee-form-item>
					<bee-form-item>
						<set-flow :name="'抄送人'" :viceName="''" v-model="json.userflow.ccs"></set-flow>
					</bee-form-item>
				</div>

			</bee-form>

		</div>

		<div class="btnsub" v-if="!cost">
			<ButtonBottom :loading="loading" @call-back="btnsub">提交</ButtonBottom>
		</div>
		<preview v-show="picshow" :picdetails="picdetails" @picturhide="pichide"></preview>
		<cost v-if="cost" :costparameter="costparameter" @emit-cost="costobj"></cost>
		<!-- costparameter -->
	</div>
</template>

<script>
	import Vue from 'vue'
	import Vonic from "vonic"
	import api from '../../../asset/api.js'
	import utrl from '../../../controller/utrl.js'
	import '../../establish/commoncss/common.css'
	import '../../Parts/reference/Referencedetails/utrl/spark-md5.min.js'
	export default {
		data() {
			return {
				titles: "费用报销",
				indexs: 1,
				cost: false,
				isbackground: false,
				isgetcommpy: false,
				loading:false,
				filelist: [],
				piclist: [],
				offsettops:"",
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
				costparameter: {
					costparameter: {},
					company_id: "",
					detail_id: ""
				},
				picshow: false,
				picdetails: "",
				ce_cost_expense_details_t: [
					//费用明细

				],
				costlists: [{
					arrcost: {
						actual_use: "",
						amt: "",
						expense_class_detail_id: "",
						expense_class_detail_name: "",
						remarks: ""
					},
					costtitle: {
						id: 0,
						costname: "费用明细",
						actual_use: "实际用途",
						expense_class_detail_name: "费用类别",
						amt: "报销金额",
						remarks: "备注"
					}
				}],
				bizid: "",
				isshow: false,
				company_msg: {

				},
				User_Id: "",
				json: {
					flow_bizid: "",
					userflow: {
						users: [],
						ccs: []
					},
					picture: "",
					attachment: "",
					details: [],
					exp_dept_id: "",
					exp_dept_name: "",
					total_amt: 0,
					remarks: "",
					title: "",
					exp_dept_varattribute: "",
					exp_people_id: "",
					exp_people_name: "",
					company_id: "",
					app_user_name: "",
					app_user_id: "",
					company_name: "",
				}
			}
		},
		mounted() {
			
		},
		activated() {
			if(this.offsettops!=""){
				this.$refs.Approver.scrollTop=this.offsettops
				this.offsettops=""
			}
			this.picshow = false
			this.json.app_user_id = api.userInfo.id
			this.json.app_user_name = api.userInfo.name
			this.bizid = utrl.setbizid();
			this.json.flow_bizid = this.bizid
			let personData1 = JSON.parse(sessionStorage.getItem('selectPerson'))
			// let personData1 = JSON.parse(localStorage.getItem('selectPerson'));
			if(personData1 !== null) {
				this.User_Id = ""
				if(personData1.length==0){
					this.User_Id = "empty"
				}else{
					var arr=[]
					for(var j=0;j<personData1.length;j++){
						arr.push(personData1[j].user_id)
					}
					this.User_Id=arr
				}
				this.json.exp_people_name = personData1[0].user_name
				this.User_Id = personData1[0].user_id
				this.json.exp_people_id = personData1[0].user_id
				this.getdepartment()
				sessionStorage.removeItem("selectPerson")
			} else {
				this.User_Id = ""
			}
			//选择后部门返回信息 data

			let departData = JSON.parse(sessionStorage.getItem('department'));
			if(departData !== null) {
				this.json.exp_dept_name = departData.OUName;
				this.json.exp_dept_id = departData.id
				this.json.exp_dept_varattribute = departData.attribute_name
				sessionStorage.removeItem("department")
				localStorage.removeItem('selectPerson')
			}

			//选择人员后返回信息data 注：单选返回{}，多选返回[];
			//let personData1 = JSON.parse(sessionStorage.getItem('radioselect'));

			//          if(personData1 !== null){
			//              this.exp_people_name = personData1.user_name;
			//               this.exp_people_id = personData1.User_Id;
			//              sessionStorage.removeItem("radioselect")
			//          }
			//			Vonic.app.setConfig("beforeLeave", (to, from, next) => {
			//			  if(this.isbackground || this.isgetcommpy){
			//		 		 this.isbackground=false
			//				 this.isgetcommpy=false
			//				 this.cost=false
			//		 		 next(false)
			//		 		 return
			//		 	}else{
			//	 			next()
			//		 	}
			//			})
		},
		// beforeRouteLeave(to, from, next){
		//  	if(this.isbackground || this.isgetcommpy){
		//  		 this.isbackground=false
		// 		 this.isgetcommpy=false
		// 		 this.cost=false
		//  		 next(false)
		//  		 return
		//  	}else{
		// 			next()
		//  	}
		//  	// next(false)
		// },
		components: {
//          if(personData1 !== null){
//              this.exp_people_name = personData1.user_name;
//               this.exp_people_id = personData1.user_id;
//              sessionStorage.removeItem("radioselect")
//          }
//			Vonic.app.setConfig("beforeLeave", (to, from, next) => {
//			  if(this.isbackground || this.isgetcommpy){
//		 		 this.isbackground=false
//				 this.isgetcommpy=false
//				 this.cost=false
//		 		 next(false)
//		 		 return
//		 	}else{
//	 			next()
//		 	}
//			})
      },
		methods: {
			getscrolltop() {
				this.offsettops=this.$refs.Approver.scrollTop
			},
			gettops() {
				//this.$refs.Approver.scrollTop="120px"

			},
			nowattachment(val) {
				this.json.attachment = val
			},
			pictures(val) {
				this.json.picture = val
			},
			//tupian隐藏
			pichide() {
				this.picshow = false
			},
			hide() {
				this.cost = false
				this.isbackground = false
				this.isgetcommpy = false
			},
			//获取默认部门
			async getdepartment() {
				let url = "oumembers/depts?token=" + api.token + "&company_id=" + this.company_msg.company_id + "&filter=id=" + this.json.exp_people_id
				let res = await api.get(url)
				if(res.status >= 200 && res.status < 300) {
					if(res.status == 204) return;
					let data = res.data[0]
					this.json.exp_dept_name = data.dept_name
					this.json.exp_dept_id = data.dept_id
				} else {
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
			},
			chosedepartment() {
				sessionStorage.setItem('company_msg', JSON.stringify(this.company_msg));
				this.$router.push("/chooseDepartment");
				//回到本页面获取数据执行JSON.parse(sessionStorage.getItem('department'));
			},
			chosePerson1() {
				// sessionStorage.setItem('company_msg',JSON.stringify(this.company_msg));
				//this.$router.push("/chooseExecutive");
				console.log(this.User_Id);
				this.$router.push({
					name: "chooseCharges",
					params: {
						id: 1,
						name: "费用报销",
						user_id: this.User_Id
					}
				});
				//回到本页面获取数据执行JSON.parse(sessionStorage.getItem('radioselect'));
			},
			showcosts(val) {
				this.costparameter.detail_id = val.expense_class_detail_name
				this.costparameter.costparameter = val
				this.cost=!this.cost
				//this.isbackground = !this.isbackground
				//history.pushState(null, null, document.URL);
				//window.addEventListener("popstate", this.returnKey, false);
				console.log(this.cost)
			},
			returnKey() {
				this.cost = false;
				window.removeEventListener("popstate", this.returnKey, false);
			},
			costobj(obj, costparameter) {
				this.cost = !this.cost
				this.isbackground = false
				costparameter.expense_class_detail_name = obj.name
				costparameter.expense_class_detail_id = obj.id
			},
			setCompony(obj) {
				this.company_msg = obj
				this.json.company_name = obj.company_name
				this.json.company_id = obj.company_id
				Vue.set(this.costparameter, "company_id", obj.company_id)
				this.company_msg = obj
				this.json.exp_people_name = ""
				this.json.exp_dept_name = ""
				this.json.exp_people_id = ""
				this.json.exp_dept_id = ""
				this.costlists = [{
					arrcost: {
						actual_use: "",
						amt: "",
						expense_class_detail_name: "",
						remarks: ""
					},
					costtitle: {
						id: 0,
						costname: "费用明细",
						actual_use: "实际用途",
						expense_class_detail_name: "费用类别",
						amt: "报销金额",
						remarks: "备注"
					}
				}]
				//this.exp_people_name=""
				//this.title=""
				//this.remarks=""
				//this.exp_dept_name=""
			},
			back: function() {
				//this.$destroy()
				$router.go(-1)
			},
			addcost() {
				this.indexs++
					this.costlists.push({
						arrcost: {
							actual_use: "",
							amt: "",
							expense_class_detail_name: "",
							remarks: ""
						},
						costtitle: {
							id: this.indexs,
							costname: "费用明细",
							actual_use: "实际用途",
							expense_class_detail_name: "费用类别",
							amt: "报销金额",
							remarks: "备注"
						}
					})
			},


			async btnsub() {
				//判断数据是否为空
				var isempty = false;
				var isnum = true;
				var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
				for(var i = 0; i < this.costlists.length; i++) {
					//this.costlists[i].amt=parseFloat(this.costlists[i].amt)
					if(this.costlists[i].arrcost.expense_class_detail_name == "" || this.costlists[i].arrcost.actual_use == "" || this.costlists[i].arrcost.amt == "") {
						isempty = true
					}
					if(!reg.test(this.costlists[i].arrcost.amt)) {
						//console.log(this.costlists[i].arrcost.amt);
						isnum = false
					}
				}
				var rei_cost = document.getElementsByClassName("rei_cost");
				//console.log(rei_cost.length)
				if(this.json.exp_dept_name == "") {
					$toast.show("费用承担部门不能为空", 1000).then(() => {})

				} else if(this.json.exp_people_name == "") {
					$toast.show("费用承担人不能为空", 1000).then(() => {})
				} else if(isempty == true) {
					for(let i = 0; i < rei_cost.length; i++) {
						let costinp = rei_cost[i].getElementsByTagName("input")
						for(let j = 0; j < costinp.length - 1; j++) {
							if(costinp[j].value == "") {
								if(j == 0) {
									$toast.show("费用明细不能为空", 1000).then(() => {})
								} else if(j == 1) {
									$toast.show("实际用途不能为空", 1000).then(() => {})
								} else if(j == 2) {
									$toast.show("报销金额不能为空", 1000).then(() => {})
								}
								costinp[j].focus()
								return
							}
						}
					}
					//for(var )
				} else if(isnum == false) {
					$toast.show("金额必须是数字或保留两位小数", 1000).then(() => {})
				} else {
					this.loading = true;
					$loading.show('提交中..')
					this.ce_cost_expense_details_t = []
					this.json.total_amt = 0
					for(var i = 0; i < this.costlists.length; i++) {
						this.costlists[i].arrcost.rowno = i + 1
						this.costlists[i].arrcost.OrderIndex = i + 1
						this.costlists[i].arrcost.exp_dept_name = this.json.exp_dept_name
						this.costlists[i].arrcost.exp_dept_id = this.json.exp_dept_id
						this.costlists[i].arrcost.exp_people_name = this.json.exp_people_name
						this.costlists[i].arrcost.exp_people_id = this.json.exp_people_id
						this.ce_cost_expense_details_t.push(this.costlists[i].arrcost)
						this.json.total_amt = this.json.total_amt + this.costlists[i].arrcost.amt
					}
					let url = "costexpenses?token=" + api.token + "&bizid=" + this.bizid
					this.json.details = this.ce_cost_expense_details_t
					let res = await api.post(url, this.json)
					//console.log(this.ce_cost_expense_details_t)
					if(res.status >= 200 && res.status < 300) {
						$toast.show("提交成功", 1000)
						$loading.hide()
						sessionStorage.removeItem("selectPerson")
						this.json = {
							flow_bizid: "",
							userflow: {
								users: [],
								ccs: []
							},
							picture: "",
							attachment: "",
							details: [],
							exp_dept_id: "",
							exp_dept_name: "",
							total_amt: 0,
							remarks: "",
							title: "",
							exp_dept_varattribute: "",
							exp_people_id: "",
							exp_people_name: "",
							company_id: "",
							app_user_name: "",
							app_user_id: "",
							company_name: ""
						}
						this.piclist = []
						this.filelist = []
						this.ce_cost_expense_details_t = []
						this.costlists = [{
							arrcost: {
								actual_use: "",
								amt: "",
								expense_class_detail_id: "",
								expense_class_detail_name: "",
								remarks: ""
							},
							costtitle: {
								id: 0,
								costname: "费用明细",
								actual_use: "实际用途",
								expense_class_detail_name: "费用类别",
								amt: "报销金额",
								remarks: "备注"
							}
						}]
						this.$router.push({
							path:"/index"
						})
					} else {
						$loading.hide()
						$toast.show(res.data.errmsg + "，请重试！", 3000)
						return
					}
					this.loading = false;
				}

			},
			deletes(index) {
				this.costlists.splice(index, 1)
			},
			showcompony() {
				this.isbackground = !this.isbackground
				this.isgetcommpy = !this.isgetcommpy
			},

		},
		watch: {
			costlists() {
				for(var i = 0; i < this.costlists.length; i++) {
					this.costlists[i].arrcost.index = i + 1
					if(this.costlists.length == 1) {
						Vue.set(this.costlists[i].arrcost, "isshow", false)
					} else {
						Vue.set(this.costlists[i].arrcost, "isshow", true)
					}
				}
			}

		}

	}
</script>

<style scoped>
	.scrollout {
		position: relative;
		width: 100%;
		height: 93vh;
	}
	
	.scroll {
		top: 0;
	}
</style>
