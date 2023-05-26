const proxy = require('http-proxy-middleware')//引入http-proxy-middleware，react脚手架已经安装

module.exports = function (app) {
	app.use(
		// 代理的地址
		proxy.createProxyMiddleware('/agentApi', {
			// target: 'https://fbsproxy.testlive.vip/api/',
			target: 'https://fbs-agentapi.testlive.vip/api/',
			changeOrigin: true,
			pathRewrite: { '^/agentApi': '/' }
		}),
		// FBS
		proxy.createProxyMiddleware('/api', {
			target: 'http://fbs-web.testlive.vip', //fbs 测试环境 （默认连接测试环境开发）
			// target: 'http://fbs-liveapi.testlive.vip', //fbs 测试环境 （默认连接测试环境开发）
			// target: 'http://fbslive.com', //fbs 正式环境
			// target: 'http://fbs98.com', //fbs 正式环境
			changeOrigin: true,
			pathRewrite: { '^/api': '/api' }
		}),
	)
}