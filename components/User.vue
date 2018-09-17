<template>
	<div id="body">
		<transition name="slide-fade" mode="out-in">
			<keep-alive>
			    <router-view></router-view>
			</keep-alive>
		</transition>
	</div>
</template>

<script>
import api from "../asset/api.js"
import utrl from "./../controller/utrl.js"
export default {
	data () {
		return {
			transitionName: 'slide-left'
		}
	},
	// dynamically set transition based on route change
	watch: {
		'$route' (to, from) {
			const toDepth = to.path.split('/').length
			const fromDepth = from.path.split('/').length
			this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
		}
	},
	mounted() {
	  // this.a()
    // utrl.fullscreen()
	},
	methods: {
		a: function() {
			
		}
	},
	computed: {
        key() {
            return this.$route.path.replace(/\//g, '_')
        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped="">
	#body {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		overflow:hidden;
		font-size: 1rem;
		overflow: hidden;
		background: url(../../static/work_images/entry.png) center;
		// background-size: 230% 100%;
		background-repeat: no-repeat;
		// background-position-x: -15rem;
		background-size:cover;
		// background-position-x:-10rem;
		z-index: -10;
	}

</style>