<template>
	<div class="beeerp">
		<transition name="fade">
			<keep-alive>
			    <router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
		</transition>
		<transition name="fade">
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	},
	mounted(){

	}
}

</script>

<style>
	.beeerp{
		width: 100vw;
		height: 100vh;
	}
</style>