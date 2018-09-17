<template>
	<div :class="showCompony ? 'zIndex' : ''">
    	<input-text :name="'发票类型'" :edit="false" :alert="'请选择发票类型'" v-model="invoiceObj.type" @click="setCompony">
    		<i class="icon-right ion-ios-arrow-forward"></i>
    	</input-text>
		<div class="absolute" v-if="showCompony">
			<Refinvoicetype
				:invoice="invoiceObj"
				@my-invoice="componyobj">
			</Refinvoicetype>
		</div>
    </div>
	<!-- <item :class="showCompony ? 'zIndex' : ''">
		<div class="info-list" @click="setCompony">
			<label>发票类型</label>
			<span :class="invoiceObj.id ? '' : 'gray'">
				{{invoiceObj.id ? invoiceObj.type : '请选择发票类型'}}
			</span>
		</div>
		<div class="absolute" v-if="showCompony">
			<Refinvoicetype
				:invoice="invoiceObj"
				@my-invoice="componyobj">
			</Refinvoicetype>
		</div>
	</item> -->
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
		mounted(){
		},
		props:['invoiceObj'],
		methods:{
			setCompony(){
				this.showCompony = true
				// this.showBlack()
			},
			componyobj(obj){
				this.showCompony = false
				if(obj == false){
					return
				}
				this.Acompanyid = obj.id
				this.Acompanyname = obj.name
				// company_id
			}
		},
		watch:{
			Acompanyname(){
				this.$emit('give-invoice',{
					company_id:this.Acompanyid,
					company_name:this.Acompanyname
				})
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
	.info-list{
		display: flex;
	    justify-content: space-between;
	    align-items: center;
	    color: #666;
	}
</style>