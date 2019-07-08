import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { StoreState } from '../../redux/store';
import { UIState } from '../../UI/reducer';
import Scene from './scene';


interface InjectedProps extends DispatchProp, UIState {
}

// @ts-ignore
@connect( ( state: StoreState ) => state.ui )
export default class MovementUI extends React.PureComponent {
	
	props: InjectedProps;
	
	public componentDidMount(): void {
		this.props.game.scene.start( 'Movement' );
	}
	
	public componentWillUnmount(): void {
		const scene = this.props.game.scene.getScene( 'Movement' ) as Scene;
		scene.room.leave();
		scene.scene.stop();
	}
	
	render() {
		return null;
	}
	
}
