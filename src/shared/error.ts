import * as SocketIO from 'socket.io';

export function error( socket: SocketIO.Socket, err?: ERROR ) {
	socket.emit( 'err', err );
}

export enum ERROR {
	RoomExist,
	UnableJoinRoom,
	ClientNotInRoom,
	ClientInRoom
}
