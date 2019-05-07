import React from 'react';

const
	buttonStyles = {
		borderRadius: '4px',
		color: 'white',
		cursor: 'pointer',
		fontSize: '14px',
		fontWeight: 'bold',
		height: '35px',
		width: '188px'
	},

	Button = props =>
		<button className='Button' style={buttonStyles} {...props}>
			{props.children}
		</button>;

export default Button;