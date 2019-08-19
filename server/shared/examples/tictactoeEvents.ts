export enum tictactoeEvents {
	/*
		client -> server
			toggle ready
		server -> client
			start game
	 */
	START,
	/*
		client -> server
			index
				plays at location
	 */
	PLAY,
	/*
		client -> server
			exit game
		server -> client
			state, winner?
				result of the game
				who won
	 */
	OVER
}
