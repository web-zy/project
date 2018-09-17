<template>
	<div class="contents">
		<div class="rei_cost" :key="costlists.id">
			<bee-form v-model="costlists" ref="form" :rules="rules">	
			<div class="reimbursement">
				<p>请假明细<span v-if="costlists.isshow==true">{{costlists.index}}</span></p>
				<button v-if="costlists.isshow==true" @click="deletecost(costlists.index-1)">删除</button>
			</div>
			<bee-form-item prop="name">
				<input-text :name="'请假类型'" :edit=false :alert="'请选择请假类型'" v-model="costlists.holidaytype"
					@click="showcost(costlists)"
				>
				</input-text>
			</bee-form-item>
			<bee-form-item prop="name">
					<input-datepicker :name="'开始日期'" :alert="'请选择开始日期'" v-model="costlists.start_date">
						<!--<i class="ion-chevron-right"></i>-->
					</input-datepicker>
			</bee-form-item>
			<bee-form-item prop="name">
					<input-datepicker :name="'结束日期'" :alert="'请选择结束日期'" v-model="costlists.end_date" @change="changes"></input-datepicker>
			</bee-form-item>
			<bee-form-item prop="name">
				<input-text :name="'请假天数'"  :alert="'请输入请假天数'" v-model="costlists.leave_days"
				>
				</input-text>
			</bee-form-item>
			<bee-form-item>
				<input-text :name="'备注'" :alert="'请输入备注'" v-model="costlists.details_remarks"
				>
				</input-text>
			</bee-form-item>
			</bee-form>
		</div>
	</div>
</template>

<script>
	import '../../../Parts/reference/commoncss/common.css'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return {
				rules:{
					name:{ 
	                    regular:false, 
	                    message: '',
	                    must:true
						}
					}
				}
		},
		props:["costlists"],
		mounted(){
			
		},
		methods:{
			changes(){
				if(this.costlists.start_date!=""){
					let start_date = Date.parse(new Date(this.costlists.start_date))
					let end_date = Date.parse(new Date(this.costlists.end_date))
					if(end_date<start_date){
						$toast.show("结束时间不能小于开始时间", 1000)
						this.costlists.end_date=''
						this.costlists.leave_days=""
					}else{
						this.costlists.leave_days=utrl.dateDiff(start_date,end_date)
					}
				}
			},
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
			showcost(costlists){
				// console.log(costlists)
				this.$emit("showcost",costlists)
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