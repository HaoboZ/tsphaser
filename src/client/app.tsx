import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Server from './connect/server';
import Game from './game/game';
import store from './redux/store';
import UI from './UI/UI';


class App extends React.PureComponent {
	
	constructor() {
		// @ts-ignore
		super( ...arguments );
		Server.init();
	}
	
	render() {
		return <Provider store={store}>
			<BrowserRouter>
				<UI/>
				<Game/>
			</BrowserRouter>
		</Provider>;
	}
	
}

$( () => {
	ReactDOM.render( <App/>, $( '#root' )[ 0 ] );
} );
