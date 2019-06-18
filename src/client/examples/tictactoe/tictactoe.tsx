import * as React from 'react';
import Server from '../../connect/server';
import store from '../../redux/store';
import { setUI } from '../../redux/UIReducer';
import { endPlaying, setRoom, startPlaying } from './tictactoeActions';
import TictactoeRoom from './tictactoeRoom';
import TictactoeUI from './tictactoeUI';


const boardX = 370, boardY = 90;

export default class Tictactoe extends Phaser.Scene {
	
	room: TictactoeRoom;
	
	self: Phaser.GameObjects.Text;
	enemy: Phaser.GameObjects.Text;
	
	board: Phaser.GameObjects.Graphics;
	pieces: Phaser.GameObjects.Graphics;
	
	constructor() {
		super( 'Tictactoe' );
	}
	
	public create() {
		const room = Server.client.join( 'chat' );
		store.dispatch( setRoom( room ) );
		room.onJoin.add( () => {
		
		} );
		room.onMessage.add( message => {
			switch ( message.action ) {
			case 'JOIN':
				store.dispatch( startPlaying() );
				break;
			case 'END':
				store.dispatch( endPlaying() );
				break;
			}
		} );
		room.onLeave.add( () => {
			store.dispatch( setRoom( null ) );
			store.dispatch( endPlaying() );
			console.log( 'Left Room', room.id );
		} );
		room.onError.add( err => {
			console.log( 'Error:', err );
		} );
		
		store.dispatch( setUI( TictactoeUI as any ) );
		
		this.input.on( 'pointerdown', ( pointer: Phaser.Input.Pointer ) => {
				if ( !this.room || !this.room.playing || !this.room.turn ) return;
				const x = Math.floor( ( pointer.x - boardX ) / 180 ),
				      y = Math.floor( ( pointer.y - boardY ) / 180 );
				
				if ( 0 <= x && x < 3 && 0 <= y && y < 3 ) {
					if ( !this.room.board[ y ][ x ] )
						room.send( { action: 'PLAY', x, y } );
				}
			}
		);
		
		this.self = this.add.text( 1000, 600, '', { fontSize: '40px' } );
		this.enemy = this.add.text( 100, 100, '', { fontSize: '40px' } );
		this.board = this.add.graphics();
		this.board.lineStyle( 5, 0xffffff );
		for ( let i = 0; i < 2; ++i ) {
			const x = boardX + 180 + i * 180,
			      y = boardY + 180 + i * 180;
			this.board.lineBetween( x, boardY, x, boardY + 180 * 3 );
			this.board.lineBetween( boardX, y, boardX + 180 * 3, y );
		}
		this.pieces = this.add.graphics();
		
		Server.events.on( roomInfo.join, ( room: TictactoeRoom ) => {
			this.room = room;
			
			this.draw();
			room.events.on( roomInfo.clientJoin, () => {
				this.draw();
			} );
			room.events.on( roomInfo.clientLeave, () => this.draw() );
			room.events.on( roomInfo.leave, () => {
				this.room = null;
				this.draw();
			} );
			room.events.on( tictactoeInfo.start, () => this.draw() );
			room.events.on( tictactoeInfo.play, () => this.draw() );
		} );
	}
	
	private draw() {
		this.self.setText( '' );
		this.enemy.setText( '' );
		this.pieces.clear();
		if ( !this.room ) return;
		
		this.room.clients.iterate( ( client ) => {
			let piece = '';
			const text = client.clientId === Server.id ? this.self : this.enemy;
			if ( this.room.first )
				piece = this.room.first === client.clientId ? 'X ' : 'O ';
			text.setText( piece + client.name );
		} );
		
		if ( this.room.playing )
			if ( this.room.turn ) {
				this.self.setFontStyle( 'bold' );
				this.enemy.setFontStyle( 'normal' );
			} else {
				this.self.setFontStyle( 'normal' );
				this.enemy.setFontStyle( 'bold' );
			}
		
		this.pieces.lineStyle( 5, 0xffffff );
		for ( let x = 0; x < 3; ++x )
			for ( let y = 0; y < 3; ++y ) {
				const player = this.room.board[ y ][ x ];
				if ( player === this.room.first )
					this.drawX( x, y );
				else if ( player )
					this.drawO( x, y );
			}
	}
	
	private drawX( x, y ) {
		x = boardX + x * 180;
		y = boardY + y * 180;
		this.pieces.lineBetween( x + 10, y + 10, x + 160, y + 160 );
		this.pieces.lineBetween( x + 10, y + 160, x + 160, y + 10 );
	}
	
	private drawO( x, y ) {
		x = boardX + x * 180;
		y = boardY + y * 180;
		this.pieces.strokeCircle( x + 90, y + 90, 70 );
	}
	
}
