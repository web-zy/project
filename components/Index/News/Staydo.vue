<template>
	<div id="Staydo" class="newsList">
		<scroll class="page-content scroll-view staydo-scroll" :on-refresh="onRefresh" :on-infinite="onInfinite">
			<ul>
				<li class="lis" v-for="(item,index) in arr" :class="item.ExtDeleted ? 'toLeft' : ''">
					<div class="cen" @click.stop="routerGo(item.process_english_name,item.TaskID,item.process_vue_name,item.ProcessName,item.Description,item.head_img_url_medium,item.DisplayName,
					item.CreateAt,item.SerialNum,item.StepID,item.head_image_id)">
							<div class="a">
								<font>{{item.DisplayName}}<span v-if="item.DisplayName">的</span>{{item.ProcessName}}</font>
								<font class="time">{{item.CreateAt | time}}</font>
							</div>
							<div class="text-wrap" v-if="item.Description">
								<div class="pad">
									<!--<span class="spaceFont">单号<i class="stationc"></i></span><span>：{{item.SerialNum}}</span>-->
									<span v-if="item.is_show_code !== 0" class="spaceFont">单号：{{item.SerialNum}}</span>
								</div>
								<div v-for="n,i in item.Description">
									<!--<div class="pad" v-if="n != item.Description['公司名称']" >-->
										<!--<span class="spaceFont">{{i}}<i class="stationc"></i></span><div class="indent">：{{n}}</div>-->
									<!--</div>-->
									<div class="pad" v-if="n != item.Description['公司名称']" >
										<span class="spaceFont">{{i}}</span>：{{n}}
									</div>
								</div>
								<div class="seeDetails">查看详情 <i class="ion-ios-arrow-forward"></i></div>
								<!-- <div class="pad">{{item.Description | Text_3}}</div>
								<div class="pad">{{item.Description | Text_4}}</div> -->
							</div>
						<!--<div style="margin: 0.3rem 0;height: 1px; background:#eee;"></div>-->
						<div class="btns">
							<div class="divs" style="display: flex;">
								<div class="ran">{{item.Description['公司名称'] ? item.Description['公司名称'] : '小蜜蜂' | strExclude}}</div>
								<div class="company">
									<ul style="color:#333;font-size:0.7rem;line-height: 1.58rem;background-color:#fff;">
										<li>&nbsp;{{item.Description['公司名称'] ? item.Description['公司名称'] : '小蜜蜂'}}</li>
									</ul>
								</div>
							</div>
							<div class="divs">
								<input class="act" type="button" value="拒绝" @click.stop="fastReject(item.TaskID,item.process_english_name,index)" />
								<input type="button" value="同意" @click.stop="fastAgree(item.StepID,item.process_english_name,index)">
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div v-if="infiniteCount" slot="infinite" class="text-center">没有更多数据</div>
		</scroll>
		<!-- <router-view></router-view> -->
	</div>
</template>
<script>
	import api from "../../../asset/api.js"
	import utrl from "../../../controller/utrl.js"
	import "./utrl/style.less"
	export default {
		data() {
			return {
				msg: [],
				arr: [],
				infiniteCount: false,
				page:1,
        searchMode:false,                                       //搜索模式
        ishide:false,
        totals:0
      }
		},
    inject: ['unread'],
		// computed:mapState(['login']),
		filters: {
			time: function(val) {
        let dataYear = Number(val.split('-')[0])
        let nowYear = Number(new Date().getFullYear())
        // let time = ''
        // time = (nowYear - dataYear) > 0 ? val.split('T')[0] : val.split('T')[0].split('-')[1] + "-" + val.split('T')[0].split('-')[2];
        if((nowYear - dataYear) > 0){
          return val.split('T')[0]
        }
        let dataMonth = Number(new Date(val).getMonth()+1)
        let nowMonth = Number(new Date().getMonth()+1)
        if((nowMonth - dataMonth) > 0){
          return val.split('T')[0].split('-')[1] + "-" + val.split('T')[0].split('-')[2]
        }
				let nowDate = Number(new Date().getDate());
				let valDate = Number(new Date(val).getDate())
				let differDate = (nowDate - valDate);
				if(differDate >= 1 && differDate < 2){
					return "昨天"
				}else if(differDate >= 0 && differDate < 1){
					console.log(new Date(val).getMinutes())
					if(new Date(val).getMinutes()<10){
						return new Date(val).getHours() + ":0" + new Date(val).getMinutes()
					}else{
						return new Date(val).getHours() + ":" + new Date(val).getMinutes()
					}
				}else{
					return val.split('T')[0].split('-')[1] + "-" + val.split('T')[0].split('-')[2]
				}
				// return val.split('T')[0] + ' ' + val.split('T')[1].split('').splice(0, 8).join('');
			},
            strExclude: function(val){
                val.replace(/(有限|股份|软件|技术|电子|公司)/g,'');
                return val.substr(-1);
            }
		},
    activated(){
      let _this = this;
      if(api.loginStatus){
      					console.log(11);
      					this.cartView();
      }else{
      					console.log(22);
      	let loginStatusTimer = setInterval(function(){
      		if(api.loginStatus)
      			_this.cartView()
      			clearInterval(loginStatusTimer)
      	}, 500)
      }
    },
		mounted() {
			let _this = this;
			if(api.loginStatus){
                this.cartView();
			}else{
				let loginStatusTimer = setInterval(function(){
					if(api.loginStatus)
						_this.cartView()
						clearInterval(loginStatusTimer)
				}, 500)
			}
			// if(!store.state.login){
				// this.cartView();
			// }
            this.guid = utrl.setbizid();
		},
		methods: {
			routerGo(path,id,vue_name,processname,description,src,displayName,createAt,serialNum,stepId,head_image_id){
				utrl.routerGo(path,id,vue_name,processname,description,src,displayName,createAt,serialNum,stepId)
				console.log(path)
				$router.push({
					path:path,
					name:path,
					params:{
						id:id,
						stepId:stepId,
						interface:path,
						po:processname,
						form:description,
						src:src,
						displayName:displayName,
						createAt:createAt,
						serialNum:serialNum,
						head_image_id:head_image_id
					}
				})
			},
      		//获取列表PendingTasks
			async cartView(done) {
        let _this = this;
				var url = "";
				var key = this.keyword;
        if(key !== undefined) {                         //搜索模式
          key = "keyword=" + key;
          if(this.searchMode === false){                //防止第一次进页面加载数据。
              this.searchMode = true;
              this.infiniteCount = true;
              return;
          }
        }else{
          this.searchMode = false;
          key = "";
        }
		url = "PendingTasks?"+ key +"&page=" + this.page + "&size=10" + "&token=" + api.token;
        let res = await api.get(url);
        	if(res.status === 204 || res.status === 504){
            	if(this.searchMode === true) this.arr = [];
                this.infiniteCount = true;
                return;
			}
            if(res.status >= 200 && res.status < 300){
                res = res.data;
                this.totals = res.length > 0 ? res[0].totals : 0
                if(this.unread) this.unread.setUnread(0,this.totals)
                // 获取详细信息
                console.log(res)
                for(let i = 0; i < res.length; i++){
                    if(res[i].Description == undefined){
                        res[i].Description={公司名称:""}
                    }else{
                      try{
                          res[i].Description=JSON.parse(res[i].Description);// 转换成对象
                      }catch(err){
                        res[i].Description="{\"错误描述\":\"json转换错误\"}";
                        res[i].Description=JSON.parse(res[i].Description);// 转换成对象
                      }
                    }
                }
			          if(res[0].totals > this.arr.length){
					      if(this.onCk === true){
					          this.page = 1;
					          this.arr = res;
					          this.$emit("ck-off",false);
					      }else{
					          this.arr.length == 0 ? this.arr = res : this.arr = this.arr.concat(res);
					      }
					      if(done)done();
					      if(res[0].totals > this.arr.length){
					          this.infiniteCount = false
					      }else{
                              this.page = 1;
					          this.infiniteCount = true;
					      }
			          }else{
			            this.infiniteCount = true;
			          }
		        }else{
		          //$toast.show(res.data.errmsg, 2000);
		          this.infiniteCount = true;
		        }
				// _this.arr = res;
				_this.$nextTick(function() {
					_this.$emit('domload', true);
				})
			},
			// 刷新
		    onRefresh(done) {
                if(this.searchMode === false){
			        this.page = 1;
			        this.arr = [];
			        this.cartView();
                }else{
                    if(this.keyword !== ''){
                        this.page = 1;
                        this.arr = [];
                        this.cartView();
                    }
                }
                done();
			},
			//下一页
			onInfinite(done) {
				if(this.infiniteCount){
					done();
					return
				}
				this.page = this.page+1;
				this.cartView(done);
            },
			// 同意
			async fastAgree(step,inter,index) {
				$dialog.confirm({
					theme: 'ios',
					title: '确定同意该审批吗？',
					cancelText: '取消',
					okText: '同意'
				}).then(async (res) => {
				    if(res){
				        let url = inter + "/0/quickagree/" + step + "?bizid=" + this.guid + "&token=" + api.token;
				        let res = await api.patch(url)
					    if(res.status >= 200 && res.status < 300){
				            res = res.data;
				        }else{
				            $toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						    return
						}
						if(res.taskid){
							// this.arr.splice(index, 1)
							this.deleteData(index,"已同意")
						}
				  }
				})
			},
			// 拒绝
            fastReject(id,inter,index) {
                // $dialog.confirm({
                //     theme: 'ios',
                //     title: '确定拒绝该审批吗？',
                //     cancelText: '取消',
                //     okText: '确定'
                // }).then(async (res) => {
                //     if(res){
                //         let url = inter + "/0/reject/" + id + "?bizid=" + this.guid + "&token=" + api.token;
                // 	    let res = await api.patch(url)
                // 	    if(res.status >= 200 && res.status < 300){
                // 	        res = res.data;
                // 	    }else{
                // 	        $toast.show(res.data.errmsg + "，请重试！", 3000)
                // 		    return
                // 	    }
                // 	    if(res.taskid){
                // 	        // this.arr.splice(index, 1)
                // 		    this.deleteData(index,"已拒绝")
                // 	    }
                //     }
                // })
                utrl.order_module_func(inter,"reject",id, res => {
                    if(res) this.deleteData(index,"已拒绝");
                    else $toast.show("拒绝失败，请重试！", 500);
                });
            },
			// 删除数据方法
			deleteData(index,text){
				let _this = this;
				this.arr[index].ExtDeleted = true;
				setTimeout(function(){
					_this.arr.splice(index, 1)
				},500)
        this.totals--
        if(this.unread) this.unread.setUnread(1,this.totals)
				$toast.show(text ? text : "成功！", 3000).then(() => {})
			}
		},
	    watch:{
	        keyword(curVal){
	            if(curVal == ""){
	                this.arr = [];
	                this.infiniteCount = true;
	            }
	        }
	    },
	    destroyed(){
		    this.searchMode = false;
		    this.$destroy()
	    },
		props:{
			keyword:{
				type:String
			},
			onCk:{
				  type:Boolean
			}
    	},
    	// store
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
