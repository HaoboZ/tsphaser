export default class Socket {
	
	public static io: SocketIO.Server;
	
	constructor(io: SocketIO.Server) {
		Socket.io = io;
	}
	
}
