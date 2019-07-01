import { Room } from 'colyseus.js';

import { MESSAGE, ROOM } from './actions';


export interface ChatState {
	room: Room
	log: string[]
}

const initState: ChatState = {
	room: null,
	log:  []
};

export const chatReducer = (
	state = initState,
	action: {
		type: string
		room?: Room
		message?: string
	}
) => {
	switch ( action.type ) {
	case ROOM:
		return { ...state, room: action.room };
	case MESSAGE:
		const log = state.log.slice();
		log.push( action.message );
		return { ...state, log };
	default:
		return state;
	}
};
