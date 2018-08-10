import * as React from 'react';
import '../connect/socket';
import Interface from '../interface/interface';

import config from '../config';

export default class Load extends Phaser.Scene {
	
	constructor() {
		super( { key: 'Load' } );
	}
	
	public preload() {
		// sets overlay width height
		Interface.init();
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
		
		
		let progressBar = this.add.graphics(),
			 progressBox = this.add.graphics();
		
		let width       = this.cameras.main.width,
			 height      = this.cameras.main.height,
			 loadingText = this.make.text( {
				 x:     width / 2,
				 y:     height / 2 - 50,
				 text:  'Loading...',
				 style: {
					 font: '20px monospace',
					 fill: '#ffffff'
				 }
			 } ),
			 percentText = this.make.text( {
				 x:     width / 2,
				 y:     height / 2 - 5,
				 text:  '0%',
				 style: {
					 font: '18px monospace',
					 fill: '#ffffff'
				 }
			 } ),
			 assetText   = this.make.text( {
				 x:     width / 2,
				 y:     height / 2 + 50,
				 text:  '',
				 style: {
					 font: '18px monospace',
					 fill: '#ffffff'
				 }
			 } );
		loadingText.setOrigin( 0.5, 0.5 );
		percentText.setOrigin( 0.5, 0.5 );
		assetText.setOrigin( 0.5, 0.5 );
		
		progressBox.fillStyle( '#222222'.toColor(), 0.8 );
		progressBox.fillRect( width / 2 - 160, height / 2 - 30, 320, 50 );
		
		this.load.on( 'progress', ( value ) => {
			percentText.setText( `${ Math.floor( value * 100 ) }%` );
			progressBar.clear();
			progressBar.fillStyle( '#ffffff'.toColor(), 1 );
			
			progressBar.fillRect( width / 2 - 150, height / 2 - 20, 300 * value, 30 );
		} );
		
		this.load.on( 'fileprogress', ( file ) => {
			assetText.setText( 'Loading asset: ' + file.key );
		} );
		
		this.load.on( 'complete', () => {
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			assetText.destroy();
		} );
		
		// load assets
		this.load.multiatlas( 'atlas', 'assets/atlas.json', 'assets' );
	}
	
	public create() {
		this.scene.start( 'Menu' );
	}
	
}
