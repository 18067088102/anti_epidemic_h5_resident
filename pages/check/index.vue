<template>
	<view>
		<view class="nav">
			<view class="nav_item" v-for="(item,index) in Tabs" :key='index' @click="tabSelect" :data-id="index">
				<view class="item_content" :class="index==TabCur?'text-theme cur':'text-gray'">
					{{Tabs[index]}}
				</view>
			</view>
		</view>
		<view class="add_snap" v-if="TabCur==0">
			<view class="cu-bar" style="background-color: #F6F8FA;">
				<view class="action">
					<text class="action1" style="color: #FF2553;">您好，请如实填写以下信息</text>
				</view>
			</view>
			<view class="cu-form-group solid-bottom">
				<view class="title"><text style="color: #FF2553;">*</text> 姓名</view>
				<input :value="userName" @input="userNameInput" placeholder="请输入您的姓名" placeholder-class='placeholder' maxlength="5"></input>
			</view>
			<view class="cu-form-group solid-bottom">
				<view class="title"><text style="color: #FF2553;">*</text> 电话</view>
				<input :value="userPhone" @input="userPhoneInput" @blur="userPhoneBlur" placeholder="请输入能联系到您的手机号"
				 placeholder-class='placeholder' maxlength="11" type="number"></input>
			</view>
			<view class="cu-form-group solid-bottom">
				<view class="title"><text style="color: #FF2553;">*</text>目的地</view>
				<input :value="address" @input="addressInput" placeholder="请输入到达地址(现住址)" placeholder-class='placeholder'></input>
			</view>
			<view class="cu-form-group solid-bottom">
				<view class="title"><text style="color: #FF2553;">*</text> 来源地</view>
				<view class="city_box">
					<view class="type_box">
						<view class="type_box_item normal_bg" @click="onSelectProvince">
							<text class="normal_color">{{provinceName?provinceName:'请选择省'}}</text>
						</view>
					</view>
					<view class="type_box" v-if="provinceName.length!=0">
						<view class="type_box_item normal_bg" @click="onSelectCity">
							<text class="normal_color">{{cityName?cityName:'请选择市'}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="detail-list" v-if="provinceName.length!=0&&cityName.length!=0">
				<view class="list-item solid-bottom">
					<text class="title-text">风险等级</text>
					<text class="detail-text">{{riskLevelName}}</text>
				</view>
				<view class="list-item solid-bottom">
					<text class="title-text">隔离政策</text>
					<text class="detail-text">{{isolationStrategy}}</text>
				</view>
			</view>
			<view class="cu-form-group solid-bottom" @click="onShowDate">
				<view class="title"><text style="color: #FF2553;">*</text> 返程时间</view>
				<picker disabled>
					<view class="picker" :class="date1?'color2':'color1'">
						{{date1?date1:'请选择返程时间'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group solid-bottom">
				<view class="title">返程方式</view>
				<view class="type_box">
					<view class="type_box_item" :class="index==typeIndex?'active_bg':'normal_bg'" v-for="(item, index) in typeArr"
					 :key="index" @click="onSelectType(index)">
						<text :class="index==typeIndex?'active_color':'normal_color'">{{item}}</text>
					</view>
				</view>
			</view>
			<view class="cu-form-group solid-bottom" v-if="typeIndex==0" @click="cardNumFocus">
				<view class="title">车牌号</view>
				<input disabled :value="cardNum" placeholder="您乘坐的车辆车牌号" placeholder-class='placeholder'></input>
				<u-keyboard :mask="true" ref="uKeyboard" safe-area-inset-bottom @confirm="cardNumConfirm" :random="false"
				 :dotEnable="false" mode="car" :confirmBtn="true" :cancelBtn="true" :tooltip="true" v-model="showCarNum" @change="change"
				 @backspace="backspace"></u-keyboard>
			</view>
			<view class="cu-form-group solid-bottom" v-if="typeIndex==1" @click="onShowWay1">
				<view class="title">交通方式</view>
				<picker disabled>
					<view class="picker" :class="way1?'color2':'color1'">
						{{way1?way1:'请选择交通方式'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group solid-bottom" v-if="typeIndex==1">
				<view class="title">班次</view>
				<input :value="lineNum1" @input="lineNumInput1" placeholder="您乘坐的班次/车次/航班号" placeholder-class='placeholder'></input>
			</view>
			<view class="cu-form-group solid-bottom" v-if="typeIndex==1&&isShowAddRecord==true" @click="onShowWay2">
				<view class="title">交通方式(转)</view>
				<picker disabled>
					<view class="picker" :class="way2?'color2':'color1'">
						{{way2?way2:'请选择交通方式'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group solid-bottom" v-if="typeIndex==1&&isShowAddRecord==true">
				<view class="title">班次(转)</view>
				<input :value="lineNum2" @input="lineNumInput2" placeholder="您乘坐的班次/车次/航班号" placeholder-class='placeholder'></input>
			</view>
			<view class="cu-form-group solid-bottom" v-if="typeIndex==1&&isShowAddRecord==true" @click="onShowWay3">
				<view class="title">交通方式(转)</view>
				<picker disabled>
					<view class="picker" :class="way3?'color2':'color1'">
						{{way3?way3:'请选择交通方式'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group solid-bottom" v-if="typeIndex==1&&isShowAddRecord==true">
				<view class="title">班次(转)</view>
				<input :value="lineNum3" @input="lineNumInput3" placeholder="您乘坐的班次/车次/航班号" placeholder-class='placeholder'></input>
			</view>
			<view class="line-view" v-if="(typeIndex==1&&isShowAddRecord==true)||typeIndex==0"></view>
			<view class="add_record" v-if="typeIndex==1&&!isShowAddRecord" @click="onAddRecord">
				<view class="record_box">
					<image class="add_img" src="../../static/icon_add.png"></image>
					<text class="add_text">添加转车记录</text>
				</view>
			</view>
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="action1">人脸照片</text>
				</view>
				<view class="action">
					{{imgList.length}}/1
				</view>
			</view>
			<uni-upload-image :maxLength="1" :imgList="imgList" class="upload_view" @getPictures="onGetPictures" @deletePicture="onDeletePicture" />
			<view class="line-view"></view>
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="action1">核酸检测报告照片</text>
				</view>
				<view class="action">
					{{imgList1.length}}/1
				</view>
			</view>
			<uni-upload-image :maxLength="1" :imgList="imgList1" class="upload_view" @getPictures="onGetPictures1" @deletePicture="onDeletePicture1" />
			<view class="cu-form-group solid-bottom" @click="onShowCheckResult">
				<view class="title">核酸检测结果</view>
				<picker disabled>
					<view class="picker" :class="checkResult?'color2':'color1'">
						{{checkResult?checkResult:'请选择检测结果'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group solid-bottom" @click="onShowDate1">
				<view class="title">核酸检测时间</view>
				<picker disabled>
					<view class="picker" :class="date2?'color2':'color1'">
						{{date2?date2:'请选择核酸检测时间'}}
					</view>
				</picker>
			</view>
			<view class="checkBox">
				<u-checkbox-group :size="size" :width="width" :wrap="wrap" :max="max" @change="checkboxGroupChange" :activeColor="activeColor">
					<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in list" :key="index" :name="item.name"
					 :shape="shape" :disabled="item.disabled">{{item.name}}</u-checkbox>
				</u-checkbox-group>
			</view>
			<view class="btn-view">
				<button class='submit-btn' :loading="isLoading" @click="submitHandler" :disabled="isDisable">{{buttonText}}</button>
			</view>
		</view>
		<view class="add_snap" v-if="TabCur==1">
			<view class="cu-bar" style="background-color: #F6F8FA;">
				<view class="action">
					<text class="action1" style="color: #FF2553;">您好，请如实填写以下信息</text>
				</view>
			</view>
			<view class="cu-form-group solid-bottom">
				<view class="title"><text style="color: #FF2553;">*</text> 姓名</view>
				<input :value="userName" @input="userNameInput" placeholder="请输入您的姓名" placeholder-class='placeholder' maxlength="5"></input>
			</view>
			<view class="cu-form-group solid-bottom">
				<view class="title"><text style="color: #FF2553;">*</text> 电话</view>
				<input :value="userPhone" @input="userPhoneInput" @blur="userPhoneBlur" placeholder="请输入能联系到您的手机号"
				 placeholder-class='placeholder' maxlength="11" type="number"></input>
			</view>
			<view class="cu-form-group solid-bottom">
				<view class="title"><text style="color: #FF2553;">*</text> 住址</view>
				<input :value="address" @input="addressInput" placeholder="您现在住在哪里" placeholder-class='placeholder'></input>
			</view>
			<view class="line-view"></view>
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="action1">人脸照片</text>
				</view>
				<view class="action">
					{{imgList.length}}/1
				</view>
			</view>
			<uni-upload-image :maxLength="1" :imgList="imgList" class="upload_view" @getPictures="onGetPictures" @deletePicture="onDeletePicture" />
			<view class="checkBox">
				<u-checkbox-group :size="size" :width="width" :wrap="wrap" :max="max" @change="checkboxGroupChange" :activeColor="activeColor">
					<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in list" :key="index" :name="item.name"
					 :shape="shape" :disabled="item.disabled">{{item.name}}</u-checkbox>
				</u-checkbox-group>
			</view>
			<view class="btn-view">
				<button class='submit-btn' :loading="isLoading" @click="submitHandler" :disabled="isDisable">{{buttonText}}</button>
			</view>
		</view>
		<u-picker mode="selector" v-model="showProvincePicker" @confirm="confirmProvince" :defaultSelector="defaultSelector"
		 :range="provinceRange" :range-key="rangKey"></u-picker>
		<u-picker mode="selector" v-model="showCityPicker" @confirm="confirmCity" :defaultSelector="defaultSelector1" :range="cityRange"
		 :range-key="rangKey"></u-picker>

		<u-picker mode="selector" v-model="showWay1" @confirm="confirmWay1" :defaultSelector="defaultSelectorWay1" :range="wayRange"></u-picker>
		<u-picker mode="selector" v-model="showWay2" @confirm="confirmWay2" :defaultSelector="defaultSelectorWay2" :range="wayRange"></u-picker>
		<u-picker mode="selector" v-model="showWay3" @confirm="confirmWay3" :defaultSelector="defaultSelectorWay3" :range="wayRange"></u-picker>

		<u-picker mode="selector" v-model="showResult" @confirm="confirmResult" :defaultSelector="defaultSelectorResult"
		 :range="checkResultRange"></u-picker>
		<u-picker mode="time" :defaultTime="defaultTime" v-model="showDate" :params="params" end-year="2030" @confirm="confirmDate"></u-picker>
		<u-picker mode="time" :defaultTime="defaultTime1" v-model="showDate1" :params="params" end-year="2030" @confirm="confirmDate1"></u-picker>
	</view>
</template>

<script>
	import UniUploadImage from "@/components/uni-upload-image/uni-upload-image.vue"

	export default {
		components: {
			UniUploadImage
		},
		data() {
			return {
				TabCur: 0,
				Tabs: ['返乡人员登记', '我是本地人员'],

				showCarNum: false,
				showDate: false,
				showDate1: false,
				showProvincePicker: false,
				showCityPicker: false,
				showWay1: false,
				showWay2: false,
				showWay3: false,
				showResult: false,
				date1: '',
				date2: '',
				defaultTime: '',
				defaultTime1: '',
				params: {
					year: true,
					month: true,
					day: true
				},

				provinceRange: [],
				cityRange: [],
				wayRange: ["飞机", "火车", "长途客车", "其他"],
				checkResultRange: ["阳性", "阴性"],
				rangKey: 'name',
				defaultSelector: [0],
				defaultSelector1: [0],
				defaultSelectorWay1: [0],
				defaultSelectorWay2: [0],
				defaultSelectorWay3: [0],
				defaultSelectorResult: [0],

				way1: '',
				way2: '',
				way3: '',
				checkResult: '',
				checkResultIndex: null,

				userName: '',
				userPhone: '',
				cardNum: '',
				address: '',
				lineNum1: '',
				lineNum2: '',
				lineNum3: '',
				isLoading: false,
				buttonText: '提交',
				isDisable: false,
				imgList: [],
				imgList1: [],
				typeIndex: 0, //返程方式
				typeArr: ['自驾', '公共交通'],
				list: [{
					name: '我承诺如实填报以上登记信息，并授权以上信息提交疫情防控部门统筹管理',
					checked: false,
					disabled: false
				}],
				disabled: false,
				checked: true,
				shape: 'square',
				activeColor: '#2979ff',
				size: 34,
				max: 3,
				wrap: true,
				width: 'auto',

				isShowAddRecord: false,
				provinceName: '',
				cityName: '',
				isolationStrategy: '',
				riskLevelName: '',

				isLegalIdNum: false,
				checkBoxSelect: false,
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			var nowDate = new Date()
			var year = nowDate.getFullYear()
			var month = (nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1)
			var day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()
			this.date1 = this.defaultTime = `${year}-${month}-${day}`
			// this.defaultTime = this.defaultTime1 = this.date1

			this.getProvinceListRequest("0")

			var user = JSON.parse(options.userDic)
			this.freshFormData(user)
		},
		methods: {
			freshFormData(user) {
				this.userName = user.name
				this.age = user.age
				this.userPhone = user.mobile
				if (user.origin) {
					this.provinceName = user.origin.split("/")[0]
					this.cityName = user.origin.split("/")[1]

					// console.log(this.provinceRange)
					// for(let i = 0; i < this.provinceRange.length; i++) {
					// 	var dic = this.provinceRange[i]
					// 	if(dic.name == this.provinceName) {
					// 		this.defaultSelector = [i]
					// 	}
					// }
				}
				this.address = user.backHomeAddress
				if (user.backHomeTime) {
					this.date1 = this.defaultTime = user.backHomeTime.split(" ")[0]
				}
				this.typeIndex = parseInt(user.transportationType)
				if (parseInt(user.transportationType) == 0) {
					this.cardNum = user.trainNumber
				} else {
					if (user.trainNumber) {
						var trainStr = user.trainNumber
						if (trainStr.indexOf(";") !== -1) {
							var str1 = trainStr.split(";")[0]
							var str2 = trainStr.split(";")[1]
							if (str1.indexOf(",") !== -1 && str2.indexOf(",") !== -1) {
								var waysArr = str1.split(",")
								var linesArr = str2.split(",")
								this.way1 = waysArr[0]
								this.way2 = waysArr[1]
								this.way3 = waysArr[2]
								this.lineNum1 = linesArr[0]
								this.lineNum2 = linesArr[1]
								this.lineNum3 = linesArr[2]
							}
						}
					}
				}
				this.riskLevelName = user.riskLevel
				this.isolationStrategy = user.isolationStrategy
				this.imgList = !user.faceImg ? [] : [user.faceImg]
				this.checkResult = user.nucleicAcidStatus ? user.nucleicAcidStatus == '0' ? '阳性' : '阴性' : ''
				this.checkResultIndex = user.nucleicAcidStatus ? user.nucleicAcidStatus : null
				if (user.nucleicAcidTime) {
					this.date2 = this.defaultTime1 = user.nucleicAcidTime.split(" ")[0]
				}
				this.imgList1 = !user.nucleicAcidImg ? [] : [user.nucleicAcidImg]
			},
			tabSelect(e) {
				if (uni.pageScrollTo) {
					uni.pageScrollTo({
						scrollTop: 0
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
					})
				}
				this.TabCur = e.currentTarget.dataset.id
			},

			async getProvinceListRequest(parentId) {
				var that = this
				return await that.$http(that.$api.getProvinceListUrl, {
					method: 'GET',
					data: {
						parentId: parentId
					},
					token: uni.getStorageSync('token')
				}).then(res => {
					if (parentId == "0") {
						that.provinceRange = res
					} else {
						that.cityRange = res
					}
				}).catch(err => {})
			},

			async getRiskLevelRequest(areaId) {
				var that = this
				return await that.$http(that.$api.getRiskLevelUrl, {
					method: 'GET',
					data: {
						areaId: areaId
					},
					token: uni.getStorageSync('token')
				}).then(res => {
					if (res.length == 0) {
						that.isolationStrategy = '无需隔离'
						that.riskLevelName = '低风险'
					} else {
						that.isolationStrategy = res[0].isolationStrategy ? res[0].isolationStrategy : '无需隔离'
						that.riskLevelName = res[0].riskLevelName ? res[0].riskLevelName : '低风险'
					}
				}).catch(err => {})
			},

			onShowDate() {
				this.showDate = true
			},

			onShowDate1() {
				this.showDate1 = true
			},

			onSelectProvince() {
				this.showProvincePicker = true
			},

			confirmProvince(e) {
				let index = e[0]
				this.defaultSelector = e
				this.provinceName = this.provinceRange[index].name
				var parentId = this.provinceRange[index].id
				this.getProvinceListRequest(parentId)
				this.cityName = ''
			},

			onSelectCity() {
				this.showCityPicker = true
			},

			confirmCity(e) {
				let index = e[0]
				this.defaultSelector1 = e
				this.cityName = this.cityRange[index].name
				var cityId = this.cityRange[index].id
				this.getRiskLevelRequest(cityId)
			},

			onShowWay1() {
				this.showWay1 = true
			},

			confirmWay1(e) {
				let index = e[0]
				this.defaultSelectorWay1 = e
				this.way1 = this.wayRange[index]
			},

			onShowWay2() {
				this.showWay2 = true
			},

			confirmWay2(e) {
				let index = e[0]
				this.defaultSelectorWay2 = e
				this.way2 = this.wayRange[index]
			},

			onShowWay3() {
				this.showWay3 = true
			},

			confirmWay3(e) {
				let index = e[0]
				this.defaultSelectorWay3 = e
				this.way3 = this.wayRange[index]
			},

			onShowCheckResult() {
				this.showResult = true
			},

			confirmResult(e) {
				let index = e[0]
				this.defaultSelectorResult = e
				this.checkResult = this.checkResultRange[index]
				this.checkResultIndex = index
			},

			onAddRecord() {
				this.isShowAddRecord = !this.isShowAddRecord
			},

			confirmDate(e) {
				this.date1 = ''
				if (this.params.year) this.date1 += e.year
				if (this.params.month) this.date1 += '-' + e.month
				if (this.params.day) this.date1 += '-' + e.day
				this.defaultTime = this.date1
			},

			confirmDate1(e) {
				this.date2 = ''
				if (this.params.year) this.date2 += e.year
				if (this.params.month) this.date2 += '-' + e.month
				if (this.params.day) this.date2 += '-' + e.day
				this.defaultTime1 = this.date2
			},

			onSelectType(idx) {
				this.typeIndex = idx
			},

			submitHandler() {
				if (!this.userName) {
					uni.showToast({
						title: '请填写姓名',
						icon: 'none'
					})
					return
				}
				if (!this.userPhone) {
					uni.showToast({
						title: '请填写手机号',
						icon: 'none'
					})
					return
				}
				if (!this.provinceName||!this.cityName) {
					uni.showToast({
						title: '请选择来源地',
						icon: 'none'
					})
					return
				}
				if (!this.address) {
					uni.showToast({
						title: '请填写现住址',
						icon: 'none'
					})
					return
				}
				if (!this.checkBoxSelect) {
					uni.showToast({
						title: '请承诺如实填报',
						icon: 'none'
					})
					return
				}
				this.isLoading = true
				this.buttonText = '提交中...'
				this.isDisable = true
				this.addInfoRecordRequest()
			},

			async addInfoRecordRequest() {
				var that = this
				return await that.$http(that.$api.addInfoRecordUrl, {
					method: 'POST',
					data: that.TabCur == 0 ? {
						name: that.userName,
						mobile: that.userPhone,
						origin: !that.provinceName ? '' : that.provinceName + "/" + that.cityName,
						backHomeAddress: that.address,
						backHomeTime: !that.date1 ?  '' : that.date1 + ' 00:00:00',
						transportationType: that.typeIndex.toString(),
						trainNumber: that.typeIndex == 1 ? that.way1 + ',' + that.way2 + ',' + that.way3 + ';' + that.lineNum1 + ',' +
							that.lineNum2 + ',' + that.lineNum3 : that.cardNum,
						riskLevel: that.riskLevelName,
						isolationStrategy: that.isolationStrategy,
						faceImg: that.imgList.length == 0 ? '' : that.imgList[0],
						nucleicAcidStatus: that.checkResultIndex,
						nucleicAcidTime: !that.date2 ?  '' : that.date2 + ' 00:00:00',
						nucleicAcidImg: that.imgList1.length == 0 ? '' : that.imgList1[0]
					} : {
						name: that.userName,
						mobile: that.userPhone,
						backHomeAddress: that.address,
						faceImg: '',
					},
					token: uni.getStorageSync('token')
				}).then(res => {
					that.isLoading = false
					that.buttonText = '提交'
					that.isDisable = false
					if (res.code == 200) {
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

			onGetPictures(e) {
				this.imgList = e.detail
			},

			onDeletePicture(e) {
				this.imgList = e.detail
			},
			
			onGetPictures1(e) {
				this.imgList1 = e.detail
			},
			
			onDeletePicture1(e) {
				this.imgList1 = e.detail
			},

			userNameInput(event) {
				let userName = event.detail.value || event.detail.text;
				if (!userName) {
					userName = ''
				}
				this.userName = userName.replace(/\s+/g, '')
			},

			userPhoneInput(event) {
				let userPhone = event.detail.value || event.detail.text;
				if (!userPhone) {
					userPhone = ''
				}
				this.userPhone = userPhone.replace(/\s+/g, '')
			},

			userPhoneBlur(event) {
				let userPhone = event.detail.value || event.detail.text;
				if (!userPhone) {
					userPhone = ''
				}
				if (userPhone.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(userPhone))) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
					this.illegalPhoneNum = true
				} else {
					this.illegalPhoneNum = false
				}
			},

			cardNumFocus(event) {
				this.showCarNum = true
			},

			// 点击退格键
			backspace() {
				if (this.cardNum.length) this.cardNum = this.cardNum.substr(0, this.cardNum.length - 1)
			},

			// 键盘按键发生变化
			change(detail) {
				this.cardNum += detail
			},

			cardNumConfirm(e) {

			},

			lineNumInput1(event) {
				let lineNum1 = event.detail.value || event.detail.text;
				if (!lineNum1) {
					lineNum1 = ''
				}
				this.lineNum1 = lineNum1.replace(/\s+/g, '')
			},

			lineNumInput2(event) {
				let lineNum2 = event.detail.value || event.detail.text;
				if (!lineNum2) {
					lineNum2 = ''
				}
				this.lineNum2 = lineNum2.replace(/\s+/g, '')
			},

			lineNumInput3(event) {
				let lineNum3 = event.detail.value || event.detail.text;
				if (!lineNum3) {
					lineNum3 = ''
				}
				this.lineNum3 = lineNum3.replace(/\s+/g, '')
			},

			addressInput(event) {
				let address = event.detail.value || event.detail.text;
				if (!address) {
					address = ''
				}
				this.address = address.replace(/\s+/g, '')
			},

			checkboxGroupChange(e) {
				// console.log(e);
				// this.checkBoxSelect = e.value
			},

			checkboxChange(e) {
				// console.log(e);
				this.checkBoxSelect = e.value
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../common/css/list-detail.css";

	.nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		height: 90rpx;
		background: #fff;
		position: fixed;
		top: 0;
		z-index: 99;
	}

	.nav_item {
		width: 50%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.item_content {
		font-size: 30rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 400;
		line-height: 90rpx;
	}

	.item_content.cur {
		border-bottom: 6rpx solid;
		border-radius: 3rpx;
	}

	.add_snap {
		width: 100%;
		height: 100%;
		background: #F6F8FA;
		margin-top: 93rpx;
	}

	.type_box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.type_box_item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 26rpx;
		padding: 12rpx 24rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		line-height: 28rpx;
		margin-left: 19rpx;
	}

	.city_box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.active_bg {
		background: #208EFF;
	}

	.active_color {
		color: #FFFFFF;
	}

	.normal_bg {
		background: #E9EAED;
	}

	.normal_color {
		color: #63656B;
	}

	.add_record {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
		background-color: #F6F8FA;
	}

	.record_box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.add_img {
		width: 63rpx;
		height: 63rpx;
		margin-right: 5rpx;
	}

	.add_text {
		height: 28rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 28rpx;
	}

	.checkBox {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: 100%;
		padding: 20rpx 30rpx;
	}

	.check_text {
		height: 28rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 28rpx;
	}
</style>
