const UI = 'UI';
const JSONUI = 'JSONUI';

export const setUI = ( element: React.ComponentClass ) => ( {
	type: UI,
	element
} );

export const setJSONUI = ( data: object ) => ( {
	type: JSONUI,
	data
} );

export interface UIState {
	element: React.ComponentClass
	data: object
}

const initState: UIState = { element: null, data: null };

export const UIReducer = (
	state = initState,
	action: { type: string, element?: React.ComponentClass, data?: object }
) => {
	if ( action.type === UI ) {
		state.element = action.element;
		return { ...state };
	} else if ( action.type === JSONUI ) {
		state.data = action.data;
		return { ...state };
	} else {
		return state;
	}
};

