import config from './config';

const Main = new class {
	
	init() {
		if ( config.debug )
			console.log( 'main program' );
	}
	
	
};
export default Main;