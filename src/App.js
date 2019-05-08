import React, { Component } from 'react';
import AvatarEditor from './components/AvatarEditor/AvatarEditor';
import neptune from './assets/neptune.jpg';
import plasmaBall from './assets/plasma-ball.jpg';
import { logTitle } from './libs/utils';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {

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
	}

	onUpdateCreature(creature) {
		logTitle('App: onUpdateCreature');
		console.log(creature);
		console.log('');
	}

	onUpdateImage(image, data) {
		logTitle('App: onUpdateImage');
		console.log(image);
		console.log(data);
		console.log('');
	}

	render() {
	    return (
	        <div className='App'>
				<AvatarEditor
					disableNotifications={true}
					imageAvatarWidth={30}
					onUpdateCreature={this.onUpdateCreature}
					onUpdateImage={this.onUpdateImage} />
			</div>
		);
	}
}

export default App;
