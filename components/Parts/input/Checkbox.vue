<template>
	<div class="input-warp">
		<label>{{name}}</label>
		<span class="onlyShow show" @click="iclick">
			<em v-for="(val,index) in model">{{val.name}}<ins> , </ins></em>
            <em style="color:#aeadac;" v-if="model.length == 0">请选择</em>
		</span>
        <i class="icon-right ion-ios-arrow-forward"></i>
	</div>
</template>

<script>
	import "./input.less"
    import MyModal from "./Show-radio.vue"
	export default{
		data(){
			return{
				// model:this.value,
				inpShow:true,
                modal: undefined
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
        provide() {
        	return {
        		checkBox: this
        	};
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
            // this.iclick()
		},
        destroyed() {
//             if (this.modal)
//                 $modal.destroy(this.modal)
        },
		methods:{
			iclick(){
                this.$emit('click');
//                 $modal.fromComponent(MyModal, {
//                     title: '模态窗标题',
//                     theme: 'default',
//                     destroyOnHide:true
//                 }).then((modal) => {
//                     this.modal = modal
//                     this.modal.show()
//                 })
			},
			b(){
				if(this.model) this.inpShow = false;
				if(this.beeFormItem != ''){
                	// this.beeFormItem.validate(this.model)
				}
			},
            closeModel(){
                // this.modal.hide()
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
	.onlyShow em:last-child ins{
		display: none;
	}
	@import "./input.less"
</style>