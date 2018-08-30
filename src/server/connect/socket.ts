import * as SocketIO from 'socket.io';
import Client from './client';

const Socket = new class {
	
	public io: SocketIO.Server;
	
	init( io: SocketIO.Server ) {
		this.io = io;
		this.io.on( 'connect', ( socket ) => {
			new Client( socket );
		} );
	}
	
};
export default Socket;
