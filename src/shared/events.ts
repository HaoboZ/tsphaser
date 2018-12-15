export module socketEvents {
	export const connect = 'connect';
	export const disconnect = 'disconnect';
	export const error = 'err';
}

export module roomEvents {
	export const type = 'room';
	export const join = 'joinRoom';
	export const leave = 'leaveRoom';
	export module client {
		export const join = 'clientJoinRoom';
		export const leave = 'clientLeaveRoom';
	}
}

export module chatEvents {
	export const type = 'chat';
	export const message = 'chatMessage';
}

export module tictactoeEvents {
	export module room {
		export const type = 'ttt';
		export const queue = 'tttQueue';
		export const unQueue = 'tttUnQueue';
		export const create = 'tttCreateRoom';
	}
	export const start = 'tttStart';
	export const play = 'tttPlay';
}
