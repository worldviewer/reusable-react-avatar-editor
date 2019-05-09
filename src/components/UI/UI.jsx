import React from 'react';

const UI = props => {
    const
        desktopUIStyles = {
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            height: '60vh',
            justifyContent: 'center'
        },

        mobileUIStyles = {
            borderBottom: '1px solid #e0e0e0'
        };

    return (
        <div style={props.windowWidth > 800 ? desktopUIStyles : mobileUIStyles}>
			{props.children}
		</div>
    );
};

export default UI;