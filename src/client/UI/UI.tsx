import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';

import config from '../config';
import Examples from '../examples/examples';
import { StoreState } from '../redux/store';
import { UIState } from './reducer';
import './style.less';


export const theme = createMuiTheme( {
	palette: {
		type: 'dark'
	}
} );

interface Props extends UIState {
}

export default connect( ( state: StoreState ) => state.ui )
( function UI( props: Props ) {
	return <MuiThemeProvider theme={theme}>
		<CssBaseline/>
		<div id='ui' className={config.constantScale ? 'constantScale' : ''}>
			{props.ready ? <Examples/> : null}
		</div>
	</MuiThemeProvider>;
} );
