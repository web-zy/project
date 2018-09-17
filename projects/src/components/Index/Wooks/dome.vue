<template>
	<div>
		<div class="">
			<von-header>
				<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
				<span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
				<div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right">{{company}}</div>
			</von-header>
		</div>
		<div>
			<scroll>
				<div class="tab-cons" style="display: block;">
					<details>
						<summary>
							<div class="Detailed">
								<div class="yuan">
									<div class="img">

									</div>
								</div>
								<div class="new-cent" @click="solid()">
									<p>Dell显示器 T40 黑色</p>
									<p>默认仓库 备注</p>
									<p>5个/1箱 ¥40.00</p>
								</div>
								<div class="tu">
									▼
								</div>
							</div>
						</summary>
						<p style="display: none; z-index: -1;" class="details">
							<div class="basic"><span>产品名称</span><span>Dell显示器</span></div>
							<div class="basic"><span>规格型号</span><span>T40 黑色</span></div>
							<div class="basic"><span>仓库</span><span>默认仓库</span></div>
							<div class="basic"><span>数量</span><span>1个</span></div>
							<div class="basic"><span>包装规格</span><span>1箱2个</span></div>
							<div class="basic"><span>单价</span><span>1.000</span></div>
							<div class="basic"><span>金额</span><span>5.000</span></div>
							<div class="basic"><span>降点</span><span>2.00%</span></div>
							<div class="basic"><span>入库单价</span><span>800</span></div>
							<div class="basic"><span>入库金额</span><span>4.000</span></div>
							<div class="basic"><span>备注</span><span>备注</span></div>
						</p>
					</details>
					<accordion>
						  <accordion-item title="老虎" content-height="110">
						    <p>
						      如果有一天我能够拥有一个大果园，
						      我愿放下所有追求做个农夫去种田，
						      每一个早晨我耕耘在绿野田园，
						      每一个黄昏我守望在乡间的麦田。
						      我会把忧虑都融化在夕阳里，
						      让孤独的心等待秋收的欢喜。
						    </p>
						  </accordion-item>
					 </accordion>
					<div class="basic"><span>合同开始日期</span><span>2018/9/9</span></div>
					<div class="basic"><span>合同结束日期</span><span>2018/9/9</span></div>
					<div class="basic"><span>合同签订人</span><span>李文强</span></div>
					<div class="basic"><span>合同负责人</span><span>郭旭达</span></div>
					<div class="basic"><span>合同归档号</span><span>XS201809090001</span></div>
					<div class="basic"><span>备注</span><span>请尽早发货，着急用</span></div>
					<div class="basic"><span>合同类别</span><span>采购合同</span></div>
					<div class="basic"><span>合同签订日期</span><span>2018/9/9</span></div>
					<div class="basic"><span>合同开始日期</span><span>2018/9/9</span></div>
					<div class="basic"><span>合同结束日期</span><span>2018/9/9</span></div>
					<div class="basic"><span>合同签订人</span><span>李文强</span></div>
					<div class="basic"><span>合同负责人</span><span>郭旭达</span></div>
					<div class="basic"><span>合同归档号</span><span>XS201809090001</span></div>
					<div class="basic"><span>备注</span><span>请尽早发货，着急用</span></div>
				</div>
			</scroll>
		</div>
		<div class="footer">
			<div>同意</div>
			<div>退回</div>
			<div>拒绝</div>
			<div>更多</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				msg: "我的客户",
				company: "蜂王科技",
				title: "Dell 显示器 T40 黑色",
				items: [],
				infiniteCount: 0
			}
		},

		mounted() {
			//			for(let i = 1; i <= 20; i++) {
			//				this.items.push(i + ' - keep walking, be 2 with you.')
			//			}
			//			this.top = 1
			//			this.bottom = 20
		},

		methods: {
			//			onRefresh(done) {
			//				setTimeout(() => {
			//					let start = this.top - 1
			//					for(let i = start; i > start - 10; i--) {
			//						this.items.splice(0, 0, i + ' - keep walking, be 2 with you.')
			//					}
			//					this.top = this.top - 10;
			//
			//					done()
			//				}, 1500)
			//			},
			//
			//			onInfinite(done) {
			//				setTimeout(() => {
			//					if(this.infiniteCount < 2) {
			//						let start = this.bottom + 1
			//						for(let i = start; i < start + 10; i++) {
			//							this.items.push(i + ' - keep walking, be 2 with you.')
			//						}
			//						this.bottom = this.bottom + 10;
			//
			//						this.infiniteCount++
			//					}
			//
			//					done()
			//				}, 1500)
			//			},

			onItemClick(index) {
				console.log(index)
			},
			back: function() {
				$router.go(-1)
				//          @click="$router.forward('/Mines/myMessage')"
			},
		}
	}
</script>
<style lang="less">
	details summary::-webkit-details-marker {
		display: none;
	}
	
	.tab-cons {
		width: 100%;
		min-height: 100%;
		display: none;
		background-color: #fff;
		margin-top: 4.8rem;
		margin-bottom: 3rem;
		span {
			display: block;
			line-height: 2.5rem;
		}
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
			line-height: 2.2rem;
			font-size: 0.7rem;
			display: flex;
			-webkit-justify-content: space-between;
			padding: 0 0.7rem;
		}
		.Detailed {
			width: 100%;
			display: flex;
			-webkit-justify-content: space-around;
			border-bottom: solid 1px #f3f4f4;
			.yuan {
				width: 30%;
				padding: 0.5rem 0;
				.img {
					margin: 0 auto;
					width: 70%;
					height: 100%;
					border: solid 1px gray;
					border-radius: 0.3rem;
				}
			}
			.new-cent {
				width: 60%;
				font-size: 0.7rem;
				padding: 0.5rem 0;
			}
			.tu {
				width: 10%;
				text-align: center;
				line-height: 3.5rem;
				font-size: 0.85rem;
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
			width: 25%;
			text-align: center;
			height: 3rem;
			line-height: 3rem;
			font-size: 0.8rem;
			color: #fff;
		}
	}
</style>