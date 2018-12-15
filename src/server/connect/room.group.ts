import Room from './room';

let RoomGroup = new class {
	
	private list: { [ id: string ]: Room } = {};
	
	public get( id: string ) {
		return this.list[ id ];
	}
	
	public add( room: Room ) {
		this.list[ room.id ] = room;
		return room;
	}
	
	public remove( room: Room ) {
		delete this.list[ room.id ];
	}
	
};

export default RoomGroup;
