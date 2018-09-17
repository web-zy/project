<template>
	<div  @click="hide">
		<div v-if="isbackground" class="posback">
				
		</div>
		<von-header>
		      <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
		      <span slot="title">{{title}}</span>
		      <div class="button button-icon company" id="companyname" slot="right" @click.stop="showcompony">{{company_name}}</div>
		</von-header>
		<div class="reference reference-one">
			<p class="required">*</p>
			<p>计量单位</p>
			<input type="text" v-model="name" placeholder="请输入修改后的计量单位"/>
		</div>
		<div class="reference">
			<p>备注</p>
			<input type="text" v-model="remarks" placeholder="备注"/>
		</div>
		<button class="addSubmit" @click="addSubmit">提交</button>
		<!-- 选择公司 -->
		
		<getcommpy v-if="isgetcommpy"  :componparameter="componparameter"   @emit-getcommpys="componyobj"></getcommpy>
	
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data(){
			return {
				title:"修改计量单位",
				company_id:"",
				// 公司名称
				company_name:"",
				// 备注
				remarks:"",
				// 计量单位
				name:"",
				// 申请人id
				user_id:"",
				id:"",
				getcommpy:"",
				isgetcommpy:false,
				isbackground:false,
				bizid:""
			}
		},
		mounted(){
			this.company_name=this.$route.params.obj.company_name
			this.user_id=this.$route.params.obj.user_id
			this.id=this.$route.params.obj.id
			this.company_id=this.$route.params.obj.company_id
			this.remarks=this.$route.params.obj.remarks
			this.name=this.$route.params.obj.name
			this.bizid=utrl.setbizid();
		},
		deactivated(){
			 this.$destroy()
		},
		methods:{
			back: function() {
				$router.go(-1)
			},
			hide(){
				this.isgetcommpy=false,
				this.isbackground=false
			},
			//选择公司
			showcompony(e){
				this.componparameter=e.currentTarget
				this.isgetcommpy=!this.isgetcommpy
				this.isbackground=!this.isbackground
			},
			componyobj(obj,componparameter){
				this.isgetcommpy=!this.isgetcommpy
				this.company_name=obj.company_name
				this.company_id=obj.company_id
				this.isbackground=!this.isbackground
				this.remarks=""
				this.name=""

			},
			async addSubmit(){
				let _this=this
				if(this.name==""){
					$toast.show("请输入计量单位", 3000).then(() => {})
				}else{
					let url="measures/"+this.id+"/?bizid="+this.bizid+"&token="+api.token;
					let res=await api.put(url,{
						name:_this.name,
						company_id:_this.company_id,
						company_name:_this.company_name,
						remarks:_this.remarks,
						user_id:_this.user_id,
					})
					console.log(res);
					if(res.status >= 200 && res.status < 300){
						$toast.show("修改成功", 3000).then(() => {})
						$router.go(-1)
						// this.$router.push({name:"commanreference",params:{istrue:true}})
						// alert("提交成功")
					}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
					}
					
				}
			}
		},
		components:{
			
		}
	}
</script>

<style lang="less" scoped>
	.addinput{
		margin:3rem auto 0;
		border:1px solid #eee;
		width:90%;
		height:2rem;
		line-height:2rem;
		padding-left:0.5rem;
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
	.reference-one{
		margin-top:2.5rem;
	}
	.reference .required{
		height: 2.3rem;
		line-height:2.3rem;
	    position: absolute;
	    top: 0;
	    left: 0.6rem;
	    margin: 0;
	    color: red;
	}
	.fuhao{
		height: 2.3rem;
	    position: absolute;
	    top: 0;
	    right: 0.6rem;
	    line-height: 2.3rem;
	}
	.reference:nth-child(1){
		height: 2.3rem;
	    margin-left: 1.15rem;
	    color: #666;
	    font-size: 0.75rem;
	    display: flex;
	    align-items: center;
	}
	.reference p{
		margin-left:1rem;
	}
	.reference input{
		width: 60%;
	    height: 2.3rem;
	    text-align: right;
	    font-size: 0.75rem;
	    margin-right: 1.2rem;
	    background: transparent;
	    padding: 0;
	    color: #666;
	    display: flex;
	    align-items: center;	
	}
	.addSubmit{
		display:flex;
		padding:0 0.9rem;
		margin:0.5rem auto;
		height:1.4rem;
		color:#333;
		border:1px solid #f2ad06;
		border-radius:0.7rem 0.7rem;
		background:white;
	}
.posback{
	position:fixed;
	width:100%;
	height:100vh;
	background:rgba(0,0,0,.2);
	top:0;
	left:0;
	z-index:33;
}
#companyname{
	width: 5.5rem;
    height: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
    line-height: 40px;
    text-align: right;
}
</style>