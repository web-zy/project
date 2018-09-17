<template>
	<div id="content">
		<von-header>
			 <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	      <span slot="title">{{title}}</span>
	       <div class="button button-icon companyname" slot="right">
				{{company_name}}
		 	</div>
		</von-header>
		<div class="nav">
			<router-link tag="div" v-for="(item,index) in navlist" :to="item.path" v-if="item.show">{{item.name}}</router-link>
		</div>
		 <router-view></router-view>	
	</div>
</template>

<script>
	import Vue from 'vue'
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return{
				title:"报表",
				company_name:"",
				company_id:"",
				indexs:0,
				navlist:[
					{name:"月报表",path:"/Workattendance/clocknav/Reportform/Monthlyreport",show:false,id:"1004050"},
					{name:"我的",path:"/Workattendance/clocknav/Reportform/Myreport",show:false,id:"1004040"}
				]
			}
		},
		mounted(){
			//let company_msg = JSON.parse(sessionStorage.getItem('company_msg'));
			let company_msg=utrl.getCompany()
			this.company_name=company_msg.company_name
			this.company_id=company_msg.company_id
			this.Jurisdiction()
		},
		methods:{
			back: function() {
				//$router.go(-1)
				this.$router.replace('/index')
			},
			tabnav(e){
				this.indexs=e
			},
			async Jurisdiction(){
				let url="usermenus/"+api.userInfo.id+"?token="+api.token+"&company_id="+this.company_id
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
						for(let i=0;i<res.data.length;i++){
							for(let j=0;j<this.navlist.length;j++){
								if(this.navlist[j].id==res.data[i].id){
									Vue.set(this.navlist[j],"show",true)
								}
							}
						}
				}else{
					
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
				}
			}
		}
	}
</script>

<style scoped>
	#content{
		width:100%;
		height:100vh;
		background:#eee;
		font-size:0.75rem;
		
	}
	.nav{
		width:100%;
		height:2.2rem;
		display:flex;
		justify-content: space-around;
		align-items: center;
		margin-top:2.75rem;
		background:#fdfdfd;
		box-sizing: border-box;
	}
	.nav div{
		padding:0 1rem;
		display:flex;
		justify-content: space-around;
		align-items: center;
		height:100%;
	}
	.router-link-active{
		border-bottom:1px solid #f2be06;
	}
	.companyname{
		display:block;
		max-width: 5rem;
	    height: 100%;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    white-space: nowrap;
	    display: block;
	    line-height: 40px;
	    text-align: right;
	}
</style>