<template>
	<div class="prcontent" ref="warp" @click="get(false)">
		<div class="procont">
			<div v-if="editBtn" class="head">
				<P class="ion-compose" v-if="!isedit" @click.stop="edit"></P>
				<P class="ion-ios-undo" v-if="isedit" @click.stop="completes"></P>
			</div>
			<!-- 主体内容 -->
			<ul class="uls" ref="uls">
				<li v-for="(val,index) in lists">
					<div class="top" ref="addInput" @click.stop="get(val,index)">
						<div class="left" v-show="isLeft">
							<i :class="val.name == getIndex ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
						</div>
						<!-- 输入框 -->
						<div class="contents">
							<input type="text" v-focus v-model="val.name" :readonly="readonly">
						</div>
						<div  v-show="isIcon" class="edits">
							<!-- 编辑符号  ion-compose  icon-Feedback -->
							<i class="icon-Feedback" v-show="(index==thisIndex?false:true)"></i>
						</div>
					</div>
					<div class="icon" v-show="isIcon">
						<div v-show="(index==thisIndex?false:true)">
							<!-- 删除符号 -->
							<i class="ion-trash-a" @click.stop="deletes(val,index)"></i>
						</div>
						<div v-show="(index!=thisIndex?false:true)">
							<!-- 对号   icon-Agree  ion-ios-checkmark-outline-->
							<i class="icon-Agree" @click.stop="complete(val,index)"></i>
							<!-- 叉号  icon-Disagree    ion-ios-close-outline-->
							<i class="icon-Disagree" @click.stop="modify(val,index)"></i>
						</div>
					</div>
				</li>
			</ul>
			<div class="buttons">
				<div class="add" v-if="isedit" @click.stop="add"><i class="ion-ios-plus-outline"></i>添加</div>
			</div>
		</div>
	</div>
	
</template>

<script>
	import Vue from 'vue'
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	import './utrl/Reference.less'
	Vue.directive("focus",{
        inserted:function(el,obj){
             el.focus();
        }

    });
	export default{
		data(){
			return {
				lists:[],
				index:"",
				getIndex:"",
				company_id:"",
				company_name:"",
				app_user_id:"",
				// bizid:"",
				oldData:{},
				isedit:false,
				isLeft:true,
				isIcon:false,
				readonly:true,
				thisIndex:null,
				editBtn:false
			}
		},
		props:["costparameter"],
		mounted(){
			console.log(1111)
			this.getcommpy();
			this.permission();
			this.isedit=false
			// this.bizid=utrl.setbizid()
		},
		watch:{
			
		},
		methods:{
		    async permission(){
                let url = `usermenus/${api.userInfo.id}?token=${api.token}&company_id=${this.company_id}`;
                let res = await api.get(url);
				console.log(res)
                if(res.status >= 200 && res.status <= 300){
                    for(let val of res.data){
                        if(val.id == 1013090) this.editBtn = true;
                    }
                }else{
                    $toast.show(res.data.errmsg, 3000);
                }
			},
			async getcommpy(){
				// 获取上一页面的内容
				
				this.getIndex = this.costparameter.detail_id
				// 用户信息
				let userInfo = api.userInfo;
				this.app_user_id=userInfo.id;
				this.app_user_name=userInfo.name;
				// 公司信息
				let mycompanies = utrl.getCompany()
				this.company_id = mycompanies.company_id
				this.company_name = mycompanies.company_name
				//获取费用明细数据
				// let costurl="expenseclass/company_exp?token="+api.token+"&company_id="+this.company_id+"&size=130";;
				let costurl="expenseclass/company_exp?token="+api.token+"&company_id="+this.company_id+"&size=130";
				let leaveres=await api.get(costurl)

				if(leaveres.status >= 200 && leaveres.status < 300){
					this.lists=leaveres.data;
                    this.$nextTick(() => {this.$refs.uls.scrollTop = 0;});
				}else{
					$toast.show(leaveres.data.errmsg + "，请重试！", 3000).then(() => {})
				}
			},
			get(val,index){
				this.index=index;
				// 加上关闭动画的class名字
				if(this.isedit==false){
					this.$refs.warp.className += " close"					
					// 传参延时
					setTimeout(()=>{
						// 判断是否选中有效数据
						if(val == false){
							this.$emit('emit-cost',false)
							return
						}else{
							// this.$emit('my-invoice',val)
							for(let i=0;i<this.lists.length;i++){
                                if(index==i){
									// this.$emit('my-invoice',val,this.invoice)
									this.$emit('emit-cost',val,this.costparameter.costparameter)
								}
							}
						}
					},200)
					return
				}else{
					this.thisIndex = index;
				}
				
			},
			// 点击叉号
			modify(val,index){
				// 判断是修改的叉号还是添加的叉号
				if(val.id){				    //val.id是发票类型的独有的id
					this.thisIndex = null;
					this.getcommpy()
				}else{
					this.lists.pop();
				}
			},
			edit(){
				this.readonly=false
				this.isLeft=false
				this.isedit=true
				this.isIcon=true
			},
			async complete(val,index){
				var bizid=utrl.setbizid()
				if(val.id){
					let url="expenseclass/"+val.id+"?token="+api.token+"&bizid="+bizid+"&company_id="+this.company_id
						let res=await api.put(url,{
							name:val.name,
							company_id:this.company_id,
							company_name:this.company_name,
							user_id:this.app_user_id,
							id:val.id,
							doc_expense_person:null
						})
						if(res.status >= 200 && res.status < 300){
							$toast.show("修改成功", 1000).then(() => {})
							this.thisIndex = null;
							
						}else{
							$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
							return
						}
				}else{
					if(val.name==""){
						$toast("请输入内容或者取消添加",1000)
					}else{
						let url="expenseclass?token="+api.token+"&bizid="+bizid
						let res=await api.post(url,{
							name:val.name,
							company_id:this.company_id,
							company_name:this.company_name,
							user_id:this.app_user_id
						})
						if(res.status >= 200 && res.status < 300){
							$toast.show("添加成功", 1000).then(() => {})
							this.thisIndex = null;
						}else{
							$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
							return
						}
						
						
						
						
					}
					
				}
				
				
				
				
			},
			add(){
				this.lists.push({
					name:"",
					// bizid:utrl.setbizid()
				})
				this.thisIndex = this.lists.length-1;
			},
			// 删除
			async deletes(val,index){
				$dialog.confirm({
				  // 设置为ios样式
				  theme: 'ios',
				  // 标题
				  title: '确定删除' + val.name + '吗?',
				  // 取消按钮文本
				  cancelText: '取消',
				  // 确定按钮文本
				  okText: '确定'
				}).then(async (res) => {
				  //console.log('confirm result: ', res)
				  if(res==true){
				  		//this.lists.splice(index,1)
				  		// console.log(val)
				  		if(val.id){
				  			let bizid=utrl.setbizid();
				  			let url="expenseclass/"+val.id+"?bizid="+bizid+"&token="+api.token+"&company_id="+this.company_id;
				  			let res=await api.delete(url);
				  			if(res.status >= 200 && res.status < 300){
								$toast.show("删除成功", 1000).then(() => {})
							}else{
								$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
								return
							}
				  		}
				  		
				  		for(var i=0;i<this.lists.length;i++){
				  			if(i==index){
				  				this.lists.splice(index,1)
				  			}
				  		}
				  }
				})
			},
			completes(){
				this.getcommpy()
				this.isLeft=true
				this.isedit=false
				this.isIcon=false
				this.readonly=true
			}
		}
	}
</script>

<style lang="less" scoped>

</style>
