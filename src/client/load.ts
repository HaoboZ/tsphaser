import config from './config';
import Server from './connect/server';

export default class Load extends Phaser.Scene {
	
	constructor() {
		super( 'Load' );
	}
	
	public preload() {
		Server.init();
		
		// load assets
		this.loadBar( 24 );
	}
	
	public create() {
		this.scene.start( this.scene.settings.data[ 'start' ] );
	}
	
	private loadBar( height: number ) {
		const progressBar = this.add.graphics(),
		      loadingText = this.add.text(
			      2, config.size.height - height,
			      'Loading...',
			      {
				      font: `${height * 0.9}px monospace`,
				      fill: '#ffffff'
			      }
		      );
		
		this.load.on( 'progress', ( value ) => {
			loadingText.setText( `Loading... ${Math.floor( value * 100 )}%` );
			
			progressBar.clear();
			progressBar.fillStyle( Phaser.Display.Color.HexStringToColor( '#bbbbbb' ).color, 1 );
			
			progressBar.fillRect( 0, config.size.height - height - 2, config.size.width * value, height + 4 );
		} );
	}
	
}
