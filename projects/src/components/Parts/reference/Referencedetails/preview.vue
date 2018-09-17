<template>
	<div class="outof" @click="hides">
		  <img :src="src"/>
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return{
				src:"",
				company_msg:{}
			}
		},
		props:['picdetails'],
		mounted(){
			this.company_msg=utrl.getCompany()
			//this.src="data:"+this.picdetails.Customarsrc
			//console.log(this.picdetails)
			//this.src=this.picdetails.src
			if(this.picdetails){
				this.getsrc()
			}
			
		},
		methods:{
			hides(){
				this.$emit("picturhide")
			},
			async getsrc(){
				$loading.show('加载中..')
				let url="images/"+this.picdetails.id+"?token="+api.token+"&company_id="+this.company_msg.company_id
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
	               	console.log(res)
	               	this.src="data:"+this.picdetails.type+";base64,"+res.data
	               	$loading.hide()
	               //	this.src="data:"+this.picdetails.Customarsrc
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
			}
		}
	}
</script>

<style scoped>
	.outof{
		width:100%;
		height:100vh;
		position:fixed;
		bottom:0;
		left:0;
		background:rgba(0,0,0,.4);
		display:flex;
		justify-content: center;
		align-items: center;
		z-index:999;
	}
	.outof img{
		width:100%;
	}
	
</style>