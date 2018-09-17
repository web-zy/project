<template>
	<div id="content">
		<von-header>
		      <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
		      <span slot="title">{{title}}</span>
		      <div class="button button-icon company companyname" slot="right">{{company_name}}</div>
		</von-header>
		<div class="reference_top">
			
		</div>
		<div v-for="(item,index) in inplist" class="timelist" >
				<div id="">
					<p>名称 : {{item.time_name}}&nbsp; ({{item.work_time}})</p>
					<p class="clocknum">打卡{{item.clock_frequency}}次  <span v-if="item.total_duration"> {{item.total_duration}}时</span></p>
				</div>
				<p class="fuhao fuhaos" v-if="!isedit"><i class="ion-edit" @click="edit(item,index)"></i><i class="icon-Delete" @click.stop="remove(item,index)"></i></p>		
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
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	import '../../../establish/commoncss/common.css'
	export default{
		data(){
			return {
				title:"工作时间",
				company_name:"",
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
				this.$router.push({name:"Kqworktimeset"})
			},
			edit(val){
				if(this.isedit==false){
					this.$router.push({name:"Kqworktimeset",params:{
						val:val
					}})
					
				}else{
					$router.go(-1)
				}
			},
			finish(){
				this.isedit=true
			},
			deletes(){
				
			},
			//shanchu
			async remove(val,e){
				$dialog.confirm({
				  // 设置为ios样式
				  theme: 'ios',
				  // 标题
				  title: '确定删除吗?',
				  // 取消按钮文本
				  cancelText: '取消',
				  // 确定按钮文本
				  okText: '删除'
				}).then(async (res) => {
				  if(res==true){
				  	let url="kqworktimesets/"+val.id+"?token="+api.token+"&company_id="+this.company_id
				  	let res=await api.delete(url)
				  	if(res.status >= 200 && res.status < 300){
						$toast.show("删除成功", 1000).then(() => {})
						for(var i=0;i<this.inplist.length;i++){
				  			if(i==e){
				  				this.inplist.splice(e,1)
				  			}
				  		}
					}else{
							$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
							return
						}
				  }
				})
			},
			//获取客户档案信息
			async getcrmcustomer(){
				let url="kqworktimesets?token="+api.token+"&company_id="+this.company_id;
				let res=await api.get(url);
				if(res.status >= 200 && res.status < 300){
					this.inplist=res.data
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
		}
	}
}
.fuhaos{
	width:3rem;
	display:flex;
	height:100%;
	justify-content: space-between;
	align-items: center;
}

</style>