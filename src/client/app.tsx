import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import Server from './connect/server';
import Game from './game';
import store from './redux/store';
import UI from './UI/UI';


class App extends React.PureComponent {
	
	render() {
		return <Provider store={store}>
			<MemoryRouter>
				<UI/>
				<Game/>
			</MemoryRouter>
		</Provider>;
	}
	
}

$( () => {
	Server.init();
	ReactDOM.render( <App/>, $( '#root' )[ 0 ] );
} );
