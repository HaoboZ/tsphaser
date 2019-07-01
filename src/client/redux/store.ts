import { combineReducers, createStore } from 'redux';

import { chatReducer, ChatState } from '../examples/chat/reducer';
import { tictactoeReducer, TictactoeState } from '../examples/tictactoe/reducer';
import { UIReducer, UIState } from '../UI/reducer';


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
