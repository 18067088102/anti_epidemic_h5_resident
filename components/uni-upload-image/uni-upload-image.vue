<template>
	<view>
		<view class="cu-form-group" :style="customBgColor ? 'background-color: rgba(246, 246, 246, 1);' : ''">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item, index) in imgList" :key="index" @click="ViewImage" :data-url="imgList[index]">
					<image :src="combineUrl(imgList[index])" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @click.stop="DelImg(index)" v-if="!disabled"><text class="cuIcon-close"></text></view>
				</view>
				<view class="solids" @click="ChooseImage" v-if="!disabled && imgList.length < maxLength"><text class="cuIcon-cameraadd"></text></view>
			</view>
		</view>
		<canvas class="canvas" :style="'width:' + cw0 + 'px; height:' + ch0 + 'px;'" canvas-id="myCanvas0"></canvas>
	</view>
</template>

<script>
	export default {
		name: 'UniUploadImage',
		/**
		 * 组件的属性列表
		 */
		props: {
			maxLength: {
				//最多上传图片的张数
				type: Number,
				value: 4
			},
			disabled: {
				//图片是否可编辑
				type: Boolean,
				value: false
			},
			customBgColor: {
				//是否自定义背景色
				type: Boolean,
				value: false
			},
			imgList: {
				type: Array,
				default: function() {
					return [];
				}
			},
			pictures: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		data() {
			return {
				cw0: '',
				ch0: ''
			};
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			combineUrl(url) {
				return this.$common.combineImageUrl(url);
			},

			ChooseImage() {
				//选择图片进行上传
				let that = this;
				uni.chooseImage({
					count: 1, //一次最多可以选择图片的张数
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //图片的来源（相册或者拍照）
					success: res => {
						let path = res.tempFilePaths[0];
						let size = res.tempFiles[0].size / 1024; //单位KB
						if (size >= 1024) {
							that.compress(path, 0.1);
						} else if (size >= 512 && size < 1024) {
							that.compress(path, 0.2);
						} else if (size >= 300 && size < 512) {
							that.compress(path, 0.5);
						} else {
							console.log('<', path);
							that.onUploadImage(path); //向服务器上传图片
						}
						if (that.pictures.length != 0) {
							//拿到图片地址同时进行本地展示
							that.imgList = that.pictures.concat(res.tempFilePaths);
						} else {
							that.imgList = res.tempFilePaths;
						}
					}
				});
			},

			compress(path, scale) {
				var that = this;
				uni.getImageInfo({
					src: path,
					success(res) {
						let img = new Image();
						img.src = res.path; // 要压缩的图片
						// 缩放图片需要的canvas
						var canvas = document.createElement('canvas');
						var context = canvas.getContext('2d');
						// base64地址图片加载完毕后
						img.onload = function() {
							// 图片原始尺寸
							var originWidth = res.width;
							var originHeight = res.height;
							// 最大尺寸限制
							var maxWidth = originWidth * scale,
								maxHeight = originHeight * scale;
							// 目标尺寸
							var targetWidth = originWidth,
								targetHeight = originHeight;
							// 图片尺寸超过400x400的限制
							if (originWidth > maxWidth || originHeight > maxHeight) {
								if (originWidth / originHeight > maxWidth / maxHeight) {
									// 更宽，按照宽度限定尺寸
									targetWidth = maxWidth;
									targetHeight = Math.round(maxWidth * (originHeight / originWidth));
								} else {
									targetHeight = maxHeight;
									targetWidth = Math.round(maxHeight * (originWidth / originHeight));
								}
							}

							// canvas对图片进行缩放
							canvas.width = targetWidth;
							canvas.height = targetHeight;
							// 清除画布
							context.clearRect(0, 0, targetWidth, targetHeight);
							// 图片压缩
							context.drawImage(img, 0, 0, targetWidth, targetHeight);
							let ndata = canvas.toDataURL('image/jpeg', 1);
							let file = that.convertBase64UrlToBlob(ndata);
							// that.onUploadImage(file)
							uni.showLoading({
								title: '正在上传...',
								mask: true
							});
							var fData = new FormData();
							fData.append('file', file, 'image.png');
							var xhr = new XMLHttpRequest();
							var surl = that.$api.uploadImageUrl;
							xhr.open('POST', surl, true);
							xhr.onload = function(e) {
								// console.log("上传成功",e); //上传成功
							};
							xhr.onreadystatechange = () => {
								if (xhr.readyState == 4 && xhr.status == 200) {
									//上传后台成功
									uni.hideLoading();
									var result = JSON.parse(xhr.responseText);
									console.log(result)
									if (result.code == 401 || result.code == 403) {
										uni.showModal({
											content: '请先去登录',
											cancelText: '再想想',
											cancelColor: '#797979',
											confirmText: '去登录',
											confirmColor: '#218EFF',
											success(res) {
												if (res.confirm) {
													uni.navigateTo({
														url: '/pages/login/index'
													});
												}
											}
										});
									}
									if (result.code == 200) {
										//上传成功后取到服务器回传的网络地址
										var imgUrl = result.message;
										that.pictures = that.pictures.concat(imgUrl);
									}
									that.$emit('getPictures', {
										detail: that.pictures
									});
								} else {
									uni.hideLoading();
								}
							};

							// 这里设置请求头，做的时候遇到一个问题，明明上传的是FormData，可是在请求中变成了request payload,后台需要的是FormData，解决方法，设置enctype为multipart/form-data，不要设置Content-Type，切记直接不设置Content-Type
							xhr.setRequestHeader('enctype', 'multipart/form-data');
							xhr.setRequestHeader('token', uni.getStorageSync('token'));
							xhr.send(fData);
						};
					}
				});
			},

			//向服务器上传图片的方法类
			onUploadImage(filePath) {
				// console.log(filePath)
				var that = this;
				uni.showLoading({
					title: '正在上传...',
					mask: true
				});

				//调用服务器上传图片接口，将图片上传至服务器
				var token = uni.getStorageSync('token')
				//调用服务器上传图片接口，将图片上传至服务器
				uni.uploadFile({
					url: that.$api.uploadImageUrl, //上传图片接口的url
					filePath: filePath,
					name: 'file',
					formData: {},
					header: {
						// "Content-Type": "multipart/form-data",
						"token": token //携带token请求
					},
					success: function(res) {
						// console.log(res)
						uni.hideLoading()
						var result = JSON.parse(res.data)
						if (result.code == 401 || result.code == 403) {
							uni.showModal({
								content: '请先去登录',
								cancelText: '再想想',
								cancelColor: '#797979',
								confirmText: '去登录',
								confirmColor: '#218EFF',
								success(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/login/index',
										})
									}
								}
							})
						}
						if (result.code == 200) {
							//上传成功后取到服务器回传的网络地址
							var imgUrl = result.message
							that.pictures = that.pictures.concat(imgUrl)
						}
						//上传成功后取到服务器回传的网络地址，传到组件外供外部操作使用
						that.$emit("getPictures", {
							detail: that.pictures
						})
					},
					fail: function(res) {
						//上传失败则进行相应提示
						uni.hideLoading()
						uni.showToast({
							title: '上传图片失败',
							icon: 'none'
						})
					}
				});
			},

			//点击放大预览图片，支持多张图片左右滑动，长按保存图片等功能
			ViewImage(e) {
				var imgs = [];
				for (let i = 0; i < this.imgList.length; i++) {
					var imgUrl = this.combineUrl(this.imgList[i]);
					imgs.push(imgUrl);
				}
				uni.previewImage({
					urls: imgs, //预览图片的数组
					current: e.currentTarget.dataset.url //当前图片的url
				});
			},

			//编辑时删除图片的操作
			DelImg(index) {
				uni.showModal({
					//先进行弹框提示，用户点确认后再进行删除操作
					content: '确定要删除该图片吗？',
					cancelText: '再想想',
					cancelColor: '#797979',
					confirmText: '删除',
					confirmColor: '#218EFF',
					success: res => {
						if (res.confirm) {
							//删除本地展示图片及后台返回的已上传图片的地址
							this.imgList.splice(index, 1);
							this.pictures.splice(index, 1);
							//删除成功后及时刷新展示区域
							this.imgList = this.imgList;
							this.pictures = this.pictures;
							//通知组件外部图片删除了
							this.$emit('deletePicture', {
								detail: this.pictures
							});
						}
					}
				});
			},
			convertBase64UrlToBlob(urlData) {
				var arr = urlData.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], {
					type: mime
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.canvas {
		position: absolute;
		left: -4000px;
	}
</style>
