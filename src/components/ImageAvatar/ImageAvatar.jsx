import React from 'react';
import { logTitle } from '../../libs/utils';

const ImageAvatar = props => {
	const
		avatarStyles = {
			borderRadius: props.width,
			maxWidth: props.width,
			width: '100%'
		};

	logTitle('ImageAvatar:');
	console.log(props.src);
	console.log('');

	return (
		<img src={props.src} style={avatarStyles} alt='user avatar' />
	);
};

export default ImageAvatar;
