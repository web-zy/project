<template>
	<div class="bom">
		<div v-for="item in navlists">
			<p>{{item.pic}}</p>
			<p>{{item.name}}</p>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				
			}
		},
		props:['navlists']
	}
</script>

<style scoped>
	.bom{
		position:fixed;
		left:0;
		bottom:0;
		width:100vw;
		height:2.5rem;
		background:white;
		display:flex;
		align-items: center;
		justify-content: space-around;
	}
	.bom div{
		width:3.75rem;
		height:100%;
		display:flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		
	}
</style>