<template>
	<div class="app-warp">
		<NewsWarp v-if="navIndex == 'news'"></NewsWarp>
		<Wooks v-if="navIndex == 'wooks'"></Wooks>
		<Account v-if="navIndex == 'account'"></Account>
		<MailList v-if="navIndex == 'maillist'"></MailList>
		<Mine v-if="navIndex == 'mine'"></Mine>
		<div class="bottom">
		<!-- <router-link
			v-for="(item,index) in nav"
			:key="item.name"
			:to="item.link"
			:class="$route.matched[2].path == item.link ? 'active' : ''">
			<span><i v-bind:class="['iconfont ', item.icon]"></i><em>{{item.name}}</em></span>
		</router-link> -->
		<a v-for="(item,index) in nav"
			:key="item.name"
			@click="navClick(item.label)">
			<span>
				<i :class="navIndex == item.label ? `${item.icon}colour` : item.icon"></i>
				<em :class="navIndex == item.label ? 'active' : ''">{{item.name}}</em>
			</span>
		</a>
</div>
	<!-- <div class="routerWarp" v-if="false">
		<transition name="slide-fade" mode="out-in">
			<keep-alive>
			    <router-view></router-view>
			</keep-alive>
		</transition>
	</div> -->
</div>
</template>

<script>
import api from "../asset/api.js"
import utrl from "./../controller/utrl.js"
export default {
	data() {
		return {
			nav: [
			{
				link: "/index/news",
				icon: "icon-News",
				name: "消息",
				label:"news"
			},
			{
				link: "/index/account",
				icon: "icon-AccountTable",
				name: "财务",
				label:"account"
			},
			{
				link: "/index/wooks",
				icon: "icon-Workbench",
				name: "工作",
				label:"wooks"
			},
			{
				link: "/index/maillist",
				icon: "icon-MailList",
				name: "通讯录",
				label:"maillist"
			},{
				link: "/index/mine",
				icon: "icon-My",
				name: "我的",
				label:"mine"
			},
			],
			navIndex:"news"
		}
	},
	beforeCreate(){
		// this.a()
	},
	mounted() {
		this.a()
	},
	methods: {
		navClick(index){
			this.navIndex = index
		},
		async a() {
			let _this = this;
			let userPass = {}
			if(localStorage.pass == null) {
				_this.$router.push({
					path: '/user/login'
				})
			}else{
				let res = await utrl.signIn({
					"uid":localStorage.user,
					"password":localStorage.pass
				})
				if(res == false){
					_this.$router.push({
						path: '/user/login'
					})
				}
			}
		}
	},
	activated(){
		if (this.$route.params.name == "login"){
			this.navIndex = "news"
			// this.$forceUpdate()
			// location.reload()
		}
	},
	beforeCreate(){
    // utrl.unfullscreen()
	},
	deactivated() {

	},
  //   components:{
		// NewsWarp,
		// Account,
		// MailList,
		// Mine
  //   }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.app-warp{
	background: #F5F5F5;
}
h1 {
	font-size: 2rem;
	text-align: center;
}
.bottom {
	height: 3rem;
	-webkit-justify-content: space-between;
	padding-top: 0.2rem;
	background-color: #f5f5f5;
	padding-bottom: 0.2rem;
	border-top: 0.05rem solid #dcdcdc;
	width: 100%;
	display: flex;
	position: fixed;
	bottom: 0;
	left: 0;
	display: flex;
	z-index:10;
	justify-content: space-between;
	a {
		width: 20%;
		text-align: center;
		span {
			display:flex;
			justify-content:center;
			flex-direction:column;
			height:100%;
			width: 100%;
			text-decoration: none;
			text-align: center;
			font-size: 12px;
			color: #666;
			position:relative;
			font-size:0.6rem;
			i {
				padding-top:0.1rem;
				font-size: 1rem;

			}
			em{
				display:block;
				color: #666;
			}
		}
	}
	.active {
		color: #f29011;
	}
}
.routerWarp{
	display:block;
	width:100vw;
	height:100vh;
	position:fixed;
	top: 0;
	left:0;
	right: 0;
	bottom:0;
	z-index:15;
}
</style>