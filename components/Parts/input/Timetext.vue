<template>
	<div class="input-warp">
		<label>{{name}}</label>
		<span class="onlyShow" :class="[inpShow ? 'hide' : 'show',model ? '' : 'no-word']" v-focus @click="iclick">{{model ? model : alert}}</span>
		<input v-if="inpShow" ref="input" v-focus @blur="b" @click="iclick" type="text" :placeholder=alert v-model="model" />
		<i v-if="inpShow && model" @click="clear" class="clear-right ion-close-round"></i>
		<input type="time" id="chosetime" v-model="model"/>
        <slot></slot>
	</div>
</template>

<script>
	import "./input.less"
	export default{
		data(){
			return{
				// model:this.value,
				inpShow:false
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
		// props:['value','name','alert','edit','validate'],
        props:{
            value:{
                default:""
            },
            'name':{
                default:""
            },
            'alert':{
                default:""
            },
            'validate':{
                default:""
            },
            edit:{
                default:true
            }
        },
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
                this.$emit('click');
                if(this.edit != false){
					this.inpShow = true;
                }
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