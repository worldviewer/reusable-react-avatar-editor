import React, { Component } from 'react';
import Row from '../Row/Row';

class Toggle extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    static Image = ({ avatarType, children }) =>
        (avatarType === 'image' ? children : null);

    static Creature = ({ avatarType, children }) =>
        (avatarType === 'creature' ? children : null);

    render() {
        const
            avatarType = this.props.value,
            { isControlledComponent,
                toggleImageHandler,
                toggleCreatureHandler } = this.props,

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
            },

            wrapperStyles = {
                display: 'block',
                margin: '0 auto',
                width: '176px'
            },

            buttonStyles = {
                marginBottom: '20px',
                width: '176px'
            };

        return (
            <div style={wrapperStyles}>
                <Row style={buttonStyles}>
                    <div style={avatarType === 'image' ?
                        activeToggleStyles : inactiveToggleStyles}
                        className={'noselect ImageToggle ' +
                            (avatarType === 'image' ? 'active' : 'inactive')}
                        onClick={toggleImageHandler}>

                        Image
                    </div>

                    <div style={avatarType === 'creature' ?
                        activeToggleStyles : inactiveToggleStyles}
                        className={'noselect CreatureToggle ' +
                            (avatarType === 'creature' ? 'active' : 'inactive')}
                        onClick={toggleCreatureHandler}>

                        Creature
                    </div>
                </Row>

                <Row>
                    { React.Children.map(this.props.children, child =>
                        React.cloneElement(child, { avatarType })) }
                </Row>
            </div>
        );
    };
}

export default Toggle;