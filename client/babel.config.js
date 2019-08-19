module.exports = api => {
	api.cache( true );
	
	return {
		'presets': [
			'@babel/preset-env',
			'@babel/preset-react',
			'@babel/preset-typescript'
		],
		'plugins': [
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
					'libraryName': '@material-ui/core',
					'libraryDirectory': '',
					'camel2DashComponentName': false
				},
				'MUI_core'
			],
			[
				'import',
				{
					'libraryName': '@material-ui/icons',
					'libraryDirectory': '',
					'camel2DashComponentName': false
				},
				'MUI_icons'
			],
			[
				'import',
				{
					'libraryName': '@material-ui/core/styles',
					'libraryDirectory': '',
					'camel2DashComponentName': false
				},
				'MUI_core_styles'
			]
		]
	};
};
