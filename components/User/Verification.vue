<template>
	<div id="body">
		<div class="login_box">
			<div class="img_box">
				<img src="../../../static/work_images/logo-small.png" />
			</div>
			<div class="field">
				<p>请输入收到的短信验证码</p>
				<p>短信发送到的手机号：<font style="color: darkred;">{{info.uid}}</font></p>
			</div>
			<div class="input_box">
				<input type="text" name="u_name" ref="code" placeholder="请输入验证码" />
				<div class="btn_box Bcolor" @click="compReg">{{msg}}</div>
			</div>
			<div class="Abox">点击<span @click="back">返回上一页</span></div>
		</div>
	</div>
</template>

<script>
import api from "../../asset/api.js"
	export default {
		data() {
			return {
				msg: '完成注册',
				info:{
					"uid":"",
					"password" :""
				}

			}
		},
		mounted() {
			this.info = this.$route.params.data
		},
		methods: {
			back: function() {
				$router.go(-1)
			},
			async compReg(){
				let _this = this;
				let reg = new RegExp(/^\d{6}$/);
				let code = this.$refs.code.value;
				if(!reg.test(code)){
					$toast.show("请输入正确的验证码！", 3000).then(() => {})
					return
				}
				let obj = this.info;
				let url = "users?validCode=" + code;
				let res = await api.post(url,obj)
				if(res.status >= 200 && res.status < 300){
					_this.$router.push({
						name: 'login',
						params:{
							data:obj
						}
					});
					return
				}
				$toast.show(res.data.errmsg, 3000).then(() => {})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped="">
	@charset "UTF-8";
	// #body {
	// 	width: 100%;
	// 	height: 100vh;
	// 	font-size: 1rem;
	// 	background-image: url(../../../static/work_images/entry.png);
	// 	background-size: 230% 100%;
	// 	background-repeat: no-repeat;
	// 	background-position-x: -15rem;
	// 	z-index: -10;
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
				input {
					width: 65%;
					margin: 0 auto;
					border: solid 1px gray;
					border-radius: 1.5rem;
					height: 2.2rem;
					padding-left: 1rem;
					margin-bottom: 0.5rem;
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
			.Abox {
				text-align:right;
				width: 60%;
				margin: 0 auto;
				font-size: 0.5rem;
				padding-top:0.5rem;
				span{
				    color: #4a90e2;
				}
			}
			.security{
				width: 100%;font-size: 0.5rem;text-align: center;line-height: 1rem;margin-top: 1rem;
			}
		}
	// }
</style>