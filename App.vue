<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "colorui/animation.css";
	@import "uni.css"; 
	@import "common/css/custom.css";
	@import "uview-ui/index.scss";
	// @import "demo.scss";
	/*每个页面公共css */
	
	page {
		background-color: #F6F8FA;
		height: 100%;
		font-size: 28upx;
		line-height: 1.8;
	}
</style>
