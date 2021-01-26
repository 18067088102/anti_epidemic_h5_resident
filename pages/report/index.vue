<template>
	<view class="report_container">
		<image class="head_img" src="../../static/banner_2.png"></image>
		<view class="empty_page" v-if="isNoData">
			<image class="empty_img" src="../../static/dummy_status_img.png"></image>
			<text class="empty_text">您暂未上报情况</text>
		</view>
		<view class="report_list" v-if="!isNoData">
			<view class="report_item" v-for="(item, index) in listsItem" :key="index">
				<view class="head_box">
					<text class="head_title">{{item.reportTime}}的上报情况</text>
					<view class="status_box" :class="!item.type||item.type=='待处理'?'color_n':'color_y'">
						<text class="status_text">{{item.type?item.type:'待处理'}}</text>
					</view>
				</view>
				<view class="type-container">
					<text class="type-text">上报对象:</text>
					<text class="content-text">{{item.reportAddress}}</text>
				</view>
				<view class="type-container">
					<text class="type-text">上报情况:</text>
					<text class="content-text">{{item.reportContent}}</text>
				</view>
				<view class="type-container">
					<text class="type-text">备注信息:</text>
					<text class="content-text">{{item.remark?item.remark:'无'}}</text>
				</view>
			</view>
			<uni-load-more v-if="!isNoData&&isShowLoadMore" :status="status"></uni-load-more>
		</view>
		<view class="add_right" @click="onAddReport">
			<image class="add_img" src="../../static/icon_add.png"></image>
		</view>
		<u-gap height="100"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				emptyText: '暂无邻里上报记录...',
				status: 'more',
				keyword: '',
				listsItem: [],
				loading: true,
				page: 1,
				pages: 0,
				isNoData: false,
				isShowLoadMore: false,
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.getReportListRequest(1, true)
		},
		mounted() {
			var that = this;
			that.$utils.$on('refreshReportList', () => {
				that.getReportListRequest(1, true);
			})
		},
		methods: {
			async getReportListRequest(pageNo, override) {
				var that = this
				return await that.$http(that.$api.getReportListUrl, {
					method: 'GET',
					data: {
						limit: '10',
						page: pageNo
					},
					token: uni.getStorageSync('token')
				}).then(res => {
					if (res.code == 200) {
						const list = res.result.list
						that.status = list.length == 0 ? 'noMore' : 'more'
						that.isNoData = list.length == 0 ? true : false
						that.page = pageNo //当前的页号
						that.pages = res.result.totalPage //总页数
						that.listsItem = override ? list : that.listsItem.concat(list)
						that.isShowLoadMore = that.listsItem.length < 10 ? false : true
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
						that.isNoData = true
					}
				}).catch(err => {
					that.isNoData = true
				})
			},
			
			onAddReport() {
				uni.navigateTo({
					url: "/pages/report/add"
				})
			}
		},
		/**
		 * 监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			uni.showNavigationBarLoading()
			this.getReportListRequest(1, true).then(() => {
				uni.hideNavigationBarLoading()
				// 处理完成后，终止下拉刷新
				uni.stopPullDownRefresh()
			})
		},
		/**
		 * 监听页面上拉触底事件
		 */
		onReachBottom: function() {
			if (this.loading && this.page < this.pages) {
				this.status = 'loading'
				this.getReportListRequest(this.page + 1)
			}
			if (this.loading && this.page == this.pages) {
				this.status = 'noMore'
			}
		},
	}
</script>

<style lang="scss" scoped>
	.report_container {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-height: 100%;
	}

	.head_img {
		width: 100%;
		height: 410rpx;
	}

	.report_list {
		display: flex;
		flex-direction: column;
		padding: 0 30rpx 30rpx;
	}

	.report_item {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		border-radius: 15rpx;
		padding: 20rpx 30rpx 0;
		margin-top: 30rpx;
	}

	.head_box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 40rpx;
		margin-bottom: 20rpx;
	}

	.head_title {
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
	}
	
	.status_box {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: center;
	  width: 90rpx;
	  height: 40rpx;
	  border-radius: 6rpx;
	  background-color: rgba(28, 169, 95, 1);
	}
	
	.status_text {
	  font-size: 24rpx;
	  font-family: PingFangSC-Regular, PingFang SC;
	  font-weight: 400;
	  color: #FFFFFF;
	  line-height: 24rpx;
	}

	.type-container {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-bottom: 20rpx;
		width: 100%;
	}

	.type-text {
		width: 140rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
		line-height: 28rpx;
	}

	.content-text {
		width: calc(100% - 140rpx);
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
	}
	
	.empty_page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 100rpx;
	}
	
	.empty_img {
		width: 306rpx;
		height: 365rpx;
	}
	
	.empty_text {
		margin-top: 30rpx;
		font-size: 36rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 700;
		color: #43BA7B;
		line-height: 42rpx;
	}
	
	.color_n {
		background-color: #FF9900;
	}
	
	.color_y {
		background-color: #19BE6B;
	}
</style>
