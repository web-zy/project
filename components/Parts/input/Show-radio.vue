<template>
	<div>
		<von-checkbox :options="topics" v-model="chosenTopics" theme="positive"></von-checkbox>
        <ButtonBottom @call-back="saveData">保存</ButtonBottom>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				// model:this.value,
				topics: ["娱乐", "电影", "减肥", "搞笑", "科技"],
                chosenTopics:[]
			}
		},
		mounted(){
            this.$destroy()
		},
		methods:{
            saveData(){
                console.log(this.checkBox)
                // this.checkBox.closeModel()
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