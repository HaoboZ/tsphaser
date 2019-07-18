import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { StoreState } from '../../redux/store';
import { UIState } from '../../UI/reducer';
import Scene from './scene';


interface Props extends DispatchProp, UIState {
}

export default connect( ( state: StoreState ) => state.ui )
( function MovementUI( props: Props ) {
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
