import * as React from 'react';
import { useSelector } from 'react-redux';

import Examples from './examples';
import MovementScene from './examples/movement/scene';
import TictactoeScene from './examples/tictactoe/scene';
import { StoreState } from './library/redux/store';


export default function Index() {
	const store = useSelector( ( state: StoreState ) => state.ui );
	
	React.useEffect( () => {
		store.game.scene.add( 'Movement', MovementScene );
		store.game.scene.add( 'Tictactoe', TictactoeScene );
	}, [] );
	
	return <Examples/>;
}
