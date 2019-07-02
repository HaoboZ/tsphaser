import * as React from 'react';


const UI = 'setUI';

export const setUI = ( element: React.ComponentClass | React.ReactElement, scene: Phaser.Scene = null ) => ( {
	type: UI,
	element,
	scene
} );

export interface UIState {
	element: React.ComponentClass | React.ReactElement
	scene: Phaser.Scene
}

const initState: UIState = { element: null, scene: null };

export const UIReducer = (
	state = initState,
	action: { type: string, element?: React.ComponentClass | React.ReactElement, scene?: Phaser.Scene }
) => {
	if ( action.type === UI ) {
		return { ...state, element: action.element, scene: action.scene };
	} else {
		return state;
	}
};
