import React from 'react';

const
    headerStyles = {
        textAlign: 'center'
    },

    Header = ({disabled, value, ...rest}) => {
        return disabled ? null :
            <h1 style={headerStyles} {...rest}>
				{value}
			</h1>;
    }

export default Header;