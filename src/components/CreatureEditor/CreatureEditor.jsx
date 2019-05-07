import React, { Component } from 'react';
import Row from '../Row/Row';
import Button from '../Button/Button';
import { logTitle } from '../../libs/utils';
import './CreatureEditor.scss';

// svg_avatar has been imported into the project to fix:
// > ./node_modules/svg_avatar/index.js
// > Critical dependency: the request of a dependency is an expression
import svgAvatar from '../../libs/SvgAvatar/index';

class CreatureEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
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

			creatureSVG: ''
		}

		this.props = props;

		this.changeCreature = this.changeCreature.bind(this);
		this.updateCreatureAvatar = this.updateCreatureAvatar.bind(this);
	}

	async changeCreature() {
		const
			creature = svgAvatar.random_avatar(),
			creatureSVG = svgAvatar.render_svg(creature);

		await this.setState({creature, creatureSVG});

		logTitle('CreatureEditor: Generating random avatar');
		console.log(creature);
		console.log(this.state.creatureSVG);
		console.log('');
	}

	updateCreatureAvatar(event) {
		event.preventDefault();

		logTitle('CreatureEditor: updateCreatureAvatar');
	}

	componentDidMount() {
		this.changeCreature();
	}

	render() {
		const
			{ creatureSVG } = this.state,

			creatureStyles = {
				marginBottom: '27px',
				marginTop: '25px',
				width: '188px'
			};

		return (
			<form onSubmit={this.updateCreatureAvatar}>
				<Row>
					<svg viewBox="0 0 500 500" key='creature'
						dangerouslySetInnerHTML={{__html: creatureSVG}}
						style={creatureStyles} />
				</Row>

				<Row>
					<Button onClick={this.changeCreature}>
						Change
					</Button>
				</Row>

				<Row>
					<Button type='submit'>
						Update
					</Button>
				</Row>
			</form>
		);
	}
}

export default CreatureEditor;