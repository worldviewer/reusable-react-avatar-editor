import React from 'react';

const
    Button = ({isControlled, children, ...props}) => {

    const
        buttonStyles = {
            backgroundColor: isControlled ? '#b4eecd' : null,
            borderColor: isControlled ? '#b4eecd' : null,
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            height: '35px',
            userSelect: 'none',
            width: '188px'
        };

        return (
            <button
				className='Button'
				style={buttonStyles}
				disabled={isControlled} {...props}>

				{children}
			</button>
        );
    }

export default Button;