<template>
<div class="outOf">
	<div id="allorder">
		<!-- 顶部内容 -->
		<von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title">{{title}}</span>
            <div class="button button-icon company" slot="right">{{company_name}}</div>
        </von-header>
        <!-- 个人详细内容 -->
        <div class="subInfo">
        	<div class="head-por">
                <head-portrait :userInfo="{'user_name':orderData.app_user_name,'head_image_id':$route.params.head_image_id}" :size="'large'"></head-portrait>
        	</div>
        	<div class="info">
        		<div class="a-single">
        			<span class="name">{{displayName}} 111</span>
        			<span><i style="opacity:0;">：</i>{{createAt | time}}</span>
        			<!-- <span class="name" style="padding-left:1rem;">提交</span> -->
        		</div>
        		<div class="a-single">
        			<span class="name">单号 1111</span>
        			<span>：{{serialNum}}</span>
        		</div>
        	</div>
        </div>
        <!-- 主体内容 -->
        <div class="content">
        	<div class="content-warp">
        			<!-- 表单内容 -->
        		<scroll style="margin-top: 0;">
					<item style="margin-bottom:0.5rem;" v-for="item,index in tempArrs" v-if="item != tempArrs['公司名称']">
						<div class="info-list">
							<label>{{index}}</label>
							<span>{{item}}</span>
						</div>
					</item>

					<div class="flowchart">
						<!-- 流程内容 -->
						<Flowchart></Flowchart>
					</div>
				</scroll>
				<!-- <scroll style="margin-top: 3rem;">

				</scroll> -->
        	</div>

        </div>
		<ApprovalButton :btns=buttons @clickBack="approvalClcik"></ApprovalButton>
	</div>
</div>
</template>

<script>
	import ApprovalButton from "./utrl/Approvalbutton.vue";
	import Flowchart from "./utrl/Flowchart.vue";
	import TabItem from "./utrl/Tab.vue";
	import api from "../../../../asset/api.js";
	import "./utrl/style.less"
	import utrl from '../../../../controller/utrl.js'
	export default {
		data() {
			return {
				// 订单名称
				title: '',
                userMsg:'',
				// src:'',
				// 个人详细数据
				createAt:'',
				displayName:'',
				serialNum:'',
				//表格数据
				tempArrs: '',

				company_name: "",
				// taskid & 接口名字
				del_info:{name:"",id:0},
				form_info:"",
           			// 审批按钮
				buttons:[
					// btnid为审批接口名称
					{name:"同意",btnId:"quickagree",icon:"icon-Agree"},
					{name:"拒绝",btnId:"reject",icon:"icon-Disagree"},
					//{name:"退回",btnId:"return",icon:"icon-Return"}
				],
				trialList:[]
			}
		},
		filters:{
			time: function(val) {
				val=String(val)
				return val.split('T')[0];
			},
			showTime(val){
				return val.split('T')[0] + " " + val.split('T')[1];
			}
		},
		mounted() {
				this.guid = utrl.setbizid()
				this.userMsg = api.userInfo;
				this.userMsg.user_name = api.userInfo.name;
				this.del_info = {
					name:this.$route.params.interface,
					id:this.$route.params.id,
					stepId:this.$route.params.stepId
				}

				this.title = this.$route.params.po
				// 头部信息
				this.displayName = this.$route.params.displayName
				this.createAt = this.$route.params.createAt
				this.serialNum = this.$route.params.serialNum

				this.tempArrs= this.$route.params.form  //从上一页面获取到数据

    },
		methods: {
			back: function() {
				$router.go(-1)
			},
			//补0
			repairZero(num){
				return num < 10 ? "0" + num : num;
			},

			// 详细信息展示
			showDetailed(index){
				if(this.orderData.details[index].showDrop){
					this.orderData.details[index].showDrop = false;
				}else{
					this.orderData.details[index].showDrop = true;
				}
				for(let i in this.orderData.details){
					if(i == index){
						continue
					}
					this.orderData.details[i].showDrop = false;
				}
			},
			approvalClcik(val){
				utrl.approvalClcik(val,{
					name:this.del_info.name,
					stepId:this.del_info.stepId,
					id:this.del_info.id
				})
			}
		},
		components:{
			ApprovalButton,TabItem,Flowchart
		}
	}
</script>

<style lang="less" scoped>

</style>
