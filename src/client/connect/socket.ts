
const Socket = new class {
	
	public socket: SocketIOClient.Socket;
	
	constructor() {
		this.socket = io.connect();
		
	}
	
};
export default Socket;