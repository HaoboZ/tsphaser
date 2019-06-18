import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Server from './connect/server';
import Game from './game';
import store from './redux/store';
import UI from './UI';


class App extends React.PureComponent {
	
	render() {
		return <Provider store={store}>
			<UI/>
			<Game/>
		</Provider>;
	}
	
}

$( () => {
	Server.init();
	ReactDOM.render( <App/>, $( '#root' )[ 0 ] );
} );
