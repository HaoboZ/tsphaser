import { combineReducers, createStore } from 'redux';
import { chatReducer } from './chatReducer';


export default createStore( combineReducers(
	{ chat: chatReducer }
) );
