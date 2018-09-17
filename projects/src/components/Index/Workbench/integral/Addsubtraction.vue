<template>
	<div id="">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
	      	<span slot="title">{{title}}</span>
	      	<!--<div class="button button-icon company companyname" slot="right" @click.stop="showcompony">{{company_name}}</div>
			-->
			<div class="button button-icon" slot="right">
				<ChoiceCompany @give-company="setCompony"></ChoiceCompany>
			 </div>
		</von-header>
		<scroll>
			<!--<div class="reference" @click="chosedepartment">
				<p class="required">*</p>
				<p>部门</p>
				<input type="text" placeholder="请选择部门"  v-model="score_modify.app_dept_name" readonly="readonly" style="background:transparent"/>
				<p class="fuhao"><i class="ion-chevron-right"></i></p>
			</div>
			<div class="reference">
				<p>备注</p>
				<input type="text" placeholder="请填写备注" v-model="score_modify.remarks" />
			</div>-->
				<Integraldetail v-for="list in modifydetailslist" :modifydetails="list" @delete="deletes" @chosePerson="chosePerson1"  @chosedepartment="chosedepartments" @emit-addproject="addprojects"></Integraldetail>
				<p class="addcosts" @click="addcost"><i class="ion-ios-plus-outline"></i> 添加</p>
				<bee-form v-model="score_modify"  class="chosedate"  ref="form" :rules="rules">
					<bee-form-item>
						<set-flow :name="'审批人'" :viceName="''" v-model="score_modify.userflow.users"></set-flow>
					</bee-form-item>
				</bee-form>
				<bee-form v-model="score_modify"  class="chosedate chosedatebom"  ref="form" :rules="rules">
					<bee-form-item>
						<set-flow :name="'抄送人'" :viceName="''" v-model="score_modify.userflow.ccs"></set-flow>
					</bee-form-item>
				</bee-form>
		</scroll>
		<div class="btnsub">
			<!--<button @click="btnsub">提交</button>-->
			<ButtonBottom :loading="loading" @call-back="btnsub">提交</ButtonBottom>
		</div>
		<Addproject v-if="isaddproject" :addproject="addproject"  @chose-addproject="choseproject"></Addproject>

	</div>
</template>

<script>
	import Vue from 'vue'
	import api from '../../../../asset/api.js'
	import '../../../establish/commoncss/common.css'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return{
				title:"积分申请",
				company_name:"",
				loading:false,
				score_modify:{
					company_name:"",
					company_id:"",
					app_user_id:"",
					app_user_name:"",
					app_dept_id:"",
					app_date:"",
					app_dept_name:"",
					remarks:"",
					details:[],
					userflow:{
						users:[],
						ccs:[]
					},
					flow_bizid:""
				},
				company_msg:{

				},
				rules:{
					name:{ regular:"^([\u2E80-\u9FFF]){3,5}$", message: '长度在 3 到 5 个字符',must:true},
					age:{ regular:"^(?:0|[1-9][0-9]?|100)$" , message: '请输入 0 - 100 之间的数字',must:false},
					email:{regular:"^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$",message:"请输入正确的邮箱格式",must:true}
				},
				componparameter:"",
				addproject:{},
				isgetcommpy:false,
				isaddproject:false,
				indexs:0,
				modifydetailslist:[
					{
						person_id:"",
						person_name:"",
						person_dept_id:"",
						person_dept_name:"",
						score_date:"",
						item_class_code:"",
						item_class:"",
						score:"",
						description:"",
						remarks:"",
						rowno:1,
						OrderIndex:1,
					}
				],
				bizid:"",
				id:"",
        user_id:""
			}
		},
		mounted(){
			//this.score_modify.app_user_id=api.userInfo.id
			//this.score_modify.app_user_name=api.userInfo.name

			//sessionStorage.removeItem("company_msg")
		},
		activated(){
			this.score_modify.app_user_id=api.userInfo.id
			this.score_modify.app_user_name=api.userInfo.name
			let company_msg=utrl.getCompany()
			this.company_msg=company_msg
			this.getdept()
			this.company_name=company_msg.company_name
			this.score_modify.company_name=company_msg.company_name
			this.score_modify.company_id=company_msg.company_id
			let personData1 = JSON.parse(sessionStorage.getItem('selectPerson'));

            if(personData1 !== null){
            	this.person_names=""
            	this.user_id=""
				if(personData1.length==0){
					this.user_id="empty"
				}else{
					//this.modifydetails.person_name=''
					//{OrderIndex:1,rowno:1,person_id:"",person_code:"",person_name:""}
					//this.kq_scheduleset.staff=personData1
					for(var i=0;i<this.modifydetailslist.length;i++){
						if(this.indexs==i){
							Vue.set(this.modifydetailslist[i],"person_name",personData1[0].user_name)
							Vue.set(this.modifydetailslist[i],"person_id",personData1[0].user_id)
						}
					}
					var arr=[]
					for(var j=0;j<personData1.length;j++){
						arr.push(personData1[j].user_id)
					}
					this.user_id=arr

				}

				sessionStorage.removeItem("selectPerson")
            }

			this.bizid=utrl.setbizid()
			this.score_modify.flow_bizid=this.bizid

			//this.exp_people_name=""
//          if(personData1 !== null){
//          	console.log(2222)
//          	console.log(personData1)
//          	//this.exp_people_name=personData1[0].user_name
//          	//this.user_id=personData1[0].user_id
//          	//this.exp_people_id=personData1[0].user_id
//          	for(var i=0;i<this.modifydetailslist.length;i++){
//          		if(this.indexs==i){
//          			Vue.set(this.modifydetailslist[i],"person_name",personData1[0].user_name)
//          			Vue.set(this.modifydetailslist[i],"person_id",personData1[0].user_id)
//          			this.user_id=personData1[0].user_id
//          			this.id=personData1[0].user_id
//          		}
//          	}
//          	this.getdepartment()
//          	//sessionStorage.removeItem("selectPerson")
//          }else{
//          	console.log(3333)
//          	this.user_id="empty"
//          }

			//let personData1 = JSON.parse(sessionStorage.getItem('radioselect'));
//			 if(personData1 !== null){
//          	for(var i=0;i<this.modifydetailslist.length;i++){
//          		if(this.indexs==i){
//          			Vue.set(this.modifydetailslist[i],"person_name",personData1.user_name)
//          			Vue.set(this.modifydetailslist[i],"person_id",personData1.user_id)
//          			this.id=personData1.user_id
//          		}
//          	}
//          	this.getdepartment()
//
//          	 sessionStorage.removeItem("radioselect")
//          }
			//选择部门
			let departData = JSON.parse(sessionStorage.getItem('department'));
             if(departData !== null){
            	for(var i=0;i<this.modifydetailslist.length;i++){
            		if(this.indexs==i){
            			Vue.set(this.modifydetailslist[i],"person_dept_name",departData.OUName)
            			Vue.set(this.modifydetailslist[i],"person_dept_id",departData.id)
            			//app_dept_id
            			//this.modifydetailslist[i].app_dept_name = departData.OUName;
            		}
            	}
            	 sessionStorage.removeItem("department")
            }

		},
		methods:{
			back: function() {
				//$router.go(-1)
				this.$router.replace('/index')
			},
			setCompony(e){
				sessionStorage.removeItem("itemlist")
				this.company_name=e;
				this.company_msg=e
				window.sessionStorage.setItem("company_msg",JSON.stringify(this.company_msg))
				this.modifydetailslist=[{
						person_id:"",
						person_name:"",
						person_dept_id:"",
						person_dept_name:"",
						score_date:"",
						item_class_code:"",
						item_class:"",
						score:"",
						description:"",
						remarks:"",
						rowno:1,
						OrderIndex:1
					}]
				this.score_modify={
					company_name:"",
					company_id:"",
					app_user_id:"",
					app_user_name:"",
					app_dept_id:"",
					app_date:"",
					app_dept_name:"",
					userflow:{
						users:[],
						ccs:[]
					},
					remarks:"",
					details:[]
				}
				//
				this.getdept()
			},


			//获取积分部门
			async getdepartment(){
				let url="oumembers/depts?token="+api.token+"&company_id="+this.company_msg.company_id+"&filter=id="+this.id
				let res=await api.get(url)
				let data=res.data[0]
				for(var i=0;i<this.modifydetailslist.length;i++){
            		if(this.indexs==i){
            			if(data){
            				Vue.set(this.modifydetailslist[i],"person_dept_name",data.dept_name)
            				Vue.set(this.modifydetailslist[i],"person_dept_id",data.dept_id)
            			}
            		}
            	}

			},
			//获取公司部门
			async getdept(){
				let url="departments?token="+api.token+"&company_id="+this.company_msg.company_id
				let res=await api.get(url)
				if(res.data[0]){
					this.score_modify.app_dept_name=res.data[0].OUName
					this.score_modify.app_dept_id=res.data[0].id
				}

			},
			addcost(){
				var arr={
					company_name:"",
					company_id:"",
					app_user_id:"",
					app_user_name:"",
					app_dept_id:"",
					app_date:"",
					app_dept_name:"",
					remarks:"",
					details:[],
					flow_bizid:""
				}
				this.modifydetailslist.push(arr)
			},
			async btnsub(){
				var peopletirim=false
				var departmenttrim=false
				var projecttirim=false
				var dividingtirim=false
				var userflowusers=false
				for(var i=0;i<this.modifydetailslist.length;i++){
					if(this.modifydetailslist[i].person_name==""){
						peopletirim=true
					}
					if(this.modifydetailslist[i].person_dept_name==""){
						departmenttrim=true
					}
					if(this.modifydetailslist[i].item_class==""){
						projecttirim=true
					}
					if(this.modifydetailslist[i].score==""){
						dividingtirim=true
					}
				}
				if(this.score_modify.userflow.users.length==0){
					userflowusers=true
				}
				if(peopletirim==true){
					$toast.show("积分人不能为空", 3000).then(() => {})
				}else if(departmenttrim==true){
					$toast.show("积分人部门不能为空", 3000).then(() => {})
				}else if(projecttirim==true){
					$toast.show("加减分项目不能为空", 3000).then(() => {})
				}else if(dividingtirim==true){
					$toast.show("加减分值不能为空", 3000).then(() => {})
				}else if(userflowusers==true){
					$toast.show("审批人不能为空", 3000).then(() => {})
				}else{
					this.loading=true
					let url="scoremodifys?token="+api.token+"&bizid="+this.bizid
					this.score_modify.details=this.modifydetailslist
					let res=await api.post(url,this.score_modify)
					if(res.status >= 200 && res.status < 300){
						this.score_modify={
							company_name:"",
							company_id:"",
							app_user_id:"",
							app_user_name:"",
							app_dept_id:"",
							app_date:"",
							app_dept_name:"",
							userflow:{
								users:[],
								ccs:[]
							},
							remarks:"",
							details:[]
						}
						this.modifydetailslist=[
							{
								person_id:"",
								person_name:"",
								person_dept_id:"",
								person_dept_name:"",
								score_date:"",
								item_class_code:"",
								item_class:"",
								score:"",
								description:"",
								remarks:"",
								rowno:1,
								OrderIndex:1
							}
						]
						this.addproject={}
						$toast.show("提交成功", 1000)
						this.loading = false;
						$loading.hide()
						$router.go(-1)
					}else{

						$toast.show(res.data.errmsg + "，请重试！", 3000)
						this.loading = false;
						$loading.hide()
						return
					}
				}
			},
			showcompony(e){
				this.componparameter=e.currentTarget
				this.isgetcommpy=!this.isgetcommpy
			},
			componyobj(obj,componparameter){
				this.isgetcommpy=!this.isgetcommpy
				this.company_msg=obj
				this.score_modify.company_name=obj.company_name
				this.score_modify.company_id=obj.company_id
				window.sessionStorage.setItem("company_msg",JSON.stringify(this.company_msg))
				this.company_name=obj.company_name
			},
			addprojects(obj){
				//this.addproject.item_class = obj.item_class
				this.isaddproject=!this.isaddproject
				this.addproject=obj
				 history.pushState(null, null, document.URL);
            	window.addEventListener("popstate", this.choseproject, false);
			},
			choseproject(obj){
					this.isaddproject= false
					if(obj == false){
						return
					}
					Vue.set(this.addproject,'item_class',obj.item_class)
					Vue.set(this.addproject,'item_class_code',obj.item_class_code)
					// if(e.toString() === '[object MouseEvent]') history.go(-1);
            		window.removeEventListener("popstate", this.choseproject, false);
			},
			deletes(index){
				$dialog.confirm({
					  theme: 'ios',
					  title: '确认删除吗?',
					  cancelText: '取消',
					  okText: '确定'
				}).then((res) => {
					  if(res==true){
						this.modifydetailslist.splice(index,1)
					  }
					})
			},
			chosePerson1(e){
				//window.sessionStorage.setItem("company_msg",JSON.stringify(this.company_msg))
				this.indexs=e
				  this.$router.push({name:"chooseCharges",params:{
	                	id:1,
	                	name:"积分申请",
                    user_id:this.user_id
	                }});
				//this.$router.push("/chooseExecutive")
			},
			chosedepartments(e){
				this.indexs=e
				 sessionStorage.setItem('company_msg',JSON.stringify(this.company_msg));
				this.$router.push("/chooseDepartment");
			},
			chosedepartment(){
               window.sessionStorage.setItem("company_msg",JSON.stringify(this.company_msg))
				this.$router.push("/chooseDepartment");
			}
		},
		watch:{
			modifydetailslist(){
				for(var i=0;i<this.modifydetailslist.length;i++){
					this.modifydetailslist[i].rowno=i+1
					this.modifydetailslist[i].OrderIndex=i+1
					if(this.modifydetailslist.length==1){
						Vue.set(this.modifydetailslist[i],"isshow",false)
					}else{
						Vue.set(this.modifydetailslist[i],"isshow",true)
					}
				}
			}
		}
	}
</script>

<style scoped>
	.scroll{
		margin-top:2.5rem;
		bottom:3rem;
	}
</style>
