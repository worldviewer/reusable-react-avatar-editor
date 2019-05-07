import React from 'react';
import { MdRotate90DegreesCcw as Rotate } from 'react-icons/md';
import './RotateIcon.scss';

const
	RotateIcon = props => {
		const
			iconStyles = {
				cursor: 'pointer',
				marginLeft: '10px',
				pointerEvents: props.disabled ? 'none' : 'auto',
				position: 'relative'
			},

			color = props.disabled ? '#e0e0e0' : '#00c853';

		return (
			<Rotate color={color} size={25} className='RotateIcon'
				style={{...iconStyles, top: '-5px'}} {...props} />
		);
	}

export default RotateIcon;
