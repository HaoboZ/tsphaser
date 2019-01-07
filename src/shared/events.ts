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
	export const type = 'room';
	export type roomData = {
		roomId: string
		roomType: string
		roomAdmin: clientInfo.id
		roomMaxClients: number
		roomCreationTime: number
		clientsData: { [ id: string ]: any }
	};
	export const join = 'joinRoom';
	export type joinData = {
		roomId: string
		password?: string
	}
	export const leave = 'leaveRoom';
	export const clientJoin = 'clientJoinRoom';
	export const clientLeave = 'clientLeaveRoom';
}

export module chatInfo {
	export type clientData = {
		clientId: clientInfo.id
		clientName: string
	}
	export const type = 'chat';
	export const message = 'chatMessage';
	export type message = clientData | {
		message: string
	}
}

export module tictactoeInfo {
	export type clientData = {
		clientId: clientInfo.id
		clientName: string
	}
	export module room {
		export const type = 'ttt';
		export const join = 'tttJoin';
	}
	export const start = 'tttStart';
	export const play = 'tttPlay';
	export const over = 'tttOver';
}
