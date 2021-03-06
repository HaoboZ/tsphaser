import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import MovementScene from './examples/movement/scene';
import TictactoeScene from './examples/tictactoe/scene';
import Connect from './library/connect';
import Game from './library/game';
import store from './library/redux/store';
import UI from './library/UI';


function App() {
	React.useEffect( () => {
		Connect.init();
	}, [] );
	
	return <Provider store={store}>
		<UI/>
		<Game scene={{
			'Movement':  MovementScene,
			'Tictactoe': TictactoeScene
		}}/>
	</Provider>;
}

$( () => {
	render( <App/>, $( '#root' )[ 0 ] );
} );
