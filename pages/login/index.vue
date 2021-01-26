<template>
	<view class="login_container1">
		<view class="login_head">
			<image class="head_img" src="../../static/login_img.png"></image>
			<text class="login_title">系统登录</text>
			<view class="title_tip">
				<view class="head_line"></view>
				<text class="head_text">请先使用您的手机号登录系统</text>
				<view class="head_line"></view>
			</view>
		</view>
		<view class='login-container'>
			<!-- 手机号 -->
			<view class='phone-view common-view'>
				<input class='login-input' :value="phoneNo" @input="getValue" @blur="phoneNoBlur" data-id="phoneNo" type='number'
				 maxlength='11' placeholder='请输入手机号' placeholder-class='placeholder'></input>
			</view>
			<!-- 验证码 -->
			<view class='vscode-view common-view'>
				<input class='login-input' :value="smsCode" @input="getValue" data-id="smsCode" maxlength='6' placeholder='输入验证码'
				 placeholder-class='placeholder'></input>
				<view class='line'></view>
				<text class='vscode-text' @click='onGetCode'>{{getCodeText}}</text>
			</view>
			<!-- 注册按钮 -->
			<button class='submit-btn' style="margin-bottom: 30rpx;" :loading="isLoading" @click="submitHandler" :disabled="isDisable">{{buttonText}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneNo: '',
				smsCode: '',
				isLoading: false,
				buttonText: '登录',
				isDisable: true,
				getCodeText: '获取验证码',
				isDisabled: true,
			}
		},
		onLoad() {
			this.phoneNo = uni.getStorageSync('phoneNo')
		},
		onShow() {
			const token = uni.getStorageSync('token')
			if (token) {
				uni.switchTab({
					url: '/pages/home/index',
				})
			}
		},
		methods: {
			onGetCode() {
				if (this.phoneNo == '') {
					uni.showToast({
						title: '手机号码不能为空',
						icon: 'none'
					});
					return
				} else if (this.phoneNo.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNo))) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
				} else {
					if (this.isDisabled == true) {
						uni.showToast({
							title: '加载中…',
							icon: 'loading'
						})
						this.getCodeRequest();
					} else {
						uni.showToast({
							title: '已获取验证码,请稍后再试',
							icon: 'none'
						})
					}
				}
			},
			/**
			 * 获取短信验证码
			 */
			async getCodeRequest() {
				var that = this
				return await that.$http(that.$api.getLoginSMSCodeUrl + "?phone=" + that.phoneNo, {
					method: 'POST',
					data: {},
					token: ''
				}).then(res => {
					that.handleRequestResult(res)
				}).catch(err => {})
			},
			handleRequestResult(res) {
				uni.hideToast()
				if (res.code == 200) {
					uni.showToast({
						title: '获取验证码成功',
						icon: "none"
					})
					var _this = this
					var coden = 60 //定义60秒的倒计时
					var codeV = setInterval(function() {
						_this.getCodeText = (--coden) + 's' + '后重试'
						_this.isDisabled = false
						if (coden == -1) { //清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
							clearInterval(codeV)
							_this.getCodeText = '获取验证码'
							_this.isDisabled = true
						}
					}, 1000) //1000是1秒
				} else {
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				}
			},
			submitHandler: function submitHandler(e) {
				if (this.phoneNo.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNo))) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
					return
				}
				this.isLoading = true
				this.buttonText = '登录中...'
				this.isDisable = true
				this.onLoginEvent()
			},

			async onLoginEvent() {
				var that = this
				return await that.$http(that.$api.loginUrl + '?mobile=' + that.phoneNo + '&vcode=' + that.smsCode, {
					method: 'POST',
					data: {},
					token: ''
				}).then(res => {
					this.isLoading = false
					this.buttonText = '登录'
					this.isDisable = false
					if (res.code == 200) {
						uni.setStorageSync('token', res.token.token)
						uni.showToast({
							title: '登录成功',
							icon: 'none',
							success: (res) => {
								uni.switchTab({
									url: '/pages/home/index',
								})
							}
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				}).catch(err => {
					this.isLoading = false
					this.buttonText = '登录'
					this.isDisable = false
				})
			},
			toForget() {
				uni.navigateTo({
					url: '/pages/register/index?fromID=1',
				})
			},
			phoneNoBlur(event) {
				let phoneNo = event.detail.value || event.detail.text;
				if (!phoneNo) {
					phoneNo = ''
				}
				if (phoneNo.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phoneNo))) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
				}
			},
			getValue(e) {
				let type = e.currentTarget.dataset.id;
				if (type == 'phoneNo') {
					this.phoneNo = e.detail.value.replace(/\s+/g, '')
				}
				if (type == "smsCode") {
					this.smsCode = e.detail.value.replace(/\s+/g, '')
				}
				this.validateEmpty();
			},
			validateEmpty() {
				if (this.phoneNo == '' || this.smsCode == '') {
					this.isDisable = true
				} else {
					this.isDisable = false
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../common/css/fr.css";
	
	.login_container1 {
		width: 100%;
		min-height: 100%;
		position: relative;
	}

	.login_head {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.head_img {
		width: 100%;
		height: 410rpx;
	}

	.login_title {
		font-family: "微软雅黑 Bold", "微软雅黑 Regular", 微软雅黑, sans-serif;
		font-weight: 700;
		font-style: normal;
		font-size: 48rpx;
		color: #1B7AC2;
		margin-top: 40rpx;
	}

	.title_tip {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 40rpx;
	}

	.head_line {
		width: 140rpx;
		height: 2rpx;
		background: #1B7AC2;
	}

	.head_text {
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #1B7AC2;
		line-height: 37rpx;
		margin: 0 20rpx;
	}
</style>
