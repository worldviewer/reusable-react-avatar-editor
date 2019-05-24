import React from 'react';

const Line = ({disabled, ...props}) => {
    const
        lineStyles = {
            borderBottom: '1px solid #e0e0e0',
            margin: '20px 0'
        };

    return disabled ? null :
        <div style={lineStyles} {...props}></div>;
}

export default Line;