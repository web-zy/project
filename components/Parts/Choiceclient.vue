<template>
    <div>
    	<input-text :name="'客户'" :edit="false" :alert="'请选择客户'" v-model="clientObj.type" @click="setCompony(clientObj)">
    		<i class="icon-right ion-ios-arrow-forward"></i>
    	</input-text>
    </div>
	<!--<item :class="showCompony ? 'zIndex' : ''">
		<div class="info-list">
			<label>客户</label>
			<span :class="clientObj.id ? '' : 'gray'" @click="setCompony">
				{{clientObj.id ? clientObj.type : '请选择客户'}}
			</span>
		</div>
	</item>-->
</template>

<script>
import api from "./../../asset/api.js"
	export default{
		data(){
			return{
				showCompony:false,
				companyArr:[],
				Acompanyname:"",
				Acompanyid:""
			}
		},
		activated(){
			if(window.sessionStorage.Customer != null && window.sessionStorage.Customer != ""){
				let Customer = JSON.parse(window.sessionStorage.Customer)
				let obj = {
					id:Customer.id,
					name:Customer.abb_name,
					contact_name:Customer.contact_name,
					phone:Customer.phone,
					delivery_address:Customer.delivery_address
				}
				sessionStorage.removeItem("Customer")
				this.giveData(obj)
			}
		},
		mounted(){

		},
		props:['clientObj'],
		methods:{
			setCompony(val){
				// this.showCompony = true
				// this.showBlack()
				
				this.$router.push({name:"Crmcustomer",params:{
					val:val
				}})
			},
			giveData(obj){
				this.$emit('give-client',obj)
			}
		}
	}
</script>

<style lang="less" scoped>
	.absolute{
		position: fixed;
		z-index:99;
		top:0;
		left:0;
		bottom:0;
		right: 0;
	}
	.zIndex{
		z-index:44;
	}
</style>