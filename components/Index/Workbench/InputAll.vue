<template>
	<div class="newOrder outOf">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			<span slot="title">{{title}}</span>
		</von-header>
		<div class="content">
			<input-text :name="'展示'" :edit="false" :alert="'暂无数据'" v-model="json.word"
				@change="a"
				@click="b">
			</input-text>
			<bee-form v-model="json" ref="form" :rules="rules">
				<bee-form-item prop="name">
					<Timetext :name="'可选择日期'"  :alert="'请选择时间'" v-model="json.daytime"
						@change="a"
						@click="b">
					</Timetext>
				</bee-form-item>
				<bee-form-item prop="name">
					<input-text :name="'可输入'" :alert="'请输入测试数据哦'" v-model="json.text"
						@change="a"
						@click="b">
					</input-text>
				</bee-form-item>
				<bee-form-item prop="email">
					<input-text :name="'EMail'" :alert="'请输入邮箱呢'" v-model="json.email"
						@change="a"
						@click="b">
					</input-text>
				</bee-form-item>
				<bee-form-item prop="age">
					<input-number :name="'Number'" :alert="'请输入数字'" v-model="json.num"
						@change="a"
						@click="b">
					</input-number>
				</bee-form-item>
				<bee-form-item>
					<input-radio :name="'性别'" :alert="'请选择性别'" v-model="json.sex"
                        :chioseData="[{name:'男',data:'boy'},{name:'女',data:'gril'}]"
						@change="a"
						@chick="b"><i class="icon-right ion-ios-arrow-forward"></i></input-radio>
				</bee-form-item>
				<bee-form-item>
					<input-toggle :name="'接受回访'" v-model="json.agree"
						@change="a"
						@chick="b"></input-toggle>
				</bee-form-item>
				<bee-form-item>
					<input-checkbox :name="'管理员'" v-model="json.arr"></input-checkbox>
				</bee-form-item>
				<bee-form-item>
					<input-datepicker :name="'日期'" :alert="'请选择时间'" v-model="json.date"></input-datepicker>
				</bee-form-item>
				<bee-form-item>
					<set-flow :name="'审批人'" :viceName="'这是个副标题'" v-model="json.userflow.users"></set-flow>
                    <set-flow :name="'审批人2'" :viceName="'这是个副标题'" v-model="json.userflow.users2"></set-flow>
				</bee-form-item>
			</bee-form>
			<ButtonBottom :loading="loading" @call-back="submit('form')">提交按钮</ButtonBottom>
		</div>
	</div>
</template>

<script>
import api from './../../../asset/api.js'
import utrl from './../../../controller/utrl.js'
export default{
	data(){
		return {
			title:"Input组件集",
			json:{
				daytime:"",
				text:"",
				email:"",
                date:"",
				word:"有点击回调的呦",
				num:"",
				agree:true,
				sex:"男",
				arr:[{id:233,name:'Boss'},{id:886,name:'NRR'},{id:886,name:'老三'},{id:886,name:'老三'},{id:886,name:'老三'},{id:886,name:'老三'},{id:886,name:'老三'},{id:886,name:'老三'}],
				userflow:{
					"users":[],
					"users2":[]
				}
			},
			rules:{
				name:{ 
                    regular:false, 
                    message: '名称长度在 3 到 5 个字符',
                    must:true},
				age:{ regular:"^(?:0|[1-9][0-9]?|100)$" , message: '请输入 0 - 100 之间的数字',must:true},
				email:{regular:"^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$",message:"请输入正确的邮箱格式",must:false}
			},
            loading:false
		}
	},
	created() {
		// let tmp = this.clearData
		// this.commitData = tmp;
	},
	mounted(){

	},
	methods:{
		b(){
			// console.log('执行点击回调')
		},
		a(val){
			// console.log(val,'执行change回调')
		},
		back() {
			$router.go(-1)
		},
		submit(formName){
            console.log(this.json)
            let _this = this;
            this.loading = true;
			this.$refs[formName].validate((valid) => {
				if(valid){
					console.log('All right,Implement Ajax',this.json)
                    //ajax结束后恢复提交状态
                    setTimeout(function(){
                        _this.loading = false
                    },1000)
				}else{
					console.log('有错误')
                    _this.loading = false
				}
			})
			// this.$refs[formName].validate()
		}
	},
	watch:{

	},
	components:{

	},
	activated(){

	},
	deactivated(){

	},
	destroyed(){

	}
}
</script>

<style rel="stylesheet/less" scoped>
/* @import "./utrl/NewOrder.less" */
</style>