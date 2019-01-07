import * as ReactDOM from 'react-dom';

let Interface = new class {
	
	public game: Phaser.Game;
	
	private overlay: JQuery;
	
	public init( game: Phaser.Game ) {
		this.game = game;
		this.overlay = $( '#overlay' );
	}
	
	/**
	 * Retrieves the default overlay.
	 */
	public root() {
		return this.overlay;
	}
	
	/**
	 * Clears the JQuery container.
	 *
	 * @param {JQuery} container The container to clean.
	 */
	public clear( container: JQuery = this.overlay ): void {
		ReactDOM.unmountComponentAtNode( container[ 0 ] );
	}
	
	/**
	 * Renders a React component to the JQuery container.
	 *
	 * @param {JSX.Element} component The react component to render.
	 * @param {JQuery} container Where to place the component.
	 */
	public render( component: JSX.Element, container: JQuery = this.overlay ): void {
		ReactDOM.render( component, container[ 0 ] );
	}
	
};

export default Interface;
