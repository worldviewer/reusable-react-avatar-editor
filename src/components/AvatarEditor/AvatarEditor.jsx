import React, { Component } from 'react';
import Container from '../Container/Container';
import Row from '../Row/Row';
import Header from '../Header/Header';
import Toggle from '../Toggle/Toggle';
import ImageEditor from '../ImageEditor/ImageEditor';
import CreatureEditor from '../CreatureEditor/CreatureEditor';
import { logTitle } from '../../libs/utils';
import './AvatarEditor.scss';

class AvatarEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			avatarType: 'image'
		};

		this.props = props;

		this.toggleImage = this.toggleImage.bind(this);
		this.toggleCreature = this.toggleCreature.bind(this);
	}

	toggleImage() {
		logTitle('AvatarEditor: Toggling to image');

		this.setState({avatarType: 'image'});
	}

	toggleCreature() {
		logTitle('AvatarEditor: Toggling to creature');

		this.setState({avatarType: 'creature'});
	}

	componentDidMount() {
		const { defaultAvatarType, avatarType, image, creature } = this.props;

		if (avatarType) {
			this.setState({avatarType});

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

	render() {
		const {
				defaultImage,
				defaultCreature,
				defaultZoom,
				defaultRotation,
				defaultPosition,

				image,
				creature,
				zoom,
				rotation,
				position
			} = this.props,

			is = {
				creature: this.state.avatarType === 'creature',
				image: this.state.avatarType === 'image'
			},

			avatarType = this.props.avatarType ? this.props.avatarType :
				image ? 'image' :
				creature ? 'creature' :
				this.state.avatarType,

			isControlled = this.props.avatarType || image || creature ?
				true : false;

		return (
			<Container>
				<Row>
					<Header value={this.state.avatarType} />
				</Row>

				<Row>
					<Toggle
						value={avatarType}
						isControlled={isControlled}
						toggleImageHandler={this.toggleImage}
						toggleCreatureHandler={this.toggleCreature} />
				</Row>

				<Row>
					<div style={is.image ? {display: 'block'} : {display: 'none'}}>
						<ImageEditor
							defaultImage={defaultImage}
							defaultZoom={defaultZoom}
							defaultRotation={defaultRotation}
							defaultPosition={defaultPosition}
							image={image}
							zoom={zoom}
							rotation={rotation}
							position={position} />
					</div>

					<div style={is.creature ? {display: 'block'} : {display: 'none'}}>
						<CreatureEditor
							defaultCreature={defaultCreature}
							creature={creature} />
					</div>
				</Row>
			</Container>
		);
	}
}

export default AvatarEditor;
