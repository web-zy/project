<template>
	<div class="input-warp">
		<label>{{name}}</label>
        <datepicker :style="{opacity : value ? '1' : '0'}" v-model="model" class="onlyShow datepicker" placeholder="alert" date-format="yyyy-mm-dd"></datepicker>
        <span v-if="!value" class="onlyShow showTime" @click="iclick" >{{alert}}</span>
	</div>
</template>

<script>
	import "./input.less"
	import {formatDate} from "./../../../controller/utrl.js"
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
	            	let a = this.value;
	            	if(!this.vlaue){
	            		// a = new Date().toLocaleDateString()
	            		a = formatDate(new Date(),'yyyy-MM-dd')
	            		// a = "2018-09-17"
	            	}
                	this.beeFormItem != "" ? this.beeFormItem.childData = this.value : ""
	                return a;
	            },
	            set:function(val) {
	                this.showDate = val
	            }
	        },
	        showDate:{
	        	get:function() {
	                return this.alert;
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
				this.inpShow = false;
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
		    		// console.log(el)
		    	}
		    }
		}
	}
</script>

<style lang="less">
	.showTime{
		color:#aeadac !important;
		font-size:0.7rem;
		text-align:right;
		position:absolute;
		right:1rem;
		padding:0;
	}
	.datepicker{
        justify-content: flex-end;
        position:relative;
        z-index:2;
        .hairline-top,.hairline-bottom{
            display:none;
        }
    }
    .dp-list {
        &:before,&:after{
            position: absolute;
            left: 1rem;
            right: 1rem;
            content: "";
            background: #999;
            width: auto;
            display: block;
            height: 2px;
            z-index: 99;
        }
        &:before{
            top: 43%;
        }
        &:after{
            bottom: 43%;
        }
    }
</style>