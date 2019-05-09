import React from 'react';

const Output = props => {
    const
        panelStyles = {
            height: '100%',
            padding: '10px'
        },

        wrapperStyles = {
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center'
        };

    return props.display ?
        <span style={panelStyles}>
			<span style={wrapperStyles}>
				{props.children}
			</span>
		</span> : null;
};

export default Output;