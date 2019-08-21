import { READY, SETTINGS } from './actions';


export interface UIState {
	ready: boolean
	game: Phaser.Game
	settings: any
}

const initState: UIState = {
	ready:    false,
	game:     null,
	settings: JSON.parse( localStorage.getItem( 'settings' ) )
};

export const UIReducer = (
	state = initState,
	action: { type: string } & any
) => {
	switch ( action.type ) {
	case READY:
		return { ...state, ready: true, game: action.game };
	case SETTINGS:
		localStorage.setItem( 'settings', JSON.stringify( action.settings ) );
		return { ...state, settings: action.settings };
	default:
		return state;
	}
};
