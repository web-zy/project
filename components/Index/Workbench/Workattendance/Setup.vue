<template>
	<div style="margin-top:3rem;">
		<von-header>
			 <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	      <span slot="title">{{title}}</span>
	      <div class="button button-icon company" slot="right" @click.stop="showcompony">{{company_name}}</div>
		</von-header>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				title:"设置",
				company_name:""
			}
		},
		mounted(){
			
		},
		methods:{
			back: function() {
				$router.go(-1)
			},
		}
	}
</script>

<style>
</style>