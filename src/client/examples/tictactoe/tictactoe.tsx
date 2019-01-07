import * as React from 'react';
import { roomInfo, tictactoeInfo } from '../../../shared/events';
import Socket from '../../connect/socket';
import Interface from '../../interface/interface';
import Interact from './interact';
import TictactoeRoom from './tictactoeRoom';

export default class Tictactoe extends Phaser.Scene {
	
	room: TictactoeRoom;
	
	self: Phaser.GameObjects.Text;
	enemy: Phaser.GameObjects.Text;
	
	constructor() {
		super( 'Tictactoe' );
	}
	
	public create() {
		Interface.render( <Interact/> );
		
		Socket.events.on( tictactoeInfo.room.join, ( room: TictactoeRoom ) => {
			this.room = room;
			
			this.draw();
			room.events.on( roomInfo.clientJoin, () => this.draw() );
			
			room.events.on( roomInfo.leave, () => {
				this.room = null;
			} );
		} );
	}
	
	public init() {
	
	}
	
	public clear() {
	
	}
	
	private draw() {
		this.room.clients.loop( ( client ) => {
			if ( client.clientId === Socket.id )
				this.self = this.add.text( 1000, 600, client.clientName );
			else
				this.enemy = this.add.text( 100, 100, client.clientName );
		} );
	}
	
}
