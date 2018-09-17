<template>
	<div class="newOrder">
		<!-- header -->
		<von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title">{{navConfig.title}}</span>
            <div class="button button-icon" slot="right">{{navConfig.menuButtonText}}</div>
        </von-header>

		<!-- tab -->
		<div class="page-content">
			<div class="light-bg">
				<button-bar theme="energized" :tab-items="promotions" :tab-index="promotionIndex"
				:on-tab-click="index => promotionIndex = index"></button-bar>
			</div>
		</div>
		<!-- list -->
		<scroll class="list-warp">
	        <list class="list-ios" v-show="promotionIndex == 0">
				<item class="item-icon-right">
					<span class="">业务员</span>
					<span class="item-note">张三</span>
					<i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
				</item>
				<von-input type="text" v-model="username" label="客户"></von-input>
				<datepicker label="交货日期" v-model="birthday" date-format="yyyy-mm-dd" class="flex"></datepicker>
				<div class="item item-input item-select flex">
				    <div class="input-label">发票类型</div>
				    <select>
				      <option selected="">不需要发票</option>
				      <option>电子发票</option>
				      <option>纸质发票</option>
				    </select>
				    <div class="hairline-top"></div>
				</div>
				<datepicker label="定货日期" v-model="birthday" date-format="yyyy-mm-dd" class="flex"></datepicker>
				<von-input type="text" v-model="username" label="联系人"></von-input>
				<von-input type="tel" v-model="username" label="联系电话"></von-input>
				<von-input type="text" v-model="username" label="发货地址"></von-input>
				<div class="item item-input item-select flex">
				    <div class="input-label">仓库</div>
				    <select>
				      <option selected="">仓库一</option>
				      <option>仓库二</option>
				    </select>
				    <div class="hairline-top"></div>
				</div>
				<div class="item item-input item-select flex">
				    <div class="input-label">关联合同</div>
				    <select>
				      <option selected="">仓库一</option>
				      <option>仓库二</option>
				    </select>
				    <div class="hairline-top"></div>
				</div>
				<von-input type="text" v-model="username" label="备注"></von-input>
	        </list>

	        <list class="padding" v-show="promotionIndex == 1">
	        	<item v-for="(val,index) in commodity">
	        		
	        	</item>
	    		<button class="button button-energized button-block" @click="$router.forward('/addCommodity')">添加</button>
	        	<!-- <item>111</item> -->
	        </list>
		</scroll>
		<!-- botton -->
		<div class="bottomBtn">
            <span class="botton">暂存</span>
            <span class="botton">提交</span>
        </div>
	</div>
</template>

<script>
export default {
	data() {
		return {
            navConfig:{
                title: "",
                showBackButton: true,
                onBackButtonClick: this.back,
                showMenuButton:true,
                menuButtonText:"默认公司"
            },
            promotions: ["基本信息", "商品明细"],
        	promotionIndex: 0,
        	username:"1",
        	birthday:"",
        	commodity:[]
		}
	},
	mounted() {
		if(this.$route.params.title){
			this.navConfig.title = this.$route.params.title
		}else if(this.$route.params.data){
			this.commodity = this.$route.params.data
		}
	},
	methods: {
		back() {
            $router.go(-1)
        },
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
	.newOrder{
		padding-top: 2.5rem;
		.von-input-wrapper{
			.item{
				padding-left:0;
			}
		}
		.list-warp{
			position: absolute;
			top:calc(3.5rem + 1.5rem);
			bottom:3rem;
			left:0;
			right:0;
		}
		.bottomBtn{
	        display:flex;
	        justify-content: space-between;
	        height:3rem;
	        position:absolute;
	        bottom:0;
	        width: 100%;
	        background: rgba(0,0,0,.8);
	        .botton{
	            display:block;
	            color: #fff;
	            line-height:3rem;
	            height:100%;
	            text-align: center;
	            width:30%;
	            font-size: 0.7rem;
	        }
	    }
		.input-label,.von-input-wrapper .von-input .input-label{
			font-size: 0.7rem;
		}
		.von-input-wrapper .von-input input{
			text-align: right;
		}
		.flex{
			display:flex;
			justify-content: space-between;
			padding-right:15px;
			padding-left:0;
			padding-top:13px;
			padding-bottom: 13px;
			span{
				width: 50%;
				text-align: right;
				padding-right: 24px;
				&.input-label{
					text-align: left;
				}
			}
		}
		.item-select option{
			direction: inherit;
			text-align: left;
		}
		.von-button-bar{
			margin: 0;
		}
		// .grade-a .item{
		// 	padding:0;
		// }
		.page-content{
			padding:0.5rem;
		}
	}

</style>