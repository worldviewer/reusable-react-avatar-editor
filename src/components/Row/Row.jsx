import React from 'react';

const
	rowStyles = {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: '20px'
	},

	Row = props =>
		<div style={rowStyles} {...props}>{props.children}</div>;

export default Row;
