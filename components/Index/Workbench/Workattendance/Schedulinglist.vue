<template>
	<div id="content">
		<von-header>
		      <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
		      <span slot="title">{{title}}</span>
		      <div class="button button-icon company companyname" slot="right">{{company_name}}</div>
		</von-header>
		<div class="reference_top">
			
		</div>
		<div class="scrollout">
			<scroll>
					<div v-for="(item,index) in inplist" class="timelist">
					<div class="timelist_item">
						<p class="miaoshu">{{item.schedule_name}} ({{item.schedule_type}})</p>
						<p class="description" v-html="item.schedule_description"></p>
						<p class="description">{{item.staff | names}}</p>
						<div class="fuhaoout">
							<p class="fuhao fuhaos" v-if="!isedit"><i class="ion-edit"  @click="edit(item,index)"></i><i class="icon-Delete" @click.stop="remove(item,index)"></i></p>	
						</div>
						
					</div>
				</div>
			</scroll>
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
				title:"排班时间",
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
		filters:{
			names(val){
				var str="";
				for(var i=0;i<val.length;i++){
					if(i==val.length-1){
						str+=val[i].person_name
					}else{
						str+=val[i].person_name+","
					}
				}
				return str
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
				this.$router.push({name:"Scheduling"})
			},
			edit(val){
				if(this.isedit==false){
					this.$router.push({name:"Schedulingedit"})
					sessionStorage.setItem('Schedulinglist',JSON.stringify(val))
				}else{
					//$router.go(-1)
				}
			},
			finish(){
				this.isedit=true
			},
			deletes(){
				
			},
//			async search(){
//				let url="kqworktimesets?token="+api.token+"&company_id="+this.company_id+"&filter=name*"+this.searchs;
//				let res=await api.get(url);
//				if(res.status >= 200 && res.status < 300){
//					this.inplist=res.data
//				}else{
//					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
//					return
//				}
//				
//			},
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
				  	let url="kqschedulesets/"+val.id+"?token="+api.token+"&company_id="+this.company_id
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
				let url="kqschedulesets?token="+api.token+"&company_id="+this.company_id;
				let res=await api.get(url);
				if(res.status >= 200 && res.status < 300){
					this.inplist=res.data
					for(var i=0;i<this.inplist.length;i++){
						let descriptionstr=this.inplist[i].schedule_description.slice(5)
						descriptionstr=descriptionstr.split(",")
						descriptionstr=descriptionstr.join("")
						this.inplist[i].schedule_description=descriptionstr
						
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
		}
	}
}
.fuhaoout{
	width:100%;
	display:flex;
	justify-content: flex-end;
}
.fuhaos{
	width:3rem;
	display:flex;
	height:100%;
	justify-content: space-between;
	align-items: center;
	text-align:right;
}
.reference .miaoshu{
	width:65%;
	height:auto;
	padding:0.5rem 0;
}
.timelist_item{
	width:100%;
}
.description{
	color:#999;
}
.scrollout{
	position:relative;
	width:100%;
	height:85vh;
}
#content .scrollout .scroll{
	top:0;
}
</style>