<template>
	<div class="login_box">
		<div class="img_box">
			<img src="../../../static/work_images/logo-small.png" />
		</div>
		<div class="field">
			<!-- <p>请输入收到的短信验证码</p> -->
		</div>
		<div class="input_box">
			<input type="text" name="phone" v-model="data.phone"  placeholder="接收验证码的手机号" />
			<div class="code">
				<input type="text" name="code" v-model="data.code"  placeholder="请输入验证码" />
				<div class="Vcode" v-on:click="Forget">{{codeAle}}</div>
			</div>
			<input type="password" v-model="data.password"  placeholder="请输入新密码" />
			<input type="password" v-model="data.cofim"  placeholder="确认新密码" />
			<div class="btn_box Bcolor" @click="sublime">{{msg}}</div>
			<div class="Abox" @click="back">点击<span>返回上一页</span></div>
		</div>
	</div>
</template>

<script>
import api from "../../asset/api.js"
export default {
	data() {
		return {
			msg: '确认',
			codeNum:60,
			codeAle:"获取验证码",
			data:{
				phone:"",
				code:"",
				password:"",
				cofim:""
			}
		}
	},
	mounted() {
		//         this.kong();
		this.number = localStorage.user;
	},
	methods: {
		back(){
		  localStorage.clear();
			$router.go(-1);
		},
		inspect(getcode){
			let phone = this.data.phone;
			let code = this.data.code;
			let password = this.data.password;
			let cofim = this.data.cofim;
			let obj = {
				phone: phone,
				code: code,
				password:password
			}
			let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
			let codeReg = new RegExp(/^\d{6}$/);
			if (!phoneReg.test(phone) || phone == "") {
				$toast.show("请输入正确格式的手机号", 3000).then(() => {})
				obj.phone = false
				return obj
			}
			if(getcode){
				return obj
			}
			if(!codeReg.test(code) || codeReg == ""){
				$toast.show("请输入正确的验证码！", 3000).then(() => {})
				obj.code = false
			}
			if(password != cofim){
				$toast.show("两次密码输入不一致", 3000).then(() => {})
				obj.password = false
			}
			if(password == "" || cofim == ""){
				$toast.show("密码不能为空", 3000).then(() => {})
				obj.password = false
			}
			return obj
		},
		async sublime(){
			let _this = this;
			let obj = this.inspect()
			if(!obj.phone || !obj.code || !obj.password){
				return
			}
			let data = {
				uid: obj.phone,
				password: obj.password
			}
			obj.uid = obj.phone;
			let url = "users/current/password?validCode=" + obj.code;
			let res = await api.put(url,data)
			if(res.status >= 200 && res.status < 300){
				_this.$router.push({
					name: 'login',
					params:{
						data:{
							uid:obj.uid,
							password:obj.password
						}
					}
				});
				return
			}
			$toast.show(res.data.errmsg, 3000).then(() => {})
		},
		async Forget(){
			if(this.codeNum > 0 && this.codeNum < 60){
				return
			}
			var obj = this.inspect(true);
			var _this = this;
			if(!obj.phone){
				// return
			}
			var url = "sms";
			let tmpObj = {
				type :"User.ResetPassword",
				phone_number:obj.phone
			}
			let res = await api.post(url,tmpObj);
			let timerCode = null;
			if(res.status >= 200 && res.status < 300){
				$toast.show("发送成功，请注意查收", 3000)
				_this.codeNum--
				_this.codeAle = _this.codeNum + "s";
				timerCode = setInterval(function(){
					if(_this.codeNum <= 0){
						_this.codeAle = "获取验证码"
						_this.codeNum = 60;
						clearInterval(timerCode)
						return
					}
					_this.codeNum--
					_this.codeAle = _this.codeNum + "s";
				},1000)
				return
			}
			$toast.show(res.data.errmsg, 3000).then(() => {})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped="">
	.login_box {
		width: 80%;
		min-height: 20rem;
        padding: 1rem 0;
		// max-height: 100vh;
		border-radius: 0.6rem;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		background-color:rgba(255,255,255,0.8);
		.img_box {
			margin: 0 auto;
			width: 35%;
            padding-bottom: 1rem;
			//height: 6.5rem;
			//margin-top: 2rem;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.field{
			width: 75%;margin: 0 auto;font-size:0.7rem ;text-align: center;line-height: 1rem;margin-bottom: 0.5rem;
			p:nth-child(2){
				font-size: 0.6rem;
			}
		}
		.input_box {
			width: 100%;
			.code{
				position: relative;
				overflow:hidden;
				transform: rotate(0deg);
				width:65%;
				margin:0 auto;
				margin-bottom:0.5rem;
				border-radius:1.5rem;
				input{
					width:100%;
					margin:0;
				}
				.Vcode{
					width: 4rem;
					height: 2.2rem;
					line-height:2.2rem;
					font-size: 0.7rem;
					padding:0 0.2rem;
					position: absolute;
					top: 0;
					right: 0;
					background:rgba(0,0,0,0.1);
					text-align: center;
					color:#6b6b6b;
				}
			}
			input {
				width: 65%;
				margin: 0 auto;
				border: solid 1px gray;
				border-radius: 1.5rem;
				height: 2.2rem;
				padding:0;
				padding-left: 1rem;
				margin-bottom: 0.5rem;
			}
			.Abox {
				display:block;
				text-align:right;
				width: 70%;
				margin: 0 auto;
				font-size: 0.5rem;
				padding: 0 1.2rem;
				padding-top:0.5rem;
				span{
					color: #4a90e2;
				}
			}
			.btn_box{
				width: 65%;
				margin: 0 auto;
				border-radius: 1.5rem;
				height: 2.2rem;
				line-height: 2.2rem;
				color: #444;
				margin-top: 0.5rem;
				text-align: center;
			}
		}
		.security{
			width: 100%;font-size: 0.5rem;text-align: center;line-height: 1rem;margin-top: 1rem;
		}
	}
</style>
