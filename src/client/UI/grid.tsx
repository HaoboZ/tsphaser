import * as React from 'react';


interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	row: string | number
	column: string | number
}

export default class Grid extends React.PureComponent<Props> {
	
	render() {
		let { row, column, children, style, ...props } = this.props;
		
		if ( typeof row === 'number' ) {
			row = `repeat(${row} , 1fr)`;
		}
		if ( typeof column === 'number' ) {
			column = `repeat(${column} , 1fr)`;
		}
		// @ts-ignore
		return <div
			{...props}
			style={{
				display:      'grid',
				gridTemplate: `${row} / ${column}`,
				justifyItems: 'center',
				alignItems:   'center',
				width:        '100%',
				height:       '100%',
				...style
			}}
		>
			{children}
		</div>;
	}
	
}
