<template>
	<div id="contentss">
		<div class="contents">
			<div class="rei_cost">
					<div class="reimbursement">
						<p>时间段</p>
						<button @click="deletes(timesoltobj.rowno)" v-if="timesoltobj.isshow==true">删除</button>
					</div>
					<!--<div class="reference reference_cost">
						<p class="required">*</p>
						<p>上班时间</p>
						<input type="time" class="timepick"    v-model="timesoltobj.onduty_time" />
						<input type="text" class="costinput" placeholder="请填写上班时间" v-model="timesoltobj.onduty_time" />
					</div>-->
					<bee-form v-model="timesoltobj" ref="form" :rules="rules">
						<bee-form-item prop="name">
							<Timetext :name="'上班时间'"  :alert="'请选择上班时间'" v-model="timesoltobj.onduty_time"
							>
							<i class="icon-right ion-ios-arrow-forward"></i>
							</Timetext>
						</bee-form-item>
					<!--<div class="reference reference_cost" @click="choseoff">
						<p class="required">*</p>
						<p>下班时间</p>
						<input type="time" class="timepick"    v-model="timesoltobj.offduty_time" />
						<input type="text" class="costinput" placeholder="请填写下班时间" v-model="timesoltobj.offduty_time" />
						<div class="box" @click.stop="boxchange">
							<label>
								<input type="checkbox" v-model="timesoltobj.is_nextday" />
								<p>次日</p>
							</label>
						</div>
					</div>-->
					<bee-form-item prop="name">
							<Timetext :name="'下班时间'"  :alert="'请选择下班时间'" v-model="timesoltobj.offduty_time"
							@click="choseoff">
							<div class="box" @click.stop="boxchange">
								<label>
									<input type="checkbox" v-model="timesoltobj.is_nextday" />
									<p>次日</p>
								</label>
							</div>
							<i class="icon-right ion-ios-arrow-forward"></i>
							</Timetext>
					</bee-form-item>
					
					<!--<div class="reference reference_cost">
						<p>时长</p>
						<input type="number" class="costinput" placeholder="请填写时长" id="test2" v-model="timesoltobj.duration" style="background:transparent" />
					</div>-->
					<bee-form-item>
						<input-text :name="'时长'" :alert="'请填写时长'" v-model="timesoltobj.duration">
							
						</input-text>
					</bee-form-item>
					<!--<div class="reference reference_cost">
						<p>备注</p>
						<input type="text" class="costinput" placeholder="请填写备注" v-model="timesoltobj.details_remarks" style="background:transparent" />
					</div>-->
					<bee-form-item>
						<input-text :name="'备注'" :alert="'请填写备注'" v-model="timesoltobj.details_remarks">
							
						</input-text>
					</bee-form-item>
				</bee-form>
				</div>
		</div>
	</div>
</template>

<script>
	
	export default{
		data(){
			return{
				rules:{
					name:{ 
	                    regular:false, 
	                    message: '',
	                    must:true
						}
					},
			}
		},
		props:["timesoltobj"],
		mounted(){
		
			//this.timesoltobj.is_nextday=false
			/*
			laydate.render({
				  elem: "#test1",
				  type: 'time'
				});
			*/
			
		},
		methods:{
			choseoff(e){
				
				//console.log(e.target)
			
			/*
			laydate.render({
				  elem: e.target,
				  type: 'time'
				});
			*/
				
			},
			deletes(e){
				this.$emit("deletss",e-1)	
			},
			boxchange(){
				
			}
		}
	}
</script>

<style scoped>
	.reference{
		position:relative;
	}
	#contentss .reference input{
		margin-right:0.5rem;
	}
	.check{
		width:2.5rem;
		position:absolute;
	}
	.check label{
		display:flex;
		justify-content: space-around;
		align-items: center;
	}
	.check input{
		height:100%;
		width:1rem;
		border:1px solid red;
	}
	.box{
		position:absolute;
		top:0;
		left:45%;
		width:3.5rem;
		display:flex;
		height:100%;
		color:#333;
	}
	.box label{
		width:3.5rem;
		float:left;
		margin:0;
		display:flex;
		align-items: center;
	}
	.box label input{
		margin:0;
		width:1rem;
		margin-right:0.1rem;
		color:#333;
	}
	.box label p{
		margin:0;
		color:#333;
	}
	.timepick{
		position:absolute;
		top:0;
		left:0;
		width:100%;
		height:100%;
		opacity:0;
	}
</style>