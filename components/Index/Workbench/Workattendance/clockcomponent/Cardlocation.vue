<template>
	<div id="contents">
		<div class="contents">
			<div class="rei_cost">
					<div class="reimbursement" >
						<p>打卡地点</p>
						<button v-if="cardlocation.isone" @click.stop="deletes(cardlocation.rowno)">删除</button>
					</div>
					<!--<div class="reference reference_cost">
						<p class="required">*</p>
						<p>地点名称</p>
						<input type="text" class="costinput" placeholder="请选择地点名称" v-model="cardlocation.location_name"  style="background:transparent" readonly="readonly"/>
						<p class="fuhao"><i class="ion-chevron-right"></i></p>
					</div>-->
					<bee-form v-model="cardlocation" ref="form" :rules="rules">
						<bee-form-item prop="name">
							<input-text :name="'地点名称'" :alert="'请选择地点名称'" v-model="cardlocation.location_name" @click="getaddress">
								<i class="icon-right ion-ios-arrow-forward"></i>
							</input-text>
						</bee-form-item>
						<!--<div class="reference reference_cost">
							<p class="required">*</p>
							<p>详细地址</p>
							<input type="text" class="costinput" placeholder="请选择详细地址" v-model="cardlocation.address"  style="background:transparent" readonly="readonly"/>
						</div>-->
						<bee-form-item prop="name">
							<input-text :name="'详细地址'" :alert="'请选择详细地址'" v-model="cardlocation.address" @click="getaddress">
								<i class="icon-right ion-ios-arrow-forward"></i>
							</input-text>
						</bee-form-item>
						
						<!--<div class="reference reference_cost" @click.stop="range">
							<p>有效范围</p>
							<input type="text" class="costinput" placeholder="请填写有效范围" v-model="cardlocation.valid_range"  style="background:transparent" />
							<p class="fuhao"><i class="ion-chevron-right"></i></p>
						</div>-->
						<bee-form-item>
							<input-text :name="'有效范围'" :edit="true" :alert="'请填写有效范围'" v-model="cardlocation.valid_range"
							>
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
					}
			}
		},
		props:['cardlocation'],
		mounted(){
			
		},
		methods:{
			deletes(e){
				this.$emit("deletes",e)
			},
			getaddress(){
				this.$emit("getmaps")
			},
			range(){
				
			}
		
			
		}
	}
</script>

<style scoped>


	.reference{
		position:relative;
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
		left:50%;
		width:3.5rem;
		display:flex;
		height:100%;
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
	}
	.box label p{
		margin:0;
	}
</style>