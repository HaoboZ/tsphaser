import { moveInfo, roomInfo } from '../../../shared/data';
import Socket from '../../connect/socket';
import MoveRoom from './moveRoom';

const speed = Phaser.Math.GetSpeed( 1000, 5 ) * 1000;

export default class Movement extends Phaser.Scene {
	
	public room: MoveRoom;
	
	private cursors: Phaser.Input.Keyboard.CursorKeys;
	
	private self: Phaser.GameObjects.Rectangle;
	private players: Phaser.GameObjects.Group;
	
	constructor() {
		super( 'Movement' );
	}
	
	public create() {
		Socket.emit( roomInfo.join, { roomId: 'moveTest' } );
		Socket.events.on( roomInfo.join, ( room: MoveRoom ) => {
			if ( !( room instanceof MoveRoom ) ) return;
			this.room = room;
			
			room.events.on( roomInfo.clientJoin, this.player );
			room.events.on( roomInfo.clientLeave, ( client: moveInfo.clientData ) => {
				const child = this.players.children.get( 'name', client.clientId );
				this.players.remove( child, true, true );
			} );
			
			// load field
			this.cameras.main.setBounds( 0, 0, moveInfo.world.width, moveInfo.world.height );
			this.physics.world.setBounds( 0, 0, moveInfo.world.width, moveInfo.world.height );
			const g = this.add.graphics();
			g.lineStyle( 1, 0xffffff );
			for ( let i = 0; i < 10; ++i ) {
				g.lineBetween( 0, i * moveInfo.world.height / 10, moveInfo.world.width, i * moveInfo.world.height / 10 );
				g.lineBetween( i * moveInfo.world.width / 10, 0, i * moveInfo.world.width / 10, moveInfo.world.height );
			}
			this.cursors = this.input.keyboard.createCursorKeys();
			
			// load players
			this.players = this.physics.add.group();
			this.room.clients.iterate( this.player );
			
			// load self
			const self = this.players.children.get( 'name', Socket.id ) as Phaser.GameObjects.Rectangle;
			self.setVisible( false );
			const client = this.room.clients.get( Socket.id );
			this.self = this.add.rectangle( client.x, client.y, moveInfo.player.width, moveInfo.player.height,
				parseInt( client.color.substr( 1, 6 ), 16 ) );
			this.cameras.main.startFollow( this.self );
			this.physics.world.enable( this.self );
			this.self.body.setCollideWorldBounds();
			this.physics.add.collider( this.self, this.players, Phaser.Utils.NOOP,
				( a, b ) => b.name !== Socket.id );
			
			// update players
			this.room.events.on( 'sync', () => {
				this.players.children.iterate( ( child: Phaser.GameObjects.Rectangle | any ) => {
					const client = this.room.clients.get( child.name );
					
					this.add.tween( {
						targets: child,
						x:       { value: client.x, duration: 1000 / moveInfo.fps },
						y:       { value: client.y, duration: 1500 / moveInfo.fps }
					} as any );
				} );
			} );
		} );
	}
	
	private moved = false;
	
	public update() {
		if ( !this.room ) return;
		
		this.self.body.setVelocity( 0, 0 );
		if ( this.moved ) {
			this.room.emit( moveInfo.move, { x: this.self.x, y: this.self.y } );
			this.moved = false;
		}
		if ( this.cursors.left.isDown ) {
			this.self.body.setVelocityX( -speed );
			this.moved = true;
		}
		if ( this.cursors.right.isDown ) {
			this.self.body.setVelocityX( speed );
			this.moved = true;
		}
		if ( this.cursors.up.isDown ) {
			this.self.body.setVelocityY( -speed );
			this.moved = true;
		}
		if ( this.cursors.down.isDown ) {
			this.self.body.setVelocityY( speed );
			this.moved = true;
		}
	}
	
	private player = ( client: moveInfo.clientData ) => {
		const child = this.add.rectangle( client.x, client.y, moveInfo.player.width, moveInfo.player.height,
			parseInt( client.color.substr( 1, 6 ), 16 ) );
		child.setName( client.clientId );
		this.players.add( child );
		child.body.setImmovable();
	};
	
}
