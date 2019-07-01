import * as React from 'react';


const UI = 'setUI';

export const setUI = ( element: React.ComponentClass | React.ReactElement ) => ( {
	type: UI,
	element
} );

export interface UIState {
	element: React.ComponentClass | React.ReactElement
}

const initState: UIState = { element: null };

export const UIReducer = (
	state = initState,
	action: { type: string, element?: React.ComponentClass | React.ReactElement }
) => {
	if ( action.type === UI ) {
		state.element = action.element;
		return { ...state };
	} else {
		return state;
	}
};
