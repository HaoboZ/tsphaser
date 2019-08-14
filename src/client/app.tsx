import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Connect from './library/connect';
import Game from './library/game';
import store from './library/redux/store';
import UI from './library/UI';


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
