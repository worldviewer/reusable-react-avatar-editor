import React from 'react';

const
	headerStyles = {
		textAlign: 'center'
	},

	Header = props =>
		<h1 style={headerStyles} {...props}>
			Edit {props.value === 'creature' ? 'Creature' : 'Image'} Avatar
		</h1>;

export default Header;
