import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { useSelector } from 'react-redux';

import config from '../../config';
import Index from '../../index';
import { StoreState } from '../redux/store';
import './style.less';


export const theme = createMuiTheme( {
	palette: {
		type: 'dark'
	}
} );

export default hot( () => {
	const store = useSelector( ( state: StoreState ) => state.ui );
	
	return <ThemeProvider theme={theme}>
		<CssBaseline/>
		<div id='ui' className={config.constantScale ? 'constantScale' : ''}>
			{store.ready ? <Index/> : null}
		</div>
	</ThemeProvider>;
} );
