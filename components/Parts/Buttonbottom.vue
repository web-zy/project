<template>
	<div class="button-warp">
		<div class="buttons" :class="loading ? 'loading' : ''" @click.stop="clickBack">
            <span v-if="!loading">{{words}}<slot></slot></span>
            <span v-else>提交中 <em class="ion-load-b"></em></span>
        </div>
	</div>
</template>

<script>
	import api from '../../asset/api.js'
	export default{
		data(){
			return{
				// loading: this.load ? this.load : false
			}
		},
		mounted(){
            // console.log(this.load)
		},
		props:['words',"loading"],
		methods:{
			clickBack(){
                if(this.loading){
                    return
                }else{
                    this.$emit("call-back")
                }
			}
		},
		activated(){
			// 执行ajax ，更新参照中的数据
		}
	}
</script>

<style lang="less" scoped>
	.button-warp{
		width:100%;
		padding:0.25rem 0.5rem 0.75rem;
		background:#eee;
		position: fixed;
		z-index: 11;
		bottom:0;
		left:0;
		.buttons{
			width: 100%;
			height:1.88rem;
			display:flex;
			align-items: center;
			justify-content: center;
			color: #333;
			font-size: 0.85rem;
			background: #f2be06;
			border-radius:5px;
            position: relative;
		}
        .loading{
            &:before{
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(9,9,9,0.1);
                box-shadow:0px 0px 10px #eee inset;
            }
        }
	}
</style>