<template>
	<scroll-view class="home_container">
		<view class="banner">
			<swiper :indicator-dots="indicatorDots" :current="index" :autoplay="autoplay" :interval="interval" :duration="duration"
			 :circular="true" style="height:410rpx;width:750rpx">
				<block v-for="(item, index) in bannerList" :key="index">
					<swiper-item @click="onClickBanner(index)">
						<image :src="item" style="width:100%;height:100%;"></image>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<view class="content">
			<view class="top_c">
				<image class="user_img" :src="!userDic.faceImg ? '../../static/personal_information_normal.png':combineUrl(userDic.faceImg)"
				 mode='aspectFill'></image>
				<view class="info_box" v-if="!userName||!address">
					<text>亲爱的{{phoneNo}}用户，您好！</text>
					<text>您的个人信息尚不完整</text>
					<button class="user_btn" @click="checkUserInfo">立即完善个人信息</button>
				</view>
				<view class="info_box" v-if="userName&&address">
					<view class="type-container">
						<text class="type-text">姓名:</text>
						<text class="content-text">{{userName}}</text>
					</view>
					<view class="type-container">
						<text class="type-text">地址:</text>
						<text class="content-text">{{address}}</text>
					</view>
					<view class="status_box">
						<text>个人信息完整</text>
						<text style="margin: 0 10rpx;">|</text>
						<text>{{!userDic.nucleicAcidImg||userDic.nucleicAcidImg.length==0?'暂未上传检测报告':'已上传检测报告'}}</text>
					</view>
				</view>
			</view>
			<view class="middle_c">
				<view class="middle_l" @click="checkUserInfo">
					<image class="middle_img" src="../../static/risk_icon.png"></image>
					<text class="text1">个人疫情风险</text>
					<text class="text2">完善信息，获取风险评级</text>
					<text class="text3" :style="userDic.riskLevel?userDic.riskLevel=='低风险'?'color: #19be6b':userDic.riskLevel=='高风险'?'color: #fa3534':'color: #ff9900;':'color: #333;'">{{userDic.riskLevel?userDic.riskLevel:'未知'}}</text>
				</view>
				<view class="middle_r" @click="checkUserInfo">
					<image class="middle_img" src="../../static/report_icon.png"></image>
					<text class="text1">核酸检测报告</text>
					<text class="text2">点击这里上传您的检测报告</text>
					<text class="text3" :style="userDic.nucleicAcidStatus?userDic.nucleicAcidStatus=='0'?'color: #fa3534':'color: #19be6b':'color: #333;'">{{userDic.nucleicAcidStatus?userDic.nucleicAcidStatus=='0'?'阳性':'阴性':'暂无'}}</text>
				</view>
			</view>
			<view class="bottom_c" v-if="userDic.riskLevel=='高风险'||userDic.nucleicAcidStatus=='0'">
				<view class="b_top">
					<image class="top_img" src="../../static/home_icon_dangerous.png"></image>
					<text :class="userDic.nucleicAcidStatus!='0'?'b_text1':'b_text3'">{{userDic.nucleicAcidStatus!='0'?'您从高风险地区返乡\n请严格履行14天隔离程序！':'请自我隔离，并联系医护人员！！'}}</text>
					<text class="b_text2" v-if="userDic.nucleicAcidStatus!='0'">科学防疫·人人有责</text>
				</view>
				<view class="b_bottom" v-if="userDic.nucleicAcidStatus!='0'">
					<text class="bottom_text color1">请严格履行14天隔离程序</text>
				</view>
				<view class="b_bottom1" v-if="userDic.nucleicAcidStatus=='0'">
					<text class="bottom_text color1" style="font-size: 28rpx;">紧急求助电话：<text class="color2">0551-8776 5544</text></text>
					<button class="call_btn" @click="onCallPhone">立即呼叫</button>
				</view>
			</view>
		</view>
		<u-gap height="100"></u-gap>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				status: 0,
				userDic: {},
				userName: '',
				phoneNo: '',
				address: '',
				indicatorDots: true,
				vertical: false,
				autoplay: true,
				index: 0,
				interval: 5000,
				duration: 1000,
				bannerList: ["/static/home_banner_1.png", "/static/banner_2.png", "/static/login_img.png"],
			}
		},
		onShow() {
			this.getUserInfoRequest()
		},
		methods: {
			combineUrl(url) {
				return this.$common.combineImageUrl(url)
			},

			async getUserInfoRequest() {
				var that = this
				return await that.$http(that.$api.getQueryInfoUrl, {
					method: 'GET',
					data: {},
					token: uni.getStorageSync('token')
				}).then(res => {
					if (res.code == 200) {
						var user = res.user
						this.userDic = user
						var reg = /^(\d{3})\d{4}(\d{4})$/
						this.phoneNo = user.mobile.replace(reg, "$1****$2")
						this.userName = user.name
						this.address = user.backHomeAddress
					}
				}).catch(err => {})
			},
			onClickBanner(index) {
				console.log(index)
			},
			checkUserInfo() {
				uni.navigateTo({
					url: "/pages/check/index?userDic=" + JSON.stringify(this.userDic)
				})
			},
			onCallPhone() {
				uni.makePhoneCall({
					phoneNumber: '19965346554'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home_container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		min-height: 100%;
	}

	.banner {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		background: #fff;
	}

	.banner .swiper-item {
		width: 100%;
		height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding: 0 30rpx;
	}

	.top_c {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		height: 260rpx;
		padding: 30rpx;
		background-color: #D2EBFF;
		border-radius: 16rpx;
		margin-top: 30rpx;
	}

	.user_img {
		width: 160rpx;
		height: 200rpx;
		margin-right: 25rpx;
	}

	.info_box {
		display: flex;
		flex-direction: column;
		width: calc(100% - 185rpx);
		height: 100%;
		position: relative;
	}

	.info_box>text {
		height: 26rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 26rpx;
	}

	.info_box>text:nth-child(2) {
		margin-top: 17rpx;
	}

	.type-container {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-bottom: 18rpx;
		width: 100%;
	}

	.type-text {
		width: 90rpx;
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 30rpx;
	}

	.content-text {
		width: calc(100% - 90rpx);
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 34rpx;
	}

	.status_box {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: absolute;
		bottom: 0;
	}

	.status_box>text {
		height: 26rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
		line-height: 26rpx;
	}

	.user_btn {
		background-color: #147DF3;
		color: #FFFFFF;
		font-size: 28rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin-left: 0rpx;
		margin-top: 68rpx;
	}

	.middle_c {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 240rpx;
		margin-top: 30rpx;
	}

	.middle_l,
	.middle_r {
		display: flex;
		flex-direction: column;
		width: 330rpx;
		height: 240rpx;
		padding: 0 20rpx;
		border-radius: 16rpx;
		position: relative;
	}

	.middle_l {
		background-color: #FFF5CD;
	}

	.middle_r {
		background-color: #D7FCF4;
	}

	.middle_img {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100rpx;
		height: 100rpx;
	}

	.text1 {
		height: 32rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 32rpx;
		margin-top: 40rpx;
	}

	.text2 {
		height: 24rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #999999;
		line-height: 24rpx;
		margin-top: 20rpx;
	}

	.text3 {
		height: 36rpx;
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 36rpx;
		margin-top: 28rpx;
	}

	.bottom_c {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 205rpx;
		padding: 0 20rpx;
		background-color: #FFECEC;
		border-radius: 16rpx;
		margin: 30rpx 0;
	}

	.b_top {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 118rpx;
		border-bottom: 1rpx solid #FBABAB;
		position: relative;
	}

	.top_img {
		width: 50rpx;
		height: 41rpx;
	}

	.b_text1 {
		height: 69rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #EA0505;
		line-height: 42rpx;
		margin-left: 23rpx;
	}

	.b_text3 {
		height: 28rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #EA0505;
		line-height: 28rpx;
		margin-left: 23rpx;
	}

	.b_text2 {
		height: 24rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
		line-height: 24rpx;
		position: absolute;
		top: 30rpx;
		right: 0;
	}

	.b_bottom {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 87rpx;
	}

	.b_bottom1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 87rpx;
	}

	.bottom_text {
		height: 30rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 30rpx;
	}

	.call_btn {
		background-color: #147DF3;
		color: #FFFFFF;
		font-size: 28rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin-right: 0rpx;
	}

	.color1 {
		color: #333333;
	}

	.color2 {
		color: #EA0505;
		margin: 0 10rpx;
	}
</style>
