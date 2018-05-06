import Socket from './connect/socket';

export default class Main {
	
	constructor(io: SocketIO.Server) {
		new Socket(io);
	}
	
}