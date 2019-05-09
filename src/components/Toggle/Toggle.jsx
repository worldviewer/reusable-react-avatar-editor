import React from 'react';

const
    Toggle = props => {
        const
            avatarType = props.value,
            isControlledComponent = props.isControlled,

            toggleStyles = {
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
                display: 'inline-block',
                height: '28px',
                lineHeight: '28px',
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
                color: isControlledComponent ? '#e0e0e0' : '#424242',
                fontSize: '14px',
                fontWeight: 'normal',
                pointerEvents: isControlledComponent ? 'none' : 'auto'
            };

        return (
            <div style={{width: '176px'}}>
				<div style={avatarType === 'image' ?
					activeToggleStyles : inactiveToggleStyles}
					className={'noselect ImageToggle ' +
						(avatarType === 'image' ? 'active' : 'inactive')}
					onClick={props.toggleImageHandler}>

					Image
				</div>

				<div style={avatarType === 'creature' ?
					activeToggleStyles : inactiveToggleStyles}
					className={'noselect CreatureToggle ' +
						(avatarType === 'creature' ? 'active' : 'inactive')}
					onClick={props.toggleCreatureHandler}>

					Creature
				</div>
			</div>
        );
    };

export default Toggle;