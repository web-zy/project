<template>
	<div class="warp" id="" @click="hide">
		<von-header>
	      <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	      <span slot="title">{{title}}</span>
	      <div class="button button-icon company companyname" slot="right" @click.stop="showcompony">{{company_name}}</div>
	     <!--<div class="button button-icon" slot="right">
				<ChoiceCompany @give-company="setCompony"></ChoiceCompany>
		</div>-->
		</von-header>

	<div style="flex:1;overflow-y:scroll;position:;">
		<scroll>
		<div class="reference">
			<!--选择某公司部门 需传公司id，data（路由params.department接收 type：obj）-->
			<p>部门</p>
			<input type="text" v-model="department" placeholder="请选择" value="" @click="chosedepartment"  readonly="readonly"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>
		<div class="reference" @click="chosePerson1">
			<!--选择某公司下所有人（主管单选）需传公司id，data（路由params.person接收 type：obj）-->
			<p>选择某公司下所有人（单选）</p>
			<input type="text" placeholder="请选择" v-model="radioselect"  disabled="false"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>
		<div  class="reference" @click="chosePerson2">
			<!--选择某公司下所有人（负责人多选）需传公司id，data（路由params.person接收 type：array）-->
			<p>选择某公司下所有人（多选）</p>
			<input type="text" placeholder="请选择" v-model="multiselect"  disabled="false"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>
		<div class="reference">
			<p>费用明细</p>
			<input type="text" placeholder="请选择" value="" @click.stop="showcost"  readonly="readonly"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>

			<div  class="reference">
				<p>借款类型</p>
				<input type="text" placeholder="请选择" v-model="Loan" @click.stop="getobjs" readonly="readonly"/>
				<p class="fuhao"><i class="ion-chevron-right"></i></p>
			</div>
		<div class="reference" >
			<p>结算方式</p>
			<input type="text"  placeholder="请选择" value="" readonly="readonly"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>

		<div  class="reference" >
			<p>请假类型</p>
			<input type="text" value="" @click.stop="leaveobjs" placeholder="请选择"  readonly="readonly"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>

		<div  class="reference">
			<p>单行文本</p>
			<input type="text" placeholder="请选择" v-model="single"  disabled="false"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>

		<div  class="reference">
			<p>多行文本</p>
			<input type="text" placeholder="请选择" v-model="multiline"  disabled="false"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>

		<div  class="reference" @click="addcustomer">
			<p>客户</p>
			<input type="text" placeholder="请选择" v-model="customer"  disabled="false"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>

		<div  class="reference">
			<p>供应商</p>
			<input type="text" placeholder="请选择" v-model="supplier"  disabled="false"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>

		<div  class="reference">
			<p>产品</p>
			<input type="text" placeholder="请选择" v-model="product"  disabled="false"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>
		<div  class="reference">
			<p>仓库档案</p>
			<input type="text" placeholder="请选择" value="" @click.stop="warobjs" readonly="readonly"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>
		<!-- <div  class="reference">
			<p>发票类型</p>
			<input type="text" placeholder="请选择" value="" @click.stop="invoice_type" readonly="readonly"/>
			
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div> -->
		<Choiceinvoice
					:invoiceObj="{id:invoice_type_id,type:invoice_type}"
					@give-invoice="setInvoice"></Choiceinvoice>
		<!-- 发票类型 -->
		<div  class="reference">
			<p>品牌档案</p>
			<input type="text" placeholder="请选择" value="" @click.stop="brand" readonly="readonly"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>
		<div  class="reference">
			<p>计量单位</p>
			<input type="text" placeholder="请选择" value="" @click.stop="measure" readonly="readonly"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>
		<div  class="reference">
			<p>备注</p>
			<input type="text" placeholder="请选择" v-model="remarks"  disabled="false"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>

		<div  class="reference" @click="getaddress">
			<p>地址</p>
			<input type="text" placeholder="请选择地址" v-model="address"  readonly="readonly"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>
		<div  class="reference" @click="golinkage">
			<p>三级联动</p>
			<input type="text" placeholder="请选择地址" v-model="threeaddress"  readonly="readonly"/>
			<p class="fuhao"><i class="ion-chevron-right"></i></p>
		</div>
		</scroll>
	</div>
		<iframe v-if="isaddress" id="test" @load.stop="loadiframe" class="maps" :src="src"></iframe>
		<!--借款类型-->		
		<Loanpopup v-if="canzhao" :parameter="parameter" @my-event="getobj" @add="add" @edit="edit"></Loanpopup>
		
		<!-- 请假类型 -->
		<leaves v-if="leaves" :parameters="parameters" @list="list" @emit-leave="leaveobj"></leaves>
		<!-- 仓库档案 -->
		<Refwarehouse v-if="Refwarehouse" :warehouses="warehouses" @my-warehouses="warobj"></Refwarehouse>
		<!-- 发票类型 -->
		<!-- <Refinvoicetype v-if="Refinvoicetype" :invoice="invoice" @my-invoice="invoice_types"></Refinvoicetype> -->
		<!-- 品牌档案 -->
		<Refbrand v-if="Refbrand" :brandobj="brandobj" @my-brand="brands"></Refbrand>
		<!-- 计量单位 -->
		<Refmeasure v-if="Refmeasure" :measureobj="measureobj" @my-measure="measures"></Refmeasure>
		<!--费用明细-->
		<cost v-if="cost" :costparameter="costparameter" @emit-cost="costobj"></cost>
		<getcommpy v-if="isgetcommpy"  :componparameter="componparameter"   @emit-getcommpys="componyobj" @addcompy="addcompy"></getcommpy>
	</div>
</template>

<script>
	import Vue from 'vue'
	import api from '../../../../asset/api.js'
	import leaves from '../../../parts/Reference/leaves.vue'
	import costmodel from '../../../ceshi/cost_reference.vue'
	import getcommpy from '../../../ceshi/getcommpy.vue'
	import Refwarehouse from '../../../parts/Reference/Refwarehouse.vue'
	// import Refinvoicetype from '../../../ceshi/Refinvoicetype.vue'
	import Refbrand from '../../../ceshi/Refbrand.vue'
	import Refmeasure from '../../../ceshi/Refmeasure.vue'
	export default{
		data(){
			return {
				title:"公共参照",
				company_name:"",
				sss:'123',
				company_id:"",
				invoice_type_id:"",      //发票id
				invoice_type:"",    //f发票名称
				isaddress:false,
				canzhao:false,
				leaves:false,
				Refwarehouse:false,
				Refbrand:false,
				Refmeasure:false,
				cost:false,
				isgetcommpy:false,
				department:"",
                radioselect:"",
                multiselect:"",
				cost:"",
				loan:"",
				settlement:"",
				Refwarehouse:"",
				// Refinvoicetype:"",
				Refbrand:"",
				Refmeasure:"",
				// leave:"",
				single:"",
				multiline:"",
				customer:"",
				supplier:"",
				product:"",
				warehouses:"",   //仓库档案
				brandobj:"",     //品牌类型
				measureobj:"",	 //计量单位
				remarks:"",
				parameter:"",
				parameters:"",
			//	costparameter:"",
				costparameter:{
					costparameter:"",
					company_id:"",
					detail_id:""
				},
				componparameter:"",
				company_msg:{},
				address:"",
				threeaddress:"",
				src:"",
				lat:"",
				lng:"",
				Loan:"",
			    //costmodal: undefined,

			}
		},
		mounted(){
				this.canzhao=false
				this.leaves=false
				this.Refwarehouse=false
				this.cost=false
				this.isgetcommpy=false
				this.isaddress=false
				console.log(111)
				console.log(api.userInfo)
				this.user_id=api.userInfo.id
			//console.log(this.leaves)
			if(this.$route.params.istrue){
				this.canzhao=this.$route.params.istrue;
				//this.leaves=this.$route.params.istrue;
			}
			//选择后部门返回信息 data
			let departData = JSON.parse(sessionStorage.getItem('department'));
            if(departData !== null) {
                this.department = departData.OUName;
            }
            //选择人员后返回信息data 注：单选返回{}，多选返回[];
			let personData1 = JSON.parse(sessionStorage.getItem('radioselect'));
            if(personData1 !== null){
                this.radioselect = personData1.name;
            }

            let personData2 = JSON.parse(sessionStorage.getItem('multiselect'));
			if(personData2 !== null){
			    let arr = [];
			    for(let i = 0; i < personData2.length; i++){
					arr.push(personData2[i].user_name);
			    }
                this.multiselect = arr.join(",");
            }
			//获取客户档案
			let Customer=JSON.parse(window.sessionStorage.getItem("Customer"));
			if(Customer!==null){
				console.log(Customer)
				this.customer=Customer.name
			}
		/*	 $modal.fromComponent(costmodel, {
		        title: '费用明细',
		        theme: 'default'
		      }).then((modal) => {

		        this.costmodal = modal
		      })
			*/
			this.getcommpy()
			this.get();
		},
		activated (){
			this.isaddress=false
		},
		/*destroyed() {
	      if (this.costmodal)
	        $modal.destroy(this.costmodal)
	    },*/
	 /*   beforeRouteLeave(to, from, next){
		 	if(this.isgetcommpy==true||this.canzhao==true||this.leaves==true||this.cost==true){
		 		 next(false)
		 		this.isgetcommpy=false
		 		this.canzhao=false;
				this.leaves=false;
				this.cost=false;
		 	}else{
		 			next()
		 	}
		 },*/
		methods:{
			loadiframe(e) {
				var that=this
		        let iframe = document.getElementById('test').contentWindow;
		        iframe.postMessage('hello', 'https://m.amap.com/picker/');
		        window.addEventListener("message", function (e) {
		          if (e.data.command != "COMMAND_GET_TITLE") {
		            //业务代码
		            console.log(e.data)
		            that.address=e.data.address
		            that.isaddress=false
		          }

		        }.bind(this), false);
		      },
		      golinkage(){
		      	this.$router.push({name:"linkage"})
		      },
			//获取公司id
			async getcommpy(){
				let url="users/current/mycompanies?token="+api.token
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					var data=res.data[0]
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}

				this.company_msg=data
				this.company_id=data.company_id
				this.costparameter.company_id=data.company_id
				this.company_name=data.company_name
			},
			chosedepartment(){
                sessionStorage.setItem('company_msg',JSON.stringify(this.company_msg));
				this.$router.push("/ChooseDepartment");
                //回到本页面获取数据执行JSON.parse(sessionStorage.getItem('department'));
			},
			chosePerson1(){
                sessionStorage.setItem('company_msg',JSON.stringify(this.company_msg));
                this.$router.push("/ChooseExecutive");
                //回到本页面获取数据执行JSON.parse(sessionStorage.getItem('radioselect'));
			},
            chosePerson2(){
                sessionStorage.setItem('company_msg',JSON.stringify(this.company_msg));
                this.$router.push("/ChooseCharges");
                //回到本页面获取数据执行JSON.parse(sessionStorage.getItem('multiselect'));
            },
			hide(){
				//return
				this.canzhao=false;
				this.leaves=false;
				this.Refwarehouse=false;
				// this.Refinvoicetype=false;
				this.Refbrand=false;
				this.Refmeasure=false;
				this.cost=false;
				this.isgetcommpy=false;
			},
			addcompy(){
				this.isgetcommpy=false
				this.$router.push({name:"createCompany"})
			},
			back: function() {
				$router.push({path:"/index"})
			},
			getobjs(){
				
			//	e.currentTarget.value='2222'
				//console.log(e.currentTarget)
				this.canzhao=!this.canzhao
			},
			getobj(obj){
				
				this.canzhao= false
				if(obj == false){
					return
				}
				this.Loan=obj.name
				
				
				
			},

			showcost(e){
				// console.log(e.currentTarget)
				this.costparameter.detail_id=e.currentTarget.value
				this.costparameter.costparameter=e.currentTarget
				this.cost=!this.cost
			},
			costobj(obj,costparameter){
				this.cost= false
				if(obj == false){
					return
				}
				costparameter.value=obj.name
			},
			showcompony(e){
				// console.log(e.currentTarget.name)
				this.componparameter=e.currentTarget
				this.isgetcommpy=!this.isgetcommpy
			},
			componyobj(obj,componparameter){

				this.isgetcommpy=!this.isgetcommpy

				this.company_name=obj.company_name
				//componparameter.value=obj.company_name
				this.company_msg=obj
				this.company_id=obj.company_id
				this.costparameter.company_id=obj.company_id
			},
			leaveobjs(e){
				this.parameters=e.currentTarget
				this.parameters.id=e.currentTarget.id
				this.leaves=!this.leaves
			},
			leaveobj(obj,parameters){
				this.leaves=!this.leaves
				this.parameters.value=obj.name
				this.parameters.id = obj.id
				// console.log(this.parameters.id)
			},
			// 仓库档案
			warobjs(e){
				this.warehouses=e.currentTarget

				this.Refwarehouse=!this.Refwarehouse
			},
			warobj(obj,warehouses){
				this.Refwarehouse=!this.Refwarehouse
				this.warehouses.value=obj.name
			},
			// 发票类型
			// invoice_type(e){
			// 	this.invoice=e.currentTarget
			// 	this.Refinvoicetype=!this.Refinvoicetype
			// },
			// invoice_types(obj,invoice){
			// 	// console.log(this.invoice)
			// 	this.invoice.value=obj.name
			// 	// this.invoice=obj
			// 	this.Refinvoicetype = false;
			// 	// this.Refinvoicetype=!this.Refinvoicetype
			// },
			setInvoice(obj){
				console.log(obj)
				this.invoice_type_id = obj.company_id
				this.invoice_type = obj.company_name
			},
			// 品牌类型
			brand(e){
				this.brandobj=e.currentTarget
				this.Refbrand=!this.Refbrand
			},
			brands(obj,brandobj){
				this.Refbrand=!this.Refbrand
				this.brandobj.value=obj.name
			},
			// 计量单位
			measure(e){
				this.measureobj=e.currentTarget
				this.Refmeasure=!this.Refmeasure
			},
			measures(obj,measureobj){
				this.Refmeasure=!this.Refmeasure
				this.measureobj.value=obj.name
			},
/*			show(){
				this.ishide=!this.ishide
			},
			getobj(obj){
				this.ishide=!this.ishide
				this.text=obj.val
				console.log(obj.val);
			}
*/
		add(){
			this.canzhao=false;
			this.$router.push({name:"addLoan",params:{company_id:this.company_id,company_name:this.company_name,user_id:this.user_id}})
		},
		edit(val){
			this.canzhao=false;
			this.$router.push({name:"xiugailoan",params:{obj:val}})
		},
		//跳转修改请假类型
		list(){
			this.leaves=false;
			this.$router.push({name:"modifyleave",params:{obj:val}})
		},
		addcustomer(){
			this.$router.push({name:"Crmcustomer"})
		},
		getaddress(){
				this.isaddress=true
				console.log(3333)
				this.src="https://m.amap.com/picker/?keywords=写字楼,小区,学校&zoom=15&center="+this.lng+","+this.lat+"&radius=1000&total=20&key=92b804a38063a22a44367ba90df5cfe0"
		},
		get(){
			console.log("ditu1")
				$loading.show('正在获取坐标..')
				var map, geolocation;
				var that = this
				//加载地图，调用浏览器定位服务
				var mapObj = new AMap.Map('iCenter');
				mapObj.plugin('AMap.Geolocation', function() {
					geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, //是否使用高精度定位，默认:true
						timeout: 10000, //超过10秒后停止定位，默认：无穷大
						maximumAge: 0, //定位结果缓存0毫秒，默认：0
						convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
						GeoLocationFirst:true, //默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
						noIpLocate:0,  //是否禁止使用IP定位，默认值为0，可选值0-3
						noGeoLocation:0,///是否禁止使用浏览器Geolocation定位，默认值为0，可选值0-3
						useNative:true //是否使用安卓定位sdk用来进行定位，默认：false

					});
					geolocation.getCurrentPosition(function(status, result) {
						if(status == "complete") {
							console.log(result);
							that.position = result
							that.lat = parseFloat(result.position.lat)
							that.lng = parseFloat(result.position.lng)
							//that.address = result.formattedAddress
							console.log("lat")
							console.log("lat",that.lat);
							console.log("lng",that.lng);
							setTimeout(() => {
							  $loading.hide()
							}, 0)
						} else {
							console.log(result.message)
							console.log("定位失败")
						}
					})
				});
			},

		},
		watch:{
			company_name(){

				window.sessionStorage.setItem("company_name",this.company_name)
				// console.log(window.sessionStorage.getItem("company_name"))
			},
			company_id(){

				window.sessionStorage.setItem("company_id",this.company_id)
				// console.log(window.sessionStorage.getItem("company_id"))
			},

		},
		components:{
			leaves,
			getcommpy,
			Refwarehouse,
			// Refinvoicetype,
			Refbrand,
			Refmeasure
		}
	}
</script>

<style lang="less" scoped>
.warp{
	display:flex;
	flex-direction: column;
    justify-content: flex-start;
    width: 100vw;
    height: 100vh;
    position:relative;
    padding-top:2.5rem;
}
.maps{
	display:block;
	width:100%;
	height:100vh;
	position:fixed;
	top:0;
	left:0;
	background:white;
}	
	.companyname{
		display:block;
		max-width: 5rem;
	    height: 100%;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    white-space: nowrap;
	    display: block;
	    line-height: 40px;
	    text-align: right;
	}
	.reference{
		width:100%;
		height:2.3rem;
		border-bottom:1px solid #eee;
		display:flex;
		justify-content: space-between;
		align-items: center;
		font-size:0.75rem;
		position:relative;
	}
	.scroll{
		top:0;
	}
	.reference div{
		height:0;
	}
	.reference .gray{
		position:absolute;
		right:0.5rem;
		top: 0;
	}
	.reference .required{
		position:absolute;
		top:0;
		left:0.4rem;
		margin:0;
		color:red;
		line-height:2.27rem;
	}
	.reference .fuhao{
		height:100%;
		position:absolute;
		top:0;
		right:0.5rem;
		display:flex;
		align-items: center;
		margin-left:0;
	}
	.reference:nth-child(1){
		margin-top:2.5rem;
	}
	.reference p{
		margin-left:0.5rem;
	}
	.reference input{
		width:70%;
		text-align:right;
		margin-right:1.2rem;
		background: transparent;

	}
	.reference .info-list{
		display: -webkit-flex;
    	display: flex;
    	span{
    		 margin-left: 9rem;
    		 color: #666;
    	}
	}
</style>