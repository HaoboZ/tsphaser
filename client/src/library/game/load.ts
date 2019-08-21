import config from '../../config';
import store from '../redux/store';
import { readyUI } from '../UI/actions';


export default class Load extends Phaser.Scene {
	
	progressBar: Phaser.GameObjects.Graphics;
	loadingText: Phaser.GameObjects.Text;
	
	constructor() {
		super( 'Load' );
	}
	
	public preload() {
		this.onResize( this.scale.gameSize );
		this.scale.on( Phaser.Scale.Events.RESIZE, this.onResize );
		
		// load assets
		this.loadBar( 24 );
	}
	
	public create() {
		store.dispatch( readyUI( this.game ) );
		this.scene.stop();
	}
	
	private onResize = ( gameSize: Phaser.Structs.Size ) => {
		if ( config.constantScale )
			$( '#ui' )
				.innerWidth( gameSize.width )
				.innerHeight( gameSize.height )
				.css( 'transform',
					`translate(-50%, -50%) scale(${1 / this.scale.displayScale.x}, ${1 / this.scale.displayScale.y})` );
	};
	
	private loadBar( height: number ) {
		this.progressBar = this.add.graphics();
		this.loadingText = this.add.text(
			2, this.scale.gameSize.height - height,
			'Loading...',
			{
				font:          `${height * 0.9}px monospace`,
				constantScale: '#ffffff'
			}
		);
		
		this.load.on( Phaser.Loader.Events.PROGRESS, ( value ) => {
			this.loadingText.setText( `Loading... ${Math.floor( value * 100 )}%` );
			
			this.progressBar.clear();
			this.progressBar.fillStyle( Phaser.Display.Color.HexStringToColor( '#bbbbbb' ).color, 1 );
			
			this.progressBar.fillRect( 0, this.scale.gameSize.height - height - 2, this.scale.gameSize.width * value, height + 4 );
		} );
	}
	
}
