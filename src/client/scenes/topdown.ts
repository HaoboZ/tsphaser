import Bullet from '../game/bullet';

export default class Topdown extends Phaser.Scene {
	
	player;
	enemy;
	
	hp1;
	hp2;
	hp3;
	
	reticle;
	
	moveKeys;
	
	playerBullets;
	enemyBullets;
	// time = 0;
	
	constructor() {
		super( { key: 'Topdown' } );
	}
	
	public preload() {
		// Load in images and sprites
		this.load.spritesheet( 'player_handgun', 'assets/sprites/player_handgun.png',
			{ frameWidth: 66, frameHeight: 60 }
		); // Made by tokkatrain: https://tokkatrain.itch.io/top-down-basic-set
		this.load.image( 'bullet', 'assets/sprites/bullets/bullet6.png' );
		this.load.image( 'target', 'assets/demoscene/ball.png' );
		this.load.image( 'background', 'assets/skies/underwater1.png' );
	}
	
	public create() {
		// Set world bounds
		this.physics.world.setBounds( 0, 0, 1600, 1200 );
		
		// Add 2 groups for Bullet objects
		this.playerBullets = this.physics.add.group( { classType: Bullet, runChildUpdate: true } );
		this.enemyBullets = this.physics.add.group( { classType: Bullet, runChildUpdate: true } );
		
		// Add background player, enemy, reticle, healthpoint sprites
		let background = this.add.image( 800, 600, 'background' );
		this.player = this.physics.add.sprite( 800, 600, 'player_handgun' );
		this.enemy = this.physics.add.sprite( 300, 600, 'player_handgun' );
		this.reticle = this.physics.add.sprite( 800, 700, 'target' );
		this.hp1 = this.add.image( -350, -250, 'target' ).setScrollFactor( 0 );
		this.hp2 = this.add.image( -300, -250, 'target' ).setScrollFactor( 0 );
		this.hp3 = this.add.image( -250, -250, 'target' ).setScrollFactor( 0 );
		
		// Set image/sprite properties
		background.setOrigin( 0.5, 0.5 ).setDisplaySize( 1600, 1200 );
		this.player.setOrigin( 0.5, 0.5 ).setDisplaySize( 132, 120 ).setCollideWorldBounds( true ).setDrag( 500, 500 );
		this.enemy.setOrigin( 0.5, 0.5 ).setDisplaySize( 132, 120 ).setCollideWorldBounds( true );
		this.reticle.setOrigin( 0.5, 0.5 ).setDisplaySize( 25, 25 ).setCollideWorldBounds( true );
		this.hp1.setOrigin( 0.5, 0.5 ).setDisplaySize( 50, 50 );
		this.hp2.setOrigin( 0.5, 0.5 ).setDisplaySize( 50, 50 );
		this.hp3.setOrigin( 0.5, 0.5 ).setDisplaySize( 50, 50 );
		
		// Set sprite letiables
		this.player.health = 3;
		this.enemy.health = 3;
		this.enemy.lastFired = 0;
		
		// Set camera properties
		this.cameras.main.zoom = 0.5;
		this.cameras.main.startFollow( this.player );
		
		// Creates object for input with WASD kets
		this.moveKeys = this.input.keyboard.addKeys( {
			'up':    Phaser.Input.Keyboard.KeyCodes.W,
			'down':  Phaser.Input.Keyboard.KeyCodes.S,
			'left':  Phaser.Input.Keyboard.KeyCodes.A,
			'right': Phaser.Input.Keyboard.KeyCodes.D
		} );
		
		// Enables movement of player with WASD keys
		this.input.keyboard.on( 'keydown_W', ( event ) => {
			this.player.setAccelerationY( -800 );
		} );
		this.input.keyboard.on( 'keydown_S', ( event ) => {
			this.player.setAccelerationY( 800 );
		} );
		this.input.keyboard.on( 'keydown_A', ( event ) => {
			this.player.setAccelerationX( -800 );
		} );
		this.input.keyboard.on( 'keydown_D', ( event ) => {
			this.player.setAccelerationX( 800 );
		} );
		
		// Stops player acceleration on uppress of WASD keys
		this.input.keyboard.on( 'keyup_W', ( event ) => {
			if ( this.moveKeys[ 'down' ].isUp )
				this.player.setAccelerationY( 0 );
		} );
		this.input.keyboard.on( 'keyup_S', ( event ) => {
			if ( this.moveKeys[ 'up' ].isUp )
				this.player.setAccelerationY( 0 );
		} );
		this.input.keyboard.on( 'keyup_A', ( event ) => {
			if ( this.moveKeys[ 'right' ].isUp )
				this.player.setAccelerationX( 0 );
		} );
		this.input.keyboard.on( 'keyup_D', ( event ) => {
			if ( this.moveKeys[ 'left' ].isUp )
				this.player.setAccelerationX( 0 );
		} );
		
		// Fires bullet from player on left click of mouse
		this.input.on( 'pointerdown', ( pointer, time, lastFired ) => {
			if ( this.player.active === false )
				return;
			
			// Get bullet from bullets group
			let bullet = this.playerBullets.get().setActive( true ).setVisible( true );
			
			if ( bullet ) {
				bullet.fire( this.player, this.reticle );
				this.physics.add.collider( this.enemy, bullet, this.enemyHitCallback );
			}
		}, this );
		
		// Pointer lock will only work after mousedown
		this.sys.game.canvas.addEventListener( 'mousedown', () => {
			this.sys.game.input.mouse.requestPointerLock();
		} );
		
		// Exit pointer lock when Q or escape (by default) is pressed.
		this.input.keyboard.on( 'keydown_Q', ( event ) => {
			if ( this.game.input.mouse.locked )
				this.game.input.mouse.releasePointerLock();
		} );
		
		// Move reticle upon locked pointer move
		this.input.on( 'pointermove', ( pointer ) => {
			if ( this.input.mouse.locked ) {
				this.reticle.x += pointer.movementX;
				this.reticle.y += pointer.movementY;
			}
		} );
		
	}
	
	enemyHitCallback( enemyHit, bulletHit ) {
		// Reduce health of enemy
		if ( bulletHit.active === true && enemyHit.active === true ) {
			enemyHit.health = enemyHit.health - 1;
			console.log( "Enemy hp: ", enemyHit.health );
			
			// Kill enemy if health <= 0
			if ( enemyHit.health <= 0 ) {
				enemyHit.setActive( false ).setVisible( false );
			}
			
			// Destroy bullet
			bulletHit.setActive( false ).setVisible( false );
		}
	}
	
	playerHitCallback = ( playerHit, bulletHit ) => {
		// Reduce health of player
		if ( bulletHit.active === true && playerHit.active === true ) {
			playerHit.health = playerHit.health - 1;
			console.log( "Player hp: ", playerHit.health );
			
			// Kill hp sprites and kill player if health <= 0
			if ( playerHit.health == 2 ) {
				this.hp3.destroy();
			}
			else if ( playerHit.health == 1 ) {
				this.hp2.destroy();
			}
			else {
				this.hp1.destroy();
				// Game over state should execute here
			}
			
			// Destroy bullet
			bulletHit.setActive( false ).setVisible( false );
		}
	};
	
	enemyFire( enemy, player, time, gameObject ) {
		if ( enemy.active === false ) {
			return;
		}
		
		if ( ( time - enemy.lastFired ) > 1000 ) {
			enemy.lastFired = time;
			
			// Get bullet from bullets group
			let bullet = this.enemyBullets.get().setActive( true ).setVisible( true );
			
			if ( bullet ) {
				bullet.fire( enemy, player );
				// Add collider between bullet and player
				gameObject.physics.add.collider( player, bullet, this.playerHitCallback );
			}
		}
	}

// Ensures sprite speed doesnt exceed maxVelocity while update is called
	constrainVelocity( sprite, maxVelocity ) {
		if ( !sprite || !sprite.body )
			return;
		
		let angle, currVelocitySqr, vx, vy;
		vx = sprite.body.velocity.x;
		vy = sprite.body.velocity.y;
		currVelocitySqr = vx * vx + vy * vy;
		
		if ( currVelocitySqr > maxVelocity * maxVelocity ) {
			angle = Math.atan2( vy, vx );
			vx = Math.cos( angle ) * maxVelocity;
			vy = Math.sin( angle ) * maxVelocity;
			sprite.body.velocity.x = vx;
			sprite.body.velocity.y = vy;
		}
	}

// Ensures reticle does not move offscreen
	constrainReticle( reticle ) {
		let distX = reticle.x - this.player.x; // X distance between player & reticle
		let distY = reticle.y - this.player.y; // Y distance between player & reticle
		
		// Ensures reticle cannot be moved offscreen (player follow)
		if ( distX > 800 )
			reticle.x = this.player.x + 800;
		else if ( distX < -800 )
			reticle.x = this.player.x - 800;
		
		if ( distY > 600 )
			reticle.y = this.player.y + 600;
		else if ( distY < -600 )
			reticle.y = this.player.y - 600;
	}
	
	update( time, delta ) {
		// Rotates player to face towards reticle
		this.player.rotation = Phaser.Math.Angle.Between( this.player.x, this.player.y, this.reticle.x, this.reticle.y );
		
		// Rotates enemy to face towards player
		this.enemy.rotation = Phaser.Math.Angle.Between( this.enemy.x, this.enemy.y, this.player.x, this.player.y );
		
		//Make reticle move with player
		this.reticle.body.velocity.x = this.player.body.velocity.x;
		this.reticle.body.velocity.y = this.player.body.velocity.y;
		
		// Constrain velocity of player
		this.constrainVelocity( this.player, 500 );
		
		// Constrain position of constrainReticle
		this.constrainReticle( this.reticle );
		
		// Make enemy fire
		this.enemyFire( this.enemy, this.player, time, this );
	}
	
}
