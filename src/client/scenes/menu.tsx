import * as React from 'react';
import Socket from '../connect/socket';
import Interface from '../interface/interface';

export default class Menu extends Phaser.Scene {
	
	room = 'test';
	
	constructor() {
		super( 'Menu' );
	}
	
	public create() {
		Socket.init( this.sys.game );
		
		Interface.render(
			<div className='d-flex justify-content-center w-100 h-100 align-items-center'>
				<input type='text' onChange={( e ) => this.room = e.target.value}/>
				<button
					style={{ fontSize: 30 }}
					onClick={() => {
						Socket.socket.emit( 'join', this.room );
					}}
				>
					Join
				</button>
				<button
					style={{ fontSize: 30 }}
					onClick={() => {
						Socket.socket.emit( 'leave', Socket.room );
					}}
				>
					Leave
				</button>
			</div>
		);
	}
	
}
