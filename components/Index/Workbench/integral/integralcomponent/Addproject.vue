<template>
	<div class="prcontent" ref="warp" @click="getcost(false)">
		<!-- 内容层 -->
		<div class="procont proconts">
			<!-- 公司列表 -->
			<ul class="uls">
				<li v-for="(val,index) in costlist" :class="{ss:val.istrue}">
					<div class="top" ref="addInput" @click.stop="getcost(val,index)">
						<div class="left">
							<i :class="val.item_class == getIndex ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
						</div>
						<!-- 输入框 -->
						<div class="contents">
							<input type="text" v-model="val.item_class" disabled="disabled">
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import api from '../../../../../asset/api.js'
	// import  '../../../../../asset/Reference.css'
	import  '../../../../Parts/reference/Referencedetails/utrl/Reference.css'
	import utrl from '../../../../../controller/utrl.js'
	export default{
		data(){
			return {
				// 默认的数据列表
				costlist:[],
				// 默认选中的ID
				company_id:"",
				getIndex:""
			}
		},
		props:["addproject"],
		mounted(){
			// 获取api里存储的公里列表
			
			//let company_msg=JSON.parse(window.sessionStorage.getItem("company_msg"))
			let company_msg=utrl.getCompany()
			this.company_id=company_msg.company_id
			this.getcommpy()
		},
		methods:{
			//获取公司列表
			async getcommpy(){
				// 获取上一页面的内容
				this.getIndex = this.addproject.item_class
				//this.costlist = api.mycompanies;
				let url="scoreset/company_item?token="+api.token+"&company_id="+this.company_id
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					this.costlist=res.data	
				}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
					}
			},
			// 关闭遮罩层
			getcost(val){
				// 加上关闭动画的class名字
				this.$refs.warp.className += " close"
				// 传参延时
				setTimeout(()=>{
					// 判断是否选中有效数据
					if(val == false){
						this.$emit('chose-addproject',false)
						return
					}else{
						this.$emit('chose-addproject',val)
					}
				},200)
			},
			addcompy(){
				this.$emit("addcompy")
				// $router.push("/index")
			}
		},
		activated(){
			// 执行ajax ，更新参照中的数据
		}
	}
</script>

<style lang="less" scoped>

</style>