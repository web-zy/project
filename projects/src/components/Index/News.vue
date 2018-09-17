<template>
	<div class="news_warp">
		<von-header>
	    	<span slot="title">
	    		<!-- <i v-if="!loginStatusApi" style="font-size:0.7rem;">登录中 <em class="ion-load-d"></em></i> -->
	    		<!-- <i v-else>{{msg}}</i> -->
	    		{{msg}}
	    	</span>
	    	<div class="button button-icon ion-ios-search-strong" slot="right" @click="goSearch"></div>
	    </von-header>
		<div id="tge" class="news_nav">
			<!-- <router-link
	         v-for="(item,index) in nav"
	         :key="item.name" v-bind:to="item.link"
	         v-bind:class="$route.path == nav[index].link ? 'active' : ''">
		       <span @click="navTab(index)"><em v-if="x[index] > 0"><badge :num=x[index]></badge></em>{{item.name}}</span>
		    </router-link> -->
		    <a v-for="(item,index) in nav"
	         :key="item.name"
	         :class="newsIndex == index ? 'active' : ''"
	         @click="navTab(index)">
		       <span><em v-if="x[index] > 0"><badge :num="x[index]"></badge></em>{{item.name}}</span>
		    </a>
		</div>
		<Staydo v-show="newsIndex == 0"></Staydo>
		<Notice v-show="newsIndex == 1"></Notice>
		<Myapply v-if="newsIndex == 2"></Myapply>
		<!-- <transition name="slide-fade" mode="out-in">
			  <router-view></router-view>
		</transition> -->
	</div>
</template>

<script>
	import api from "./../../asset/api.js";
	// import store from "./../../store/store.js"
	export default {
		data() {
			return {
				msg: '消息',
				loginStatusApi:false,
        x:[0,0,0],
				iscrollOption: {
					mouseWheel: true,
					preventDefault: true,
					bounce: true,
					momentum: true,
					startX: false
				},
				newsIndex: 0,
				nav: [{
						link: "/index/news/staydo",
						name: "我的待办"
					},
					{
						link: "/index/news/Notice",
						name: "抄送我的"
					},
					{
						link: "/index/news/Myapply",
						name: "我的申请"
					},
					// {
					// 	link: "/index/news/Chat",
					// 	name: "聊天"
					// }
				]
			}
		},
    provide(){
    	return{
    		unread:this
    	}
    },
		methods: {
			navTab: function(index) {
				this.newsIndex = index;
			},
			goSearch(){
				this.$router.push("/search");
			},
      setUnread(index,num){
        let arr = this.x
        arr[index] = num
        this.x.splice(0,arr)
      }
		},
		mounted() {
			let _this = this;
			let loginTimer = setInterval(function(){
				if(api.loginStatus)
					_this.loginStatusApi = api.loginStatus;
					clearInterval(loginTimer)
			},200)
			// this.$refs.iscroll.refresh();
		},
		// store
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .button-icon{
    display: flex;
    align-items: center;
  }
	.news_warp {
		/*padding-top: 1.5rem;*/
		padding: 5rem 0 2.5rem;
		width:100vw;
		height: 100vh;
		box-sizing: border-box;
		.ion-ios-search-strong{
			padding-top: .2rem;
		}
		.top {
			width: 100%;
			border-bottom: solid 1px #F3BF06;
			position: fixed;
			top: 0;
			z-index: 100;
			.top_utils {
				width: 100%;
				display: flex;
				-webkit-justify-content: space-between;
				height: 2.5rem;
				.backImg {
					width: 20%;
					background-image: url(../../../static/work_images/logo-small.png);
					background-size: 80% 100%;
					background-repeat: no-repeat;
					background-position-x: 0.5rem;
				}
				.put_box {
					width: 70%;
					display: flex;
					border-radius: 1rem;
					background: #fff;
					height: 1.8rem;
					margin-top: 0.35rem;
					.suso {
						width: 15%;
						background-image: url(../../../static/work_images/search.png);
						background-repeat: no-repeat;
						background-size: 50% 50%;
						background-position: 0.5rem 0.5rem;
					}
					input {
						width: 85%;
						border: none;
						border-radius: 0 0.8rem 0.8rem 0;
						height: 100%;
						font-size: 0.75rem;
					}
				}
				.txt {
					width: 10%;
					line-height: 2.2rem;
					text-align: center;
					font-size: 1.8rem;
				}
			}
		}
		.news_nav {
			display: flex;
			padding:0.25rem 0;
			background-color: #f1f1f1;
			margin: 0;
			position: fixed;
			top: 2.5rem;
			z-index: 10;
			width: 100%;
			left: 0;
			height: 2.5rem;
			line-height: 2rem;
			font-size: 16px;
			justify-content: space-around;
			a {
				flex: 1;
				width: 25%;
				display: block;
				text-align: center;
				background-color: #fdfdfd;
				color: #000000;
				text-decoration: none;
        		border-bottom: solid 2px #fdfdfd;
				span {
					display: block;
					width: 100%;
					height: 100%;
					font-size:0.7rem;
				}
				&.active {
					color: black;
					border-bottom: solid 2px #F3C41F;
				}
				span{
					position:relative;
					em{
						display:block;
						position:absolute;
						top: 30%;
            			transform:translate(0,-50%);
						right:1rem;
					}
				}
			}
		}
		.scroll-view {
			height: 100%;
			overflow: hidden;
			touch-action: none;
			/*这个东西一定不能少!!!!!!*/
		}
	}
</style>
