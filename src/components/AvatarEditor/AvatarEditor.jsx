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

	render() {
		const
			{ avatarType } = this.state,

			is = {
				creature: avatarType === 'creature',
				image: avatarType === 'image'
			};

		return (
			<Container>
				<Row>
					<Header value={avatarType} />
				</Row>

				<Row>
					<Toggle value={avatarType}
						toggleImageHandler={this.toggleImage}
						toggleCreatureHandler={this.toggleCreature} />
				</Row>

				<Row>
					<div style={is.image ? {display: 'block'} : {display: 'none'}}>
						<ImageEditor />
					</div>

					<div style={is.creature ? {display: 'block'} : {display: 'none'}}>
						<CreatureEditor />
					</div>
				</Row>
			</Container>
		);
	}
}

export default AvatarEditor;
