<template>
	<div id="saleorders" @click="hides">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click.stop="back"></button>
	      	<span slot="title">{{title}}</span>
	      	<div class="button button-icon company companyname" slot="right">{{company_msg.company_name}}</div>
		</von-header>
		<div class="seting">
			<scroll>
				<div class="reimbursement references_top" v-if="itemlist!=''">
					<p>积分类别</p>
				</div>
				<div>
					<div v-if="itemlist!=''" class="references reference" v-for="(item,index) in itemlist" :id="keys==index?'referpicks':''" @touchstart="touchstart(index)" @touchend="touchend(index)">
						<p >{{item.item_class}}</p>
						<input type="text"  v-model="item.score+'分'" disabled="false"/>
						
						 <div class="ol-popup" v-if="keys==index">
                                <div class="ol-popup-closer" @click.stop="deletes">删除</div>
                         </div>
					</div>
				</div>
				<!--<p class="addcost" @click.stop="addcost"><i class="ion-ios-plus-outline"></i> 添加</p>-->
				<div :class="itemlist!=''?'':'references_top'"></div>
				<div v-for="(item,index) in list">
					<div class="reimbursement">
						<p>{{item.name}}</p>
						 <!--<von-toggle :text="item.name" v-model="item.isactive" theme="energized"></von-toggle>
						 <div class="active" @click.stop="allactive(index)"></div>-->
					</div>
					<div class="latedetails">
						<div class="reimbursements" v-for="val in item.content">
							<von-toggle v-if="val.late_rule" :text="val.late_rule+'减'+val.score+'分'" theme="energized" v-model="val.is_use"></von-toggle>
							<von-toggle v-else-if="val.leftearly_rule"  :text="val.leftearly_rule+'减'+val.score+'分'" theme="energized" v-model="val.is_use"></von-toggle>
							<von-toggle v-else-if="val.clock_rule"  :text="val.clock_rule+'减'+val.score+'分'" theme="energized" v-model="val.is_use"></von-toggle>
							<von-toggle v-else-if="val.absenteeism_rule"  :text="val.absenteeism_rule+'减'+val.score+'分'" theme="energized" v-model="val.is_use"></von-toggle>
						</div>
					</div>
				</div>	
				<!--<div style="margin-bottom:3rem;"></div>-->
			</scroll>
		</div>
		<div class="btnsub">
			<!--<button @click.stop="btnsub">提交</button>-->
			<ButtonBottom :loading="loading" @call-back="btnsub">提交</ButtonBottom>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	var times=null
	export default{
		data(){
			return {
				title:"积分设置",
				company_msg:{},
				toggleText:"迟到减分",
				pushNotification:false,
				latename:"迟到一次扣两分",
				latestrue:false,
				itemlist:null,
				loading:false,
				bizid:"",
				keys:"-1",
				list:[
					{name:"迟到减分",content:[],sing:"late",isactive:true,isshow:true},
					{name:"早退减分",content:[],sing:"leftearly",isactive:true,isshow:false},
					{name:"缺勤减分",content:[],sing:"leakclock",isactive:true,isshow:false},
					{name:"旷工减分",content:[],sing:"absenteeism",isactive:true,isshow:false}
				],
				score_set:{
					
				}
			}
		},
		filters:{
			texts(val){
				if(val=='01'){
					return "职场态度"
				}else{
					return "岗位能力"
				}
			}
		},
		mounted(){
			let company_msg=utrl.getCompany()
			this.company_msg=company_msg
			this.bizid=utrl.setbizid()
			this.getlist()
		},
		methods:{
			back: function() {
				//$router.go(-1)
				this.$router.replace('/index')
			},
			hides(){
				this.keys="-1"
			},
			touchstart(k){
				var that=this
				
				 times=setTimeout(function(){
				 	that.keys=k
//					$dialog.confirm({
//					  theme: 'ios',
//					  title: '确定删除吗?',
//					  cancelText: '取消',
//					  // 确定按钮文本
//					  okText: '删除'
//					}).then((res) => {
//					 // console.log('confirm result: ', res)
//					  if(res==true){
//					  	that.itemlist.splice(k,1)
//					  }
//					})
				},500)
			},
			deletes(){
				$dialog.confirm({
					  theme: 'ios',
					  title: '确定删除吗?',
					  cancelText: '取消',
					  // 确定按钮文本
					  okText: '删除'
					}).then((res) => {
					 // console.log('confirm result: ', res)
					  if(res==true){
					  	this.itemlist.splice(this.keys,1)
					  }
					})
			},
			touchend(){
				clearTimeout(times)
			},
			addcost(){
				this.$router.push({name:"Adddivideditem"})
			},
			allactive(e){
				for(let i=0;i<this.list.length;i++){
					
					if(e==i){
						this.list[i].isactive=!this.list[i].isactive
						let arr=this.list[i].content
						if(this.list[i].isactive==true){
							for(let j=0;j<arr.length;j++){
								arr[j].is_use=true
							}
						}else{
							for(let j=0;j<arr.length;j++){
								arr[j].is_use=false
							}
						}
					
						this.list[i].content=arr
						this.list[i].isshow=true

					}else{
						this.list[i].isshow=false
					}
				}
			},
			async getlist(){
				let url="scoreset?token="+api.token+"&company_id="+this.company_msg.company_id
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					
					this.score_set=res.data[0]
//					if(this.score_set.item[0]==null){
//						this.score_set.item=[]
//					}
						
					let itemlist=JSON.parse(sessionStorage.getItem("itemlist"));
					if(itemlist!==null){
						this.itemlist=itemlist
					}else{
						this.itemlist=this.score_set.item
					}
					for(var i=0;i<this.list.length;i++){
						for(let k in this.score_set){
							if(k==this.list[i].sing){
//								if(k=="late"){
//										for(let o=0;o<this.score_set[k].length;o++){
//												this.score_set[k][o].is_use=1
//										}
//								}
								//is_use
								for(let j=0;j<this.score_set[k].length;j++){
									if(this.score_set[k][j].is_use==0){
										this.score_set[k][j].is_use=false
									}else{
										this.score_set[k][j].is_use=true
									}
								}
								this.list[i].content=this.score_set[k]
							}
						}
				}

				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
			},
//			show(e){
//				for(var i=0;i<this.list.length;i++){
//					if(e==i){
//						this.list[i].isshow=!this.list[i].isshow
//						
//					}else{
//						this.list[i].isshow=false
//					}
//				}
//			},
			async btnsub(){
				this.loading=true
				for(var i=0;i<this.list.length;i++){
						for(let k in this.score_set){
							if(k==this.list[i].sing){
								for(var j=0;j<this.list[i].content.length;j++){
									if(this.list[i].content[j].is_use==false){
										this.score_set[k][j].is_use=0
									}else{
										this.score_set[k][j].is_use=1
									}
								}
								
								this.score_set[k]=this.list[i].content
							}
						}
					}
				let itemlist=JSON.parse(sessionStorage.getItem("itemlist"))
				if(itemlist.length==0){
					delete this.score_set.item
				}else{
					this.score_set.item=itemlist
				}
				
				let url="scoreset/"+this.score_set.id+"/?token="+api.token+"&company_id="+this.score_set.company_id+"&bizid="+this.bizid
				let res=await api.put(url,this.score_set)
				if(res.status >= 200 && res.status < 300){
					$toast.show("提交成功", 3000)
					this.loading = false;
					$loading.hide()
					sessionStorage.removeItem("itemlist")
					$router.go(-1)
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000)
					this.loading = false;
					$loading.hide()
					return
				}
			}
		},
//		beforeRouteLeave (to, from, next){
//				this.btnsub()
//				next()
//			},
		watch:{
			itemlist(){
//				for(var i=0;i<this.itemlist.length;i++){
//					this.itemlist[i].id=this.itemlist[0].id
//				}
				sessionStorage.setItem("itemlist",JSON.stringify(this.itemlist))
			}
		}
	}
</script>

<style scoped>
	.companyname{
		max-width: 5rem;
	    height: 100%;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    white-space: nowrap;
	    display: block;
	    line-height: 40px;
	    text-align: right;
	}
	.seting{
		position:relative;
		width:100%;
		height:100vh;
		flex:1;
	}
	#referpicks{
		background:#fafafa;
	}
	.references_top{
		margin-top:2.5rem;
	}
	#content .seting .scroll{
		top:0;
		bottom:3rem;
		z-index:1;
	}
	.reference{
		width:100%;
		min-height:2.3rem;
		border-bottom:1px solid #eee;
		display:flex;
		justify-content: space-between;
		align-items: center;
		font-size:0.65rem;
		position:relative;
		background:#ffffff;
	}
	.reference .fuhao{
		height:2.3rem;
		position:absolute;
		top:0;
		right:0.75rem;
		line-height:2.3rem;
	}
	.reference p{
		height:2.3rem;
		margin-left:0.75rem;
		/*line-height:2.3rem;*/
		color:#666;
		font-size:0.75rem;
		display: flex;
    	align-items: center;
	}
	.reference input{
		width:50%;
		height:2.3rem;
		text-align:right;
		font-size:0.75rem;
		margin-right:0.75rem;
		background: transparent;
		padding:0;
		color:#666;
		display: flex;
    	align-items: center;
	}
	.references input{
		width:50%;
		height:2.3rem;
		text-align:right;
		font-size:0.75rem;
		margin-right:16px;
		background: transparent;
		padding:0;
		color:#666;
		display: flex;
    	align-items: center;
	}
	.btnsub{
		position:fixed;
		width:100%;
		left:0;
		bottom:0rem;
		background:#eee;
		border:0;
		height:2.95rem;
		display:flex;
		justify-content: space-around;
		padding:0 0.5rem;
		z-index:33;
	}
	.btnsub button{
		flex:1;
		background:#f2be06;
		border:0;
		height:1.86rem;
		border-radius:0.15rem;
		font-size:0.8rem;
		color:#333;
		margin-top:0.36rem;
	}
	.reimbursement{
		width:100%;
		height:2.3rem;
		background:#fafafa;
		display:flex;
		align-items: center;
		justify-content: space-between;
		font-size:1rem;
		border-bottom:1px solid #eee;
		box-sizing: border-box;
		margin-bottom:0.25rem;
		position:relative;
		font-size:0.7rem;
	}
	.reimbursement p{
		margin-left:0.75rem;
		font-size:0.7rem;	
	}
	.reimbursement span{
		font-size:0.7rem;	
	}
	.item{
		width:100%;
		height:100%;
	}
	.reimbursement .item{
		background:#fafafa;
	}
	.reimbursements .item{
		background:#fff;
	}
	.latedetails{
		margin-bottom:0.25rem;
	}
	.active{
		width:12.5%;
		height:100%;
		position:absolute;
		top:0;
		right:0.75rem;
		opacity:0;
	}
	.addcost{
		width:100%;
		height:2.6rem;
		text-align:center;
		line-height:2.6rem;
		font-size:0.9rem;
		background:#ffffff;
		box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
		margin-bottom:0.25rem;
		margin-top:0.25rem;
		color:#f2ad06;
	}
	.ol-popup {
                position: absolute;
                top:-2rem;
                left: 50%;
                z-index:333;
                display:block;
                width: 4rem;
                height: 2rem;
                margin-left:-2rem;
                border: 1px solid #cccccc;
                border-radius: 10px;
                background-color: #1B1C1D;
                display:flex;
                justify-content: space-around;
                align-items: center;
            }
            .ol-popup-closer{
            	width:100%;
                color:#fff;
                height: 2rem;
                min-height: 0;
                margin:0;
                display:flex;
                justify-content: space-around;
                align-items: center;
            }
            /*以下是尖角的实现*/
            .ol-popup:after, .ol-popup:before {
                top: 100%;
                border: solid transparent; /*边框颜色设置为透明*/
                content: " ";
                height: 0; /*高、宽都设置为0，边框的4条边就聚合到一起，组合成一个小正方形。*/
                width: 0; /*正方形按对角线分成4个小三角，分别对应4条边框*/
                position: absolute;
                pointer-events: none;/*不允许穿透层去点击下面的内容*/
            }
            .ol-popup:after {
                border-top-color: #1B1C1D;
                border-width: 10px;
                left: 50%;
                margin-left: -10px;
            }
</style>