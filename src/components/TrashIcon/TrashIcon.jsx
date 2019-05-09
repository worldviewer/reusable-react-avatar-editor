import React from 'react';
import { FaTrash as TrashCan } from 'react-icons/fa';
import './TrashIcon.scss';

const
    iconStyles = {
        cursor: 'pointer',
        marginLeft: '10px',
        position: 'relative'
    },

    TrashIcon = props =>
        <TrashCan color='#00c853' size={20} className='TrashIcon'
			style={{...iconStyles, top: '-3px'}} {...props} />;

export default TrashIcon;