export default class Bullet extends Phaser.GameObjects.Image {
	
	speed = 1;
	born = 0;
	direction = 0;
	xSpeed = 0;
	ySpeed = 0;
	
	constructor( scene ) {
		super( scene, 0, 0, 'bullet' );
		
		// @ts-ignore
		this.setSize( 12, 12, true );
	}
	
	
	// Fires a bullet from the player to the reticle
	fire( shooter, target ) {
		this.setPosition( shooter.x, shooter.y ); // Initial position
		this.direction = Math.atan( ( target.x - this.x ) / ( target.y - this.y ) );
		
		// Calculate X and y velocity of bullet to moves it from shooter to target
		if ( target.y >= this.y ) {
			this.xSpeed = this.speed * Math.sin( this.direction );
			this.ySpeed = this.speed * Math.cos( this.direction );
		}
		else {
			this.xSpeed = -this.speed * Math.sin( this.direction );
			this.ySpeed = -this.speed * Math.cos( this.direction );
		}
		
		this.rotation = shooter.rotation; // angle bullet with shooters rotation
		this.born = 0; // Time since new bullet spawned
	}
	
	
	// Updates the position of the bullet each cycle
	// @ts-ignore
	update( time, delta ) {
		this.x += this.xSpeed * delta;
		this.y += this.ySpeed * delta;
		this.born += delta;
		if ( this.born > 1800 ) {
			this.setActive( false );
			this.setVisible( false );
		}
	}
}