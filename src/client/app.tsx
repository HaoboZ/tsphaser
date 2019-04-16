import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

class App extends React.PureComponent {
	
	render() {
		return <Provider store={store}>
			<div
				style={{
					display:        'flex',
					alignContent:   'center',
					justifyContent: 'center',
					flexDirection:  'row',
					height:         '100vh'
				}}
			>
				{/*<UI/>*/}
				{/*<Game/>*/}
			</div>
		</Provider>;
	}
	
}

ReactDOM.render( <App/>, $( '#root' )[ 0 ] );
