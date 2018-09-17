<template>
<div class="contents">
		<div class="rei_cost" >
				<div class="reimbursement" v-if="modifydetails.isshow==true">
					<p><span>积分明细</span><span> {{modifydetails.OrderIndex}}</span></p>
					<button @click="deletes(modifydetails.rowno-1)">删除</button>
				</div>

				<bee-form v-model="modifydetails" ref="form" :rules="rules">
					<bee-form-item prop="name">
						<input-text :name="'积分人'" :edit=false :alert="'请选择给谁加减分'" v-model="modifydetails.person_name"
							@click="chosePerson(modifydetails.rowno-1)">
							<i class="icon-right ion-ios-arrow-forward"></i>
						</input-text>
					</bee-form-item>
				<!--<div class="reference reference_cost" @click="chosePerson(modifydetails.rowno-1)">
					<p class="required">*</p>
					<p>积分人</p>
					<input type="text" class="costinput" v-model="modifydetails.person_name" placeholder="请选择给谁加减分"   style="background:transparent" readonly="readonly"/>
					<p class="fuhao fuhaos"><i class="ion-chevron-right "></i></p>
				</div>-->
				<!--<selectPerson :isRed="true"
		              :inpWidth="'60%'"
					  :txt="'选择ceo'"
					  :plehoder="'请选择ceo'"
					  :mag="'.75rem'"
					  :persons="modifydetails"
					  @call-select="chosePerson2"
		              @call-clean="clearPerson"
		              ></selectPerson>-->

				<!--<div class="reference reference_cost" @click="chosedepartment(modifydetails.rowno-1)">
					<p class="required">*</p>
					<p>所在部门</p>
					<input type="text" class="costinput" v-model="modifydetails.person_dept_name" placeholder="请选择所在部门"   style="background:transparent" readonly="readonly"/>
					<p class="fuhao fuhaos"><i class="ion-chevron-right "></i></p>
				</div>-->
				<bee-form-item prop="name">
						<input-text :name="'所在部门'" :edit=false :alert="'请选择所在部门'" v-model="modifydetails.person_dept_name"
							@click="chosedepartment(modifydetails.rowno-1)">
							<i class="icon-right ion-ios-arrow-forward"></i>
						</input-text>
				</bee-form-item>
				<!--<div class="reference reference_cost reference_costnobor" @click="addproject(modifydetails)">
					<p class="required">*</p>
					<p>理由</p>
					<input type="text" class="costinput" v-model="modifydetails.item_class" placeholder="请选择积分类别"   style="background:transparent" readonly="readonly"/>
					<p class="fuhao fuhaos"><i class="ion-chevron-right "></i></p>
				</div>-->
				<bee-form-item prop="name">
						<input-text :name="'理由'" :edit=false :alert="'请选择积分类别'" v-model="modifydetails.item_class"
							@click="addproject(modifydetails)">
							<i class="icon-right ion-ios-arrow-forward"></i>
						</input-text>
				</bee-form-item>
				<div class="reference reference_text">
					<textarea v-model="modifydetails.description" style="width:90%;height:4rem;" class="texts"></textarea>
				</div>

				<!--<div class="reference reference_cost" @click="scoreshow">
					<p class="required">*</p>
					<p>加减分值</p>
						<input type="text" placeholder="请选择分值" style="background:transparent" :class="modifydetails.score<0?'numsmall':'numbig'" v-model="modifydetails.score==''?'':modifydetails.score+'分'" readonly="readonly"/>
						<p class="fuhao fuhaos"><i class="ion-chevron-right "></i></p>
				</div>-->
				<bee-form-item prop="name">
						<input-text :class="modifydetails.score<0?'numsmall':'numbig'" :name="'加减分值'" :edit=false :alert="'请选择分值'" v-model="modifydetails.score==''?'':modifydetails.score+'分'"
							@click="scoreshow">
							<i class="icon-right ion-ios-arrow-forward"></i>
						</input-text>
				</bee-form-item>
				<Choseintegral v-if="isscoreshow" :costparameter="modifydetails" @emit-cost="chosescore"></Choseintegral>
				</bee-form>
		</div>
</div>
</template>
<script>
	import '../../../../establish/commoncss/common.css'
	export default{
		data(){
			return {
				scorearr:[-10,-5,-2,2,5,10],
				index:3,
				isscoreshow:false,
				personUserId:[],
				json:{
					userflow:{
						"users":[],
						"ccs":[]
					}
				},
			rules:{
					name:{ regular:false, message: '',must:true},
			    }
			}
		},
		props:["modifydetails"],
		mounted(){
			this.index=3
        },
		activated(){
			let data = JSON.parse(sessionStorage.getItem('selectPerson'));
            // console.log("users-333")
            // console.log(data)
		},
		methods:{
//			 chosePerson2(){
//              let user_id = this.personUserId.length === 0 ? "" : this.personUserId;
//              this.$router.push({
//                  path:'/ChooseCharges',
//                  name:'chooseCharges',
//                  params:{
//                      id:1,                                               //1单选，2多选
//                      name:"选择负责人",
//                      user_id:user_id
//                  }
//              })
//              //回到本页面获取数据执行JSON.parse(sessionStorage.getItem('selectPerson'));
//          },
            clearPerson(){
                this.personUserId = [];
            },
			scoreshow(){
				this.isscoreshow=true
				 history.pushState(null, null, document.URL);
           		 window.addEventListener("popstate", this.chosescore, false);
			},
			chosescore(obj,costparameter){
				this.isscoreshow= false
				if(obj == false){
					return
				}
				this.modifydetails.score=obj.num
				// if(e.toString() === '[object MouseEvent]') history.go(-1);
           		 window.removeEventListener("popstate", this.chosescore, false);
			},
			addnum(){
				for(var i=0;i<this.scorearr.length;i++){
					if(this.modifydetails.score==this.scorearr[i]){
						this.index=i
					}
				}
				if(this.index==this.scorearr.length-1){
						$toast.show("最大分值了", 1000)
						return
				}else{
						this.modifydetails.score=this.scorearr[this.index+1]
				}
			},
			remove(){
				for(var i=0;i<this.scorearr.length;i++){
						if(this.modifydetails.score==this.scorearr[i]){
							this.index=i
						}
					}
					if(this.index==0){
							$toast.show("最小分值了", 1000)
							return
					}else{
							this.modifydetails.score=this.scorearr[this.index-1]
					}
			},
			deletes(e){
				this.$emit("delete",e)
			},
			chosePerson(e){
                this.$emit("chosePerson",e)
			},
			chosedepartment(e){
                this.$emit("chosedepartment",e)
			},
			addproject(modifydetailsobj){
				this.$emit("emit-addproject",modifydetailsobj)
			}
		},
	}

</script>

<style scoped>
	.reference .addsub{
		width:4rem;
		position:absolute;
		border:1px solid #eee;
		height:1.2rem;
		min-height:1.2rem;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		font-size:0.5rem;
		right:0.6rem;
		margin-right:0;
		padding:0;
	}
	.addsub i{
		display:block;
		padding:0 0.5rem;
	}
	.addsub input{
		display:block;
		text-align:center;
		margin-right:0;
		height:1rem;
		border-left:1px solid #eee;
		border-right:1px solid #eee;
	}
	.addsub>p{
		justify-content: center;
		margin-right:0;
		margin-left:0;
		height:1rem;
		border-left:1px solid #eee;
		border-right:1px solid #eee;
		padding:0 0.5rem;
	}
	.numsmall{
		color:red;
	}
	.removes{
		color:red;
	}
	.reference_costnobor{
		border:0;
	}
	.reference_text{
		width:100%;
		height:4.8rem;
		display:flex;
		justify-content: space-around;
	}
	.reference_text .texts{
		display:block;
		width:90%;
		height:4rem;
		border:1px solid #eee;
		line-height:1.5rem;
	}
</style>
