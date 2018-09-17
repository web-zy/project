<template>
	<div id="Report">
		<div class="headerTop Bcolor">
			<von-header>
				<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
				<span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
				<div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right">{{company}}</div>
			</von-header>
		</div>
		<div class="Report_box">
			<div class="Report">
				<div class="name">客户全称</div>
				<div class="input_box"><input type="text" placeholder="世纪畅想科技有限公司"/></div>
			</div>
			<div class="Report">
				<div class="name">客户简称</div>
				<div class="input_box"><input type="text" placeholder="世纪畅想"/></div>
			</div>
			<div class="Report">
				<div class="name">备注</div>
				<div class="input_box"><input type="text" placeholder=""/></div>
			</div>
		</div>
		<div class="footer">
			<p>提交</p>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				msg: '快速报备',
				company: "蜂王科技"
			}
		},
		mounted() {
			//this.solid()
		},
		methods: {
			/*solid: function() {
				var cent = document.getElementsByClassName("details")[0]
				cent.style.display = 'block';
			},*/
			back: function() {
				$router.go(-1);
				//          @click="$router.forward('/Mines/myMessage')"
			}
		}
	}
</script>

<style lang="less"  scoped>
	#Report {
		width: 100%;
		height: 100%;
			.headerTop {
				width: 100%;
				height: 2.5rem;
				display: flex;
				-webkit-justify-content: space-around;
				.topDiv {
					width: calc(100%/3);
					line-height: 2.5rem;
				}
				div:nth-child(1) {
					text-align: left;
					img {
						width: 30%;
						height: 60%;
						margin-top: 0.45rem;
						margin-left: 0.5rem;
					}
				}
				div:nth-child(2) {
					font-size: 1rem;
					text-align: center;
				}
				div:nth-child(3) {
					text-align: right;
					padding-right: 0.5rem;
					font-size: 0.7rem;
				}
			}
			.Report_box{
				width: 100%;height: 100%;
				.Report{
					width:100%;display: flex;-webkit-justify-content: space-between;
					border-bottom:solid 1px #f3f4f4 ;
					padding:0 1rem;font-size:0.8rem;line-height:2.2rem;
					.name{
						width: 30%;
					}
					.input_box{
						width: 70%;
						input{
							border: none;text-align: right;width: 100%;
						}
					}
				}
			}
			.footer{
				width:100%;
				height:2rem;
				p{
					
					width:100%;
					line-height: 2rem;
					font-size: 0.85rem;
					color:#fff;

					text-align:center;
				}
			}
		}
</style>