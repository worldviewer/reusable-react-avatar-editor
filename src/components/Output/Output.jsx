import React from 'react';

const Output = ({display, children, ...props}) => {
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

    return display ?
        <span style={panelStyles} {...props}>
			<span style={wrapperStyles}>
				{children}
			</span>
		</span> : null;
};

export default Output;