import React from 'react';
import AvatarEditor from './components/AvatarEditor/AvatarEditor';
import neptune from './assets/neptune.jpg';
import plasmaBall from './assets/plasma-ball.jpg';

function App() {
	const
		creatureBob = {
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
		},

		creatureJim = {
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
		}

    return (
        <div className='App'>
			<AvatarEditor
				defaultImage={neptune}
				defaultCreature={creatureBob}
				defaultAvatarType={'image'}
				defaultZoom={1.5}
				defaultRotation={90}
				defaultPosition={{x: 0.6, y: 0.6}}

				image={neptune}
				zoom={2}
				rotation={180}
				position={{x: 0.7, y: 0.7}} />
		</div>
    );
}

export default App;
