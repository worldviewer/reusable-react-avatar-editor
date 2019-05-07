import React from 'react';

const
	toggleStyles = {
		border: '1px solid #e0e0e0',
		display: 'inline-block',
		height: '28px',
		lineHeight: '28px',
		cursor: 'pointer',
		textAlign: 'center',
		width: '86px'
	},

	activeToggleStyles = {
		...toggleStyles,
		border: '1px solid #00c853',
		color: 'white',
		fontSize: '14px',
		fontWeight: 'bold',
	},

	inactiveToggleStyles = {
		...toggleStyles,
		color: '#424242',
		fontSize: '14px',
		fontWeight: 'normal'
	},

	Toggle = props =>
		<div style={{width: '176px'}}>
			<div style={props.value === 'image' ?
				activeToggleStyles : inactiveToggleStyles}
				className={'noselect ImageToggle ' +
					(props.value === 'image' ? 'active' : 'inactive')}
				onClick={props.toggleImageHandler}>

				Image
			</div>

			<div style={props.value === 'creature' ?
				activeToggleStyles : inactiveToggleStyles}
				className={'noselect CreatureToggle ' +
					(props.value === 'creature' ? 'active' : 'inactive')}
				onClick={props.toggleCreatureHandler}>

				Creature
			</div>
		</div>;

export default Toggle;
