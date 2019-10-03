import { Room } from 'colyseus.js';

import { tictactoeEvents } from '../../../../server/src/examples/tictactoe/tictactoeEvents';
import tictactoeRoomState from '../../../../server/src/examples/tictactoe/tictactoeRoomState';


export default class TictactoeScene extends Phaser.Scene {
	
	private room: Room<tictactoeRoomState>;
	
	private board: Phaser.GameObjects.Sprite[] = [];
	playing = false;
	
	public preload() {
		this.load.spritesheet( 'piece', 'assets/examples/piece.png',
			{ frameWidth: 192, frameHeight: 192 } );
	}
	
	public create() {
		this.input.on( Phaser.Input.Events.GAMEOBJECT_UP, ( _, rect ) => {
				if ( !this.room ) return;
				if ( !this.playing || ( this.room.state.turn ? this.room.state.cross : this.room.state.circle ) !== this.room.sessionId ) return;
				if ( rect.getData( 'value' ) !== 0 ) return;
				
				this.room.send( { event: tictactoeEvents.PLAY, index: rect.getData( 'index' ) } );
			}
		);
		
		this.scale.on( Phaser.Scale.Events.RESIZE, this.resize );
		
		this.events.on( 'shutdown', () => {
			this.room.leave();
		} );
	}
	
	public setRoom( room?: Room ) {
				if ( room ) {
					this.room = room;
					room.onMessage( ( message ) => {
						switch ( message.event ) {
						case tictactoeEvents.START:
							this.playing = true;
							break;
						case tictactoeEvents.OVER:
							this.playing = false;
							break;
						}
					} );
					for ( let i = 0; i < 9; i++ ) {
						this.board[ i ] = this.add.sprite( 0, 0, 'piece' )
							.setData( 'index', i )
							.setInteractive();
					}
					this.resize();
					this.room.state.board.onAdd = this.room.state.board.onChange = ( item, index ) => {
						this.board[ index ].setData( 'value', item );
						this.board[ index ].setFrame( item );
					};
		} else {
			// remove all items begin displayed
			for ( const tile of this.board )
				tile.destroy();
			this.room = null;
		}
	}
	
	private resize = () => {
		const size = Math.min( this.scale.gameSize.width, this.scale.gameSize.height ) * .8;
		const boardX   = ( this.scale.gameSize.width - size ) / 2,
		      boardY   = ( this.scale.gameSize.height - size ) / 2,
		      cellSize = size / 3;
		
		for ( const cell of this.board ) {
			const index = cell.getData( 'index' );
			const x = index % 3 + .5,
			      y = Math.floor( index / 3 ) + .5;
			cell.setPosition( boardX + x * cellSize, boardY + y * cellSize )
				.setDisplaySize( cellSize, cellSize );
		}
	};
	
}
