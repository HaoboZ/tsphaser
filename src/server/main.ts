import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as SocketIO from 'socket.io';
import config from './config';

import Client from './connect/client';

import Socket from './connect/socket';
import ChatRoom from './examples/chat/chatRoom';
import MoveRoom from './examples/movement/moveRoom';
import { TictactoeEvents } from './examples/tictactoe/tictactoeRoom';

declare const __basedir;

// set up server
const app: express.Application = express();
const port = process.env.PORT || config.port;
const server: http.Server = app.listen( port, () => {
		if ( config.debug ) console.log( `Listening on port ${port}` );
	}
);

app.get( '/', ( req, res ) => {
	const index = path.join( __basedir, config.index );
	res.sendFile( index );
} );

app.use( '/', express.static( path.join( __basedir, 'public' ) ) );
app.use( '/assets', express.static( path.join( __basedir, 'assets' ) ) );
app.use( '/node_modules', express.static( path.join( __basedir, 'node_modules' ) ) );

// socket.io
Socket.init( SocketIO( server ) );

new ChatRoom( {
	id:     'chatTest',
	remove: false
} );

new MoveRoom( {
	id:     'moveTest',
	remove: false
} );

Socket.events.on( 'connect', ( client: Client ) => {
	client.multiOn( TictactoeEvents );
} );
