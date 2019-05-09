import React from 'react';

const
	containerStyles = {
		fontFamily: 'sans-serif',
		position: 'relative',
		transform: 'translateY(-50%)',
		top: '50%',
		width: '100%'
	},

	Container = props =>
		<div style={containerStyles} className='AvatarEditor' {...props}>
			{props.children}
		</div>;

export default Container;