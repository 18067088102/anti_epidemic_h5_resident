<template>
	<view class="add_snap">
		<view class="cu-bar" style="background-color: #F6F8FA;">
			<view class="action">
				<text class="action1" style="color: #FF2553;">您好，请如实填写以下信息</text>
			</view>
		</view>
		<view class="cu-form-group solid-bottom">
			<view class="title"><text style="color: #FF2553;">*</text> 上报对象</view>
			<input :value="villageName" @input="villageNameInput" placeholder="请输入您要上报的对象所在的小区" placeholder-class='placeholder'></input>
		</view>
		<view class="cu-form-group solid-bottom">
			<view class="title"><text style="color: #FF2553;">*</text> 上报信息</view>
			<picker @change="infoChange" :value="index1" :range="picker1">
				<view class="picker" :class="index1!=null?'color2':'color1'">
					{{index1!=null?picker1[index1]:'请选择'}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">备注信息</view>
		</view>
		<view class="cu-form-group">
			<textarea maxlength="-1" :value="textArea" @input="textareaAInput" placeholder="请输入备注信息..."
			 placeholder-class='placeholder1'></textarea>
		</view>
		<view class="btn-view">
			<button class='submit-btn' :loading="isLoading" @click="submitHandler" :disabled="isDisable">{{buttonText}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				textArea: '',
				isLoading: false,
				buttonText: '提交',
				isDisable: false,
				villageName: '',
				index1: 2,
				picker1: ["外地返回","咳嗽气促","未满隔离期出行"],
				address: ''
			}
		},
		methods: {
			infoChange(e) {
				this.index1 = e.detail.value
			},
			
			textareaAInput(e) {
				this.textArea = e.detail.value.replace(/\s+/g, '')
			},
			
			villageNameInput(event) {
				let villageName = event.detail.value || event.detail.text;
				if (!villageName) {
					villageName = ''
				}
				this.villageName = villageName.replace(/\s+/g, '')
			},
			
			addressInput(event) {
				let address = event.detail.value || event.detail.text;
				if (!address) {
					address = ''
				}
				this.address = address.replace(/\s+/g, '')
			},
			
			submitHandler() {
				if (this.villageName == '') {
					uni.showToast({
						title: '请输入上报对象',
						icon: 'none'
					})
					return
				}
				this.addReportRequest()
			},
			
			async addReportRequest() {
				var that = this
				return await that.$http(that.$api.addReportUrl , {
					method: 'POST',
					data: {
						reportAddress: that.villageName,
						reportContent: that.picker1[that.index1],
						type: '待处理',
						remark: that.textArea
					},
					token: uni.getStorageSync('token')
				}).then(res => {
					that.isLoading = false
					that.buttonText = '提交'
					that.isDisable = false
					if (res.code == 200) {
						that.$utils.$emit('refreshReportList')
						uni.showToast({
							title: '提交成功',
							icon: 'none',
							success: (res) => {
								uni.navigateBack({
									delta: 1
								});
							}
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				}).catch(err => {
					that.isLoading = false
					that.buttonText = '提交'
					that.isDisable = false
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.placeholder1 {
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(186, 186, 186, 1);
		line-height: 32rpx;
		text-align: left;
	}
</style>
