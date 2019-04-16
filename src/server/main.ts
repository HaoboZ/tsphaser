import { Server } from 'colyseus';
import * as express from 'express';
import { createServer } from 'http';
import * as path from 'path';
import config from './config';
import ChatRoom from './examples/chat/chatRoom';

declare const __basedir;

// set up server
const app: express.Application = express();
const port: any = process.env.PORT || config.port;
const gameServer: Server = new Server( {
	server: createServer( app )
} );
gameServer.listen( port, undefined, undefined,
	() => {
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

gameServer.register( 'chat', ChatRoom ).then( ( handler ) => {
	handler
		.on( 'create', ( room ) => console.log( 'room created:', room.roomId ) )
		.on( 'dispose', ( room ) => console.log( 'room disposed:', room.roomId ) )
		.on( 'join', ( room, client ) => console.log( client.id, 'joined', room.roomId ) )
		.on( 'leave', ( room, client ) => console.log( client.id, 'left', room.roomId ) );
} );
