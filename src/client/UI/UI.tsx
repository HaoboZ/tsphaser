import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../redux/store';
import './style.less';


export const theme = createMuiTheme( {
	palette: {
		type: 'dark'
	}
} );

interface Props {
	ui?
}

// @ts-ignore
@connect( ( state: StoreState ) => ( { ui: state.ui } ) )
export default class UI extends React.PureComponent<Props> {
	
	render() {
		return <MuiThemeProvider theme={theme}>
			<CssBaseline/>
			<div id='ui'>
				{this.props.ui.element ?
					typeof this.props.ui.element === 'function' || 'render' in this.props.ui.element ?
						React.createElement( this.props.ui.element ) : this.props.ui.element : null}
			</div>
		</MuiThemeProvider>;
	}
	
}
