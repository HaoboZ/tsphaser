import * as React from 'react';
import * as ReactDOM from 'react-dom';

const Interface = new class {
	
	private game: Phaser.Game;
	
	public overlay: JQuery;
	
	init( game: Phaser.Game ) {
		this.game = game;
		this.overlay = $( '#overlay' );
	}
	
	/**
	 * Unmounts container.
	 */
	public unmount(): void {
		ReactDOM.unmountComponentAtNode( this.overlay[ 0 ] );
	}
	
	/**
	 * Renders a React component to the container.
	 *
	 * @param {JSX.Element} component
	 */
	public render( component: JSX.Element ): void {
		ReactDOM.render( component, this.overlay[ 0 ] );
	}
	
};
export default Interface;
