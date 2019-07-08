export const MESSAGE = 'chatMESSAGE';
export const CLEAR = 'chatCLEAR';

export const sendMessage = ( message: string ) => ( {
	type: MESSAGE,
	message
} );

export const clearLog = () => ( {
	type: CLEAR
} );
