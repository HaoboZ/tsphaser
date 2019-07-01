import { Room } from 'colyseus.js';


export const MESSAGE = 'MESSAGE';
export const ROOM = 'ROOM';

export const sendMessage = ( message: string ) => ( {
	type: MESSAGE,
	message
} );

export const setRoom = ( room: Room ) => ( {
	type: ROOM,
	room
} );
