import { Room } from 'colyseus.js';
import Server from '../../connect/server';


export const FPS = 15;
export const WORLD = { width: 2000, height: 2000 };
export const PLAYER = { width: 100, height: 100 };

const speed = Phaser.Math.GetSpeed( 1000, 2 ) * 1000;

export default class Movement extends Phaser.Scene {
	
	private room: Room;
	
	private cursors: Phaser.Input.Keyboard.CursorKeys;
	private wasd: Phaser.Input.Keyboard.CursorKeys;
	
	private self: Phaser.GameObjects.Rectangle;
	private players: Phaser.GameObjects.Group;
	
	constructor() {
		super( 'Movement' );
	}
	
	public create() {
		this.room = Server.client.join( 'movement' );
		this.room.onJoin.add( () => {
			// load field
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
			
			this.scale.on( 'resize', ( { width, height } ) => {
				this.cameras.resize( width, height );
			} );
			
			this.room.state.players.onAdd = ( player, sessionId ) => {
				const child = this.add.rectangle( player.x, player.y, PLAYER.width, PLAYER.height,
					parseInt( player.color.substr( 1, 6 ), 16 ) );
				child.setName( sessionId );
				this.players.add( child );
				child.body.setImmovable();
				if ( sessionId == this.room.sessionId ) {
					child.setVisible( false ).setActive( false );
					this.self = this.add.rectangle( player.x, player.y, PLAYER.width, PLAYER.height,
						parseInt( player.color.substr( 1, 6 ), 16 ) );
					this.self.setName( sessionId );
					this.cameras.main.startFollow( this.self );
					this.physics.world.enable( this.self );
					this.self.body.setCollideWorldBounds();
					this.physics.add.collider( this.self, this.players, Phaser.Utils.NOOP,
						( a, b ) => b.name !== this.room.sessionId );
				}
			};
			
			this.room.state.players.onRemove = ( player, sessionId ) => {
				const child = this.players.children.get( 'name', sessionId );
				this.players.remove( child, true, true );
			};
			
			this.room.state.players.onChange = ( player, sessionId ) => {
				const child = this.players.children.get( 'name', sessionId );
				this.add.tween( {
					targets: child,
					x:       { value: player.x, duration: 1000 / FPS },
					y:       { value: player.y, duration: 1000 / FPS }
				} as any );
			};
		} );
		
		
	}
	
	private moved = false;
	
	public update() {
		if ( !this.self ) return;
		
		this.self.body.setVelocity( 0, 0 );
		if ( this.moved ) {
			this.room.send( { x: this.self.x, y: this.self.y } );
			this.moved = false;
		}
		if ( this.cursors.left.isDown || this.wasd.left.isDown ) {
			this.self.body.setVelocityX( -speed );
			this.moved = true;
		}
		if ( this.cursors.right.isDown || this.wasd.right.isDown ) {
			this.self.body.setVelocityX( speed );
			this.moved = true;
		}
		if ( this.cursors.up.isDown || this.wasd.up.isDown ) {
			this.self.body.setVelocityY( -speed );
			this.moved = true;
		}
		if ( this.cursors.down.isDown || this.wasd.down.isDown ) {
			this.self.body.setVelocityY( speed );
			this.moved = true;
		}
	}
	
}
