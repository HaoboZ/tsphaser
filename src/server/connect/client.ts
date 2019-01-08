import * as SocketIO from 'socket.io';
import { clientInfo } from '../../shared/events';
import Group from '../../shared/group';
import config from '../config';
import Room, { RoomEvents } from '../room/room';

export function ClientEvents( client: Client ) {
	client.socket.on( clientInfo.disconnect, () => {
			// remove this player from our clients list
			Client.Group.remove( client.id );
			
			if ( config.debug ) console.log( `${client.id} disconnected` );
		}
	);
}

/**
 * Socket wrapper.
 * Stores extra data for rooms.
 */
export default class Client {
	
	public static Group = new Group<Client>();
	
	public socket: SocketIO.Socket;
	
	/**
	 * Reference to this.socket.id.
	 */
	public id: clientInfo.id;
	
	/**
	 * List of rooms that client is currently in.
	 */
	public rooms = new Group<Room<any>>();
	
	/**
	 * All client data.
	 */
	get data(): clientInfo.clientData {
		return {
			clientId: this.id
		};
	}
	
	constructor( socket: SocketIO.Socket ) {
		this.socket = socket;
		this.id = this.socket.id;
		
		Client.Group.add( this.id, this );
		
		ClientEvents( this );
		this.multiOn( RoomEvents( this ) );
		
		if ( config.debug ) console.log( `${this.id} connected` );
	}
	
	public multiOn( events: { [ name: string ]: ( ...any ) => void } ) {
		for ( let name in events )
			this.socket.on( name, events[ name ] );
	}
	
}
