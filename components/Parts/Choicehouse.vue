<template>
	<div :class="showCompony ? 'zIndex' : ''">
    	<input-text :name="'仓库'" :edit="false" :alert="'请选择仓库'" v-model="houseObj.type" @click="setCompony">
    		<i class="icon-right ion-ios-arrow-forward"></i>
    	</input-text>
		<div class="absolute" v-if="showCompony">
			<Refwarehouse
				:Refwarehouse="houseObj"
				@emit-getcommpys="componyobj">
			</Refwarehouse>
		</div>
    </div>
	<!-- <item :class="showCompony ? 'zIndex' : ''">
		<div class="info-list" @click="setCompony">
			<label>仓库</label>
			<span :class="houseObj.id ? '' : 'gray'">
				{{houseObj.id ? houseObj.type : '请选择仓库'}}
			</span>
		</div>
		<div class="absolute" v-if="showCompony">
			<Refwarehouse
				:Refwarehouse="houseObj"
				@emit-getcommpys="componyobj">
			</Refwarehouse>
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
		props:['houseObj','index'],
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
				this.$emit('give-house',{
					company_id:this.Acompanyid,
					company_name:this.Acompanyname,
					index:this.index ? this.index : false
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
</style>