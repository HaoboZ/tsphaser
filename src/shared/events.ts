export module clientInfo {
	export type id = string;
	export type clientData = {
		clientId: clientInfo.id
	}
	
	export const connect = 'connect';
	export const disconnect = 'disconnect';
	export const error = 'err';
}

export module roomInfo {
	export type id = string;
	export const type = 'room';
	export type roomData = {
		roomId: roomInfo.id
		roomType: string
		roomAdmin: clientInfo.id
		roomMaxClients: number
		roomCreationTime: number
		clientsData: { [ id: string ]: any }
	};
	
	export const join = 'joinRoom';
	export const leave = 'leaveRoom';
	export const clientJoin = 'clientJoinRoom';
	export const clientLeave = 'clientLeaveRoom';
	export module events {
		export module server {
			export type global = {
				// Called when a client tries to join
				[ join ]: ( args: { roomId: string, password?: string }, returnId: string ) => void
			}
			export type local = {
				// Called when a client disconnects
				[ clientInfo.disconnect ]: () => void
				// Called when a client tries to leave
				[ leave ]: ( roomId: string, args: undefined, returnId: string ) => void
			}
		}
		export module client {
			export type global = {
				// Called when client joins
				[ join ]: ( roomId: string, args: roomData ) => void
			}
			export type local = {
				// Called when client leaves
				[ leave ]: ( roomId: string ) => void
				// Called when another client joins
				[ clientJoin ]: ( roomId: string, args: clientInfo.clientData ) => void
				// Called when another client leaves
				[ clientLeave ]: ( roomId: string, args: clientInfo.clientData ) => void
			}
		}
	}
}

export module chatInfo {
	export type clientData = {
		clientId: clientInfo.id
		clientName: string
	}
	export const type = 'chat';
	
	export const message = 'chatMessage';
	export module events {
		export module server {
			export type local = roomInfo.events.server.local & {
				// Called when a clients sends a message
				[ message ]: ( roomId: string, args: { message: string } ) => void
			}
		}
		export module client {
			export type global = {
				// Called when client joins
				[ roomInfo.join ]: ( roomId: string, args: roomInfo.roomData ) => void
			}
			export type local = roomInfo.events.client.local & {
				// Called when a message is sent
				[ message ]: ( roomId: string, args: clientData & { message: string } ) => void
			}
		}
	}
}

export module tictactoeInfo {
	export const type = 'ttt';
	export type clientData = {
		clientId: clientInfo.id
		clientName: string
	}
	
	export const join = 'tttJoin';
	
	export const start = 'tttStart';
	export const play = 'tttPlay';
	export const over = 'tttOver';
	export module events {
		export module server {
			export type global = {
				// Called when a client tries to join
				[ join ]: ( args: undefined, returnId: string ) => void
			}
			export type local = roomInfo.events.server.local & {
				// Called when a client clicks ready
				[ start ]: ( roomId: string, args: undefined, returnId: string ) => void
				// Called when a client plays a move
				[ play ]: ( roomId: string, args: { x: number, y: number } ) => void
			}
		}
		export module client {
			export type global = {
				// Called when client joins
				[ roomInfo.join ]: ( roomId: string, args: roomInfo.roomData ) => void
			}
			export type local = roomInfo.events.client.local & {
				// Called when game starts
				[ start ]: ( roomId: string, args: { first: string } ) => void
				// Called when a move is made
				[ play ]: ( roomId: string, args: { player: string, x: number, y: number } ) => void
				// Called when game over
				[ over ]: ( roomId: string, args: { winner: string } ) => void
			}
		}
	}
}

// export module events {
// 	export module server {
// 		export type global = {}
// 		export type local = {}
// 	}
// 	export module client {
// 		export type global = {}
// 		export type local = {}
// 	}
// }