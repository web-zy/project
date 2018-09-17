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
			<div class="headerCent">
				<div class="Fdiv">
					<div class="Fdiv1">
						<div class="Yuan">
							完善
						</div>
					</div>
					<div class="Fdiv2">
						<div>林文强 2018-01-27</div>
						<div>单号 HKDD123456654</div>
					</div>
				</div>
				<div class="Tabdiv">
					<ul>
						<li class="tab-li active">基本信息</li>
						<li class="tab-li">发票信息</li>
						<!--<li class="tab-li">付款方式</li>-->
						<li class="tab-li">审批进程</li>
					</ul>
				</div>
			</div>
		</div>
		<scroll class="page-content">
			<div class="conent">
				<!--/**************基本信息**************/-->

				<div class="tab-cons" style="display: block;">

					<div class="basic"><span>客户全称</span><span></span></div>
					<div class="basic"><span>客户简称	</span><span>同辉</span></div>
					<div class="basic"><span>客户分类</span><span>通友时代</span></div>
					<div class="basic"><span>联系人及电话</span><span></span></div>
					<div class="basic"><span>邮箱</span><span>2018/9/9</span></div>
					<div class="basic"><span>QQ</span><span>2018/9/9</span></div>
					<div class="basic"><span>客户地址</span><span>2018/9/9</span></div>
					<div class="basic"><span>拜访次数</span><span></span></div>
					<div class="basic"><span>业务员</span><span></span></div>
					<div class="basic"><span>李文强，郭旭达</span><span></span></div>
				</div>
				<div class="tab-cons">
					<div class="basic"><span>客户全称</span><span></span></div>
					<div class="basic"><span>纳税人识别号</span><span></span></div>
					<div class="basic"><span>公司注册地址</span><span></span></div>
					<div class="basic"><span>开户行账号</span><span></span></div>
					<div class="basic"><span>开户地</span><span></span></div>
					<div class="basic"><span>开户行</span><span></span></div>
					<div class="basic"><span>联系人及电话</span><span></span></div>
				</div>
				<div class="tab-cons">
					<div style="border: none; color: green;" class="basic">
						<div>
							<span><img src="all"/>&emsp;郭旭达 &nbsp;&nbsp;审批中</span>
						</div>
					</div>
					<!--<div><img src="../../../../../static/work_images/arror.png"/></div>-->
					<div style="border: none;" class="basic">
						<span><img src="all"/>&emsp;李文强 &nbsp;&nbsp;同意</span>
					</div>
					<div style="border: none;" class="basic">
						<span><img src="all"/>&emsp;赵金杨 &nbsp;&nbsp;开始</span>
					</div>
				</div>
			</div>
		</scroll>
		<div class="footer">
			<div>已阅</div>
			<div>知会</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				msg: '完善客户信息',
				s: "进程",
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
			solids: function() {
				var basic = document.getElementsByClassName("basic");
				var cent = document.getElementsByClassName("details")[0]
				for(var i = 0; i < basic.length; i++) {
					basic[i].onclick = function() {
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
	#Customer {
		width: 100%;
		height: 100vh;
		.header {
			width: 100%;
			height: 9rem;
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
						padding-top: 1.3rem;
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
			height: 100%;
			margin-top: 11.2rem;
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
				width: 50%;
				text-align: center;
				height: 3rem;
				line-height: 3rem;
				font-size: 0.8rem;
				color: #fff;
			}
		}
	}
</style>