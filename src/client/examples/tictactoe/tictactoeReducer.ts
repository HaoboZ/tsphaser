import { SCENE } from './tictactoeActions';


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
		return { ...state, room: action.scene };
	} else
		return state;
};

