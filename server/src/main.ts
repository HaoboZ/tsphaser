import { Server } from 'colyseus';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { createServer } from 'http';
import * as logger from 'morgan';
import * as path from 'path';

import config from './config';
import ChatRoom from './examples/chat';
import MoveRoom from './examples/movement';
import TictactoeRoom from './examples/tictactoe';


declare const __basedir;

// set up server
const app: express.Application = express();
const port: any = process.env.PORT || config.port;
const gameServer: Server = new Server( {
	server: createServer( app )
} );
gameServer.listen( port, undefined, undefined, () => {
	if ( config.debug ) console.log( `Listening on port ${port}` );
} );

if ( config.debug ) app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( cookieParser() );

app.use( '/', express.static( path.join( __basedir, 'public' ) ) );
app.use( '/assets', express.static( path.join( __basedir, 'assets' ) ) );
app.use( '/node_modules', express.static( path.join( __basedir, 'node_modules' ) ) );

app.get( '*', ( req, res ) => {
	const index = path.join( __basedir, config.index );
	res.sendFile( index );
} );

gameServer.register( 'chat', ChatRoom ).then();
gameServer.register( 'movement', MoveRoom ).then();
gameServer.register( 'tictactoe', TictactoeRoom ).then();
