import * as React from 'react';

export class CenterV extends React.PureComponent {
	
	props: {
		width: number,
		children: any
	};
	
	render() {
		return <div className='d-flex h-100 align-items-center'>
			<div style={{ width: this.props.width }} className='container-fluid border'>
				{this.props.children}
			</div>
		</div>;
	}
	
}

export class Button extends React.PureComponent {
	
	props: {
		onClick: () => void,
		children: any
	};
	
	render() {
		return <div className='row justify-content-center m-3'>
			<button className='btn btn-lg btn-primary' onClick={this.props.onClick}>
				{this.props.children}
			</button>
		</div>
	}
	
}
