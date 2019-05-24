import React from 'react';

const Results = ({windowWidth, children, ...props}) => {
    const
        resultsStyles = {
            height: '40vh',
            display: 'flex',
            flexWrap: windowWidth > 800 ? 'nowrap' : 'wrap',
            justifyContent: 'space-evenly',
            overflow: windowWidth > 800 ? 'hidden' : 'scroll'
        };

    return (
        <div>
			{ windowWidth > 800 ?
				<div style={resultsStyles}>
					{children}
				</div> :

				<div>{children}</div> }
		</div>
    );
};

export default Results;