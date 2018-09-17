
<template>
	<div class="prcontent" ref="warp" @click="setCommpy(false)">
		<div class="procont">
			<!-- 主体内容 -->
			<ul class="uls">
				<li v-for="(val,index) in lists">
					<div class="top" ref="addInput" @click.stop="get(val,index)">
						<div class="left">
							<i :class="val.company_id == getIndex ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
						</div>
						<!-- 输入框 -->
						<div class="contents">
							<input type="text" v-model="val.company_name" disabled="disabled">
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
	
</template>

<script>
	import './utrl/Reference.less'
	import Vue from 'vue'
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return {
				lists:[],
				index:"",
				getIndex:"",
				company_id:"",
				company_name:"",
				// bizid:"",
				oldData:{}

			}
		},
		props:["commpy","guard"],
		mounted(){
			// this.getuser()
			this.getcommpy()
			// this.bizid=utrl.setbizid()
		},
		watch:{
			
		},
		methods:{
			getcommpy(){
				this.getIndex = this.commpy.id;
				this.lists = api.mycompanies;
				let data = this.lists
			},
			get(val){
                let _this = this
                if(this.guard != true){
                    this.setCommpy(val)
                    return
                }
                $dialog.confirm({
                    theme: 'ios',
                    title: '切换公司将清除已输入的内容哦！',
                    cancelText: '取消',
                    okText: '确定'
                }).then((res) => {
                    res ? _this.setCommpy(val) : _this.setCommpy(false)
                })
			},
			// 关闭遮罩层
            setCommpy(val){
				// 加上关闭动画的class名字
				this.$refs.warp.className += " close"
				// 传参延时
				setTimeout(()=>{
					// 判断是否选中有效数据
					if(val == false){
						this.$emit('emit-getcommpys',false)
						return
					}else{
						this.$emit('emit-getcommpys',val)
					}
				},200)
            }
		}
	}
</script>

<style lang="less" scoped>

</style>
