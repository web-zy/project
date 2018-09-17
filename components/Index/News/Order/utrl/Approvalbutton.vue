<template>
    <div class="fun-botton">
    	<div class="botton" v-for="(val,index) in bottons.length == 0 ? btns : bottons" :key="index" @click.stop="callback(val)">
    		<i v-bind:class="['iconfont ', val.icon]"></i>
	    	<span class="botton-word">{{val.name}}</span>
	    	<div class="subBtn" :class="subShow ? 'show' : ''" v-for="(val,index) in val.subBtn" :key="index" @click.stop="callback(val)">
	    		{{val.name}}
	    	</div>
	    </div>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				subShow:false,
				bottons:[]
			}
		},
		mounted() {
			let _this = this;
			window.onclick = function(){
				_this.subShow = false;
			}
			try {
				// statements
				if(this.$route.params.buttons){
					this.bottons = this.$route.params.buttons
				}
			} catch(e) {
				// statements
				console.log(e);
			}
		},
		methods: {
			callback(index){
				if(index.subBtn){
					this.subShow = true;
					return
				}
				this.$emit("clickBack",index)
			}
		},
		props:{
			btns:Array
		}
	}
</script>

<style lang="less" scoped>
	.fun-botton{
		// padding:7px 0 10px 0;
		z-index:2;
		bottom:0;
		left:0;
		width:100vw;
		height:2.5rem;
		background:#f5f5f5;
		box-shadow: inset 0.02rem 0.05rem 0.07rem 0.01rem #cccccc;
		display:flex;
		justify-content:space-between;
		.botton{
			padding-top: 0.2rem;
			flex:1;
			height:2.5rem;
			text-align:center;
			color:#666;
			font-size:0.5rem;
			position:relative;
			display:flex;
			justify-content: center;
			flex-direction: column;
			.iconfont{
				font-size:1rem;
			}
			.botton-word{
				// height:0.8rem;
				display:block;
				font-size:0.5rem;

			}
			.subBtn{
				position:absolute;
				bottom: 0;
				right:0;
				width:100%;
				height:0;
				background:#fafafa;
				transition:all .5s;
				opacity:0;
				&.show{
					height:3rem;
					bottom:100%;
					opacity:1;

				}
			}
		}
	}
</style>