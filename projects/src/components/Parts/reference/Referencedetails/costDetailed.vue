<template>
	<div class="contents">
		<bee-form v-model="costlists" ref="form" :rules="rules">
			<div class="rei_cost" :key="costlists.costtitle.id">
				<div class="reimbursement">
					<p>{{costlists.costtitle.costname}} <span v-if="costlists.arrcost.isshow==true">{{costlists.arrcost.index}}</span></p>
					<button v-if="costlists.arrcost.isshow==true" @click="deletecost(costlists.arrcost.index-1)">删除</button>
				</div>
				<div class="reference reference_cost">
					<p class="required">*</p>
					<p>{{costlists.costtitle.expense_class_detail_name}}</p>
					<input type="text" class="costinput" placeholder="请选择" v-model="costlists.arrcost.expense_class_detail_name" @click.stop="showcost(costlists.arrcost)" style="background:transparent" readonly="readonly" />
					<p class="fuhao fuhaos"><i class="ion-ios-arrow-forward"></i></p>
				</div>
				<!--<bee-form-item prop="name">
					<input-text :name="costlists.costtitle.expense_class_detail_name" :edit=false :alert="'请输入'" v-model="costlists.arrcost.expense_class_detail_name"
					 @click="showcost(costlists.arrcost)"
					>
					</input-text>
				</bee-form-item>-->
				<bee-form-item prop="name">
					<input-text :name="costlists.costtitle.actual_use" :edit=false :alert="'请输入'" v-model="costlists.arrcost.actual_use">
					</input-text>
				</bee-form-item>
				<bee-form-item prop="name">
					<input-text :name="costlists.costtitle.amt" :edit=false :alert="'请输入'" v-model="costlists.arrcost.amt">
					</input-text>
				</bee-form-item>
				<bee-form-item>
					<input-text :name="costlists.costtitle.remarks" :edit=false :alert="'请输入'" v-model="costlists.arrcost.remarks">
					</input-text>
				</bee-form-item>
			</div>
		</bee-form>
	</div>
</template>

<script>
	import '../commoncss/common.css'
	export default {
		data() {
			return {
				rules: {
					name: {
						regular: false,
						message: '名称长度在 3 到 5 个字符',
						must: true
					},
					age: {
						regular: "^(?:0|[1-9][0-9]?|100)$",
						message: '请输入 0 - 100 之间的数字',
						must: true
					},
					email: {
						regular: "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$",
						message: "请输入正确的邮箱格式",
						must: false
					}
				}
			}
		},
		props: ["costlists"],
		mounted() {

		},
		methods: {
			deletecost(index) {
				//	this.costlists.splice(index,1)
				$dialog.confirm({
					theme: 'ios',
					title: '确认删除吗?',
					cancelText: '取消',
					okText: '确定'
				}).then((res) => {
					if(res == true) {
						//	this.costlists.splice(index,1)
						this.$emit("deletss", index)
						//var ss=document.getElementsByClassName("contents")[0]
						//ss.style.transition="height 2s"
					}
				})
			},
			showcost(costlists) {
				this.$emit("showcost", costlists)
			}
		}
	}
</script>

<style scoped>
	.reference .fuhaos i {
		color: #666;
	}
</style>