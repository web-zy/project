<template>
	<div id="content" @click="hide">
		<router-view></router-view>
		<!--<div class="navs">
			<img :src="isshow==false?src1:src2" @click.stop="show"/>
			<div class="navlist" v-if="isshow" :class="isshow==false?'hide':'show'" @click.stop="actives">
				<ul>
					<router-link tag="li" v-for="nav in navlist" :to="nav.path" @click.stop="hides">{{nav.name}}
					<i :class="nav.classname"></i>
					</router-link>
				</ul>
			</div>
		</div>-->
		<div class="backcontent" v-if="isbackground">
			
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				src1:"../../../../../static/images/eeee_03.png",
				src2:"../../../../../static/images/qqq_03.png",
				navlist:[
					{name:"积分申请",path:"/integral/Addsubtraction",classname:"icon-AccountTable"},
					{name:"个人积分",path:"/integral/Personalintegral",classname:"icon-PersonalIntegral"},
					{name:"积分统计",path:"/integral/Integralstatistics",classname:"icon-PersonalStatistics"},
					{name:"积分设置",path:"/integral/Integralsetting",classname:"ion-ios-gear-outline"}
				],
				isshow:false,
				isbackground:false,
			}
		},
		mounted(){
			this.isshow=false
			this.isbackground=false
		},
		methods:{
			hides(){
				this.isshow=false
				this.isbackground=false
			},
			show(){
				this.isshow=!this.isshow
				this.isbackground=!this.isbackground
			},
			hide(){
				this.isshow=false
				this.isbackground=false
			},
			actives(){
				this.isshow=false
				this.isbackground=false
			}
		}
	}
</script>

<style scoped>
	#content{
		width:100%;
		height:100vh;
		background:#eee;
		z-index:3;
	}
	.navs{
		width:3rem;
		position:fixed;
		right:1.5rem;
		bottom:3rem;
		font-size:0.75rem;
		z-index:444;
	}
	.navs>img{
		width:2.5rem;
		height:2.5rem;
	}
	.navlist{
		width:15rem;
		height:10rem;
		position:absolute;
		bottom:3.5rem;
		right:0.2rem;
		background:white;
		border-radius:0.25rem;
		padding:0.9rem 0;
	}
	.navlist ul {
		width:100%;
		height:100%;
		display:flex;
		flex-direction: column;
		justify-content: space-around;
		
	}
	.navlist ul li{
		width:100%;
		list-style: none;
		display:block;
		height:2.3rem;
		display:flex;
		align-items: center;
		text-indent:0.5rem;
		display:flex;
		justify-content: flex-end;
		align-items: center;
		font-size:0.9rem;
	}
	.navlist ul li i{
		width:2rem;
		font-size:1.5rem;
		margin-right:0.8rem;
		color:#555;
		text-align:center;
		display:flex;
		justify-content: center;
		margin-left:0.4rem;
	}
	.navlist ul li:nth-child(3) i{
		font-size:1.2rem;
	}
	.navlist ul li:last-child i{
		font-size:1.6rem;
	}
	.router-link-active{
		color:#4a90e2;
	}
	.router-link-active i{
		color:#555;
	}
	.backcontent{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100vh;
		background:rgba(3,3,3,.4);
		z-index:33;
	}
</style>