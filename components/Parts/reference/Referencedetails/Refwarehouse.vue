<template>
	<div class="prcontent" ref="warp" @click="get(false)" @touchmove.prevent>
		<div class="procont">
			<!-- 主体内容 -->
			<ul class="uls">
				<li v-for="(val,index) in lists">
					<div class="top" ref="addInput" @click.stop="get(val,index)">
						<div class="left">
							<i :class="val.id == getIndex ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
						</div>
						<!-- 输入框 -->
						<div class="contents">
							<input type="text" v-model="val.name" disabled="disabled">
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
				lists:[],
				index:"",
				getIndex:"",    //当前ID
				company_id:"",
				company_name:"",
				app_user_id:"",
				// bizid:"",
				oldData:{}

			}
		},
		props:["Refwarehouse"],
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
				
				this.getIndex = this.Refwarehouse.id
				// console.log(this.getIndex);
				// 用户信息
				let userInfo = api.userInfo;
				this.app_user_id=userInfo.id;
				this.app_user_name=userInfo.name;
				// 公司信息
				let mycompanies = utrl.getCompany()
				this.company_id = mycompanies.company_id
				this.company_name = mycompanies.company_name
				//获取仓库数据
				let leaveurl="warehouses?token="+api.token+"&company_id="+this.company_id;
				let leaveres=await api.get(leaveurl);

				if(leaveres.status >= 200 && leaveres.status < 300){
					this.lists=leaveres.data
				}else{
					$toast.show(leaveres.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
			},
			get(val,index){
				this.index=index;
				// 加上关闭动画的class名字
				this.$refs.warp.className += " close"					
				// 传参延时
				setTimeout(()=>{
					// 判断是否选中有效数据
					if(val == false){
						this.$emit('emit-getcommpys',false)
						return
					}else{
						// this.$emit('my-invoice',val)
						for(let i=0;i<this.lists.length;i++){
							if(index==i){
								// this.$emit('my-invoice',val,this.invoice)
								this.$emit('emit-getcommpys',val,this.Refwarehouse)
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
