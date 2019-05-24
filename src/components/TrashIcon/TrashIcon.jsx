import React from 'react';
import { FaTrash as TrashCan } from 'react-icons/fa';
import './TrashIcon.scss';

const
    iconStyles = {
        cursor: 'pointer',
        marginLeft: '10px',
        position: 'relative',
        top: '-3px'
    },

    TrashIcon = props =>
        <TrashCan color='#00c853' size={20} className='TrashIcon'
			style={iconStyles} {...props} />;

export default TrashIcon;