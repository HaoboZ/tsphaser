import * as React from 'react';
import { Button, CenterV } from '../interface/components';

export default class Selection extends React.PureComponent {
	
	props: {
		switch: ( number ) => void
	};
	
	render() {
		return <CenterV width={400}>
			<Button onClick={() => {
				this.props.switch( 1 );
			}}>Quick Match</Button>
			<Button onClick={() => {
				this.props.switch( 2 );
			}}>Join Existing</Button>
			<Button onClick={() => {
				this.props.switch( 3 );
			}}>Create Game</Button>
		</CenterV>;
	}
	
}
