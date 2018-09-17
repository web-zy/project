<template>
    <div>
        <input-text :name="'业务部门'" :edit="false" :alert="'请选择部门'" v-model="clientObj.type" @click="setCompony">
            <i class="icon-right ion-ios-arrow-forward"></i>
        </input-text>
    </div>
<!--	<item :class="showCompony ? 'zIndex' : ''">
		<div class="info-list">
			<label>业务部门</label>
			<span :class="clientObj.id ? '' : 'gray'" @click="setCompony">
				{{clientObj.id ? clientObj.type : '请选择部门'}}
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
			if(window.sessionStorage.department != null && window.sessionStorage.department != ""){
				let department = JSON.parse(window.sessionStorage.department)
				let obj = {
					id:department.id,
					name:department.OUName
				}
				sessionStorage.removeItem("department")
				this.giveData(obj)
			}
		},
		mounted(){

		},
		props:['clientObj'],
		methods:{
			setCompony(){
				$router.push({
					name:"chooseDepartment",
				})
			},
			giveData(obj){
				this.$emit('give-dept',obj)
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