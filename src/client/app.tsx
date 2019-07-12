import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Server from './connect/server';
import Game from './game/game';
import store from './redux/store';
import UI from './UI/UI';


function App() {
	return <Provider store={store}>
		<BrowserRouter>
			<UI/>
			<Game/>
		</BrowserRouter>
	</Provider>;
}

$( () => {
	Server.init();
	ReactDOM.render( <App/>, $( '#root' )[ 0 ] );
} );
