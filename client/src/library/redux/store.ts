import { createStore } from 'redux';

import reducers, { state } from './reducers';


const store = createStore( reducers );
export default store;

export interface StoreState extends state {
}
