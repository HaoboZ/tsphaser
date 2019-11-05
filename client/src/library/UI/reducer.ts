import { READY } from './actions';


export interface UIState {
	ready: boolean
	game: Phaser.Game
}

const initState: UIState = {
	ready: false,
	game:  null
};

export const UIReducer = (
	state = initState,
	action: { type: string } & any
) => {
	switch ( action.type ) {
	case READY:
		return { ...state, ready: true, game: action.game };
	default:
		return state;
	}
};
