<template>
	<div id="invoice">
		<div class="header">
			<div class="headerTop Bcolor">
				<von-header>
					<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
					<span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
					<div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right">{{company}}</div>
				</von-header>
			</div>
			<div class="headerCent">
				<div class="Fdiv">
					<div class="Fdiv1">
						<div class="Yuan">
							发票
						</div>
					</div>
					<div class="Fdiv2">
						<div>林文强 2018-01-27</div>
						<div>单号 HKDD123456654</div>
						<div>共计1件 $1000</div>
					</div>
				</div>
				<div class="Tabdiv">
					<ul>
						<li class="tab-li active">基本信息</li>
						<li class="tab-li">发票明细</li>
						<li class="tab-li">审批进程</li>
					</ul>
				</div>
			</div>
		</div>
		<scroll  class="page-content">
		<div class="conent">
			<!--/**************基本信息**************/-->
			<div class="tab-cons" style="display: block;">
				<div class="basic"><span>发票类型</span><span>增值税专用发票</span></div>
				<div class="basic"><span>发票号</span><span>BD10001</span></div>
				<div class="basic"><span>客户名称</span><span>易成软件</span></div>
				<div class="basic"><span>发票抬头</span><span>石家庄易成软件可以有限公司</span></div>
				<div class="basic"><span>纳税人识别号</span><span>8111010565679376AB</span></div>
				<div class="basic"><span>公司注册地址</span><span style="line-height: 1rem;width: 60%;text-align: right;">北京市朝阳区阜通东大街6号院9号楼2单元320901</span></div>
				<div class="basic"><span>开户地—开户行</span><span></span></div>
				<div class="basic"><span>联系人及电话</span><span></span></div>
				<div class="basic"><span>邮寄地址</span><span style="line-height: 1rem;width: 60%;text-align: right;"></span></div>
				<div class="basic"><span>收件人及电话</span><span></span></div>
				<div class="basic"><span>快递及单号</span><span ></span></div>
				<div class="basic"><span>备注</span><span></span></div>
				<div class="basic"><span></span><span></span></div>
			</div>
			<!--/**************商品明细**************/-->
			<div class="tab-cons">
				<div class="invoice">
					<div class="invoice_box">Dell 电脑</div>
					<div class="invoice_box">单价：19.000.000.000</div>
					<div class="invoice_box">
						<span>数量：2</span>&emsp;&emsp;&emsp;&emsp;&emsp;
						<span>金额：38.00</span>
					</div>
				</div>
				<div class="invoice">
					<div class="invoice_box">Dell 电脑</div>
					<div class="invoice_box">单价：19.000.000.000</div>
					<div class="invoice_box">
						<span>数量：2</span>&emsp;&emsp;&emsp;&emsp;&emsp;
						<span>金额：38.00</span>
					</div>
				</div>
			</div>
			<div class="tab-cons">
				1234
			</div>
		</div>
		</scroll>
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
				msg: '客户发票申请',
				company: "蜂王科技"
			}
		},
		mounted() {
			this.tab();
			this.solids();
		},
		methods: {
			solid: function() {
				var cent = document.getElementsByClassName("details")[0]
				cent.style.display = 'block';
			},
			solids:function(){
				var basic = document.getElementsByClassName("basic");
				var cent = document.getElementsByClassName("details")[0]
				for(var i=0;i<basic.length;i++){
					basic[i].onclick = function(){
						cent.style.display = 'none';
					}
				}
			},
			back: function() {
				$router.go(-1)
				//          @click="$router.forward('/Mines/myMessage')"
			},
			tab: function() {
				var _this = this;
				var btns = document.getElementsByClassName("tab-li");
				var cons = document.getElementsByClassName("tab-cons");
				for(var i = 0; i < btns.length; i++) {
					btns[i].index = i;
					btns[i].onclick = function() {
						if(this.className == ' active ') {
							return;
						}
						//清空类名，并把所有tab-con设置为display:none
						for(var i = 0; i < cons.length; i++) {
							btns[i].className = btns[i].className.replace(/\s*active\s*/, '');
							cons[i].style.display = 'none';
						}
						this.className += ' active ';
						cons[this.index].style.display = 'block';
					};
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	#invoice {
		width: 100%;
		height: 100%;
		.header {
			width: 100%;
			background-color: #f3f4f4;
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
			.headerCent {
				width: 100%;
				z-index: 1;
				background-color: #f3f4f4;
				position: absolute;
				.Fdiv {
					width: 100%;
					display: flex;
					.Fdiv1 {
						width: 30%;
						.Yuan {
							width: 3rem;
							height: 3rem;
							border-radius: 50%;
							background-color: gray;
							margin: 0.75rem 0;
							margin-left: 1.5rem;
							text-align: center;
							line-height: 3rem;
							color: #FFF;
							font-size: 0.8rem;
						}
					}
					.Fdiv2 {
						width: 70%;
						line-height: 1rem;
						font-size: 0.7rem;
						padding-top: 0.9rem;
					}
				}
				.Tabdiv {
					width: 100%;
					height: 2rem;
					line-height: 2rem;
					font-size: 0.8rem;
					ul {
						width: 100%;
						display: flex;
						-webkit-justify-content: space-between;
						li {
							width: calc(100%/3);
							text-align: center;
						}
						.active {
							border-bottom: solid 1px #F3BF06;
						}
					}
				}
			}
		}
		.conent {
			width: 100%;
			height:100%;
			margin-top: 11.2rem;
			.tab-cons {
				width: 100%;
				min-height: 100%;
				display: none;
				margin-bottom: 3rem;
				.invoice{
					width: 100%;font-size: 0.75rem;border-bottom:solid 1px gray ;
					padding: 0.5rem 0;
					.invoice_box{
						width: 100%;line-height: 1.2rem;
						padding:0 1rem ;
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
					position: relative;
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
	}
</style>
