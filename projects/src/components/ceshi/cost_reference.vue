<template>
	<div class="page-content padding padding-top content">
		<ul>
			<li v-for="val in costlist" @click="getcost(val)">
				<p>{{val.name}}</p>
			</li>
		</ul>	
	</div>
	
</template>

<script>
	import api from '../../asset/api.js'
	export default{
		data(){
			return {
				costlist:[],
				company_id:""
			}
		},
		mounted(){
			
			this.getcommpy()
			this.ssss=898
		},
		methods:{
			//获取公司id
			async getcommpy(){
				let url="users/current/mycompanies?token="+api.token
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					var data=res.data[0]
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				//console.log(res)
				this.company_id=data.company_id
				//获取costlist数据
				let costurl="expenseclass/company_exp?token="+api.token+"&company_id="+this.company_id;
				let response=await api.get(costurl);
				if(response.status >= 200 && response.status < 300){
					
				}else{
					$toast.show(response.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				
				this.costlist=response.data
				
			},
			getcost(val){
				console.log(1111)
				console.log(val)
				//this.$emit('emit-cost',val,this.parameter)
			}
			
		}
	}
</script>

<style scoped>
	.content{
		width:100%;
		height:100vh;
		background:white;
	}
	.content ul li{
		width:100%;
		padding:0 0.75rem;
		list-style:none;
		line-height:2rem;
		font-size:0.8rem;
		position:relative;
	}
	.content ul li p{
		text-indent:0.1rem;
		box-sizing: border-box;
		border-bottom:1px solid #eee;
	}
</style>