import React from 'react';
import { MdRotate90DegreesCcw as Rotate } from 'react-icons/md';
import './RotateIcon.scss';

const
	iconStyles = {
		cursor: 'pointer',
		marginLeft: '10px',
		position: 'relative'
	},

	RotateIcon = props =>
		<Rotate color='#00c853' size={25} className='RotateIcon'
			style={{...iconStyles, top: '-5px'}} {...props} />;

export default RotateIcon;
