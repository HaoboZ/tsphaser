import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Connect from './connect';
import Game from './game';
import store from './redux/store';
import UI from './UI';


function App() {
	return <Provider store={store}>
		<BrowserRouter>
			<UI/>
			<Game/>
		</BrowserRouter>
	</Provider>;
}

$( () => {
	Connect.init();
	ReactDOM.render( <App/>, $( '#root' )[ 0 ] );
} );
