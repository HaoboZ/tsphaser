import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { StoreState } from '../../library/redux/store';
import { UIState } from '../../library/UI/reducer';
import Scene from './scene';


interface Props extends DispatchProp, UIState {
}

const MovementUI = connect( ( state: StoreState ) => state.ui )
( function ( props: Props ) {
	const { game } = props;
	
	React.useEffect( () => {
		game.scene.start( 'Movement' );
		
		return () => {
			const scene = game.scene.getScene( 'Movement' ) as Scene;
			scene.room.leave();
			scene.scene.stop();
		};
	}, [] );
	
	return null;
} );
export default MovementUI;
