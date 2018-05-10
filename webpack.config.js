const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	entry:     path.join(__dirname, 'src/client/main.ts'),
	output:    {
		path:     path.join(__dirname, 'build'),
		filename: 'bundle.js'
	},
	devtool:   'inline-source-map',
	module:    {
		rules: [
			// ts-loader: convert typescript (es6) to javascript (es6),
			// babel-loader: converts javascript (es6) to javascript (es5)
			{
				test:   /\.tsx?$/,
				loader: ['babel-loader', 'ts-loader']
			},
			// babel-loader for pure javascript (es6) => javascript (es5)
			{
				test:   /\.jsx?$/,
				loader: ['babel-loader']
			},
			{
				test:   /\.less$/,
				loader: ['style-loader', 'css-loader', 'less-loader']
			},
			{
				test:   /\.css$/,
				loader: ['style-loader', 'css-loader']
			}
		]
	},
	externals: {
		'react':     'React',
		'react-dom': 'ReactDOM',
		'jquery':    'jQuery',
		'phaser':    'Phaser'
	},
	plugins:   [
		new BrowserSyncPlugin({
			host: 'localhost'
		})
	],
	resolve:   {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less']
	}
};