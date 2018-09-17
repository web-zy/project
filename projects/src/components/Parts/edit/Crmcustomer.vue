<template>
	<div id="content">
		<von-header>
		      <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
		      <span slot="title">{{title}}</span>
		      <div class="button button-icon company companyname" slot="right">{{company_name}}</div>
		</von-header>
		<div class="search">
			<input type="text"  placeholder="请输入搜索内容" v-model="searchs"/>
			 <!--<search v-model="searchs" placeholder="请输入搜索内容" :on-search="onSearch" :on-cancel="onCancel"></search>-->
			<i class="ion-ios-search i_search"></i>
			<i class="ion-ios-close i_delets" @click="emptys" v-if="searchs.length!=0"></i>	
		</div>
		<div v-for="(item,index) in inplist" class="reference" @click="edit(item,index)">
				<p><i :class="item.isTrue ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>{{item.name}}</p>
				<p class="fuhao fuhaos" v-if="!isedit"><i class="ion-edit"></i></p>
		</div>
		<div class="btnsub" v-if="isedit">
			<button @click="btnsub">编辑</button>
		</div>
		<div v-else class="btnsub">
			<button @click="addcustor" class="assbtmns">添加</button>
			<button @click="finish" class="btnfinsgh">完成</button>
		</div>
	</div>
</template>

<script>
	import api from '../../../asset/api.js'
	import utrl from '../../../controller/utrl.js'
	import '../reference/commoncss/common.css'
	export default{
		data(){
			return {
				title:"客户档案",
				company_name:"",
				commoditynum:"123",
				list:[
					{name:"基本信息",isactive:true},
					{name:"商品明细",isactive:false}
				],
				indexs:0,
				inplist:[
					
				],
				isedit:true,
				company_id:"",
				company_msg:{},
				searchs:""
			}
		},
		mounted(){
			this.isedit=true
			let company_msg = utrl.getCompany()
			this.company_name=company_msg.company_name
			this.company_id=company_msg.company_id
			this.getcrmcustomer()
			if(this.$route.params.val){
				console.log(this.$route.params.val)
			}
		},
		methods:{
			back: function() {
				$router.go(-1)
			},
			getindex(e){
				this.indexs=e
			},
			btnsub(){
				this.isedit=false
			},
			addcustor(){
				this.$router.push({name:"Addcrmcustomerm"})
			},
			edit(val){
				if(this.isedit==false){
					this.$router.push({name:"Modifycrmcustomer",params:{
						val:val
					}})
					
				}else{
					window.sessionStorage.setItem("Customer",JSON.stringify(val))
					$router.go(-1)
				}
			},
			finish(){
				this.isedit=true
			},
			deletes(){
				
			},
			async search(){
				let url="crmcustomerdocs?token="+api.token+"&company_id="+this.company_id+"&filter=name*"+this.searchs;
				let res=await api.get(url);
				if(res.status >= 200 && res.status < 300){
					this.inplist=res.data
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				
			},
			//获取客户档案信息
			async getcrmcustomer(){
				let url="crmcustomerdocs?token="+api.token+"&company_id="+this.company_id;
				let res=await api.get(url);
				if(res.status >= 200 && res.status < 300){
					this.inplist=res.data
					for(var i=0;i<this.inplist.length;i++){
						this.inplist[i].isTrue=false
						if(this.$route.params.val){
							if(this.inplist[i].id==this.$route.params.val.id){
								this.inplist[i].isTrue=true
							}
						}
					}
					
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				
			},
			//清空搜索
			emptys(){
				this.searchs=""
			}
		},
		watch:{
				searchs(a,b){
					var that=this
					setTimeout(function(){
							that.search()
					},500)
				
				}
			}
	}
</script>

<style lang='less' scoped>
#content{
	padding-top:1px;
	.companyname{
		width: 5.5rem;
	    height: 100%;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    white-space: nowrap;
	    display: block;
	    line-height: 40px;
	    text-align: right;
	}
	.search{
		width:100%;
		display:block;
		height:2.425rem;
		margin-top:2.5rem;
		margin-bottom:0.3rem;
		background:#fff;
		display:flex;
		align-items: center;
		position:relative;
	}
	.search input{
		display:block;
    	height: 1.375rem;
	    line-height: 1.375rem;
	    padding-left: 1.5rem;
	    width: 100%;
	    margin: 0 .5rem;
	    border-radius: 20px;
	    background-color: #eeeeee;
	    padding-top:0;
	}
	.search .i_search{
		position:absolute;
		font-size:1rem;
		left:1rem;
		color:#b9b9b9;
	}
	.search .i_delets{
		position: absolute;
	    right: 1rem;
	    font-size: 1rem;
	    color: #666;
	}
	.reference{
		p{
			margin-left:0.6rem;
			i{
				margin-right:0.5rem;
			}
		}
	}
	
}


</style>