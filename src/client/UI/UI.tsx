import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';

import Examples from '../examples/examples';
import { StoreState } from '../redux/store';
import { UIState } from './reducer';
import './style.less';


export const theme = createMuiTheme( {
	palette: {
		type: 'dark'
	}
} );

interface InjectedProps extends UIState {
}

// @ts-ignore
@connect( ( state: StoreState ) => state.ui )
export default class UI extends React.PureComponent {
	
	props: InjectedProps | any;
	
	render() {
		return <MuiThemeProvider theme={theme}>
			<CssBaseline/>
			<div id='ui'>
				{this.props.ready ? <Examples/> : null}
			</div>
		</MuiThemeProvider>;
	}
	
}
