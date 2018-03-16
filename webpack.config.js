let path = require('path');

module.exports = {
	entry: path.join(__dirname, 'src/client/main.ts'),
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js'
	},
	devtool: 'inline-source-map',
	module: {
		rules: [
			// ts-loader: convert typescript (es6) to javascript (es6),
			// babel-loader: converts javascript (es6) to javascript (es5)
			{
				test: /\.tsx?$/,
				loader: ['babel-loader', 'ts-loader']
			},
			// babel-loader for pure javascript (es6) => javascript (es5)
			{
				test: /\.jsx?$/,
				loader: ['babel-loader']
			}
		]
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'jquery': 'jQuery',
		'phaser': 'Phaser'
	},
	plugins: [],
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	}
};