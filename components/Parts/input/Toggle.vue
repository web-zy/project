<template>
	<div class="input-warp input-radio">
		<label>{{name}}</label>
		<div class="page-content padding-top">
			<von-toggle :text="''" v-model="model"></von-toggle>
		</div>
	</div>
</template>

<script>
	import "./input.less"
	export default{
		data(){
			return{
				// model:this.value,
				inpShow:true
			}
		},
		inject: {
			beeFormItem: {
				default: ''
			},
			modelData:{
				default: ''
			}
		},
		props:['value','name','alert','edit','validate'],
		computed:{
	        model: {
	            // model
	            get:function() {
                	this.beeFormItem != "" ? this.beeFormItem.childData = this.value : ""
	                return this.value;
	            },
	            set:function(val) {
	                this.$emit('input', val);
	                this.$emit('change', val);
                	this.beeFormItem.childData = val
	            }
	        }
	    },
		mounted(){
		},
		methods:{
			iclick(){
                this.$emit('click');
                if(!this.edit){
	                if(this.beeFormItem == ""){
	                	return
	                }
                }else{
                	if(this.edit != true){
                		return
                	}
                }
				this.inpShow = true;
			},
			clear(){
				this.model = "";
				this.iclick()
				this.$refs.input.focus()
			},
			b(){
				if(this.model) this.inpShow = false;
				if(this.beeFormItem != ''){
                	// this.beeFormItem.validate(this.model)
				}
			}
		},
		directives: {
		    blur:{
		    	update:function(el){
		    		console.log(el)
		    	}
		    }
		}
	}
</script>

<style rel="stylesheet/less" scoped>
	@import "./input.less"
</style>
<style lang="less">
    .input-radio label{
        width: 70% !important;
    }
	.input-warp{
		.padding-top{
			padding:0;
			.item-toggle .toggle{
				right: 0;
			}
			.padding-top .item .hairline-top,.hairline-bottom{
				display: none;
			}
		}
	}
</style>