const UI = 'TictactoeUI';

export const setUI = ( element: React.ComponentClass ) => ( {
	type: UI,
	element
} );

export interface UIState {
	element: React.ComponentClass
}

const initState: UIState = { element: null };

export const UIReducer = (
	state = initState,
	action: { type: string, element?: React.ComponentClass }
) => {
	if ( action.type === UI ) {
		state.element = action.element;
		return { ...state };
	} else {
		return state;
	}
};

