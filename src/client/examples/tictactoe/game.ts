import { Room } from 'colyseus.js';

import { events } from '../../../shared/examples/tictactoeEvents';
import tictactoeRoomState from '../../../shared/examples/tictactoeRoomState';
import store from '../../redux/store';
import { setUI } from '../../UI/reducer';
import { setScene } from './actions';
import TictactoeUI from './UI';


export default class TictactoeScene extends Phaser.Scene {
	
	private room: Room<tictactoeRoomState>;
	
	private board: Phaser.GameObjects.Sprite[] = [];
	playing = false;
	
	constructor() {
		super( 'Tictactoe' );
	}
	
	public preload() {
		this.load.spritesheet( 'piece', 'assets/examples/piece.png',
			{ frameWidth: 192, frameHeight: 192 } );
	}
	
	public create() {
		store.dispatch( setScene( this ) );
		store.dispatch( setUI( TictactoeUI ) );
		
		this.input.on( 'gameobjectup', ( _, rect ) => {
				if ( !this.room ) return;
				if ( !this.playing || ( this.room.state.turn ? this.room.state.cross : this.room.state.circle ) !== this.room.sessionId ) return;
				if ( rect.getData( 'value' ) !== 0 ) return;
				
				this.room.send( { event: events.PLAY, index: rect.getData( 'index' ) } );
			}
		);
		
		this.scale.on( 'resize', this.resize );
	}
	
	public setRoom( room?: Room ) {
		if ( room ) {
			this.room = room;
			room.onMessage.add( ( message ) => {
				switch ( message.event ) {
				case events.START:
					this.playing = true;
					break;
				case events.OVER:
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
