<template>
	<div class="input-warp">
		<label>{{name}}</label>
        <span class="onlyShow" :class="[inpShow ? 'hide' : 'show',model ? '' : 'no-word']" v-focus @click="iclick">{{model ? model : alert}}</span>
		<input v-if="inpShow" v-model="model" ref="input" v-focus @blur="b" @click="iclick" type="number" :placeholder=alert />
		<i v-if="inpShow && model" @click="clear" class="clear-right ion-close-round"></i>
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
		props:['value','name','alert','edit','validate','max','min'],
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
            maxMin(val){
            	let num = this.$refs.input.value
            	let nowNum = 0;
            	if(this.max && this.min){
                console.log(num)
            		var reg = eval('/^(' + this.min + '|([1-9]\d?)|(1[01]\d)|(' + this.max + '))(\.\d*)?$/');
            		if(!reg.test(num)){
            			$dialog.alert({
            				theme: 'ios',
            				title: '提示',
            				content: '请输入0-100之间的数字',
            				okText: '确定'
            			})
            			if(num > this.max){
            				nowNum = this.max
            			}else if(num < this.min){
            				nowNum = this.min
            			}else{
            				nowNum = this.min
            			}
            		}else{
            			nowNum = num
            		}
            	}else if(this.max){
            		alert(1)
            		nowNum = num > this.max ? this.max : num;
            	}else if(this.min || this.min == 0){
            		alert(2)
            		nowNum = num < this.min ? this.min : num;
            	}else{
            		nowNum = num
            	}
            	this.$refs.input.value = nowNum
            	this.model = nowNum
            	return nowNum
            },
			b(){
				if(this.model) this.inpShow = false;
                this.maxMin(this.model)
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