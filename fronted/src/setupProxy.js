const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app)
{
    app.use(
        '/v1', // 希望代理的路径，例如：请求 /v1/login 会被代理到 http://localhost:8888/login
        createProxyMiddleware({
            target: 'http://localhost:8890', // 后端服务器地址
            changeOrigin: true,
            pathRewrite: {
                '^/v1': '/v1'  // http://localhost:8888/v1/login
            }
        })
    );
}
