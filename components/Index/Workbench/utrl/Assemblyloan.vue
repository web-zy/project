<template>
	<div class="contents">
		<div class="rei_cost" :key="costlists.id">
				<div class="reimbursement">
					<p>结算方式<span v-if="costlists.isshow==true">{{costlists.index}}</span></p>
				<button v-if="costlists.isshow==true" @click="deletecost(costlists.index-1)">删除</button>
				</div>
				<div class="reference reference_cost">
					<p class="required">*</p>
					<p>结算方式</p>
					<!-- <input type="text" v-model="costlists.settle_name" placeholder="请输入结算方式"  disabled="false"/> -->
					<input type="text" placeholder="请选择结算方式" v-model="costlists.settle_name" value="" @click.stop="showloan(costlists)"  style="background:transparent" readonly="readonly"/>
					<p class="fuhao"><i class="ion-chevron-right"></i></p>
				</div>
				<div class="reference reference_cost">
					<p class="required">*</p>
					<p>结算金额</p>
						<input type="text" v-model="costlists.settle_amt" placeholder="请输入结算金额" />
				</div>
				<div class="reference reference_cost">
					<p>收款人开户省</p>
					<input type="text" v-model="costlists.province_name" placeholder="请输入收款人开户省" />
				</div>
				<div class="reference reference_cost">
					<p>收款人开户市</p>
						<input type="text" v-model="costlists.city_name" placeholder="请输入收款人开户市" />
				</div>
				<div class="reference reference_cost">
					<p>收款人</p>
					<input type="text" v-model="costlists.payee_account_name"  placeholder="请输入收款人名称" />
				</div>
				<div class="reference reference_cost">
					<p>收款人开户行</p>
					<input type="text" v-model="costlists.payee_account_bank" placeholder="请输入收款人开户行" />
				</div>
				<div class="reference reference_cost">
					<p>收款人账号</p>
					<input type="text" v-model="costlists.payee_account_code"  placeholder="请输入收款人账号" />
				</div>
			</div>
	</div>
</template>

<script>
	import '../../../Parts/reference/commoncss/common.css'
	export default{
		data(){
			return {
				
			}
		},
		props:["costlists"],
		mounted(){

		},
		methods:{
			deletecost(index){
				$dialog.confirm({
					theme: 'ios',
					title: '确认删除吗?',
					cancelText: '取消',
					okText: '确定'
				}).then((res) => {
				    if(res==true){
				  	   this.$emit("deletss",index)
				    }
				})
			},
			showloan(costlists){
				// console.log(costlists)
				this.$emit("showloan",costlists)
			}
		}
	}
</script>

<style  lang="less" scoped>
.reference .date{
		position: absolute;
    	left: 39%;
    	opacity: 0;
	}
</style>