module.exports = api => {
	api.cache( true );
	
	return {
		'presets': [
			'@babel/preset-env',
			'@babel/preset-react',
			'@babel/preset-typescript'
		],
		'plugins': [
			'react-hot-loader/babel',
			[
				'@babel/plugin-proposal-decorators',
				{
					'legacy': true
				}
			],
			'transform-class-properties',
			[
				'import',
				{
					'libraryName':             '@material-ui/core',
					'libraryDirectory':        'esm',
					'camel2DashComponentName': false
				},
				'core'
			],
			[
				'import',
				{
					'libraryName':             '@material-ui/core/styles',
					'libraryDirectory':        '../esm/styles',
					'camel2DashComponentName': false
				},
				'core/styles'
			],
			[
				'import',
				{
					'libraryName':             '@material-ui/styles',
					'libraryDirectory':        'esm',
					'camel2DashComponentName': false
				},
				'styles'
			],
			[
				'import',
				{
					'libraryName':             '@material-ui/icons',
					'libraryDirectory':        'esm',
					'camel2DashComponentName': false
				},
				'icons'
			]
		]
	};
};
