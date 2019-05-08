import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
				this.state.avatarType,

			isControlled = this.props.avatarType ? true : false;

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

AvatarEditor.propTypes = {
	defaultImage: PropTypes.string,
	defaultCreature: PropTypes.shape({
		form: PropTypes.shape({
			pattern: PropTypes.number,
			colors: PropTypes.number
		}),
		mouth: PropTypes.shape({
			pattern: PropTypes.number,
			colors: PropTypes.number
		}),
		eye: PropTypes.shape({
			pattern: PropTypes.number,
			colors: PropTypes.number
		})
	}),
	defaultAvatarType: PropTypes.oneOf(['image', 'creature']),
	defaultZoom: PropTypes.number,
	defaultRotation: PropTypes.number,
	defaultPosition: PropTypes.shape({
		x: PropTypes.number,
		y: PropTypes.number
	}),

	image: PropTypes.string,
	creature: PropTypes.shape({
		form: PropTypes.shape({
			pattern: PropTypes.number,
			colors: PropTypes.number
		}),
		mouth: PropTypes.shape({
			pattern: PropTypes.number,
			colors: PropTypes.number
		}),
		eye: PropTypes.shape({
			pattern: PropTypes.number,
			colors: PropTypes.number
		})
	}),
	avatarType: PropTypes.oneOf(['image', 'creature']),
	zoom: PropTypes.number,
	rotation: PropTypes.number,
	position: PropTypes.shape({
		x: PropTypes.number,
		y: PropTypes.number
	}),
	imageAvatarWidth: PropTypes.number
};

export default AvatarEditor;
