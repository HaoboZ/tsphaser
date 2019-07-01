import { createStore } from 'redux';

import reducers, { state } from './reducers';


export default createStore(
	reducers()
);

export interface StoreState extends state {
}
