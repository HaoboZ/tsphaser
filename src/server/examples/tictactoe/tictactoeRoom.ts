import { ERROR, error } from '../../../shared/error';
import { tictactoeEvents } from '../../../shared/events';
import Client from '../../connect/client';
import Room from '../../connect/room';
import Tictactoe from './tictactoe';

export function TictactoeRoomEvents( client: Client ) {
	client.socket.on( tictactoeEvents.room.queue, () => {
		if ( !Object.keys( client.rooms ).length )
			return error( client.socket, ERROR.ClientInRoom );
		
		if ( !TictactoeRoom.queue ) {
			TictactoeRoom.queue = client;
			client.socket.emit( tictactoeEvents.room.queue );
			return;
		}
		
		let room = new TictactoeRoom( { maxClients: 2 } );
		room.join( TictactoeRoom.queue );
		room.join( client );
	} );
	client.socket.on( tictactoeEvents.room.unQueue, () => {
		if ( TictactoeRoom.queue === client )
			TictactoeRoom.queue = null;
	} );
	client.socket.on( tictactoeEvents.room.create, ( { password } ) => {
		if ( !Object.keys( client.rooms ).length )
			return error( client.socket, ERROR.ClientInRoom );
		
		let room = new TictactoeRoom( { password, admin: client.socket.id } );
		room.join( client, password );
	} );
}

export default class TictactoeRoom extends Room {
	
	game: Tictactoe;
	
	static queue: Client = null;
	
	get data() {
		return {
			...super.data,
			roomType: tictactoeEvents.room.type,
			...this.game.data
		};
	}
	
}
