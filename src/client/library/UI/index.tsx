import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
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

export default function UI() {
	const store = useSelector( ( state: StoreState ) => state.ui );
	
	return <MuiThemeProvider theme={theme}>
		<CssBaseline/>
		<div id='ui' className={config.constantScale ? 'constantScale' : ''}>
			{store.ready ? <Index/> : null}
		</div>
	</MuiThemeProvider>;
}
