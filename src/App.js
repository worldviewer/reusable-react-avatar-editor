import React, { Component } from 'react';
import UI from './components/UI/UI';
import Results from './components/Results/Results';
import Output from './components/Output/Output';
import Header from './components/Header/Header';
import Line from './components/Line/Line';
import AvatarEditor from './components/AvatarEditor/AvatarEditor';
import ImageAvatar from './components/ImageAvatar/ImageAvatar';
import { logTitle, logError } from './libs/utils';
import svgAvatar from './libs/SvgAvatar/index';
import ReactJson from 'react-json-view';

// import { creatureBob, creatureJim } from './libs/creatures';
// import neptune from './assets/neptune.jpg';
// import plasmaBall from './assets/plasma-ball.jpg';

const
	MAX_ATTACHMENT_SIZE = 5000000,
	VALID_ATTACHMENT_TYPES =
		['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

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
	}

	onUpdateCreature = creature => {
		logTitle('App: onUpdateCreature');
		console.log(creature);
		console.log('');

		const
			creatureSVG = svgAvatar.render_svg(creature);

		this.setState({creature, creatureSVG});
	}

	onUpdateImage = (image, imageData) => {
		logTitle('App: onUpdateImage');
		console.log(image);
		console.log(imageData);
		console.log('');

		this.setState({image, imageData})
	}

	onDropRejected = rejectedFiles => {
		logTitle('App: onDropRejected');

		const messages = rejectedFiles.map(file => {
			let message = '';

			if (file.size > MAX_ATTACHMENT_SIZE) {
				message = 'The file ' + file.name + 
					' is too large.  It should be smaller than ' + 
					parseInt(MAX_ATTACHMENT_SIZE/1000000, 10) + 'mb. ';
			} else if (!VALID_ATTACHMENT_TYPES.includes(file.type)) {
				message = 'The file ' + file.name +
					' is not an acceptable type.  It should be of type jpg, png, webp or gif. ';
			}

			return message;
		});

		const preface = messages.length > 1 ?
			'Some image files were rejected: ' :
			'An image file was rejected: ';

		logError(preface + messages.reduce((prev, cur) => prev + cur, ''),
			'App', 'onDropRejected');
	}

	onError = err => {
		logError(err);
	}

	saveWindowState = () => {
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

	render = () => {
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
						onUpdateCreature={this.onUpdateCreature}
						onUpdateImage={this.onUpdateImage}
						validAttachmentTypes={VALID_ATTACHMENT_TYPES}
						maxSize={MAX_ATTACHMENT_SIZE}
						onError={this.onError}
						onDropRejected={this.onDropRejected} />
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
