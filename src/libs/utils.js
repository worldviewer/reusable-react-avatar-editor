import fileType from './file-type/index';
import Carl from '../assets/carl-sagan.jpg';

// import createDOMPurify from 'dompurify';
// import { JSDOM } from 'jsdom';
// import svgr from '@svgr/core';

// TODO
// export function sanitize(dirty) {
// 	const window = (new JSDOM('')).window;
// 	const DOMPurify = createDOMPurify(window);
// 	const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500">${dirty}</svg>`;

// 	svgr(svgCode, { icon: true }, { componentName: 'Creature' }).then(jsCode => {
// 	  	logTitle('utils: sanitize');
// 	  	console.log(jsCode);

//   		return jsCode;
// 	});
// }

export function logTitle(message) {
	const consoleTitleStyles = [
		'background: black',
		'color: white',
		'padding: 2px'
	].join(';');

	console.log('%c' + message, consoleTitleStyles);
}

export function getFileTypeFromPreview(file) {
	const xhr = new XMLHttpRequest();

	logTitle('getFileTypeFromPreview: File blob');
	console.log(file.preview.split('blob:')[1]);
	console.log('');

	return new Promise((resolve, reject) => {
		xhr.open('GET', file.preview);
		xhr.responseType = 'arraybuffer';

		xhr.onload = () => {
			logTitle('getFileTypeFromPreview: response');
			console.log(xhr.response);
			console.log('');

			resolve(fileType(new Uint8Array(xhr.response)));
		};

		xhr.send();
	});
}

export function getAttachmentFromPreview(preview) {
	const xhr = new XMLHttpRequest();

	return new Promise((resolve, reject) => {
		xhr.open('GET', preview);
		xhr.responseType = 'arraybuffer';

		xhr.onload = () => {
			resolve(new Uint8Array(xhr.response));
		};

		xhr.send();
	});
}

// https://stackoverflow.com/questions/32702431/display-images-fetched-from-s3
export function encode(data) {
	let str = '';
	for (let i = 0; i < data.length; i++) {
		str = str + String.fromCharCode(data[i]);
	}

	// const str = data.reduce((a,b) => a + String.fromCharCode(b), '');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
}

export function logError(message, component, method) {
	console.error(message);
	console.error(component + ': ' + method);
	console.log('');
}

export async function generateCarlSagan() {
	logTitle('AvatarEditor: Generating Carl Sagan');
	console.log('');

	let image = new Image();

	const attachment = await getAttachmentFromPreview(Carl);

	const avatarFileType = await
		fileType(new Uint8Array(attachment));

	image.src = "data:" + avatarFileType.mime + 
		";base64," + encode(attachment);

	return image;
}
