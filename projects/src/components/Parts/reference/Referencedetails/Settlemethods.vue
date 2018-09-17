
 <template>
	<div class="prcontent" ref="warp" @click="get(false)">
		<div class="procont">
			<!-- 主体内容 -->
			<ul class="uls">
				<li v-for="(val,index) in lists"  :class="{ss:val.invoicetype}">
					<div class="top" ref="addInput" @click.stop="get(val,index)">
						<div class="left" v-show="isLeft">
							<i :class="val.id === value ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
						</div>
						<!-- 输入框 -->
						<div class="contents">
							<!-- readonly是否可以选中 -->

							<!-- <input v-focus type="text" v-model="val.name" :readonly="(index == thisIndex ? false : true)" /> -->
							<!-- calss -->
							<!-- :class="(index==thisIndex?'active':'')" -->
							<input type="text" v-focus  v-model="val.name" :readonly="readonly">
						</div>
					</div>
				</li>
			</ul>
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
				id:"",
				oldData:{},

			}
		},
		props:["methods"],
		mounted(){
			// this.getuser()
			this.getcommpy()
			// this.bizid=utrl.setbizid()
			this.isedit=false
		},
		watch:{
			
		},
		methods:{
			async getcommpy(){
				// 获取上一页面的内容
				this.value = this.methods.settle_id
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
				//获取结算方式数据
				let leaveurl="SettleMethods?token="+api.token+"&company_id="+this.company_id+"&size=30";
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
							this.$emit('emit-methods',false)
							// return
						}else{
							// this.$emit('my-event',val)
							for(let i=0;i<this.lists.length;i++){
								this.lists[i].invoicetype=false
								if(index==i){
									this.lists[i].invoicetype=true
									this.$emit('emit-methods',val,this.methods)
								}
							}
						}
					},200)
					return
				}else{
					this.thisIndex = index;
				}
			},

			edit(){
				this.readonly=false
				this.isLeft=false
				this.isedit=true
				this.isIcon=true
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
