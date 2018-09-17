
 <template>
	<div class="prcontent" ref="warp" @click="get(false)">
		<div class="procont">
			<!--编辑和放回符号 -->
			<div v-if="editBtn" class="head">
				<P class="ion-compose" v-if="!isedit" @click.stop="edit"></P>
				<P class="ion-ios-undo" v-if="isedit" @click.stop="completes"></P>
			</div>
			<!-- 主体内容 -->
			<ul class="uls">
				<li v-for="(val,index) in lists">
					<div class="top" ref="addInput" @click.stop="get(val,index)">
						<div class="left" v-show="isLeft">
							<i :class="val.name === value ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
						</div>
						<!-- 输入框 -->
						<div class="contents">
							<!-- readonly是否可以选中 -->

							<!-- <input v-focus type="text" v-model="val.name" :readonly="(index == thisIndex ? false : true)" /> -->
							<!-- calss -->
							<!-- :class="(index==thisIndex?'active':'')" -->
							<input type="text" v-focus  v-model="val.name" :readonly="readonly">
						</div>
						<div  v-show="isIcon">
							<i class="ion-compose" v-show="(index==thisIndex?false:true)"></i>
						</div>
					</div>
					<div class="icon" v-show="isIcon">
						<div v-show="(index==thisIndex?false:true)">
							<!-- 删除符号 -->
							<i class="ion-trash-a" @click.stop="deletes(val,index)"></i>
						</div>
						<div v-show="(index!=thisIndex?false:true)">
							<!-- 对号 -->
							<i class="ion-ios-checkmark-outline" @click.stop="complete(val,index)"></i>
							<!-- 叉号 -->
							<i class="ion-ios-close-outline" @click.stop="modify(val,index)"></i>
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

	/*Vue.directive("focus",{
        inserted:function(el,obj){
             el.focus();
        }

    });*/
	export default{
		data(){
			return {
				lists:[],
				index:"",
				thisIndex: null,
				value:"",
				isedit:false,
				isLeft:true,
				readonly:true,
				isIcon:false,
				company_id:"",
				company_name:"",
				app_user_id:"",
				user_id:"",
				// bizid:"",
				// id:"",
				oldData:{},
                editBtn:false,

			}
		},
		props:["parameters"],
		mounted(){
			// this.getuser()
			this.getcommpy();
            this.permission();
			// this.bizid=utrl.setbizid()
			this.isedit=false
		},
		watch:{
			
		},
		methods:{
            async permission(){
                let url = `usermenus/${api.userInfo.id}?token=${api.token}&company_id=${this.company_id}`;
                let res = await api.get(url);

                if(res.status >= 200 && res.status <= 300){
                    for(let val of res.data){
                        if(val.id == 1013110) this.editBtn = true;
                    }
                }else{
                    $toast.show(res.data.errmsg, 3000);
                }
            },
			async getcommpy(){
				// 获取上一页面的内容
				this.value = this.parameters.holidaytype
				// 用户信息
				let userInfo = api.userInfo;

				this.app_user_id=userInfo.id;
				this.app_user_name=userInfo.name;
				// 公司信息
				// let mycompanies = api.mycompanies

				// let data = mycompanies[0]
				// console.log(data)
				// 获取公司信息
				let mycompanies = utrl.getCompany()
				this.company_id=mycompanies.company_id
				this.company_name=mycompanies.company_name
				//获取请假类型数据
				let leaveurl="holidaytypes?token="+api.token+"&company_id="+this.company_id+"&size=30";
				let leaveres=await api.get(leaveurl)
				if(leaveres.status >= 200 && leaveres.status < 300){
					this.lists=leaveres.data
					// console.log(this.lists)
					var idArr= []
					for(var i=0;i<this.lists.length;i++){
						idArr.push(this.lists[i].id);
					}
					this.id=idArr;
				}else{
					$toast.show(leaveres.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				for(let i=0;i<this.lists.length;i++){
					this.lists[i].invoicetype=false
				}	
			},
			get(val,index){
			
				this.index=index;
				if(this.isedit==false){
					// 加上关闭动画的class名字
					this.$refs.warp.className += " close"					
					// 传参延时
					setTimeout(()=>{
						// 判断是否选中有效数据
						if(val == false){
							this.$emit('emit-leave',false)
							// return
						}else{
							// this.$emit('my-event',val)
							for(let i=0;i<this.lists.length;i++){
								this.lists[i].invoicetype=false
								if(index==i){
									this.lists[i].invoicetype=true
									this.$emit('emit-leave',val,this.parameters)
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
			complete(val,index){
				console.log(index)
				var bizid=utrl.setbizid()
				// 点击本条的数据
				for(var i=0; i<this.lists.length;i++){
					if(this.id[index] == this.id[i]){
						var id = this.id[index]
					}

				}
				// 判断是修改的对号还是添加的对号
				if(val.id){					//val.id是发票类型的独有的id
					console.log("修改接口")
					// 修改接口

					let url="holidaytypes/"+id+"/?bizid="+bizid+"&token="+api.token
					let res=api.put(url,{
						name:val.name,
						company_id:this.company_id,
						company_name:this.company_name,
					})
					$toast.show("修改成功", 1000).then(() => {})
					// 选中状态改为选中状态
					this.thisIndex = null;
				}else{
					console.log("添加接口")
					if(val.name==""){
						$toast.show("请输入内容或者取消添加", 1000).then(() => {})
					}else{
						// 添加接口
						let url="holidaytypes?bizid="+bizid+"&token="+api.token;
						let res=api.post(url,{
							name:val.name,
							company_id:this.company_id,
							company_name:this.company_name,
							user_id:this.user_id
						})
						$toast.show("添加成功", 1000).then(() => {})
						this.thisIndex = null;
					}
					
				}
			},
			edit(){
				this.readonly=false
				this.isLeft=false
				this.isedit=true
				this.isIcon=true
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
				  		let bizid=utrl.setbizid();
				  		let url="holidaytypes/"+val.id+"?bizid="+bizid+"&token="+api.token+"&company_id="+this.company_id;
				  		let res=await api.delete(url);
				  		for(var i=0;i<this.lists.length;i++){
				  			if(i==index){
				  				this.lists.splice(index,1)
				  			}
				  		}
				  }
				})
			},
			// 添加发票类型
			add(){
				this.lists.push({
					name:"",
					// bizid:utrl.setbizid()
				})
				this.thisIndex = this.lists.length-1;
				// console.log(2222)
				// console.log(this.lists);
				// document.getElementsByClassName("input")[this.thisIndex].focus();
				// console.log(document.getElementsByClassName("input")[this.thisIndex])
			},
			// 返回选择页
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
