import { combineReducers } from 'redux';

import { chatReducer, ChatState } from '../examples/chat/reducer';
import { tictactoeReducer, TictactoeState } from '../examples/tictactoe/reducer';
import { UIReducer, UIState } from '../UI/reducer';


export default () => combineReducers(
	{
		ui:        UIReducer,
		chat:      chatReducer,
		tictactoe: tictactoeReducer
	}
)

export interface state {
	ui: UIState
	chat: ChatState
	tictactoe: TictactoeState
}