import { combineReducers, createStore } from 'redux';

import { chatReducer, ChatState } from '../examples/chat/chatReducer';
import { tictactoeReducer, TictactoeState } from '../examples/tictactoe/tictactoeReducer';
import { UIReducer, UIState } from '../UI/UIReducer';


export default createStore( combineReducers(
	{
		chat:      chatReducer,
		ui:        UIReducer,
		tictactoe: tictactoeReducer
	}
) );

export interface StoreState {
	ui: UIState
	chat: ChatState
	tictactoe: TictactoeState
}
