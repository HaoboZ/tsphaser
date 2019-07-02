import { combineReducers } from 'redux';

import { chatReducer, ChatState } from '../examples/chat/reducer';
import { UIReducer, UIState } from '../UI/reducer';


export default () => combineReducers(
	{
		ui:   UIReducer,
		chat: chatReducer
	}
)

export interface state {
	ui: UIState
	chat: ChatState
}
