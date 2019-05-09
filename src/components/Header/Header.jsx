import React from 'react';

const
	headerStyles = {
		textAlign: 'center'
	},

	Header = props => {
		return props.disabled ? null :
			<h1 style={headerStyles} {...props}>
				{props.value}
			</h1>;
	}

export default Header;
