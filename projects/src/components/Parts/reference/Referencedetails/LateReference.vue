<template>
	<div class="contents">
		<div class="rei_cost">
				<div class="reimbursement">
					 <von-toggle :text="toggleText" v-model="pushNotification"></von-toggle>
				</div>
				<div class="reimbursements">
					<von-toggle :text="latename" v-model="latestrue"></von-toggle>
				</div>
			</div>
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return {
				toggleText:"迟到减分",
				pushNotification:false,
				latename:"迟到一次扣两分",
				latestrue:false,
				company_msg:{
					
				}
			}
		},
		props:['lates'],
		mounted(){
			let company_msg = utrl.getCompany()
			this.company_msg=company_msg
			console.log(987)
			console.log(this.lates)
		},
		methods:{
			
		}
	}
</script>

<style scoped>
	.reference .fuhaos i{
		color:#666;
	}
	.reimbursement{
		width:100%;
		height:2.3rem;
		background:#fafafa;
		display:flex;
		align-items: center;
		justify-content: space-between;
		font-size:1rem;
		border-bottom:1px solid #eee;
		box-sizing: border-box;
	}
	.item{
		width:100%;
		height:100%;
	}
	.reimbursement .item{
		background:#fafafa;
	}
	.reimbursements .item{
		background:#fff;
	}
	
	
</style>