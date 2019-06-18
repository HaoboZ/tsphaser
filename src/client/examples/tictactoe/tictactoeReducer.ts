import { Room } from 'colyseus.js';
import { END, PLAY, ROOM } from './tictactoeActions';


export interface TictactoeState {
	room: Room
	playing: boolean
}

const initState: TictactoeState = {
	room:    null,
	playing: false
};

export const tictactoeReducer = (
	state = initState,
	action: {
		type: string
		room?: Room
	}
) => {
	switch ( action.type ) {
	case ROOM:
		return { ...state, room: action.room };
	case PLAY:
		return { ...state, playing: true };
	case END:
		return { ...state, playing: false };
	default:
		return state;
	}
};

