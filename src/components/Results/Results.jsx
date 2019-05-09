import React from 'react';

const Results = props => {
	const
		resultsStyles = {
			height: '40vh',
			display: 'flex',
			flexWrap: props.windowWidth > 800 ? 'nowrap' : 'wrap',
			justifyContent: 'space-evenly',
			overflow: props.windowWidth > 800 ? 'hidden' : 'scroll'
		};

	return (
		<div>
			{ props.windowWidth > 800 ?
				<div style={resultsStyles}>
					{props.children}
				</div> :

				<div>{props.children}</div> }
		</div>
	);
};

export default Results;
