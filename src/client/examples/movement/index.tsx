import { RouteComponentProps } from '@reach/router';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { StoreState } from '../../library/redux/store';
import Scene from './scene';


export default function MovementUI( props: RouteComponentProps ) {
	const store = useSelector( ( state: StoreState ) => state.ui );
	
	React.useEffect( () => {
		store.game.scene.start( 'Movement' );
		
		return () => {
			const scene = store.game.scene.getScene( 'Movement' ) as Scene;
			scene.room.leave();
			scene.scene.stop();
		};
	}, [] );
	
	return null;
}
