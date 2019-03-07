const path = require( 'path' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );

module.exports = {
	entry:     path.join( __dirname, 'src/client/main.ts' ),
	output:    {
		path:     path.join( __dirname, 'build' ),
		filename: 'bundle.js'
	},
	devtool:   'inline-source-map',
	mode:      'development',
	module:    {
		rules: [
			{
				test:   /\.tsx?$/,
				loader: [ 'ts-loader' ]
			},
			{
				test:   /\.less$/,
				loader: [ 'style-loader', 'css-loader', 'less-loader' ]
			},
			{
				test:   /\.css$/,
				loader: [ 'style-loader', 'css-loader' ]
			}
		]
	},
	externals: {
		'react':     'React',
		'react-dom': 'ReactDOM'
	},
	plugins:   [
		new BrowserSyncPlugin( {
			host:      'localhost',
			ghostMode: false
		} )
	],
	resolve:   {
		extensions: [ '.js', '.jsx', '.ts', '.tsx', '.css', '.less' ]
	}
};
