import React from 'react';

const Line = props => {
    const
        lineStyles = {
            borderBottom: '1px solid #e0e0e0',
            margin: '20px 0'
        };

    return props.disabled ? null :
        <div style={lineStyles}></div>;
}

export default Line;