<template>
	<div class="newOrder outOf">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			<span slot="title">{{title}}</span>
			<!-- <div class="button button-icon companyname" slot="right" @click.stop="setCompony">{{company_name}}</div> -->
			<div class="button button-icon" slot="right">
				<ChoiceCompany :getcommpyObj="{id:commitData.company_id,type:commitData.company_name}" :guard="true" @give-company="setCompony"></ChoiceCompany>
			</div>
		</von-header>
		<tab-item :tabArr="tabs" v-model="tabDefault" @clickIndex="onTabClick"></tab-item>
		<div class="content">
			<!--<list class="list-ios" v-show="tabIndex == 'basic'">-->
			<bee-form v-show="tabIndex == 'basic'" ref="form" :rules="rules">
				<!-- 部门 -->
				<bee-form-item prop="dept">
					<Choicedepar :clientObj="{id:commitData.dept_id,type:commitData.dept_name}" @give-dept="setDeptid"></Choicedepar>
				</bee-form-item>
				<!-- 业务员 -->
				<bee-form-item prop="saleman">
					<Choicesalesman :clientObj="{id:commitData.saleman_id,type:commitData.saleman_name}" :radio="1" :name="'业务员'" :alert="'请选择业务员'" @give-salesman="setSalesman"></Choicesalesman>
				</bee-form-item>
				<!--交货日期-->
				<bee-form-item prop="deliveryDate">
					<input-datepicker :name="'交货日期'" :alert="'请选择交货日期'" v-model="commitData.plan_delivery_date"></input-datepicker>
				</bee-form-item>
				<!-- 客户 -->
				<bee-form-item prop="customer">
					<Choiceclient :clientObj="{id:commitData.customer_id,type:commitData.customer_abb_name}" @give-client="setClient"></Choiceclient>
				</bee-form-item>
				<bee-form-item prop="contact_name">
					<input-text :name="'联系人'" :alert="'请输入联系人'" v-model="commitData.contact_name"></input-text>
				</bee-form-item>
				<bee-form-item prop="contact_phone">
					<input-text :name="'联系人电话'" :alert="'联系人电话'" v-model="commitData.contact_phone"></input-text>
				</bee-form-item>
				<bee-form-item prop="delivery_address">
					<input-text :name="'发货地址'" :alert="'请输入发货地址'" v-model="commitData.delivery_address"></input-text>
				</bee-form-item>
				<!-- 发票 -->
				<bee-form-item prop="invoice">
					<Choiceinvoice :invoiceObj="{id:commitData.invoice_type_id,type:commitData.invoice_type}" @give-invoice="setInvoice"></Choiceinvoice>
				</bee-form-item>
				<!-- 仓库 -->
				<bee-form-item prop="warehouse">
					<Choicehouse :houseObj="{id:commitData.warehouse_id,type:commitData.warehouse_name}" @give-house="setHouse"></Choicehouse>
				</bee-form-item>
				<input-text :name="'备注'" :alert="'请输入备注'" v-model="commitData.remarks"></input-text>
			</bee-form>
			<!--</list>-->
			<div class="shopDetailed" v-show="tabIndex == 'detailed'">
				<scroll style="top:0;">
					<div class="detailed-list" v-for="(val,index) in commitData.details" :key="index">
						<div class="brief-warp" @click="showDetailed(index)">
							<div class="detailed-head">商品</div>
							<div class="detailed-info">
								<span>{{val.product_name}} {{val.specification_type}} </span>
								<span>{{val.qty}}{{val.unit_name}} ¥{{val.real_amt}}</span>
							</div>
							<div class="rightBtn button-icon ion-edit" style="right:2.5rem;font-size:0.8rem;"></div>
							<div class="rightBtn button-icon ion-trash-a" @click.stop="deleteThis(index)"></div>
							<!-- <div class="rightBtn button-icon " :class="val.showDrop ? 'ion-ios-arrow-down' : 'ion-ios-arrow-up'"></div> -->
						</div>
						<div class="drop-down list-ios" id="drop-down1" :class="val.showDrop ? 'show-this' : 'hide-this'">
							<input-text :name="'产品名称'" :edit="false" :alert="'暂无产品名称'" v-model="val.product_name"></input-text>
							<input-text :name="'规格型号'" :edit="false" v-model="val.specification_type"></input-text>
							<!-- 仓库 -->
							<Choicehouse :houseObj="{id:val.warehouse_id,type:val.warehouse_name}" :index="index + 1" @give-house="setHouse"></Choicehouse>
							<input-radio :name="'赠品'" :alert="'是否赠品'" :chioseData="[{name:'是',data:1},{name:'否',data:0}]" v-model="val.is_free_gifts"></input-radio>
							<input-number :name="'数量'" :alert="'请输入数量'" v-model="val.qty" @change="changeDiscount(val.qty,index)"></input-number>
							<input-text :name="'包装规格'" :edit="false" v-model="val.packing_unit"></input-text>
							<input-text :name="'单价'" :edit="false" v-model="val.price"></input-text>
							<input-text :name="'金额'" :edit="false" v-model="val.amt"></input-text>
							<input-number :name="'折扣(%)'" max="100" min="0" :alert="'请输入折扣比例'" v-model="val.discount" @change="changeDiscount(val.qty,index)"></input-number>
							<input-text :name="'折扣额'" :edit="false" v-model="val.discount_amt"></input-text>
							<input-text :name="'结算金额'" :edit="false" v-model="val.real_amt"></input-text>
							<input-text :name="'备注'" :alert="'请输入备注'" v-model="val.remarks"></input-text>
						</div>
					</div>
					<!-- <div class="addDetailed ion-plus-round" @click="addDetailed">添加商品</div> -->
					<p class="addDetailed" @click="addDetailed"><i class="ion-ios-plus-outline"></i> 添加商品</p>
				</scroll>
			</div>
			<ButtonBottom :loading="loading" @call-back="submit('form')">提交</ButtonBottom>
		</div>
	</div>
</template>

<script>
	import api from './../../../asset/api.js'
	import utrl from './../../../controller/utrl.js'
	export default {
		data() {
			return {
				title: "创建客户订单",
				tabs: [{
						name: "基本信息",
						id: "basic"
					},
					{
						name: "商品明细",
						id: "detailed"
					}
				],
				tabDefault: 0,
				tabIndex: "basic",
				company_name: "",
				companyArr: [],
				commitData: {
					"company_id": "", //公司ID
					"company_name": "", //公司名称
					"app_user_id": api.userInfo.id, //申请人ID
					"app_user_name": api.userInfo.name, //申请人姓名
					"plan_delivery_date": "", //交货日期
					"customer_id": "", //客户ID
					"customer_abb_name": "", //客户简称
					"contact_name": "", //联系人
					"contact_phone": "", //联系电话
					"delivery_address": "", //发货详细地址
					"invoice_type": '', //发票类型
					'invoice_type_id': "", //发票类型ID
					"warehouse_name": "", //仓库
					"warehouse_id": "", //仓库ID
					"remarks": "", //备注
					"dept_id": "", //部门ID
					"dept_name": "", //部门名称
					"saleman_id": "", //业务员ID
					"saleman_name": "", //业务员姓名
					"total_qty": "1", //数量合计
					"total_amt": "1.00", //总金额
					"total_discount_amt": "0", //折扣金额
					"total_real_amt": "1.00", //折扣后总金额
					"details": []
				},
				clearData: {},
				rules: {
					dept: {
						must: true,
						message: '请选择部门！'
					},
					saleman: {
						must: true,
						message: "请选择业务员！"
					},
					deliveryDate: {
						must: true,
						message: "请选择交货日期！"
					},
					customer: {
						must: true,
						message: "请选择客户！"
					},
					contact_name: {
						must: false,
						message: "请输入联系人！"
					},
					contact_phone: {
						must: false,
						message: "请输入联系人电话！"
					},
					delivery_address: {
						must: false,
						message: "请输入发货地址！"
					},
					invoice: {
						must: false,
						message: "请选择发票类型！"
					},
					warehouse: {
						must: false,
						message: "请选择仓库！"
					}
				},
				loading: false,
				modal: null
			}
		},
		created() {
			// let tmp = this.clearData
			// this.commitData = tmp;
		},
		mounted() {
			this.bizid = utrl.setbizid();
		},
		methods: {
			setGoods() {
				if(!window.sessionStorage.selectGoods) {
					return
				}
				let arr = JSON.parse(sessionStorage.selectGoods);
				for(let i in arr) {
					arr[i].packing_unit = (arr[i].qty + arr[i].unit_name) + (arr[i].packing_unit ? "/" + arr[i].packing_unit : '');
					arr[i].amt = (arr[i].price * Number(arr[i].qty)).toFixed(2);
					arr[i].discount = "";
					arr[i].discount_amt = 0;
					arr[i].real_amt = arr[i].amt;
				}
				this.commitData.details = this.commitData.details.concat(arr);
				sessionStorage.selectGoods = "";
			},
			// 删除商品
			deleteThis(index) {
				let _this = this;
				$dialog.confirm({
					theme: 'ios',
					title: '确认删除该商品吗?',
					cancelText: '取消',
					okText: '删除'
				}).then((res) => {
					if(res) {
						_this.commitData.details.splice(index, 1)
					}
				})
			},
			// 选择部门
			setDeptid(obj) {
				this.commitData.dept_id = obj.id;
				this.commitData.dept_name = obj.name;
			},
			// 选择业务员
			setSalesman(obj) {
				this.commitData.saleman_id = obj[0].user_id;
				this.commitData.saleman_name = obj[0].user_name;
			},
			// 价格计算
			changeDiscount(val, index) {
				let data = this.commitData.details[index]
				data.amt = (data.price * data.qty).toFixed(2);
				data.discount_amt = (data.discount / 100 * (data.price * data.qty)).toFixed(2)
				data.real_amt = (data.amt - data.discount_amt).toFixed(2)
				this.commitData.details[index] = data
			},
			// 设置公司
			setCompony(obj) {
				this.clearCommitData()
				this.commitData.company_id = obj.company_id
				this.commitData.company_name = obj.company_name
				sessionStorage.company_id = obj.company_id
			},
			// 设置发票
			setInvoice(obj) {
				this.commitData.invoice_type_id = obj.company_id
				this.commitData.invoice_type = obj.company_name
			},
			// 设置客户及联系人
			setClient(obj) {
				this.commitData.customer_id = obj.id
				this.commitData.customer_abb_name = obj.name
				this.commitData.contact_name = obj.contact_name
				this.commitData.contact_phone = obj.phone
				this.commitData.delivery_address = obj.delivery_address
			},
			// 设置仓库
			setHouse(obj) {
				if(obj.index) {
					let index = obj.index - 1
					this.commitData.details[index].warehouse_id = obj.company_id
					this.commitData.details[index].warehouse_name = obj.company_name
					return
				}
				this.commitData.warehouse_id = obj.company_id
				this.commitData.warehouse_name = obj.company_name
			},
			// 添加商品
			addDetailed() {
				$router.push({
					name: "productref"
				})
			},
			nonEmpty() {
				let data = this.commitData;
				if(data.dept_id == '' || data.saleman_id == '' || data.plan_delivery_date == '' || data.contact_name == '' || data.contact_phone == '' || data.delivery_address == '' || data.invoice_type_id == '' || data.warehouse_id == '' || data.details.length == 0) {
					return false
				}
				return true
			},
			clearCommitData() {
				for(let i in this.commitData) {
					if(i == 'details') {
						this.commitData[i] = []
						continue;
					} else if(i == 'company_id' || i == 'company_name' || i == 'app_user_id' || i == 'app_user_name') {
						continue;
					} else {
						this.commitData[i] = '';
					}
				}
				this.tabIndex = 'basic';
				this.tabDefault = 0;
				return
			},
			// 提交
			async submit(formName) {
				let _this = this;
				this.loading = true;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.goAjax(function() {
							_this.loading = false
							_this.clearCommitData()
							$router.go(-1)
						})
					} else {
						_this.loading = false
					}
				})
			},
			async goAjax(callBack) {
				let _this = this;
				$loading.show('请稍等..')
				let qty = 0,
					amt = 0,
					discount_amt = 0,
					real_amt = 0;
				for(let i in this.commitData.details) {
					qty += Number(this.commitData.details[i].qty);
					amt += Number(this.commitData.details[i].amt);
					discount_amt += Number(this.commitData.details[i].discount_amt);
					real_amt += Number(this.commitData.details[i].real_amt)
				}
				// return
				this.commitData.total_qty = qty.toFixed(2);
				this.commitData.total_amt = amt.toFixed(2);
				this.commitData.total_discount_amt = discount_amt.toFixed(2);
				this.commitData.total_real_amt = real_amt.toFixed(2);
				let url = 'saleorders?token=' + api.token + "&bizid=" + this.bizid + "&company_id=" + this.commitData.company_id
				let res = await api.post(url, this.commitData)
				$loading.hide()
				if(res.status >= 200 && res.status < 300) {
					$dialog.alert({
						theme: "ios",
						effect: 'default',
						title: '提示',
						content: '提交成功',
						okText: '确定'
					}).then(function() {
						$loading.hide()
						callBack()
					})
				} else {
					$dialog.alert({
						theme: "ios",
						effect: 'default',
						title: '无法提交',
						content: '无法提交数据，因为数据不正确',
						okText: '确定'
					}).then(() => {
						$loading.hide()
						callBack()
					})
				}
			},
			// 选择赠品
			giftsClick(index) {
				$actionSheet.show({
					theme: 'ios',
					title: '是否赠送赠品',
					buttons: {
						// 操作列表选项文字及回调函数
						'是': () => {
							this.commitData.details[index].is_free_gifts = 1;
						},

						'否': () => {
							this.commitData.details[index].is_free_gifts = 0
						}
					}
				})
			},
			// 详细信息展示
			showDetailed(index) {
				//details
				for(let i in this.commitData.details) {
					if(i == index) {
						continue
					}
					this.commitData.details[i].showDrop = 0
				}
				this.commitData.details[index].showDrop = this.commitData.details[index].showDrop == 0 ? 1 : 0
			},
			onTabClick(index) {
				this.tabIndex = index
			},
			back() {
				$router.go(-1)
			}
		},
		watch: {},
		components: {

		},
		activated() {
			this.setGoods()
		},
		deactivated() {},
		destroyed() {}
	}
</script>

<style rel="stylesheet/less" scoped>
	/* @import "./utrl/NewOrder.less" */
</style>
