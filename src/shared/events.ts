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
				[ join ]: ( args: { roomId: string, password?: string }, returnId: string ) => void
			}
			export type local = {
				[ clientInfo.disconnect ]: () => void
				[ leave ]: ( roomId: string, args: undefined, returnId: string ) => void
			}
		}
		export module client {
			export type global = {
				[ join ]: ( roomId: string, args: roomData ) => void
			}
			export type local = {
				[ leave ]: ( roomId: string ) => void
				[ clientJoin ]: ( roomId: string, args: clientInfo.clientData ) => void
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
				[ message ]: ( roomId: string, args: { message: string } ) => void
			}
		}
		export module client {
			export type global = {
				[ roomInfo.join ]: ( roomId: string, args: roomInfo.roomData ) => void
			}
			export type local = roomInfo.events.client.local & {
				[ chatInfo.message ]: ( roomId: string, args: clientData & { message: string } ) => void
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
				[ tictactoeInfo.join ]: ( args, returnId ) => void
			}
			export type local = roomInfo.events.server.local & {
				[ tictactoeInfo.start ]: ( roomId: string, args: undefined, returnId: string ) => void
				[ tictactoeInfo.play ]: ( roomId: string, args: { x: number, y: number } ) => void
			}
		}
		export module client {
			export type global = {
				[ roomInfo.join ]: ( roomId: string, args: roomInfo.roomData ) => void
			}
			export type local = roomInfo.events.client.local & {
				[ tictactoeInfo.start ]: ( roomId: string, args: { x: string, o: string } ) => void
				[ tictactoeInfo.play ]: ( roomId: string, args: { player: string, x: number, y: number } ) => void
				[ tictactoeInfo.over ]: ( roomId: string, args: { winner: string } ) => void
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