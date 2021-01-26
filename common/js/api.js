// 生产
let HOST_SERVER = 'http://220.180.36.31:30000/p/adm/api';
// let HOST_SERVER = BASE_URL + '/auth';
// let HOST_SERVER2 = BASE_URL + '/archives';
// let HOST_SERVER3 = BASE_URL + '/notification';
// let HOST_SERVER4 = BASE_URL + '/estate';

// 本地测试
// let HOST_SERVER = 'http://192.168.8.162:8080/api';
// let HOST_SERVER = 'http://192.168.8.169:8080/api';

let api = { //共52个接口
	//共用 5
	getReportListUrl: HOST_SERVER + "/biz/report/page", //查询邻里上报列表分页接口
	addInfoRecordUrl: HOST_SERVER + "/biz/person/save", //新增信息登记
	addReportUrl: HOST_SERVER + '/biz/report/save', //新增邻里上报
	getProvinceListUrl: HOST_SERVER + "/biz/area/list", //查询省市列表
	getRiskLevelUrl: HOST_SERVER + "/biz/riskArea/list", //查询风险等级
	getLoginSMSCodeUrl: HOST_SERVER + "/sendLoginSMS", //发送登录账号短信验证码接口
	loginUrl: HOST_SERVER + "/login/vcode", //登录接口 
	getQueryInfoUrl: HOST_SERVER + "/user/queryUserInfo", //查询当前用户信息
	uploadImageUrl: HOST_SERVER + '/upload', //上传图片
	viewImgaeUrl: HOST_SERVER + '/view', //拼接图片完整地址
}

module.exports = api;
