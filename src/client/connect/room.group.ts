import Room from './room';
import Socket from './socket';
import { roomEvents } from '../../shared/events';

let RoomGroup = new class {
	
	private list: { [ id: string ]: Room } = {};
	
	public get( id: string ) {
		return this.list[ id ];
	}
	
	public join( id: string, password?: string ) {
		Socket.socket.emit( roomEvents.join, { roomId: id, password } );
	}
	
	public add( room: Room ) {
		this.list[ room.id ] = room;
		return room;
	}
	
	public remove( id: string ) {
		delete this.list[ id ];
	}
	
};
export default RoomGroup;
