<template>
		<div class="login_box">
			<div class="img_box">
				<img src="../../../static/work_images/logo-small.png" />
			</div>
			<div class="input_box">
				<input type="text" ref="number" name="u_name"  placeholder="请输入手机号" />
				<input type="password" ref="password" name="u_pass"  placeholder="请输入密码" />
				<router-link to="/Verification"></router-link>
				<div class="btn_box Bcolor" @click="Register"><span class="mask" ref="mask"></span>{{msg}}</div>
			</div>
			<div class="Abox">
				已有账号？点击去<router-link to="/user/login">登录</router-link>
				<span class="Count" v-show="count < 60 && count > 0">{{count}}s</span>
			</div>
			<!-- <div class="security">
				<div>开始使用小蜜蜂REP即表示同意以下协议</div>
				<div>
					《<a href="javaScript:;">服务协议</a>》
					《<a href="javaSscript:;">隐私政策</a>》
				</div>
			</div> -->
		</div>
</template>

<script>
import api from "../../asset/api.js"
	export default {
		data() {
			return {
				msg: '获取验证码',
				count: 60,
			}
		},
		mounted() {
			console.log(this.$router)
		},
		methods: {
			async Register(){
				let number = this.$refs.number.value;
				let Obj = {};
				let _this = this;
				let url = "sms";
				let password = this.$refs.password.value;
				let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if (!myreg.test(number) || number == "") {
					$toast.show("请输入正确格式的手机号", 3000).then(() => {})
					return;
				}else if(password == ""){
					$toast.show("密码不能为空", 3000).then(() => {})
					return;
				}
				var isurl="users/"+number+"/available"
				let response = await api.get(isurl);
				console.log(number)
				if(response.status >= 200 && response.status < 300){
					console.log(response.data);
					if(response.data){
						$toast.show("账号已存在", 3000).then(() => {})
						return
					}else{
						if(this.count > 0 && this.count < 60){
							return
						}
					}
				}
				Obj["type"]="User.Register";
				Obj["phone_number"]= number;
				let res = await api.post(url,Obj)
				if(res.status >= 200 && res.status < 300){
					this.setCount()
					_this.$router.push({
						name: 'verification',
						params:{
							data:{
								"uid":number,
								"password":password
							}
						}
					});
					return
				}
				$toast.show(res.data.errmsg, 3000).then(() => {})
			},
			setCount(){
				let _this = this;
				let widthNum = 100;
				_this.count--;
				widthNum = _this.count / 60 * 100 + "%";
				_this.$refs.mask.style.opacity = 1;
				let timer = setInterval(function(){
					if(_this.count <= 0){
						clearInterval(timer)
						_this.$refs.mask.style.width = 100 + "%";
						_this.$refs.mask.style.opacity = 0;
						_this.count == 60;
						return
					}
					_this.count--;
					widthNum = _this.count / 60 * 100 + "%";
					_this.$refs.mask.style.opacity = 1;
					_this.$refs.mask.style.width = widthNum;
				},1000)
				return false
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
		.input_box {
			width: 100%;
			input {
				width: 65%;
				margin: 0 auto;
				border: solid 1px gray;
				border-radius: 1.5rem;
				height: 2.2rem;
				// text-indent: 1rem;
				margin-bottom: 0.5rem;
				padding-left:1rem;
			}
			.btn_box {
				width: 65%;
				margin: 0 auto;
				border-radius: 1.5rem;
				height: 2.2rem;
				line-height: 2.2rem;
				color: #444;
				margin-top: 0.5rem;
				text-align: center;
			}
			.Bcolor{
				position:relative;
				overflow:hidden;
				transform: rotate(0deg);
				span{
					// z-index:10;
					// position:relative;
				}
				.mask{
					display:block;
					position:absolute;
					z-index:9;
					transition:all 1s;
					background:rgba(0,0,0,0.2);
					width:100%;
					height:100%;
					top:0;
					right:0;
					opacity:0;
					// border-radius:1.5rem;
				}
			}
		}
		.Abox {
			width: 60%;
			margin: 0 auto;
			font-size: 0.5rem;
			padding-top:0.5rem;
			position:relative;
			.Count{
				position:absolute;
				right:0;
				padding:0 0.5rem;
			}
		}
		.security {
			width: 100%;
			font-size: 0.5rem;
			text-align: center;
			line-height: 1rem;
			padding: 0.5rem 0;
		}
	}
</style>