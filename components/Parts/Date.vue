<template>
	<div class="data-warp">
		<label>{{name}}</label>
		<input type="date" class="dateInp" v-model="model" ref="dateInp" @click="off()" />
		<input type="text" style="text-align:right;height:100%;" detailed :placeholder=alert v-model="model" ref="textInp" />
	</div>
</template>

<script>
	export default{
		data(){
			return{
				// model:this.value,
			}
		},
		props:['value','name','alert'],
		computed:{
	        model: {
	            // model
	            get:function() {
	                return this.value;
	            },
	            set:function(val) {
	                this.$emit('input', val);
	            }
	        }
	    },
		mounted(){
			// console.log(this.value)
		},
		methods:{
			off(e){
				// this.$refs.textInp.blur();
				// this.$refs.dateInp.focus()
			}
		}
	}
</script>

<style lang="less" scoped>
.date-warp{
	position: relative;
}
.dateInp{
	position: absolute;
	width: 100%;
	height: 100%;
	opacity: 0;
	top: 0;
	right: ;
}
</style>