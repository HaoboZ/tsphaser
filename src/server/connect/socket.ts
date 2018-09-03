import * as SocketIO from 'socket.io';
import Client from './client';

import Tictactoe from '../game/tictactoe';

const Socket = new class {
	
	public io: SocketIO.Server;
	
	public room = Tictactoe;
	
	init( io: SocketIO.Server ) {
		this.io = io;
		this.io.on( 'connect', ( socket ) => new Client( socket ) );
	}
	
};
export default Socket;

export function error( socket, err?: ERROR ) {
	socket.emit( 'err', err );
}

export enum ERROR {
	NoRoom,
	Join
}
