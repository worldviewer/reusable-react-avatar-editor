import React from 'react';

const
    rowStyles = {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
    },

    Row = ({children, ...props}) =>
        <div style={rowStyles} {...props}>{children}</div>;

export default Row;