<template>
	<div class="additem">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	      	<span slot="title">{{title}}</span>
	      	<div class="button button-icon company companyname" slot="right">{{company_msg.company_name}}</div>
		</von-header>
		<div class="reference reference_top" >
				<p>积分类别</p>
				<input type="text" placeholder="请选择积分类别" @click.stop="intergal"  style="background:transparent" v-model="item_class" readonly="readonly"/>
				<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>
		<div class="reference">
			<p>积分明细</p>
			<input type="text" placeholder="请填写积分明细" v-model="score_item.item_details"/>
		</div>	
		<div class="reference reference_cost">
					<p>考核分值</p>
					<div class="addsub">
						<i class="ion-android-remove removes numsmall" @click="removes"></i>
						<input type="text"  :class="score_item.score<0?'numsmall':'numbig'" v-model="score_item.score"/>
						<i class="ion-android-add" @click="add"></i>
					</div>
			</div>
		<div class="btnsub">
			<button @click="btnsub">提交</button>
		</div>
		<Integralclass  v-if="isintergal" @emit-cost="costobj" :pickname="item_class"></Integralclass>
	</div>
</template>

<script>
	import Vue from 'vue'
	import api from '../../../../../asset/api.js'
	import utrl from '../../../../../controller/utrl.js'
	import '../../../../establish/commoncss/common.css'
	export default{
		data(){
			return {
				title:"积分设置",
				isintergal:false,
				company_msg:{},
				item_class:"",
				costparameter:{
					costparameter:"",
					detail_id:""
				},
				score_item:{
					rowno:"",
					OrderIndex:"",
					item_class:"",
					item_details:"",
					score:""
				},
				arr:[-10,-5,-2,2,5,10],
				index:3
				
			}
		},
		mounted(){
			this.index=3
			let company_msg=utrl.getCompany()
			this.company_msg=company_msg
			//this.score_item.score=this.arr[this.index]
			Vue.set(this.score_item,'score',this.arr[this.index])
		},
		methods:{
			back(){
				//$router.go(-1)
				this.$router.replace('/index')
			},
			add(){
				if(this.index==this.arr.length-1){
					$toast.show('最大分值了', 3000).then(() => {
						  
						})
					return
				}else{
					this.index++;
					Vue.set(this.score_item,'score',this.arr[this.index])
				}
				
			},
			removes(){
				if(this.index==0){
					$toast.show('最小分值了', 3000).then(() => {
						  
						})
					return
				}else{
					this.index--;
					Vue.set(this.score_item,'score',this.arr[this.index])
				}
			},
			costobj(obj){
				this.isintergal= false
				if(obj == false){
					return
				}
				this.score_item.item_class=obj.item_class
				this.item_class=obj.item_details
				//this.score_item.item_details=obj.item_details
			},
			intergal(e){
				// console.log(e.currentTarget)
				this.costparameter.detail_id=e.currentTarget.value
				this.costparameter.costparameter=e.currentTarget
				this.isintergal=!this.isintergal
			},
			async btnsub(){
				let itemlist=JSON.parse(sessionStorage.getItem("itemlist"))
				let index=itemlist[itemlist.length-1].rowno
				this.score_item.rowno=parseFloat(index)+1
				this.score_item.OrderIndex=parseFloat(index)+1
				itemlist=itemlist.concat(this.score_item)
				
				sessionStorage.setItem("itemlist",JSON.stringify(itemlist))
				$router.go(-1)
			}
		}
	}
</script>

<style scoped>
	.additem .reference p{
		margin-left:0.75rem;
	}
	.additem .reference input{
		margin-right:1.4rem;
	}
	.additem .reference .fuhao{
		right:0.75rem;
	}
	.reference .addsub{
		width:4rem;
		position:absolute;
		border:1px solid #eee;
		height:1.2rem;
		min-height:1.2rem;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		font-size:0.5rem;
		right:0.6rem;
		margin-right:0;
		padding:0;
	}
	.addsub i{
		display:block;
		padding:0 0.5rem;
	}
	.reference>.addsub>input{
		display:block;
		text-align:center;
		margin-right:0;
		height:1rem;
		border-left:1px solid #eee;
		border-right:1px solid #eee;
		margin-right:0;
	}
	.addsub>p{
		justify-content: center;
		margin-right:0;
		margin-left:0;
		height:1rem;
		border-left:1px solid #eee;
		border-right:1px solid #eee;
		padding:0 0.5rem;
	}
	.numsmall{
		color:red;
	}
</style>