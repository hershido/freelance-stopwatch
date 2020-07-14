const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
	app.use(
		'/api',
		createProxyMiddleware({
			changeOrigin: true,
			target: 'http://localhost:5000',
		})
	);
};
