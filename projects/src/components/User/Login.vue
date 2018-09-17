<template>
	<div class="login_box">
		<div class="img_box">
			<img src="../../../static/work_images/logo-small.png" />
		</div>
		<div class="input_box">
			<input type="text" ref="name" name="u_name" id="u_name" v-model="loginData.uid" placeholder="请输入账号"/>
			<input type="password" ref="pass" name="u_password" id="u_password" v-model="loginData.password" placeholder="请输入密码"  @keyup.enter="getObj()"/>
			<div class="Abox">
				<router-link to="/user/register">新用户注册</router-link>
				<router-link to="/user/forget">忘记密码</router-link>
			</div>
			<div id="btn" class="btn_box Bcolor" @click="getObj()">登录</div>
		</div>
	</div>
</template>
<script>
	import api from '../../asset/api.js'
	import utrl from "./../../controller/utrl.js"
	export default {
		data() {
			return {
				msg: '',
				loginData:{
					uid:localStorage.user ? localStorage.user : "",
					password:localStorage.pass ? localStorage.pass : ""
				}
			}
		},
		mounted() {
			if(this.$route.params.data){
				localStorage.user = this.$route.params.data.uid;
				localStorage.pass = this.$route.params.data.password;
			}
			if(localStorage.user && localStorage.pass){
				this.loginData = {
					uid:localStorage.user,
					password:localStorage.pass
				}
				this.login(this.loginData)
			}
		},
		methods: {
			getObj(){
				this.login(this.loginData)
			},
			async login(obj){
				let res = await utrl.signIn(obj)
				if(res == true){
					// this.$destroy()
					this.$router.replace({
						path: '/index',
						name:'index',
						params: {
			                name: 'login',
			            }
					})
				}
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
				// text-indent: 0.75rem;
				padding-left:0.75rem;
				margin-bottom: 0.5rem;
			}
			.Abox {
				width: 70%;
				margin: 0 auto;
				font-size: 0.5rem;
				display: flex;
				-webkit-justify-content: space-between;
				padding: 0.5rem 1.2rem;
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
		}
	}
</style>