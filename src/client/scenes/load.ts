import Interface from '../interface/interface';

import config from '../config';

export default class Load extends Phaser.Scene {
	
	constructor() {
		super( 'Load' );
	}
	
	public preload() {
		Interface.init( this.sys.game );
		this.resize();
		
		// load assets
		this.loadBar( 24 );
		this.load.pack( 'pack', 'assets/pack.json' );
	}
	
	public create() {
		this.scene.start( 'Menu' );
	}
	
	private resize() {
		// sets overlay width height
		Interface.overlay.width( config.width ).height( config.height );
		
		// scales screen to fit screen dimensions
		const w = $( window );
		function onResize() {
			let s = $( '#screen' );
			let width       = w.width(),
				 height      = w.height(),
				 widthRatio  = width / config.width,
				 heightRatio = height / config.height,
				 scale       = Math.min( widthRatio, heightRatio );
			
			s.css( 'transform', `translate(-50%, -50%) scale(${scale}, ${scale})` );
			return onResize;
		}
		w.on( 'resize', onResize() );
	}
	
	private loadBar( height: number ) {
		let progressBar = this.add.graphics(),
			 loadingText = this.add.text(
				 2, config.height - height,
				 'Loading...',
				 {
					 font: `${height * 0.9}px monospace`,
					 fill: '#ffffff'
				 }
			 );
		
		this.load.on( 'progress', ( value ) => {
			loadingText.setText( `Loading... ${ Math.floor( value * 100 ) }%` );
			
			progressBar.clear();
			progressBar.fillStyle( Phaser.Display.Color.HexStringToColor( '#bbbbbb' ).color, 1 );
			
			progressBar.fillRect( 0, config.height - height - 2, config.width * value, height + 4 );
		} );
		
		this.load.on( 'complete', () => {
			progressBar.destroy();
			loadingText.destroy();
		} );
	}
	
}
