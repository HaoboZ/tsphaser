import * as React from 'react';
import Interface from '../interface/interface';

import config from '../config';

export default class Load extends Phaser.Scene {
	
	constructor() {
		super( { key: 'Load' } );
		
		Interface.init();
	}
	
	public preload() {
		this.resize();
		
		this.loadBar( 24 );
		
		// load assets
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
			progressBar.fillStyle( '#bbbbbb'.toColor(), 1 );
			
			progressBar.fillRect( 0, config.height - height - 2, config.width * value, height + 4 );
		} );
		
		this.load.on( 'complete', () => {
			progressBar.destroy();
			loadingText.destroy();
		} );
	}
	
}
