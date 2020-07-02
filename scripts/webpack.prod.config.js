const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pluginConfigs = {
	CopyWebpackPlugin: new CopyWebpackPlugin({
		patterns: [
			{ from: 'src/index.html', to: 'index.html' }
			// { from: "src/css", to: "css" },
			// { from: "src/fonts", to: "fonts" },
			// { from: 'src/images', to: 'images' },
			// { from: 'node_modules/carbon-components/css/carbon-components.css', to: 'css/carbon-components.css' }
			// { from: 'server/schemas/*.graphql', to: 'schemas/[name].graphql', toType: 'template' },
			// { from: 'node_modules/semantic-ui-css/themes', to: 'themes' },
			// { from: 'configuration.json', to: 'configuration.json' },
			// { from: "src/assets", to: "assets" },
			// { from: "server/driver", to: "driver" },
			// { from: 'node_modules/semantic-ui-css/semantic.css', to: 'semantic.css' }
		]
	}),
	EnvironmentPlugin: new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify('production')
		}
	})
};

const baseConfig = {
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '../dist')
	},
	stats: "errors-only",
	mode: 'production',
	node: {
		path: true,
		__dirname: true
	},
	module: {
		// noParse: [/\/ws\//],
		rules: [
			{
				enforce: "pre",
				test: [
					/\.js$/,
					/\.jsx$/,
					/\.ts$/,
					/\.tsx$/,
					/\.graphql$/
				],
				exclude: [
					/node_modules/,
					/lib/,
					/vcap.local.js/,
					/source\/js\/bootstrap/
				],
				loader: "eslint-loader"
				// options: {
				// 	"print-config": true
				// }
			},
			// {
			// 	test: [
			// 		/\.js$/,
			// 		/\.jsx$/,
			// 		/\.graphql$/
			// 	],
			// 	exclude: [
			// 		/node_modules/,
			// 		/lib/,
			// 		/vcap.local.js/
			// 	],
			// 	loader: "babel-loader"
			// },
			{
				test: [
					/\.js$/,
					/\.jsx$/,
					/\.ts$/,
					/\.tsx$/
				],
				use: 'ts-loader',
				exclude: [
					/node_modules/
				]
			},
			{
				type: 'javascript/auto',
				test: /\.mjs$/,
				exclude: [
					/node_modules/,
					/lib/,
					/vcap.local.js/
				],
				use: []
			},
			{
				test: /\.svg$/,
				loader: 'file-loader'
			},
			{
				test: [
					/\.css$/,
					/\.less$/
				],
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							modules: {
								localIdentName: '[name]__[local]__[hash:base64:5]'
							},
							sourceMap: true,
							localsConvention: 'camelCaseOnly'
						}
					},
					{
						loader: "less-loader"
					}
				]
			}
		]
	}
};

const clientConfig = Object.assign({}, baseConfig, {
	entry: {
		bundle: path.join(__dirname, '../src/app.tsx')
	},
	target: 'web',
	resolve: {
		extensions: [
			".jsx",
			".js",
			".tsx",
			".ts"
		],
		alias: {
			common: path.resolve(__dirname, "src/common/"),
			modules: path.resolve(__dirname, "src/modules/"),
			assets: path.resolve(__dirname, "src/assets/"),
			root: path.resolve(__dirname, "src/")
		}
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({ options: {} }),
		pluginConfigs.CopyWebpackPlugin,
		pluginConfigs.EnvironmentPlugin
	]
});

module.exports = [
	clientConfig
];

module.exports.pluginConfigs = pluginConfigs;
