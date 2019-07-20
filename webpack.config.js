const path = require( 'path' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;

module.exports = {
	entry:        path.join( __dirname, 'src/client/app.tsx' ),
	output:       {
		path:     path.join( __dirname, 'public', 'build' ),
		filename: '[name].bundle.js'
	},
	devtool:      'source-map',
	mode:         'development',
	module:       {
		rules: [
			{
				test:   /\.tsx?$/,
				loader: [ 'babel-loader' ]
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
	externals:    {
		'react':       'React',
		'react-dom':   'ReactDOM',
		'redux':       'Redux',
		'react-redux': 'ReactRedux'
	},
	plugins:      [
		new BrowserSyncPlugin( {
			host:      'localhost',
			ghostMode: false
		} ),
		new BundleAnalyzerPlugin()
	],
	resolve:      {
		extensions: [ '.js', '.jsx', '.ts', '.tsx', '.css', '.less' ]
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	}
};
