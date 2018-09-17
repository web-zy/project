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
							采退
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
						<li class="tab-li">商品明细</li>
						<li class="tab-li">审批进程</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="conent">
			<div class="tab-cons" style="display: block;">
				
			</div>
			<div class="tab-cons">
				123
			</div>
			<div class="tab-cons">
				1234
			</div>
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
				msg: '采购退货订单',
				company: "蜂王科技"
			}
		},
		mounted() {
			this.tab()
		},
		methods: {
			tab:function(){
            //tab
            var _this = this;
            var btns = document.getElementsByClassName("tab-li");
            var cons = document.getElementsByClassName("tab-cons");
            for(var i=0;i<btns.length;i++){
                btns[i].index = i;
                btns[i].onclick=function(){
                    if( this.className == ' active ' ){
                        return ;
                    }
                    //清空类名，并把所有tab-con设置为display:none
                    for(var i=0;i<cons.length;i++){
                        btns[i].className = btns[i].className.replace(/\s*active\s*/,'');
                        cons[i].style.display = 'none';
                    }
                    this.className += ' active ';
                    cons[this.index].style.display = 'block';
                };
            }
        },
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
		height: 100%;
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
						.active{
							border-bottom: solid 1px #F3BF06;
						}
					}
				}
			}
		}
		.conent{
				width: 100%;height: 100%;
				.tab-cons{
					width: 100%;min-height: 100%;
					display: none;
				}
			}
		.footer{
			width: 100%;display: flex;-webkit-justify-content:space-between;
			position: fixed;bottom: 0;background-color: #404040;
			div{
				width: 25%;text-align: center;height: 3rem;line-height: 3rem;
				font-size: 0.8rem;
				color: #fff;
			}
		}
	}
</style>