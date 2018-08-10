import * as SocketIO from 'socket.io';

const Socket = new class {
	
	public io: SocketIO.Server;
	
	init( io: SocketIO.Server ) {
		this.io = io;
	}
	
};
export default Socket;
