<template>
	<div id="Customer">
		<div class="header">
			<div class="headerTop Bcolor">
				<von-header>
					<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
					<span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
					<div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right">{{company}}</div>
				</von-header>
			</div>
		</div>
		<scroll class="page-content">
			<div class="conent">
				<div class="tab-cons" style="display: block;">
					<div class="basic"><span>客户分类</span><span></span></div>
					<div class="basic"><span>上级分类</span><span>同辉</span></div>
					<div class="basic"><span>备注</span><span>通友时代</span></div>
				</div>
			</div>
		</scroll>
		<div class="footer">
			<div>保存</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				msg: '客户分类',
				s: "进程",
				company: "蜂王科技"
			}
		},
		mounted() {
			
		},
		methods: {
			back: function() {
				$router.go(-1)
				//          @click="$router.forward('/Mines/myMessage')"
			},
		}
	}
</script>

<style lang="less" scoped>
	#Customer {
		width: 100%;
		height: 100vh;
		.conent {
			width: 100%;
			height: 100%;
			margin-top: 4rem;
			.tab-cons {
				width: 100%;
				min-height: 100%;
				display: none;
				margin-bottom: 3rem;
				ul {
					width: 100%;
					li {
						height: 4rem;
						display: flex;
						-webkit-justify-content: space-between;
						border-bottom: solid 1px #f3f4f4;
						padding: 0 1rem;
						.dt {
							width: 90%;
							div {
								font-size: 0.7rem;
								line-height: 2rem;
							}
						}
						.nub {
							width: 10%;
							line-height: 4rem;
						}
					}
				}
				.basic {
					width: 100%;
					height: 2.2rem;
					border-bottom: solid 1px #f3f4f4;
					/*line-height:1.5rem;*/
					font-size: 0.75rem;
					display: flex;
					-webkit-justify-content: space-between;
					/*padding: 0 0.7rem;*/
					span {
						line-height: 2.2rem;
					}
					div {
						width: 100%;
						span {
							line-height: 2.2rem;
						}
					}
				}
			}
		}
		.footer {
			width: 100%;
			display: flex;
			-webkit-justify-content: space-between;
			position: fixed;
			bottom: 0;
			background-color: #404040;
			div {
				width: 100%;
				text-align: center;
				height: 3rem;
				line-height: 3rem;
				font-size: 0.8rem;
				color: #fff;
			}
		}
	}
</style>