import * as express from 'express';
import * as path from 'path';
// import * as io from 'socket.io';
import * as http from 'http';

declare let __basedir;

// load settings
import config from './config';

// set up server
const app: express.Application = express();
const port = process.env.PORT || config.port;
const server: http.Server = app.listen(port, () =>
	console.log(`Listening on port ${port}`)
);

app.get('/', (req, res) => {
	let index = path.join(__basedir, 'index.html');
	res.sendFile(index);
});

app.use('/', express.static(__basedir));

// socket.io
// const sio: SocketIO.Server = io(server);