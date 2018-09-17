<template>
	<div class="modal-warp">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			<span slot="title">{{title}}</span>
		</von-header>
		<!--<search
			class="baraa"
			v-model="keywords"
			placeholder="输入关键字"
			cancelText="取消"
			:on-search="onSearch"
			:on-cancel="onCancel">
		</search>-->
        <div class="search_wrap">
        		<i class="icon ion-ios-search img"></i>
        		<input @keyup="onSearch" v-model="keywords" class="inp" type="search" placeholder="输入关键字">
        		<i v-show="keywords" class="close icon ion-ios-close" @click="onCancel"></i>
        </div>
		<div class="content-warp">
			<div class="classify-warp" v-if="classify">
				<scroll style="top:0;">
					<span v-for="(val,index) in classifyArr" :key="index" @click="saveClass(null,val.id)">{{val.model_class_name}}</span>
				</scroll>
			</div>
			<div class="commodity-warp">
				<scroll v-if="showCommodity.length > 0" :on-refresh="onRefresh" :on-infinite="onInfinite">
					<div class="commodity" v-for="(val,index) in showCommodity" :key="index" @click="linkage(index)">
						<div class="radio-warp" :class="val.radio ? 'active ion-ios-checkmark-empty' : ''">
							<input type="checkbox" v-model="val.radio" class="checkbox" />
						</div>
						<div class="comm-pic">
							<img v-if="val.picture_attachment" :src="val.picture_attachment" />
							<div v-else class="default">商品</div>
						</div>
						<div class="comm-content">
							<h4 class="comm-title">{{val.product_name}}</h4>
							<p class="comm-surplus">{{val.warehouse_name}}剩余量{{val.stock}}</p>
							<p class="comm-spec">{{val.number}}{{val.unit_name}}/{{val.packing_unit}} ¥{{val.price}}</p>
							<div class="comm-num">
								<em class="numIcon ion-minus-round" @click.stop="redNum(val.qty,index)"></em>
								<input type="number" v-model="val.qty" @blur="changeNum(val.qty,index)"/>
								<!-- <span>{{val.num}}</span> -->
								<em class="numIcon ion-plus-round" @click.stop="addNum(val.qty,index)"></em>
							</div>
						</div>
					</div>
					<div v-if="infiniteCount" slot="infinite" class="text-center">没有更多数据</div>
				</scroll>
				<div v-if="showCommodity.length == 0" class="loading">暂无数据</div>
			</div>
		</div>
		<div class="bottom-warp">
			<div class="radio-warp" :class="radioAll ? 'active ion-ios-checkmark-empty' : ''" @click="linkage('all')">
				<input type="checkbox" v-model="radioAll" class="checkbox" />
			</div>
			<div class="words" @click="linkage('all')">全选</div>
			<div class="pic">合计：¥{{picAll | priceZero}}</div>
			<div class="keepButton" @click="keep">保存 <span class="small">({{goodsNum}})</span></div>
		</div>
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return {
				classify:false,
				title:"产品档案",
				radioAll:false,
				picAll:"00.00",
				classifyArr:[
					{
						model_class_name:"全部",
						model_class_id:""
					}
				],
				keywords: '',
				showCommodity:[],
		        selectGoods:[],
		        goodsNum:0,
		        page:1,
		        id:false,
		        keywords:"",
		        infiniteCount:false
			}
		},
		filters:{
			priceZero(val){
				return Number(val).toFixed(2)
			}
		},
		async mounted(){
			this.saveClass()
			let url = "productclass?token=" + api.token + "&company_id=" + sessionStorage.company_id;
			let res = await api.get(url)
			for(let i in res.data){
				this.classifyArr.push(res.data[i])
			}
		},
		methods:{
			back: function() {
				$router.go(-1)
			},
			async saveClass(done,id,keywords){
				let url = 'products/stock?token=' + api.token + "&company_id=" + sessionStorage.company_id + "&page=" + this.page;
				if(id){
					url =  url + '&filter=class_id=' + id;
				}else if(keywords){
					url =  url + '&keyword=' + keywords;
					this.showCommodity = []
				}
				// return
				let res = await api.get(url)
				if(res.status == 204)this.infiniteCount = true;
				let tmpArr = [];
				for(let i in res.data){
					let tmpProd = {
		                "rowno": this.showCommodity.length + 1,
		                "OrderIndex": this.showCommodity.length + 1,
		                "product_id": res.data[i].id,
		                "sku_id": res.data[i].sku_id,
		                "product_name": res.data[i].name,
		                "specification_type": res.data[i].specification_type,
		                "warehouse_id": "fad0fb26-59e5-4819-bd29-09f1358988f5",
		                "warehouse_name": res.data[i].warehouse_name,
		                "is_free_gifts": 0,
		                "qty": 1,
		                "unit_id":  res.data[i].measure_id,
		                "unit_name": res.data[i].measure_name,
		                "packing_unit": res.data[i].packing_unit,
		                "number":res.data[i].number,
		                "price": res.data[i].sale_price,
		                "amt": 0,
		                "discount": 0,
		                "discount_amt": 0,
		                "real_amt": 0,
		                "stock":0,
		                "showDrop":false,
		                "radio":false
					}
					tmpArr.push(tmpProd)
				}
				if(done)done()
				this.showCommodity = this.showCommodity.length == 0 ? tmpArr : this.showCommodity.concat(tmpArr)
			},
			//刷新
			onRefresh(done){
				this.page = 1
				done()
				// this.saveClass(done)
			},
			// 下拉加载
			onInfinite(done){
				if(this.infiniteCount){
					done();
					return
				}
				this.page = this.page+1;
				this.saveClass(done,this.id,this.keywords)
			},
			keep(){
				let arr = []
				for(let i in this.showCommodity){
					if(this.showCommodity[i].radio == true){
						arr.push(this.showCommodity[i])
					}
				}
				this.selectGoods = arr
				window.sessionStorage.selectGoods = JSON.stringify(this.selectGoods)
				this.back()
				// this.$emit("aaa",11)
			},
			linkage(all){
				if(all == 'all'){
					for(let i in this.showCommodity){
						this.showCommodity[i].radio = this.radioAll ? false : true;
					}
					// this.goodsNum = this.radioAll ? 0 : this.showCommodity.length;
					this.radioAll = !this.radioAll
				}
                this.showCommodity[all].radio = !this.showCommodity[all].radio
				this.setAllNum()
			},
			setAllNum(index,num){
				setTimeout(()=>{
					let arr = this.showCommodity
					let a = 0;
					let price = 0;
					for(let i in arr){
						if(arr[i].radio == true){
							a += Number(arr[i].qty)
							price += arr[i].qty * arr[i].price
						}
					}
					this.goodsNum = a;
					this.picAll = price;
				},0)
			},
			// 搜索
			onSearch(e) {
                if(e.key === "Enter")
                    alert(1)
                    this.page = 1;
                    this.showCommodity = []
                    this.saveClass(false,false,this.keywords)
			},
			// 取消
			onCancel() {
				this.keywords = ''
				this.showCommodity = []
				this.saveClass(false,false,false)
			},
			async submit(){
			},
			addNum(num,index){
				if(num == -1){
					this.showCommodity[index].qty = 1;
					return
				}
				this.showCommodity[index].qty = Number(num) + 1;
				this.setAllNum()
			},
			redNum(num,index){
				if(num == 1){
					this.showCommodity[index].qty = - 1;
					return
				}
				this.showCommodity[index].qty = Number(num) - 1;
				this.setAllNum()
			},
			changeNum(num,index){
				if(num == ""){
					this.showCommodity[index].qty = 1;
				}
				this.setAllNum()
			}
		},
		deactivated(){
			 // this.$destroy()
		},
		watch:{
			// selectGoods(){
			// 	this.goodsNum = this.selectGoods.length
			// }
		}
	}
</script>

<style lang="less" scoped>
	.modal-warp{
		flex: 1;
		height:100%;
		background:#eee;
		display: flex;
	    flex-direction: column;
	    justify-content: flex-start;
	    padding-top:2.5rem;
	}
    .search_wrap{
        /*position: fixed;*/
        /*top:0;*/
        /*left:0;*/
        display: flex;
        justify-content: center;
        align-items: center;
        height:2.425rem;
        width: 100%;
        z-index: 100;
        background-color:#fff;
        .img{
                position:absolute;
                left:1rem;
                font-size:1rem;
        }
        .inp{
                height: 1.375rem;
                line-height: 1.375rem;
                padding-left:1.5rem;
                width:100%;
                margin: 0 .5rem;
                border-radius: 20px;
                background-color:#eeeeee;
        }
        .close{
                position:absolute;
                right:1rem;
                font-size:1rem;
                color:#666;
        }
    }
    
	.content-warp{
		flex:1;
		height:100%;
		display:flex;
		justify-content:space-between;
		// align-items:flex-start;
		.classify-warp{
			// flex:1;
			display:block;
			width:4.65rem;
			max-height:100%;
			background:#fff;
			box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
			position: relative;
			span{
				// display:flex;
				color:#333;
				// justify-content:center;
				// align-items: center;
				display:block;
				line-height:2rem;
				text-align:center;
				height: 2rem;
				font-size: 0.75rem;
			    text-overflow: ellipsis;
			    white-space: nowrap;
			    overflow: hidden;
			    padding:0 0.5rem;
				&.active{
					color: #f39801;
					background-color: #f5f5f5;
				}
			}
		}
		.commodity-warp{
			display:block;
			flex:1;
			padding-left:0.08rem;
			max-height:100%;
			position: relative;
			.commodity{
				width:100%;
				height: 4.25rem;
				background-color: #fdfdfd;
				box-shadow: 0.02rem 0.05rem 0.08rem 0rem rgba(238, 238, 238, 0.5);
				border: solid 0.03rem #eeeeee;
				display:flex;
				justify-content:space-between;
				align-items:center;
				padding:0 0.45rem 0 0.33rem;
				.comm-pic{
					width: 2.2rem;
					height: 2.2rem;
					margin-left:0.45rem;
					background-color: #eeeeee;
					border-radius: 50%;
					border: solid 0.03rem #c9c9c9;
					overflow:hidden;
					.default{
						width:100%;
						height:100%;
						display:flex;
						justify-content:center;
						align-items:center;
						color:#333;
						background:#f2be06;
					}
					img{
						display:block;
						width:100%;
					}
				}
				.comm-content{
					flex:1;
					margin-left: 0.55rem;
					position: relative;
					.comm-title{
						font-size: 0.7rem;
						font-weight: normal;
						font-stretch: normal;
						line-height: 0.75rem;
						letter-spacing: -0.02rem;
						color: #555555;
					}
					.comm-surplus{
						padding-top:0.2rem;
						font-size: 0.5rem;
						font-weight: normal;
						font-stretch: normal;
						line-height: 0.75rem;
						letter-spacing: -0.01rem;
						color: #333333;
					}
					.comm-spec{
						font-size: 0.5rem;
						font-weight: normal;
						font-stretch: normal;
						line-height: 0.75rem;
						color: #333333;
						padding-top:0.5rem;
					}
					.comm-num{
						position: absolute;
						right: 0;
						bottom:0;
						min-width: 3.93rem;
						height: 1.5rem;
						border:1px solid #eee;
						display:flex;
						justify-content:space-between;
						align-items:center;
						.numIcon{
							flex:1;
							text-align: center;
						}
						input[type='number']{
							display:block;
							text-align:center;
							border-left: 1px solid #eee;
							border-right: 1px solid #eee;
							min-width:1.25rem;
							width:1.25rem;
							min-height:100%;
							max-height:100%;
							overflow:hidden;
							font-size: 0.7rem;
							font-weight: normal;
							font-stretch: normal;
							line-height: 0.75rem;
							color: #555555;
						}
						span{
							display:block;
							text-align:center;
							border-left: 1px solid #eee;
							border-right: 1px solid #eee;
							min-width:1.25rem;
							width:1.25rem;
							min-height:100%;
							max-height:100%;
							overflow:hidden;
							font-size: 0.7rem;
							font-weight: normal;
							font-stretch: normal;
							line-height: 0.75rem;
							color: #555555;
						}
					}
				}
			}
		}
	}
	.loading{
		width:100%;
		text-align:center;
		margin-top:30%;
		font-size:0.8rem;
		color:#333;
	}
	.bottom-warp{
		height:2.5rem;
		width: 100vw;
		background:#fafafa;
		padding-left:0.7rem;
		display:flex;
		align-items:center;
		position: relative;
		.words{
			padding-left:0.5rem;
			font-size: 0.65rem;
			font-weight: normal;
			font-stretch: normal;
			line-height: 0.75rem;
			letter-spacing: -0.01rem;
			color: #333333;
		}
		.pic{
			font-size: 0.85rem;
			font-weight: normal;
			font-stretch: normal;
			line-height: 0.75rem;
			letter-spacing: 0rem;
			color: #f39801;
			padding-left:0.9rem;
		}
		.keepButton{
			position: absolute;
			right:0;
			bottom:0;
			width: 6rem;
			height: 2.5rem;
			background-color: #f2be06;
			text-align:center;
			line-height:2.5rem;
			font-size: 0.85rem;
			font-weight: normal;
			font-stretch: normal;
			color: #333333;
			.small{
				font-size:0.7rem;
			}
		}
	}
	.radio-warp{
		width: 0.75rem;
		height: 0.75rem;
		background-color: #eeeeee;
		border: solid 0.03rem #c9c9c9;
		border-radius:50%;
		overflow:hidden;
		position:relative;
		&.active{
			background-color: #f2be06;
			font-size:1rem;
			display:flex;
			justify-content:center;
			align-items:center;
			color:#fff;
		}
		.checkbox{
			position: absolute;
			top:0;
			left: 0;
			width:100%;
			height:100%;
			opacity:0;
		}
	}
	.navbar, .baraa.bar-header{
		background:#fff;
		box-shadow: none;
		height:2rem;
		// top:2.5rem;
	}
</style>