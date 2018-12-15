import * as SocketIO from 'socket.io';
import { socketEvents } from '../../shared/events';
import ChatRoom from '../examples/chat/chatRoom';
import Client from './client';

let Socket = new class {
	
	public io: SocketIO.Server;
	
	public init( io: SocketIO.Server ) {
		this.io = io;
		
		this.io.on( socketEvents.connect,
			( socket ) => new Client( socket )
		);
		
		new ChatRoom( {
			id:     'chatTest',
			remove: false
		} );
	}
	
};

export default Socket;
