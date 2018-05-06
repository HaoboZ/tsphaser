import * as ReactDOM from 'react-dom';
import './style.less';

export default class Interface {
	
	public static game: Phaser.Game;
	
	private static Roverlay: HTMLElement;
	public static JQoverlay: JQuery;
	
	constructor(game: Phaser.Game) {
		Interface.game = game;
		Interface.JQoverlay = $('#JQoverlay');
		Interface.Roverlay = $('#Roverlay')[0];
	}
	
	/**
	 * Unmounts container and listeners.
	 * Default container is the main overlay.
	 *
	 * @param {HTMLElement} container
	 */
	public static clean(container: HTMLElement = this.Roverlay): void {
		ReactDOM.unmountComponentAtNode(container);
		this.JQoverlay.empty();
	}
	
	/**
	 * Renders a React component to the container.
	 * Default container is the main overlay.
	 *
	 * May need to call {@link Interface.clean} in order to remove listeners.
	 *
	 * @param {JSX.Element} component
	 * @param {HTMLElement} container
	 */
	public static render(component: JSX.Element, container: HTMLElement = this.Roverlay): void {
		ReactDOM.render(component, container);
	}
	
	/**
	 * Finds the parent HTML container.
	 * Default container is the main overlay.
	 *
	 * @param {HTMLElement} instance
	 * @returns {Element | Text | null}
	 */
	public static find(instance: HTMLElement = this.Roverlay): Element | Text | null {
		return ReactDOM.findDOMNode(instance);
	}
}
