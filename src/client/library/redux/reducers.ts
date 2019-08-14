import { combineReducers } from 'redux';

import { UIReducer, UIState } from '../UI/reducer';


const reducers = () => combineReducers(
	{
		ui: UIReducer
	}
);
export default reducers;

export interface state {
	ui: UIState
}
