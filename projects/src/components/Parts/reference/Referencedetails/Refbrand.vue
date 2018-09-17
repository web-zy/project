<template>
	<div class="prcontent" ref="warp" @click="get(false)">
		<div class="procont">
			<ul>
				<li v-for="(val,index) in lists"  :class="{ss:val.istrue}"  @click.stop="get(val,index)">
					<p>{{val.name}}</p>
					<!-- <p class="deletes" @click.stop="deletes(val,index)" v-if="isedit">×</p> -->
				</li>
			</ul>
			<div class="buttons">
				<button class="btn" @click.stop="edit" v-if="!isedit">编辑</button>
				<button class="btn" v-if="isedit" @click.stop="add">添加</button>
				<button class="btn" v-if="isedit" @click.stop="completes">完成</button>
			</div>
		</div>
	</div>
	
</template>

<script>
	import Vue from 'vue'
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	import './utrl/Reference.css'
	export default{
		data(){
			return {
				lists:[],
				index:"",
				isedit:false,
				company_id:"",
				company_name:"",
				app_user_id:"",
				bizid:""
			}
		},
		props:["Refbrand"],
		mounted(){
			// this.getuser()
			this.getcommpy()
			this.bizid=utrl.setbizid();
			this.isedit=false
		},
		methods:{
			
			async getcommpy(){
				// 用户信息
				let userInfo = api.userInfo;
				this.app_user_id=userInfo.id;
				this.app_user_name=userInfo.name;
				// 公司信息
				let mycompanies = api.mycompanies
				let data = mycompanies[0];
				this.company_id=data.company_id
				this.company_name=data.company_name
				//获取品牌数据
				let leaveurl="brands?token="+api.token+"&company_id="+this.company_id;
				let leaveres=await api.get(leaveurl)
				if(leaveres.status >= 200 && leaveres.status < 300){
					this.lists=leaveres.data
				}else{
					$toast.show(leaveres.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				for(let i=0;i<this.lists.length;i++){
					this.lists[i].istrue=false
				}
			},
			get(val,index){
				// 加上关闭动画的class名字
				this.$refs.warp.className += " close"
				// 传参延时
				setTimeout(()=>{
					// 判断是否选中有效数据
					if(val == false){
						this.$emit('emit-getcommpys',false)
						return
					}else{
						this.$emit('emit-getcommpys',val)
					}
				},200)

				this.index=index;
				if(this.isedit==false){
					for(let i=0;i<this.lists.length;i++){
						this.lists[i].istrue=false
						if(index==i){
							//Vue.set(this.lists[i],'istrue',true)
							this.lists[i].istrue=true
							this.$emit('my-brand',val,this.Refbrand)
						}
					}
				}else{
					for(let i=0;i<this.lists.length;i++){
						this.lists[i].istrue=false
						if(index==i){
							Vue.set(this.lists[i],'istrue','true')
							// 跳转修改页面
							this.$router.push({name:"Brandedit",params:{obj:val}})
						}
					}
				}
				
			},
			edit(){
				this.isedit=true
			},
			/*async deletes(val,index){
				$dialog.confirm({
				  // 设置为ios样式
				  theme: 'ios',
				  // 标题
				  title: '确定删除吗?',
				  // 取消按钮文本
				  cancelText: '取消',
				  // 确定按钮文本
				  okText: '确定'
				}).then(async (res) => {
				  	console.log( res)
				  	if(res==true){
				  		
				  		let url="brands/"+val.id+"?bizid="+this.bizid+"&token="+api.token+"&company_id="+this.company_id;
				  		let res= await api.delete(url);
				  		for(var i=0;i<this.lists.length;i++){
				  			if(i==index){
				  				this.lists.splice(index,1)
				  			}
				  		}
				  	}
				})
			},*/
			// 跳转添加页面
			add(){
				this.$router.push({name:"Brandadd",params:{company_id:this.company_id,company_name:this.company_name,app_user_id:this.app_user_id}})
			},
			completes(){
				this.isedit=false
				this.getcommpy()
			}
		}
	}
</script>

<style lang="less" scoped>
.buttons{
	width:100%;
	display:flex;
	justify-content: space-around;
	margin-bottom:0.2rem;
	margin-top:0.5rem;
}
.buttons .btn{
	display:block;
	border:0;
	text-align:center;
	line-height:1rem;
	height:1.4rem;
	padding:0 0.9rem;
	border-radius:0.7rem 0.7rem;
	border:1px solid #f2ad06;
	background:transparent;
}
</style>
