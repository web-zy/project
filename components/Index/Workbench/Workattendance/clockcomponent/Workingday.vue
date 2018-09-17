<template>
	<!-- 遮罩层 -->
	<div class="prcontent" ref="warp" @click="getcost(false)">
		<!-- 内容层 -->
		<div class="procont proconts">
			<!-- 公司列表 -->
			<ul>
				<li v-for="(val,index) in costlist" :class="{ss:val.istrue}">
					<div class="top" ref="addInput" @click.stop="getcost(val,index)">
						<div class="left">
							<i :class="val.time_name == getIndex ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
						</div>
						<!-- 输入框 -->
						<div class="contents">
							<p>{{val.time_name}} <span v-if="val.work_time">({{val.work_time}})</span></p>
							<!-- <input type="text" v-model="val.name" disabled="disabled"> -->
						</div>
					</div>
					
				</li>
			</ul>
			<!-- 功能按钮 -->
			
			<!-- <div class="button-warp">
				<div class="buttons" @click.stop="addcompy">创建公司</div>
			</div> -->
		</div>
	</div>
</template>

<script>
	import api from '../../../../../asset/api.js'
	import utrl from '../../../../../controller/utrl.js'
	import '../../../../../asset/Reference.css'
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
		props:["workdayname"],
		mounted(){
			//let company_msg = JSON.parse(sessionStorage.getItem('company_msg'));
			let company_msg=utrl.getCompany()
			this.company_id=company_msg.company_id
			this.getworkdays()
		},
		methods:{
			//获取数据
			async getworkdays(){
				// 获取上一页面的内容
				this.getIndex = this.workdayname.time_name
				let url="kqworktimesets?token="+api.token+"&company_id="+this.company_id
				let res=await api.get(url)
				this.costlist=res.data
				this.costlist.push({
					time_name:"休息",
					work_time:"",
					id:null
				})
			},
			// 关闭遮罩层
			getcost(val,workdayname){
				// 加上关闭动画的class名字
				this.$refs.warp.className += " close"
				// 传参延时
				setTimeout(()=>{
					// 判断是否选中有效数据
					if(val == false){
						this.$emit('emit-workday',false)
						return
					}else{
						this.$emit('emit-workday',val,this.workdayname)
					}
				},200)
			}
		},
		activated(){
			// 执行ajax ，更新参照中的数据
		}
	}
</script>

<style lang="less" scoped>
.prcontent{
	position:fixed;
	width:100%;
	height:100%;
	background:rgba(0,0,0,0.2);
	top:0;
	left:0;
	z-index:10;
	animation:maskBlack .1s forwards ;
	opacity:0;
}
.procont{
	position:absolute;
	left:50%;
	top:50%;
	transform:translate(-50%,-50%);
	// width:12rem;
	width:94%;
	// height:12rem;
	max-height:80vh;
	padding-top:0.5rem;
	padding-bottom:0.5rem!important;
	padding-bottom: 0;
	display:flex;
	flex-direction: column;
	justify-content: flex-start;
	background:white;
	animation:procontSize .5s forwards ;
	z-index:11;
	border-radius: 0.25rem;
}
@keyframes maskBlack{
	from {opacity:0}
	to {opacity:1}
}
@keyframes procontSize{
	from {transform:translate(-50%,-50%) scale(0.1);}
	to {transform:translate(-50%,-50%) scale(1);}
}
.prcontent.close{
	animation:maskBlackBack .2s;
}
.close .procont{
	animation:procontSizeBack .2s;
}
@keyframes procontSizeBack{
	from {transform:translate(-50%,-50%) scale(1);}
	to {transform:translate(-50%,-50%) scale(0);}
}
@keyframes maskBlackBack{
	from {opacity:1}
	to {opacity:0}
}
/* 主体内容 */
.procont ul{
	overflow-y: scroll;
	flex: 1;
}
.procont ul li{
	padding:0 1.15rem;
	list-style:none;
	line-height:2rem;
	font-size:0.8rem;
	position:relative;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.procont ul li{
	display: -webkit-flex;
    display: flex;
	max-width: 100%;
    text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	box-sizing: border-box;
}
.top{
	width: 100%;
	display: -webkit-flex;
    display: flex;
}
.content{
	font-size: 0.8rem;
	line-height: 2rem;
	width: 93%;
}
.content input{
	font-size: 0.8rem!important;
	height: 2rem;
	padding-left:0.1rem;
	background: #fff!important;
}
.active{
	border:1px solid #4a90e2;
	border-radius:0.25rem;
}
.left i{
	font-size: 1rem;
	display:block;
	line-height: 2rem;
	padding-right: 1.15rem;
}
.ion-checkmark-circled{
    color:#f2bf07;
}
.ion-ios-circle-outline{
    color:#bbb;
}
.ss{
	background:pink;
}
</style>