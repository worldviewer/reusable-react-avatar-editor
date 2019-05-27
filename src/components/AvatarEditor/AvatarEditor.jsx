import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from '../Row/Row';
import Header from '../Header/Header';
import Toggle from '../Toggle/Toggle';
import ImageEditor from '../ImageEditor/ImageEditor';
import CreatureEditor from '../CreatureEditor/CreatureEditor';
import { creaturePropType } from '../../libs/propTypes';
import { logTitle } from '../../libs/utils';
import './AvatarEditor.scss';

class AvatarEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            avatarType: 'image',
            creature: {
                form: {
                    pattern: 0,
                    colors: 0
                },
                mouth: {
                    pattern: 0,
                    colors: 0
                },
                eye: {
                    pattern: 0,
                    colors: 0
                }
            },
            image: {
                file: null,
                zoom: 0,
                rotation: 0,
                position: {
                    x: 0.5,
                    y: 0.5
                }
            }
        };

        this.props = props;
    }

    toggleImage = () => {
        logTitle('AvatarEditor: Toggling to image');

        this.setState({ avatarType: 'image' });
    }

    toggleCreature = () => {
        logTitle('AvatarEditor: Toggling to creature');

        this.setState({ avatarType: 'creature' });
    }

    componentDidMount() {
        const { defaultAvatarType, avatarType, image, creature } = this.props;

        if (avatarType) {
            this.setState({ avatarType });

        } else if (image) {
            this.toggleImage();

        } else if (creature) {
            this.toggleCreature();

        } else if (defaultAvatarType) {
            this.setState({
                avatarType: defaultAvatarType
            });

        } else if (this.props.defaultImage) {
            logTitle('AvatarEditor: componentDidMount');
            console.log('Setting default image');
            console.log('');

            this.toggleImage();

        } else if (this.props.defaultCreature) {
            logTitle('AvatarEditor: componentDidMount');
            console.log('Setting default creature');
            console.log('');

            this.toggleCreature();
        }
    }

    render = () => {
        const {
                defaultImage,
                defaultCreature,
                defaultZoom,
                defaultRotation,
                defaultPosition,

                forceImage,
                forceCreature,
                forceZoom,
                forceRotation,
                forcePosition,

                onUpdateCreature,
                onUpdateImage,

                validAttachmentTypes,
                maxSize,
                onDropRejected,
                onError
            } = this.props,

            {
                file,
                zoom,
                rotation,
                position
            } = this.state.image,

            creature = this.state.creature,

            avatarType = this.props.avatarType ? this.props.avatarType :
                this.state.avatarType,

            isControlled = ['image', 'creature'].includes(this.props.avatarType) ?
                true : false,

            header = this.state.avatarType === 'image' ?
                'Edit Image Avatar' : 'Edit Creature Avatar';

        return (
            <div className='AvatarEditor'>
				<Row>
					<Header value={header} />
				</Row>

				<Row>
					<Toggle
						value={avatarType}
						isControlled={isControlled}
						toggleImageHandler={this.toggleImage}
						toggleCreatureHandler={this.toggleCreature}>

                        <Toggle.Image>
                            <ImageEditor
                                defaultImage={defaultImage}
                                defaultZoom={defaultZoom}
                                defaultRotation={defaultRotation}
                                defaultPosition={defaultPosition}

                                forceImage={forceImage}
                                forceZoom={forceZoom}
                                forceRotation={forceRotation}
                                forcePosition={forcePosition}

                                file={file}
                                zoom={zoom}
                                rotation={rotation}
                                position={position}

                                changeImageProperty={({key, value}) =>
                                    this.setState(prevState => ({
                                        image: {
                                            ...prevState.image,
                                            [key]: value
                                        }
                                    }))}

                                onUpdateImage={onUpdateImage}
                                validAttachmentTypes={validAttachmentTypes}
                                maxSize={maxSize}
                                onDropRejected={onDropRejected}
                                onError={onError} />
                        </Toggle.Image>

                        <Toggle.Creature>
                            <CreatureEditor
                                defaultCreature={defaultCreature}
                                forceCreature={forceCreature}
                                creature={creature}
                                onUpdateCreature={onUpdateCreature}
                                changeCreature={creature => this.setState({creature})} />
                        </Toggle.Creature>

                    </Toggle>
				</Row>
			</div>
        );
    }
}

AvatarEditor.propTypes = {
    defaultImage: PropTypes.string,
    defaultCreature: creaturePropType,
    defaultAvatarType: PropTypes.oneOf(['image', 'creature']),
    defaultZoom: PropTypes.number,
    defaultRotation: PropTypes.number,
    defaultPosition: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),

    image: PropTypes.string,
    creature: creaturePropType,
    avatarType: PropTypes.oneOf(['image', 'creature']),
    zoom: PropTypes.number,
    rotation: PropTypes.number,
    position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),

    onUpdateCreature: PropTypes.func,
    onUpdateImage: PropTypes.func,
    onError: PropTypes.func,

    validAttachmentTypes: PropTypes.array,
    maxSize: PropTypes.number,
    onDropRejected: PropTypes.func
};

export default AvatarEditor;
