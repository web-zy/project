<template>
	<div class="prcontent" ref="warp" @click="get(false)">
		<div class="procont">
			<!-- 主体内容 -->
			<ul class="uls">
				<li v-for="(val,index) in lists">
					<div class="top" ref="addInput" @click.stop="get(val,index)">
						<div class="left">
							<i :class="val.item_details == pickname ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
						</div>
						<!-- 输入框 -->
						<div class="contents">
							<input type="text" v-model="val.item_details" disabled="disabled">
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
	
</template>

<script>
	import Vue from 'vue'
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	import './utrl/Reference.less'
	export default{
		data(){
			return {
				lists:[
					{item_class:"01",item_details:"职场态度"},
					{item_class:"02",item_details:"岗位能力"}
				],
				index:"",
				getIndex:"",
				company_id:"",
				company_name:"",
				app_user_id:"",
				// bizid:"",
				oldData:{},

			}
		},
		props:['pickname'],
		mounted(){
			// this.getuser()
			this.getcommpy()
			// this.bizid=utrl.setbizid()
		},
		watch:{
			
		},
		methods:{
			async getcommpy(){
				// 获取上一页面的内容
				
				//this.getIndex = this.costparameter.detail_id
				// 用户信息
				let userInfo = api.userInfo;
				this.app_user_id=userInfo.id;
				this.app_user_name=userInfo.name;
				// 公司信息
				let mycompanies = utrl.getCompany()
				this.company_id = mycompanies.company_id
				this.company_name = mycompanies.company_name
				
			},
			get(val,index){
				this.index=index;
				// 加上关闭动画的class名字
				this.$refs.warp.className += " close"					
				// 传参延时
				setTimeout(()=>{
					// 判断是否选中有效数据
					if(val == false){
						this.$emit('emit-cost',false)
						return
					}else{
						// this.$emit('my-invoice',val)
						for(let i=0;i<this.lists.length;i++){
							if(index==i){
								// this.$emit('my-invoice',val,this.invoice)
								this.$emit('emit-cost',val)
							}
						}
					}
				},200)
			}
		}
	}
</script>

<style lang="less" scoped>

</style>
