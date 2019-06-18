import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { StoreState } from './redux/store';


const theme = createMuiTheme( {
	palette:    {
		type: 'dark'
	},
	typography: {
		useNextVariants: true
	}
} );

interface Props {
	ui?: StoreState['ui']
}

// @ts-ignore
@connect( ( state: StoreState ) => ( { ui: state.ui } ) )
export default class UI extends React.PureComponent<Props> {
	
	render() {
		return <MuiThemeProvider theme={theme}>
			<CssBaseline/>
			<div id='ui'>
				{this.props.ui.element ? React.createElement( this.props.ui.element ) : null}
			</div>
		</MuiThemeProvider>;
	}
	
}

