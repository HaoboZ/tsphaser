import { EventEmitter } from 'events';
import * as SocketIO from 'socket.io';
import { clientInfo } from '../../shared/events';
import Client from './client';

let Socket = new class {
	
	public io: SocketIO.Server;
	
	public events = new EventEmitter();
	
	public init( io: SocketIO.Server ) {
		this.io = io;
		
		this.io.on( clientInfo.connect,
			( socket: SocketIO.Socket ) => {
				this.events.emit( 'connect', new Client( socket ) );
			}
		);
	}
	
};

export default Socket;
