<template>
	<div class="data-warp">
		<label>{{name}}</label>
		<!-- <input type="date" class="dateInp" v-model="model" ref="dateInp" @click="off()" /> -->
		<input type="tel" style="text-align:right;height:100%;" @blur="maxMin(model)" :placeholder=alert v-model="model" ref="textInp" />
	</div>
</template>

<script>
	export default{
		data(){
			return{
				// model:this.value,
				oldNum:this.value
			}
		},
		props:['value','name','alert','min','max'],
		computed:{
	        model: {
	            // model
	            get:function() {
	                return this.oldNum;
	            },
	            set:function(val) {
	            	// val > 100 ? val = 100 : val < 0 ? val = 0 : val = val
	                this.oldNum = val;
	                this.$emit('input', val);
	                this.$emit("change" ,val)
	                return val
	            }
	        }
	    },
		mounted(){
			// console.log(this.value)
		},
		methods:{
			maxMin(val){
				let num = this.$refs.textInp.value
				let nowNum = 0;
				if(this.max && this.min){
					var reg = /^(0|([1-9]\d?)|(1[01]\d)|(100))(\.\d*)?$/;
	            	if(!reg.test(num)){
	            		$dialog.alert({
							effect: 'ios',
							title: '提示',
							content: '请输入0-100之间的数字',
							okText: '确定',
							okTheme: 'Energized'
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
				}else if(this.min){
					alert(2)
					 nowNum = num < this.min ? this.min : num;
				}else{
					nowNum = num
				}
            	this.$refs.textInp.value = nowNum
            	this.model = nowNum
            	return nowNum
			},
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