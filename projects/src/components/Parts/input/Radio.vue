<template>
	<div class="input-warp">
		<label>{{name}}</label>
		<span class="onlyShow show" @click="iclick">{{model}}</span>
        <slot></slot>
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
		props:['value','name','alert','edit','validate','chioseData'],
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
                	this.beeFormItem != "" ? this.beeFormItem.childData = val : ""
	            }
	        }
	    },
		mounted(){
		},
		methods:{
			iclick(){
                let _this = this;
                this.$emit('click');
                let buttonsObj = {}
                for(let i in this.chioseData){
                    buttonsObj[this.chioseData[i].name] = () => {
                        _this.model = this.chioseData[i].data
                    }
                }
                // console.log(buttonsObj)
                $actionSheet.show({
					theme: 'ios',
					title: this.alert,
					cancelText:'取消',
					buttons: buttonsObj
				})
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