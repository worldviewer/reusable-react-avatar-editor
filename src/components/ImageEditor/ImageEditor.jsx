import React, { Component, createRef } from 'react';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import Mask from '../../assets/avatar-mask.png';
import Row from '../Row/Row';
import Button from '../Button/Button';
import RotateIcon from '../RotateIcon/RotateIcon';
import TrashIcon from '../TrashIcon/TrashIcon';
import CarlSagan from '../../assets/carl-sagan.jpg';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { logTitle, logError, getFileTypeFromPreview, getAttachmentFromPreview, generateCarlSagan } from '../../libs/utils';
import fileType from '../../libs/file-type/index';
import readBlob from 'read-blob';

/*
	addFileHandler={this.fileDropHandler}
	zoomImageHandler={this.zoomImage}
	rotateImageHandler={this.rotateImage}
	deleteImageHandler={this.deleteImage}
	file={file}
	scale={1 + zoom/20}
	zoom={zoom}
	rotation={rotation}
	position={position}
	panHandler={this.panHandler}
*/

const
	dropzoneRef = createRef(),
	MAX_ATTACHMENT_SIZE = 5000000,
	VALID_ATTACHMENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

class ImageEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			image: {
				file: null,
				zoom: 0,
				rotation: 0,
				position: {
					x: 0.5,
					y: 0.5
				}
			}
		};

		this.props = props;

		this.onDrop = this.onDrop.bind(this);
		this.onDropRejected = this.onDropRejected.bind(this);
		this.setEditorRef = this.setEditorRef.bind(this);
		this.triggerUpload = this.triggerUpload.bind(this);
		this.rotateImage = this.rotateImage.bind(this);
		this.panImage = this.panImage.bind(this);
		this.zoomImage = this.zoomImage.bind(this);
		this.deleteImage = this.deleteImage.bind(this);
		this.updateImageAvatar = this.updateImageAvatar.bind(this);

		this.placeholder = CarlSagan;
	}

	// TODO: Manage image dimension validations here
	onDrop(acceptedFiles, rejectedFiles) {
		if (rejectedFiles.length > 0) {
			this.onDropRejected(rejectedFiles);
		}

		let promiseList = acceptedFiles.map(file => {
			return new Promise((resolve, reject) => {
				readBlob(file, 'dataurl', (err, dataurl) => {
					if (err) {
						reject(err);
						return;
					}

					let image = new Image();
					image.src = dataurl;

					// https://stackoverflow.com/questions/623172
					// /how-to-get-image-size-height-width-using-javascript
					image.onload = () => {
						resolve({
							name: file.name,
							preview: image.src,
							width: image.naturalWidth,
							height: image.naturalHeight
						});
					};
				});
			});
		});

		Promise.all(promiseList).then(async enhancedList => {
			logTitle('ImageEditor: Dropped files');
			console.log('Accepted Files:');
			console.log(enhancedList);
			console.log('Rejected Files:');
			console.log(rejectedFiles);
			console.log('');

			let file = enhancedList[0];

			logTitle('ImageEditor: file');
			console.log(file);
			console.log('');

			const type = await getFileTypeFromPreview(file);

			logTitle('ImageEditor: Determining filetype of dropped file');
			console.log(type);
			console.log('');

			if (!type) {
				// postError('Error determining the image\'s file type for ' +
				// 	file.name);

				logError('Error determining the image\'s file type for ' +
					file.name, 'SettingsComponent', 'fileDropHandler');

				return;
			}

			const fileWithType = {
				...file,
				type: type.mime
			};

			this.setState(prevState => ({
				image: {
					...prevState.image,
					file: fileWithType
				}
			}));

		}).catch(e => {
			// postError('Error Adding File(s): ' + e.message);

			logError('Error Adding File(s): ' + e.message, 'ImageEditor',
				'onDrop');
		});
	}

	onDropRejected(rejectedFiles) {
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

		// postError(preface + messages.reduce((prev, cur) => prev + cur, ''));

		logError(preface + messages.reduce((prev, cur) => prev + cur, ''),
			'ImageEditor', 'onDropRejected');
	}

	triggerUpload() {
		if (typeof dropzoneRef === 'function') {
			dropzoneRef.open();
		}
	}

	setEditorRef(editor) {
		document.editor = editor;
	}

	rotateImage() {
		this.setState(prevState => ({
			image: {
				...prevState.image,
				rotation: (prevState.image.rotation + 90) % 360
			}
		}));
	}

	zoomImage(zoom) {
		logTitle('zoomImage:');
		console.log(zoom);
		console.log('');

		this.setState(prevState => ({
			image: {
				...prevState.image,
				zoom
			}
		}));
	}

	panImage(position) {
		logTitle('panHandler:');
		console.log(position);
		console.log('');

		this.setState(prevState => ({
			image: {
				...prevState.image,
				position
			}
		}));
	}

	async deleteImage() {
		const image = await generateCarlSagan();

		this.setState({
			image: {
				file: {preview: image.src},
				zoom: 0,
				rotation: 0,
				position: {x: 0.5, y: 0.5},
				type: 'image/jpg'
			}
		});
	}

	updateImageAvatar(event) {
		event.preventDefault();

		console.log('ref:');
		console.log(document.editor); // editor ref

		let avatars = {
			original: null,
			scaled: null,
			type: null
		};

		new Promise((resolve, reject) => {
			// If you want the image resized to the canvas size (also a 
			// HTMLCanvasElement)
			document.editor.getImageScaledToCanvas().toBlob(blob => {
				const
					newImg = document.createElement('img'),
					url = URL.createObjectURL(blob);

					newImg.onload = () => {
						// no longer need to read the blob so it's revoked
						URL.revokeObjectURL(url);
					};

				newImg.src = url;

				resolve(getAttachmentFromPreview(newImg.src));
			}, fileType, 1);
		})

		.then(scaled => {
			avatars.scaled = scaled;

			return new Promise(async (resolve, reject) => {
				const original =
					await getAttachmentFromPreview(this.state.image.file.preview);

				resolve(original);
			});
		})

		.then(async original => {
			avatars.original = original;

			avatars.type = await
				fileType(new Uint8Array(original)).mime;

			logTitle('ImageEditor: Image type');
			console.log(avatars.type);
			console.log('');

			logTitle('ImageEditor: Unscaled image');
			console.log(avatars.original);
			console.log('');

			logTitle('ImageEditor: Scaled image');
			console.log(avatars.scaled);
			console.log('');

			await this.setState(prevState => ({
				image: {
					...prevState.image,
					type: avatars.type
				}
			}));

			// postSuccess('avatar updated');
		})

		.catch(e => {
			// postError('Error uploading avatar images: ' + e.message);

			logError('Error uploading avatar images: ' + e.message,
				'AvatarEditor', 'updateImageAvatar');
		});

		console.log('');
	}

	async componentDidMount() {
		const image = await generateCarlSagan();

		this.setState({
			image: {
				file: {preview: image.src},
				zoom: 0,
				rotation: 0,
				position: {x: 0.5, y: 0.5},
				type: 'image/jpg'
			}
		}, () => {
			logTitle('ImageEditor: this.state');
			console.log(this.state);
			console.log('');
		});
	}

	render() {
		const
			editorStyles = {
				alignItems: 'center',
				display: 'flex',
				justifyContent: 'center',
				width: '208px'
			},
			uploadOverlayStyles = {
				bottom: '29px',
				color: 'white',
				cursor: 'cell',
				fontSize: '14px',
				position: 'absolute',
				textAlign: 'center',
				width: '208px',
				zIndex: '100'
			},
			overlayMaskStyles = {
				height: '208px',
				pointerEvents: 'none',
				position: 'absolute',
				top: '1px',
				width: '208px',
				zIndex: '99'
			},

			{ zoom, rotation, position, file } = this.state.image,

			handleStyles = {
				border: 'solid 2px #e0e0e0',
				height: '17px',
				width: '17px',
				marginTop: '-5px',
				boxShadow: '0 0 0 2px #fafafa'
			};

		return (
			<form onSubmit={this.updateImageAvatar}>
				<Row>
					<div style={{position: 'relative', cursor: 'move'}}>
						<AvatarEditor
							ref={this.setEditorRef}
							image={file ? file.preview : this.placeholder}
							width={188}
							height={188}
							border={10}
							borderRadius={100}
							color={[255, 255, 255, 1.0]}
							scale={1 + zoom/20}
							rotate={rotation}
							position={position}
							onPositionChange={this.panImage} />

						<Dropzone onDrop={this.onDrop} ref={dropzoneRef}>
			  				{({getRootProps, getInputProps}) => (

								<div style={editorStyles} {...getRootProps()}>
									<div style={uploadOverlayStyles}
										onClick={this.triggerUpload}>

										<span className='noselect'>Upload</span>
									</div>

									<img style={overlayMaskStyles} src={Mask} alt='text mask' />
									<input {...getInputProps()} />
								</div>
							)}
						</Dropzone>
					</div>
				</Row>

				<Row>
					<div style={{width: '50%'}}>
						<Slider onChange={this.zoomImage}
							railStyle={{backgroundColor: '#e0e0e0', height: '7px'}}
							trackStyle={{backgroundColor: '#00c853', height: '7px'}}
							handleStyle={handleStyles}
							value={zoom} />
					</div>

					<RotateIcon onClick={this.rotateImage} />
					<TrashIcon onClick={this.deleteImage} />
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

export default ImageEditor;
