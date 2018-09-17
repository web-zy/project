<template>
	<div class="addCommodity">
		<!-- header -->
		<header class="Bcolor">
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <search v-model="keywords" placeholder="名称、品牌、规格型号..." :on-search="onSearch" cancelText="取消" :on-cancel="onCancel"></search>
        </header>
		<!-- tab -->
		<div class="classification">
			<div class="condition-warp">
				<p v-for="(val,index) in classiFication" :key="index">{{val.name}}</p>
			</div>
			<div class="commodity-warp">
				<div class="commodity" v-for="(val,index) in showCommodity" @click=selected(index)>
					<div class="commodity_head"><em><i>知</i></em></div>
					<div class="commodity_info">
						<div class="top">
							<div class="left">
								<h4 class="comm_name">{{val.name}}</h4>
								<p class="comm_stock"><span>A仓库</span> <span>剩余量100</span></p>
							</div>
							<div class="radio"><i v-bind:class="val.checkbox ? 'icon ion-ios-checkmark-empty positive' : ''"></i></div>
						</div>
						<div class="bottom">
							<p class="plice"><span><em>¥</em>{{val.sale_price}}</span><span>{{val.number}}{{val.measure_name}}/{{val.packing_unit}}</span></p>
							<div class="choice_num">
								<span @click.stop="reduce(index)">-</span>
								<input type="number" v-model="val.selectNumber" readonly="readonly" />
								<span @click.stop="increase(index)">+</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="preservation">
			<p>共<span>2</span>件,<span><em>¥</em>200</span></p>
			<md-button class="button button-energized preseBtn"  @click.native="clicked()">保存</md-button>
		</div>
	</div>
</template>
<script>
import api from "../../../asset/api.js"
export default {
	data() {
		return {
        	commodity:[],
        	keywords:"",
        	classiFication:[{name:"常用"}],
        	showCommodity:[],

		}
	},
	mounted() {
		this.getClassiFication()
		this.allCommodity()
	},
	methods: {
		back() {
            $router.go(-1)
        },
        onSearch(keywords) {
        	// namelike = this.keywords
			console.log(this.keywords)
		},
		onCancel() {
			this.keywords = '';
		},
		async getClassiFication(){
			let res = await api.get("productclass");
			console.log(res)
			this.classiFication = this.classiFication.concat(res);
		},
		//拉取相对商品
		async allCommodity() {
			let res = await api.get("products")
			console.log(res)
			for(let i in res){
				res[i].checkbox = false;
				res[i].selectNumber = 1;
			}
			this.showCommodity = res;
		},
		selected(index){
			if(this.showCommodity[index].checkbox){
				this.showCommodity[index].checkbox = false;
			}else{
				this.showCommodity[index].checkbox = true;
			}
		},
		reduce(index){
			if(this.showCommodity[index].selectNumber == 1){
				return;
			}
			this.showCommodity[index].selectNumber = this.showCommodity[index].selectNumber - 1;
		},
		increase(index){
			this.showCommodity[index].selectNumber = this.showCommodity[index].selectNumber + 1;
		},
		clicked(){
			let saveCommidity = [];
			for(let i in this.showCommodity){
				if(this.showCommodity[i].checkbox){
					saveCommidity.push(this.showCommodity[i])
				}
			}
			console.log(saveCommidity)
			$router.forward({ name:'newOrder',path:"/newOrder" ,params: {data:saveCommidity} })
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.addCommodity{
	header{
		display:flex;
		justify-content: space-between;
	}
	.bar.bar-header,.button-icon {
	    box-shadow: 6px 0px 10px rgba(0, 0, 0, 0.15);
	    width: 90%;
	}
	.button.button-positive.button-clear{
		color: #444;
	}
	.button-icon{
		width:10%;
		// font-size: 20px;
		font-size:1.3rem;
		font-weight: 400;
	}
	.classification{
		position: absolute;
		top:2.5rem;
		bottom:3rem;
		left:0;
		right: 0;
		display:flex;
		justify-content:space-between;
		.condition-warp{
			width:25%;
			height:100%;
			border-right: 1px solid gainsboro;
			border-bottom: 1px solid gainsboro;
			p{
				width:100%;
				height:2.5rem;
				text-align: center;
				font-size:0.7rem;
				line-height:2.5rem;
				border-bottom: 1px solid gainsboro;
				&.active{
					border-color: #F3C41F;
				}
			}
		}
		.commodity-warp{
			width:75%;
			height:100%;
			overflow-y: scroll;
			.commodity{
				width:100%;
				height:5rem;
				padding:0.5rem;
				padding-left:0;
				border-bottom:0.1rem solid gainsboro;
				display:flex;
				justify-content:space-between;
				overflow:hidden;
				.commodity_head{
					display:block;
					width:20%;
					vertical-align: middle;
					&:after{
						content: "";
						display:inline-block;
						vertical-align: middle;
						height:100%;
					}
					em{
						display:inline-block;
						margin: 0 auto;
						position:relative;
						width:80%;
						vertical-align: middle;
						padding-bottom: 80%;
						margin:0 10%;
						i{
							position:absolute;
							width:100%;
							height:100%;
							display:flex;
							justify-content:center;
							align-items:center;
							background: #1892f5;
							border-radius: 50%;
							text-align:center;
							color:#fff;
							font-size:1rem;
						}
					}
				}
				.commodity_info{
					width:80%;
					height:100%;
					.top{
						display:flex;
						justify-content:space-between;
						width:100%;
						height:2.5rem;
						.left{
							width:80%;
							.comm_name{
								font-size:0.8rem;
								margin-bottom:0.2rem;
								height:1rem;
								font-weight: bold;
								line-height:100%;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
							.comm_stock{
								height:1.5rem;
								font-size:0.8rem;
								display:flex;
								justify-content:space-between;
								span{
									display:block;
									padding-right:0.5rem;
								}
							}
						}
						.radio{
							width:20%;
							font-size:2rem;
							vertical-align:middle;
							text-align:center;
							&:after{
								content:"";
								display:inline-block;
								height:100%;
								vertical-align:middle;
							}
						}
					}
					.bottom{
						width:100%;
						height:1.5rem;
						padding-top:0;
						display:flex;
						justify-content:space-between;
						.plice{
							width:60%;
							display:flex;
							justify-content:space-between;
							padding-top:0.3rem;
							padding-right:0.5rem;
							font-size:0.7rem;
							em{
								font-size:0.6rem;
							}
						}
						.choice_num{
							display:block;
							width:40%;
							display:flex;
							padding-left:0.7rem;
							// justify-content:space-between;
							justify-content:center;
							span{
								display:inline-block;
								vertical-align:middle;
								width:1.5rem;
								text-align:center;
								height:1.5rem;
								line-height:1.5rem;
								border:1px solid gainsboro;
								font-size:1rem;
							}
							input[type="number"]{
								width:80%;
								height:100%;
								background:transparent;
								text-align:center;
								border:1px solid gainsboro;
								vertical-align:middle;
							}
						}
					}
				}
			}
		}
	}
	.preservation{
		position:absolute;
		bottom:0;
		width:100%;
		height:3rem;
		line-height:3rem;
		background:#fff;
		box-shadow:0 0 10px rgba(0,0,0,.3);
		padding: 0.5rem;
		display:flex;
		justify-content:space-between;
		p{
			display:block;
			width:auto;
			height:100%;
			line-height:2rem;
			color:#000;
			font-size:0.8rem;
			span{
				font-size:1rem;
				padding:0 0.3rem;
			}
			em{
				font-size:0.8rem;
				padding-right:0.3rem;
			}
		}
		.preseBtn{
			display:block;
			width:20%;
			line-height:2rem;
			text-align:center;
			font-size:1rem;
			color:#fff;
		}
	}
}
</style>