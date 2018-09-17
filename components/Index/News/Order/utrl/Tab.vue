<template>
	<div class="d-tabs">
		<div class="botton" :class="nowClick == index ? 'active' : ''" @click.stop="clickThis(index,val.id)" v-for="(val,index) in tabArr">{{val.name}}</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				nowClick:this.value ? this.value : 0
			}
		},
		mounted() {
			// this.value = this.value ? this.value : 0
			// this.nowClick = this.default ? this.default : 0
		},
		methods: {
			clickThis(index,id){
				this.nowClick = index;
				this.$emit("input",index)
				this.$emit("clickIndex",id)
			}
		},
		watch:{
			value(val){
				this.nowClick = val
			}
		},
		props:[
			"value",
			"tabArr"
		]
	}
</script>

<style lang="less" scoped>
	.d-tabs{
		display:flex;
		justify-content:space-between;
		.botton{
			display:block;
			flex:1;
			height:2rem;
			line-height: 2rem;
			text-align: center;
			font-size: 0.75rem;
			border-bottom:1px solid #ccc;
			&.active{
				border-bottom:2px solid var(--color-theme);
				font-size:0.8rem;
			}
		}
	}
</style>