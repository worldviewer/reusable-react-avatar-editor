import React from 'react';

const
	Button = props => {
		const
			{ isControlled, ...rest } = props,

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

			delete rest.isControlled;

		return (
			<button
				className='Button'
				style={buttonStyles}
				disabled={isControlled} {...rest}>

				{props.children}
			</button>
		);
	}

export default Button;
