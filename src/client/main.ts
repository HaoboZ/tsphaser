import config from './config';
import Interface from './interface/interface';

let gameConfig: GameConfig = {
	type:            Phaser.AUTO,
	width:           config.width,
	height:          config.height,
	backgroundColor: '#2d2d2d',
	parent:          'screen',
	scene:           {
		preload,
		create,
		update
	}
};

var graphics;
var timerEvent;
var clockSize = 240;

new Phaser.Game( gameConfig );

function preload() {
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
	
	// sets overlay width height
	Interface.init();
	Interface.overlay.width( config.width ).height( config.height );
}

function create() {
	timerEvent = this.time.addEvent( { delay: 4000, repeat: 9 } );
	
	graphics = this.add.graphics( { x: 0, y: 0 } );
}

function update() {
	graphics.clear();
	
	drawClock( 400, 300, timerEvent );
}

function drawClock( x, y, timer ) {
	//  Progress is between 0 and 1, where 0 = the hand pointing up and then rotating clockwise a full 360
	
	//  The frame
	graphics.lineStyle( 6, 0xffffff, 1 );
	graphics.strokeCircle( x, y, clockSize );
	
	var angle;
	var dest;
	var p1;
	var p2;
	var size;
	
	//  The overall progress hand (only if repeat > 0)
	if ( timer.repeat > 0 ) {
		size = clockSize * 0.9;
		
		angle = ( 360 * timer.getOverallProgress() ) - 90;
		dest = Phaser.Math.RotateAroundDistance( { x: x, y: y }, x, y, Phaser.Math.DegToRad( angle ), size );
		
		graphics.lineStyle( 2, 0xff0000, 1 );
		
		graphics.beginPath();
		
		graphics.moveTo( x, y );
		
		p1 = Phaser.Math.RotateAroundDistance( { x: x, y: y }, x, y, Phaser.Math.DegToRad( angle - 5 ), size * 0.7 );
		
		graphics.lineTo( p1.x, p1.y );
		graphics.lineTo( dest.x, dest.y );
		
		graphics.moveTo( x, y );
		
		p2 = Phaser.Math.RotateAroundDistance( { x: x, y: y }, x, y, Phaser.Math.DegToRad( angle + 5 ), size * 0.7 );
		
		graphics.lineTo( p2.x, p2.y );
		graphics.lineTo( dest.x, dest.y );
		
		graphics.strokePath();
		graphics.closePath();
	}
	
	//  The current iteration hand
	size = clockSize * 0.95;
	
	angle = ( 360 * timer.getProgress() ) - 90;
	dest = Phaser.Math.RotateAroundDistance( { x: x, y: y }, x, y, Phaser.Math.DegToRad( angle ), size );
	
	graphics.lineStyle( 2, 0xffff00, 1 );
	
	graphics.beginPath();
	
	graphics.moveTo( x, y );
	
	p1 = Phaser.Math.RotateAroundDistance( { x: x, y: y }, x, y, Phaser.Math.DegToRad( angle - 5 ), size * 0.7 );
	
	graphics.lineTo( p1.x, p1.y );
	graphics.lineTo( dest.x, dest.y );
	
	graphics.moveTo( x, y );
	
	p2 = Phaser.Math.RotateAroundDistance( { x: x, y: y }, x, y, Phaser.Math.DegToRad( angle + 5 ), size * 0.7 );
	
	graphics.lineTo( p2.x, p2.y );
	graphics.lineTo( dest.x, dest.y );
	
	graphics.strokePath();
	graphics.closePath();
}
