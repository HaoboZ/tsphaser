import { Room } from 'colyseus.js';


export const ROOM = 'ROOM';
export const PLAY = 'PLAY';
export const END = 'END';

export const setRoom = ( room: Room ) => ( {
	type: ROOM,
	room
} );

export const startPlaying = () => ( {
	type: PLAY
} );

export const endPlaying = () => ( {
	type: END
} );
