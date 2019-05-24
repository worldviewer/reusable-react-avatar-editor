import React from 'react';
import { MdRotate90DegreesCcw as Rotate } from 'react-icons/md';
import './RotateIcon.scss';

const
    RotateIcon = ({disabled, ...props}) => {
        const
            iconStyles = {
                cursor: 'pointer',
                marginLeft: '10px',
                pointerEvents: disabled ? 'none' : 'auto',
                position: 'relative',
                top: '-5px'
            },

            color = disabled ? '#e0e0e0' : '#00c853';

        return (
            <Rotate color={color} size={25} className='RotateIcon'
				style={iconStyles} {...props} />
        );
    }

export default RotateIcon;