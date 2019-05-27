import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from '../Row/Row';
import Button from '../Button/Button';
import { logTitle } from '../../libs/utils';
import { creaturePropType } from '../../libs/propTypes';
import './CreatureEditor.scss';

// svg_avatar has been imported into the project to fix:
// > ./node_modules/svg_avatar/index.js
// > Critical dependency: the request of a dependency is an expression
import svgAvatar from '../../libs/SvgAvatar/index';

class CreatureEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            creatureSVG: ''
        }

        this.props = props;
    }

    changeCreature = async () => {
        const
            creature = svgAvatar.random_avatar(),
            creatureSVG = svgAvatar.render_svg(creature);

        await this.props.changeCreature(creature);
        await this.setState({ creatureSVG });

        logTitle('CreatureEditor: Generating random avatar');
        console.log(creature);
        console.log(creatureSVG);
        console.log('');
    }

    componentDidMount() {
        const { defaultCreature, creature } = this.props,
            controlledCreature = this.props.forceCreature;

        if (controlledCreature) {
            const
                creatureSVG = svgAvatar.render_svg(controlledCreature);

            this.props.changeCreature(controlledCreature);
            this.setState({creatureSVG});

        } else if (creature) {
            const
                creatureSVG = svgAvatar.render_svg(creature);

            this.props.changeCreature(creature);
            this.setState({creatureSVG});

        } else if (defaultCreature) {
            const
                creatureSVG = svgAvatar.render_svg(defaultCreature);

            this.props.changeCreature(defaultCreature);
            this.setState({creatureSVG});

        } else {
            this.changeCreature();
        }
    }

    render = () => {
        const { creatureSVG } = this.state,
            { creature } = this.props,

            creatureStyles = {
                marginBottom: '27px',
                marginTop: '25px',
                width: '188px'
            },

            isControlledCreature = this.props.forceCreature ? true : false,
            { onUpdateCreature } = this.props;

        return (
            <div>
				<Row>
					<svg viewBox="0 0 500 500" key='creature'
						dangerouslySetInnerHTML={{__html: creatureSVG}}
						style={creatureStyles} />
				</Row>

				<Row>
					<Button onClick={this.changeCreature}
						isControlled={isControlledCreature}>

						Change
					</Button>
				</Row>

				<Row>
					<Button onClick={() => onUpdateCreature(creature)}>
						Update
					</Button>
				</Row>
			</div>
        );
    }
}

CreatureEditor.propTypes = {
    defaultCreature: creaturePropType,
    forceCreature: creaturePropType,
    creature: creaturePropType,

    onUpdateCreature: PropTypes.func,
    changeCreature: PropTypes.func
};

export default CreatureEditor;
