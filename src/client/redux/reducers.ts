import { combineReducers } from 'redux';

import { UIReducer, UIState } from '../UI/reducer';


export default () => combineReducers(
	{
		ui: UIReducer
	}
)

export interface state {
	ui: UIState
}
