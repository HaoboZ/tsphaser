import * as SocketIO from 'socket.io';
import { socketEvents } from '../../shared/events';
import names from '../../shared/names';
import config from '../config';
import { ChatEvents } from '../examples/chat/chatRoom';
import ClientGroup from './client.group';
import Room, { RoomEvents } from './room';

function ClientEvents( client: Client ) {
	client.socket.on( socketEvents.disconnect,
		() => {
			// remove this player from our clients list
			ClientGroup.remove( client );
			
			if ( config.debug ) console.log( `${client.id} disconnected` );
		}
	);
}

export default class Client {
	
	public socket: SocketIO.Socket;
	
	public id: string;
	public rooms: { [ id: string ]: Room } = {};
	
	public name: string;
	
	constructor( socket: SocketIO.Socket ) {
		this.socket = socket;
		this.id = this.socket.id;
		this.name = names[ Math.floor( Math.random() * names.length ) ];
		
		ClientGroup.add( this );
		
		// TictactoeEvents( this );
		ChatEvents( this );
		RoomEvents( this );
		ClientEvents( this );
		
		if ( config.debug ) console.log( `${this.id} connected` );
	}
	
	get data() {
		return {
			clientId:   this.id,
			clientName: this.name
		};
	}
	
}
