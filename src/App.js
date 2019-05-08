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
				disableNotifications={true}
				imageAvatarWidth={30} />
		</div>
    );
}

export default App;
