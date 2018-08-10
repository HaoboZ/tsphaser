import * as React from 'react';
import * as ReactDOM from 'react-dom';

const Interface = new class {
	
	public overlay: JQuery;
	
	init() {
		this.overlay = $( '#overlay' );
	}
	
	/**
	 * Unmounts container and listeners.
	 * Default container is the main overlay.
	 *
	 * @param {HTMLElement} container
	 */
	public clean( container: HTMLElement = this.overlay[ 0 ] ): void {
		ReactDOM.unmountComponentAtNode( container );
		this.overlay.empty();
	}
	
	/**
	 * Renders a React component to the container.
	 * Default container is the main overlay.
	 *
	 * May need to call clean in order to remove listeners.
	 *
	 * @param {JSX.Element} component
	 * @param {HTMLElement} container
	 */
	public render( component: JSX.Element, container: HTMLElement = this.overlay[ 0 ] ): void {
		ReactDOM.render( component, container );
	}
	
	/**
	 * Finds the parent HTML container.
	 * Default container is the main overlay.
	 *
	 * @param {HTMLElement} instance
	 * @returns {Element | Text | null}
	 */
	public find( instance: HTMLElement = this.overlay[ 0 ] ): Element | Text | null {
		return ReactDOM.findDOMNode( instance );
	}
};
export default Interface;
