import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as SocketIO from 'socket.io';

import Main from './main';
import Socket from './connect/socket';

import config from './config';

declare let __basedir;

// set up server
const app: express.Application = express();
const port = process.env.PORT || config.port;
const server: http.Server = app.listen( port, () => {
		if ( config.debug )
			console.log( `Listening on port ${port}` );
	}
);

app.get( '/', ( req, res ) => {
	let index = path.join( __basedir, 'index.html' );
	res.sendFile( index );
} );

app.use( '/', express.static( __basedir ) );

// socket.io
Socket.init( SocketIO( server ) );

Main.init();