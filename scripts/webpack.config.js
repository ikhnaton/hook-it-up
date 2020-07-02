
const path = require('path');
const bff = 'http://localhost:9000';
const webpack = require('webpack');
const devConfig = {
	devtool: 'source-map',
	mode: 'development',
	watch: true,
	resolve: {
		extensions: ['.js', '.jsx']
	},
	stats: {
		colors: true
	}
};

const port = 9000;

const prodConfig = require('./webpack.prod.config');

const clientConfig = Object.assign({}, prodConfig[0], devConfig, {
	plugins: [prodConfig.pluginConfigs.CopyWebpackPlugin],
	devServer: {
		contentBase: path.join(__dirname, '../dist'),
		compress: true,
		historyApiFallback: true,
		disableHostCheck: true,
		writeToDisk: true,
		port: port
		// proxy: {
		// 	'/login': {
		// 		target: bff,
		// 		secure: false,
		// 		logLevel: 'debug',
		// 		changeOrigin: true,
		// 		proxyTimeout: 60000
		// 	},
		// 	'/api': {
		// 		target: bff,
		// 		secure: false,
		// 		logLevel: 'debug',
		// 		changeOrigin: true,
		// 		proxyTimeout: 60000
		// 	}
		// }
	}
});

module.exports = [
	clientConfig
];
