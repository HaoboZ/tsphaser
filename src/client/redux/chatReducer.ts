const MESSAGE = 'MESSAGE';


export const sendMessage = ( message: string ) => ( {
	type: MESSAGE,
	message
} );

const initState: { log: string[] } = { log: [] };

export const chatReducer = (
	state = initState,
	action: { type: string, message?: string }
) => {
	console.log( 'Action:', action );
	switch ( action.type ) {
	case MESSAGE:
		const log = state.log.slice();
		log.push( action.message );
		return { log };
	default:
		return state;
	}
};
