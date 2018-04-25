export default class Main {
	
	io: SocketIO.Server;
	
	constructor(io: SocketIO.Server) {
		this.io = io;
	}
	
}