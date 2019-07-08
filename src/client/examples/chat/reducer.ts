import { CLEAR, MESSAGE } from './actions';


export interface ChatState {
	log: string[]
}

const initState: ChatState = {
	log: []
};

export const chatReducer = (
	state = initState,
	action: { type: string, message? }
) => {
	switch ( action.type ) {
	case CLEAR:
		return { ...state, log: [] };
	case MESSAGE:
		const log = state.log.slice();
		log.push( action.message );
		return { ...state, log };
	default:
		return state;
	}
};
