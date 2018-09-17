<template>
	<div class="content">
		<von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="commoy" slot="right">
            	<select v-model="company_name">
            		<option class="option1" v-for="item in commpylist" :value="item.company_name">{{item.company_name}}</option>
            	</select>
            </div>
        </von-header>
		<div class="information">
			<ul>
				<li>
					<p>客户全称</p>
					<input type="text" name="" id="" v-model="name"/>
				</li>
				<li>
					<p>客户简称</p>
					<input type="text" name="" id="" v-model="abb_name"/>
				</li>
				<li>
					<p>备注</p>
					<input type="text" name="" id="" v-model="remarks"/>
				</li>
			</ul>
			
			<button v-if="isshow" class="btn" @click="submit">提交</button>
			<button v-else class="btn1">已阅</button>
		</div>
	</div>
</template>

<script>
	import api from "../../asset/api.js"
	import utrl from '../../controller/utrl.js'
	export default{
		data(){
			return {
				msg:"快速报备",
				name:"",
				abb_name:"",
				remarks:"",
				isshow:true,
				bizid:"",
				company_id:"",
				company_name:"",
				app_user_id:"",
				app_user_name:"",
				commpylist:""
			}
		},
		mounted(){
			//根据时间戳获取唯一数据
			//var data="000-"+new Date().getTime();
			//console.log(data)
			this.bizid=utrl.setbizid()	
			this.getcommpy()
			this.getuser()
	},
	methods: {
		//获取company_id和company_name
		async getcommpy(){
			let url="users/current/mycompanies?page=1&size=20&token="+api.token;
			let res=await api.get(url)
			console.log(res);
			this.commpylist=res.data
			if(res.status==200){
				this.company_id=res.data[0].id
				this.company_name=res.data[0].company_name
			}
			console.log(this.company_id)
			console.log(this.company_name)
		},
		async getuser(){
			let url="users/current?token="+api.token;
			let res=await api.get(url)
			if(res.status==200){
				this.app_user_id=res.data.id
				this.app_user_name=res.data.DisplayName
			}
		},
		back() {
			$router.go(-1)
		},
		async submit() {
			console.log(1)
			console.log(this.bizid)
			console.log(api.token)
			var url ="crmcustomers?token="+api.token+"&bizid="+this.bizid;
				var obj={
					app_user_id:this.app_user_id,
					app_user_name:this.app_user_name,
					company_id:this.company_id,
					company_name:this.company_name,
					name:this.name,
					abb_name:this.abb_name,
					remarks:this.remarks
				}
				let res=await api.post(url,obj);
			}
		}
	}
</script>

<style lang="less" scoped>
*{
    padding:0;
    padding:0;
    padding-top:1px;
    border:none;
}
.commoy{
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
	line-height:2rem;
	font-size: 0.75rem;
	width:5rem;
	select{
		width:100%;
		background:transparent;
	}
}
select::-ms-expand { display: none; }
.option1{
	width:100%;
	outline:none;
	background:pink;
	color:red;
	border:0;
}
.information{
	width:100%;
	margin-top:2.5rem;
	ul{
		width:100%;
		li{
			width:100%;
			height:1.85rem;
			list-style:none;
			display:flex;
			justify-content: space-between;
			border-bottom:1px solid #eeeeee;
			align-items: center;
			font-size:0.7rem;
			p{
				margin-left:0.5rem;
			}
			input{
				width:10rem;
				margin-right:0.5rem;
				text-align:right;
				outline:none;
			}
		}
		
	}
	.btn{
		width:100%;
		height:1.85rem;
		background:#888888;
	}
	.btn1{
		width:100%;
		background:#f0eded;
		height:1.85rem;
	}
}

</style>