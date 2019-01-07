import * as React from 'react';
import { CSSProperties } from 'react';

export class Centered extends React.PureComponent {
	
	props: {
		className?: string
		style?: CSSProperties
		children: any
	};
	
	render() {
		return <div
			className={'position-absolute d-flex w-100 h-100 align-items-center justify-content-center ' + ( this.props.className ? this.props.className : '' )}
			style={this.props.style}
		>
			{this.props.children}
		</div>;
	}
	
}

export class Pos extends React.PureComponent {
	
	props: {
		x?: number
		y?: number
		width?: number
		height?: number
		children: any
	};
	
	render() {
		return <div
			className='position-absolute'
			style={{
				left:   this.props.x,
				top:    this.props.y,
				width:  this.props.width,
				height: this.props.height
			}}
		>
			{this.props.children}
		</div>;
	}
	
}

export class List extends React.PureComponent {
	
	props: {
		style?: CSSProperties
		className?: string
		data: Array<any>
		renderItem: ( { item, index } ) => string | React.ReactElement<any>
	};
	
	render() {
		const listItems = this.props.data.map( ( item, index ) =>
			this.props.renderItem( { item, index } )
		);
		
		return <div
			style={this.props.style}
			className={this.props.className}
		>
			{listItems}
		</div>;
	}
	
}

export class Button extends React.PureComponent {
	
	props: {
		onClick: () => void
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
