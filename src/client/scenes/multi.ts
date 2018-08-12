import Socket from '../connect/socket';

export default class Multi extends Phaser.Scene {
	
	ship: Phaser.Physics.Arcade.Image;
	otherPlayers;
	
	cursors;
	
	constructor() {
		super( { key: 'Multi' } );
	}
	
	preload() {
		this.load.image( 'ship', 'assets/games/asteroids/ship.png' );
		this.load.image( 'otherPlayer', 'assets/games/asteroids/asteroid1.png' );
	}
	
	create() {
		this.otherPlayers = this.physics.add.group();
		Socket.socket.on( 'currentPlayers', ( players ) => {
			Object.keys( players ).forEach( ( id ) => {
				if ( players[ id ].playerId === Socket.socket.id ) {
					this.addPlayer( this, players[ id ] );
				} else {
					this.addOtherPlayers( this, players[ id ] );
				}
			} );
		} );
		Socket.socket.on( 'newPlayer', ( playerInfo ) => {
			this.addOtherPlayers( this, playerInfo );
		} );
		Socket.socket.on( 'playerMoved', ( playerInfo ) => {
			this.otherPlayers.getChildren().forEach( ( otherPlayer ) => {
				if ( playerInfo.playerId === otherPlayer.playerId ) {
					otherPlayer.setRotation( playerInfo.rotation );
					otherPlayer.setPosition( playerInfo.x, playerInfo.y );
				}
			} );
		} );
		Socket.socket.on( 'disconnect', ( playerId ) => {
			this.otherPlayers.getChildren().forEach( ( otherPlayer ) => {
				if ( playerId === otherPlayer.playerId ) {
					otherPlayer.destroy();
				}
			} );
		} );
		Socket.socket.emit( 'start' );
		
		this.cursors = this.input.keyboard.createCursorKeys();
	}
	
	addPlayer( self, playerInfo ) {
		this.ship = this.physics.add.image( playerInfo.x, playerInfo.y, 'ship' )
			.setOrigin( 0.5, 0.5 )
			.setDisplaySize( 100, 100 );
		if ( playerInfo.team === 'blue' ) {
			this.ship.setTint( '#0000ff'.toColor() );
		} else {
			this.ship.setTint( '#ff0000'.toColor() );
		}
		this.ship.setDrag( 100 );
		this.ship.setAngularDrag( 100 );
		this.ship.setMaxVelocity( 200 );
	}
	
	addOtherPlayers( self, playerInfo ) {
		const otherPlayer = this.add.sprite( playerInfo.x, playerInfo.y, 'otherPlayer' )
			.setOrigin( 0.5, 0.5 )
			.setDisplaySize( 100, 100 );
		if ( playerInfo.team === 'blue' ) {
			otherPlayer.setTint( '#0000ff'.toColor() );
		} else {
			otherPlayer.setTint( '#ff0000'.toColor() );
		}
		// @ts-ignore
		otherPlayer.playerId = playerInfo.playerId;
		this.otherPlayers.add( otherPlayer );
	}
	
	update() {
		if ( this.ship ) {
			if ( this.cursors.left.isDown ) {
				this.ship.setAngularVelocity( -150 );
			} else if ( this.cursors.right.isDown ) {
				this.ship.setAngularVelocity( 150 );
			} else {
				this.ship.setAngularVelocity( 0 );
			}
			
			if ( this.cursors.up.isDown ) {
				// @ts-ignore
				this.physics.velocityFromRotation( this.ship.rotation + 1.5, 100, this.ship.body.acceleration );
			} else {
				this.ship.setAcceleration( 0 );
			}
			
			this.physics.world.wrap( this.ship, 5 );
			
			// emit player movement
			var x = this.ship.x;
			var y = this.ship.y;
			var r = this.ship.rotation;
			// @ts-ignore
			if ( this.ship.oldPosition && ( x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation ) ) {
				Socket.socket.emit( 'playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation } );
			}
			
			// save old position data
			// @ts-ignore
			this.ship.oldPosition = {
				x:        this.ship.x,
				y:        this.ship.y,
				rotation: this.ship.rotation
			};
		}
	}
	
}