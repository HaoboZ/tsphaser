import { ERROR, error } from './socket';

import Client from './client';

import config from '../config';

export default abstract class Room {
	
	public static list: { [ id: string ]: Room } = {};
	
	public id: string;
	private password: string;
	private name: string;
	private admin: string;
	
	private remove: boolean;
	
	private timestamp: number;
	
	public clients: { [ id: string ]: Client } = {};
	
	private _events: { [ id: string ]: { [ event: string ]: any } } = {};
	
	constructor( name: string, password?: string, remove: boolean = true, admin?: string ) {
		this.id = ( function ( a, b ) {
			// noinspection StatementWithEmptyBodyJS
			for ( b = a = ''; a++ < 36; b += a * 51 & 52 ? ( a ^ 15 ? 8 ^ Math.random() * ( a ^ 20 ? 16 : 4 ) : 4 ).toString( 16 ) : '-' ) ;
			return b
		} )();
		this.password = password;
		this.remove = remove;
		this.timestamp = Date.now();
		
		Room.list[ this.id ] = this;
		
		if ( config.debug ) console.log( `room ${this.id} created` );
	}
	
	public canJoin( client: Client, password: string ) {
		return !this.clients.hasOwnProperty( client.id )
			&& ( !this.password || this.password === password );
	}
	
	public join( client: Client, password: string ) {
		// verify password
		if ( !this.canJoin( client, password ) ) {
			error( client.socket, ERROR.Join );
			return;
		}
		
		client.socket.join( this.id, ( err ) => {
			if ( err ) {
				error( client.socket, err );
				return;
			}
			
			this._events[ client.id ] = {};
			this._events[ client.id ][ 'leave' ] = ( room: string ) => {
				if ( room === this.id ) this.leave( client );
			};
			client.socket.on( 'leave', this._events[ client.id ][ 'leave' ] );
			
			this.clients[ client.id ] = client;
			client.rooms[ this.id ] = this;
			
			// confirm joined room
			client.socket.emit( 'join', this.id );
			// tell other clients
			client.socket.in( this.id ).emit( 'enter', this.id, client.id );
			if ( config.debug ) console.log( `${client.id} joined room ${this.name}` );
		} );
	}
	
	public leave( client: Client, disconnect?: boolean, close?: boolean ) {
		client.socket.leave( this.id, ( err ) => {
			if ( err ) {
				error( client.socket, err );
				return;
			}
			
			delete this.clients[ client.id ];
			
			// remove all events
			if ( !disconnect )
				for ( let event in this._events[ client.id ] )
					client.socket.removeListener( event, this._events[ client.id ][ event ] );
			
			// remove all clients if admin leaves
			if ( this.admin === client.id )
				for ( let client in this.clients )
					this.leave( this.clients[ client ], false, true );
			
			// removes room if all clients leave
			if ( this.remove && !Object.keys( this.clients ).length ) delete Room.list[ this.id ];
			
			// confirm leave room
			if ( !disconnect ) client.socket.emit( 'leave', this.id );
			// tell other clients
			if ( !close ) client.socket.in( this.id ).emit( 'exit', this.id, client.id );
			if ( config.debug ) console.log( `${client.id} left room ${this.name}` );
		} );
	}
	
}
