import { RouteComponentProps } from '@reach/router';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { StoreState } from '../../library/redux/store';


export default function MovementUI( props: RouteComponentProps ) {
	const store = useSelector( ( state: StoreState ) => state.ui );
	
	React.useEffect( () => {
		store.game.scene.start( 'Movement' );
		
		return () => {
			store.game.scene.stop( 'Movement' );
		};
	}, [] );
	
	return null;
}
