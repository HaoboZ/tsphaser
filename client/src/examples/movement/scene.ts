import { Room } from 'colyseus.js';

import { moveConfig } from '../../../../server/src/examples/movement/moveConfig';
import MoveRoomState from '../../../../server/src/examples/movement/moveRoomState';
import Connect from '../../library/connect';


const { FPS, WORLD, PLAYER, SPEED } = moveConfig;

export default class MovementScene extends Phaser.Scene {
	
	public room: Room<MoveRoomState>;
	
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private wasd: Phaser.Types.Input.Keyboard.CursorKeys;
	
	private self: Phaser.GameObjects.Rectangle;
	private players: Phaser.GameObjects.Group;
	
	public create() {
		this.self = null;
		
		Connect.client.joinOrCreate( 'movement' ).then( ( room ) => {
			this.room = room;
			this.loadField();
			this.playerStateChange();
		} );
		
		this.events.on( 'shutdown', () => {
			this.room.leave();
		} );
	}
	
	private loadField() {
		this.cameras.main.setBounds( 0, 0, WORLD.width, WORLD.height );
		this.physics.world.setBounds( 0, 0, WORLD.width, WORLD.height );
		const g = this.add.graphics();
		g.lineStyle( 1, 0xffffff );
		for ( let i = 0; i < 10; ++i ) {
			g.lineBetween( 0, i * WORLD.height / 10, WORLD.width, i * WORLD.height / 10 );
			g.lineBetween( i * WORLD.width / 10, 0, i * WORLD.width / 10, WORLD.height );
		}
		this.cursors = this.input.keyboard.createCursorKeys();
		this.wasd = this.input.keyboard.addKeys( {
			up:    Phaser.Input.Keyboard.KeyCodes.W,
			left:  Phaser.Input.Keyboard.KeyCodes.A,
			down:  Phaser.Input.Keyboard.KeyCodes.S,
			right: Phaser.Input.Keyboard.KeyCodes.D
		} );
		this.players = this.physics.add.group();
		
		this.scale.on( Phaser.Scale.Events.RESIZE, ( { width, height } ) => {
			this.cameras.resize( width, height );
		} );
	}
	
	public update() {
		if ( !this.self ) return;
		
		const body = this.self.body as Phaser.Physics.Arcade.Body;
		if ( body.moves )
			this.room.send( { x: this.self.x, y: this.self.y } );
		
		let x = 0, y = 0;
		if ( this.cursors.left.isDown || this.wasd.left.isDown )
			x -= SPEED;
		if ( this.cursors.right.isDown || this.wasd.right.isDown )
			x += SPEED;
		if ( this.cursors.up.isDown || this.wasd.up.isDown )
			y -= SPEED;
		if ( this.cursors.down.isDown || this.wasd.down.isDown )
			y += SPEED;
		
		body.setVelocity( x, y );
	}
	
	private playerStateChange() {
		this.room.state.players.onAdd = ( player, sessionId ) => {
			const child = this.add.rectangle( player.x, player.y, PLAYER.width, PLAYER.height,
				parseInt( player.color.substr( 1, 6 ), 16 ) );
			child.setName( sessionId );
			this.players.add( child );
			( child.body as Phaser.Physics.Arcade.Body ).setImmovable();
			if ( sessionId == this.room.sessionId ) {
				child.setVisible( false ).setActive( false );
				this.self = this.add.rectangle( player.x, player.y, PLAYER.width, PLAYER.height,
					parseInt( player.color.substr( 1, 6 ), 16 ) );
				this.self.setName( sessionId );
				this.cameras.main.startFollow( this.self );
				this.physics.world.enable( this.self );
				( this.self.body as Phaser.Physics.Arcade.Body ).setCollideWorldBounds();
				this.physics.add.collider( this.self, this.players, Phaser.Utils.NOOP,
					( a, b ) => b.name !== this.room.sessionId );
			}
		};
		
		this.room.state.players.onRemove = ( player, sessionId ) => {
			const child = this.players.children.get( 'name', sessionId as any );
			this.players.remove( child, true, true );
		};
		
		this.room.state.players.onChange = ( player, sessionId ) => {
			const child = this.players.children.get( 'name', sessionId as any );
			this.add.tween( {
				targets: child,
				x:       { value: player.x, duration: 1000 / FPS },
				y:       { value: player.y, duration: 1000 / FPS }
			} as any );
		};
	}
	
}
