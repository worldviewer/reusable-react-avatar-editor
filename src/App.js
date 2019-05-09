import React, { Component } from 'react';
import UI from './components/UI/UI';
import Results from './components/Results/Results';
import Output from './components/Output/Output';
import Header from './components/Header/Header';
import Line from './components/Line/Line';
import AvatarEditor from './components/AvatarEditor/AvatarEditor';
import ImageAvatar from './components/ImageAvatar/ImageAvatar';
import neptune from './assets/neptune.jpg';
import plasmaBall from './assets/plasma-ball.jpg';
import { logTitle } from './libs/utils';
import svgAvatar from './libs/SvgAvatar/index';
import ReactJson from 'react-json-view';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			creature: null,
			creatureSVG: null,
			image: null,
			imageData: null,
			windowWidth: window.innerWidth
		};

		this.props = props;

		this.creatureBob = {
			form: {
				pattern: 4, // 0-9
				colors: 4   // 0-7
			},
			mouth: {
				pattern: 7, // 0-9
				colors: 1   // 0-7
			},
			eye: {
				pattern: 3, // 0-9
				colors: 7   // 0-7
			}
		};

		this.creatureJim = {
			form: {
				pattern: 7,
				colors: 0
			},
			mouth: {
				pattern: 6,
				colors: 2
			},
			eye: {
				pattern: 3,
				colors: 6
			}			
		};

		this.onUpdateImage = this.onUpdateImage.bind(this);
		this.onUpdateCreature = this.onUpdateCreature.bind(this);
		this.saveWindowState = this.saveWindowState.bind(this);
	}

	onUpdateCreature(creature) {
		logTitle('App: onUpdateCreature');
		console.log(creature);
		console.log('');

		const
			creatureSVG = svgAvatar.render_svg(creature);

		this.setState({creature, creatureSVG});
	}

	onUpdateImage(image, data) {
		logTitle('App: onUpdateImage');
		console.log(image);
		console.log(data);
		console.log('');

		this.setState({image, imageData: data})
	}

	saveWindowState() {
		console.log('window width: ' + window.innerWidth);

		this.setState({
			windowWidth: window.innerWidth
		});		
	}

	componentDidMount() {
		window.addEventListener('resize', this.saveWindowState);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.saveWindowState);
	}

	render() {
		const
			{ creature, creatureSVG, image, imageData, windowWidth } = this.state,

			creatureStyles = {
				maxWidth: '150px',
				width: '100%'
			},

			appStyles = windowWidth > 800 ? {
				height: '100vh',
				overflow: 'hidden'
			} : {
				height: '100vh',
				overflowY: 'auto'
			};

	    return (
	        <div className='App' style={appStyles}>
	        	<UI windowWidth={windowWidth}>
					<AvatarEditor
						disableNotifications={true}
						imageAvatarWidth={30}
						onUpdateCreature={this.onUpdateCreature}
						onUpdateImage={this.onUpdateImage} />
				</UI>

				<Results windowWidth={windowWidth}>
					<Header value={'Creature Output'} disabled={windowWidth > 800} />

					<Output display={creatureSVG}>
						<svg viewBox="0 0 500 500" key='creature'
							dangerouslySetInnerHTML={{__html: creatureSVG}}
							style={creatureStyles} />
					</Output>

					<Output display={creature}>
						<ReactJson src={creature} />
					</Output>

					<Line disabled={windowWidth > 800} />

					<Header value={'Image Output'} disabled={windowWidth > 800} />

					<Output display={image}>
						<ImageAvatar src={image} width={188} />
					</Output>

					<Output display={imageData}>
						<ReactJson src={imageData} />
					</Output>
				</Results>
			</div>
		);
	}
}

export default App;
