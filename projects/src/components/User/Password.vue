<template>
	<div id="body">
		<div class="login_box">
			<div class="img_box">
				<img src="../../../static/work_images/logo-small.png" />
			</div>
			<div class="input_box">
				<input type="text" ref="pass1" placeholder="请设置密码" />
				<input type="text" ref="pass2" placeholder="请确认密码" />
				<router-link to="/Login"></router-link>
				<div class="btn_box Bcolor" @click="Confirm">{{msg}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import api from "../../asset/api.js"
export default {
	data() {
		return {
			msg: '确认',
		}
	},
	mounted() {
       
	},
	methods: {
   		async Confirm () {
   			var _this = this;
   			var pass1Val = this.$refs.pass1.value;
   			var pass2Val = this.$refs.pass2.value;

   			console.log(pass1Val,pass2Val);
   			var url = 'users?tradeId=22&validCode=111';
   			var obj = {};
   			obj.uid = localStorage.phone_number;
   			obj.password = pass1Val;
   			var json = JSON.stringify(obj);
   			console.log(url,obj);
   			console.log(obj.uid,obj.password);
   			console.log(obj);
   			console.log(json);
   			let res = await api.post(url,obj)
			
			_this.$router.push({
				path: '/Login',
			});
   		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped="">
	@charset "UTF-8";
	// #body {
	// 	width: 100%;
	// 	min-height: 100vh;
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
			.input_box {
				width: 100%;
				input {
					width: 65%;
					margin: 0 auto;
					border: solid 1px gray;
					border-radius: 1.5rem;
					height: 2.2rem;
					text-indent: 1rem;
					margin-bottom: 0.5rem;
				}
				.Abox {
					width: 70%;
					margin: 0 auto;
					font-size: 0.5rem;
					display: flex;
					-webkit-justify-content: space-between;
					padding: 0 1.2rem;
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
	// }
</style>