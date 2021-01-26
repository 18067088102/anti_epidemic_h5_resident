import Vue from 'vue'
import App from './App'
import http from '@/common/js/http-promise.js'
import api from '@/common/js/api.js'
import common from '@/common/js/common.js'
import utils from '@/common/js/utils.js'

Vue.config.productionTip = false

Vue.prototype.$http = http
Vue.prototype.$api = api
Vue.prototype.$common = common
Vue.prototype.$utils = utils

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

const app = new Vue({
    ...App
})
app.$mount()
