import { SCENE } from './actions';


export interface TictactoeState {
	scene: Phaser.Scene
}

const initState: TictactoeState = {
	scene: null
};

export const tictactoeReducer = (
	state = initState,
	action: {
		type: string
		scene?: Phaser.Scene
	}
) => {
	if ( action.type === SCENE ) {
		return { ...state, scene: action.scene };
	} else
		return state;
};
