<template>
	<div class="button button-icon " @click="setCompony">
		<div :class="['companyname', special ? 'special' : '']">{{Acompanyname}} <i v-if="special" class="ion-ios-arrow-down"></i></div>
		<Getcommpy
			v-if="showCompony"
			:commpy="componeyobj"
            :guard="guard"
			@emit-getcommpys="componyobj">
		 </Getcommpy>
	</div>
</template>

<script>
import api from "./../../asset/api.js"
import utrl from '../../controller/utrl.js'
	export default{
		data(){
			return{
				showCompony:false,
				componeyobj:{},
				companyArr:[],
				Acompanyname:"",
				Acompanyid:""
			}
		},
		mounted(){
			let mycompanies=utrl.getCompany()
			this.componeyobj=mycompanies
			this.Acompanyname = mycompanies.company_name
			this.Acompanyid =mycompanies.company_id
		},
		activated(){
			let mycompanies=utrl.getCompany()
			this.componeyobj=mycompanies
			this.Acompanyname = mycompanies.company_name
			this.Acompanyid =mycompanies.company_id
		},
		props:['guard','special'],
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
				sessionStorage.company_msg = JSON.stringify(obj)
				this.Acompanyid = obj.company_id
				this.Acompanyname = obj.company_name
				this.componeyobj=obj
			}
		},
		watch:{
			Acompanyname(){
				this.$emit('give-company',this.componeyobj)
				// this.companyName = this.Acompanyname
			}
		}
	}
</script>

<style lang="less" scoped>
	.button{
		height:100%;
		display:flex;
		width: 100%;
		padding:0;
		justify-content: center;
		flex-direction:column;
		.companyname{
			font-size: 0.65rem;
		    max-width: 5rem;
		    text-overflow: ellipsis;
		    white-space: nowrap;
		    overflow: hidden;
			&.special{
				font-size:1rem;
				margin:0 auto;
				overflow:unset;
				max-width: unset;
			}
		}
	}
</style>