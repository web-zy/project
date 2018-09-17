<template>
	<div class="content">
		<von-header>
	      <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	      <span slot="title">{{title}}</span>
	      <div class="button button-icon company" slot="right">{{menuButtonText}}</div>
		</von-header>
		<input type="text" v-model="loan" placeholder="请输入" class="inp"/>
		<button class="btn" @click="addsub">提交</button>
	</div>
</template>

<script>
	import api from '../../../asset/api.js'
	import utrl from '../../../controller/utrl.js'
	export default{
		data(){
			return {
				title:"修改",
				menuButtonText:"",
				loan:"",
				id:""
			}
		},
		mounted(){
			console.log(this.$route.params)
			this.loan=this.$route.params.obj.name
			this.id=this.$route.params.obj.id
				
		},
		deactivated(){
			 this.$destroy()
		},
		methods:{
			back: function() {
				$router.go(-1)
				//this.$router.back()
			},
			async addsub(){
				if(this.loan==""){
					
				}else{
					let bizid=utrl.setbizid();
					//loantypes
					let url="loantypes/"+this.id+"/?bizid="+bizid+"&token="+api.token
					let res=await api.put(url,{
						name:this.loan,	
					})
					if(res.status >= 200 && res.status < 300){
						$toast.show("修改成功", 1000).then(() => {})
						this.$router.push({name:"commanreference",params:{istrue:true}})
					}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
					}
					
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
		.content{
		padding-top:1px;
	}
	.content .inp{
		margin:3rem auto 0;
		border:1px solid #eee;
		width:90%;
		height:2rem;
		line-height:2rem;
		padding-left:0.5rem;
	}
	.content .btn{
		display:block;
		padding:0 0.9rem;
		margin:0.5rem auto 0;
		height:1.4rem;
		color:#333;
		border:1px solid #f2ad06;
		border-radius:0.7rem 0.7rem;
		background:white;
	}
	
</style>