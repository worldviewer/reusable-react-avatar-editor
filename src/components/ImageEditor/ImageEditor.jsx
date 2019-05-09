import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
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
import { logTitle, getFileTypeFromPreview,
	getAttachmentFromPreview, generateCarlSagan } from '../../libs/utils';
import fileType from '../../libs/file-type/index';
import readBlob from 'read-blob';

const
	dropzoneRef = createRef();

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
		this.resetImage = this.resetImage.bind(this);
		this.updateImageAvatar = this.updateImageAvatar.bind(this);
		this.loadPlaceholder = this.loadPlaceholder.bind(this);

		this.placeholder = CarlSagan;
	}

	onDrop(acceptedFiles) {
		if (acceptedFiles.length === 0) {
			return;
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
				this.props.onError('Unknown File Type',
					'Error determining the image\'s file type for ' + file.name);

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
			this.props.onError('File Drop Error', 'Error Adding File(s): ' + e.message);
		});
	}

	onDropRejected(rejectedFiles) {
		logTitle('ImageEditor: onDropRejected');

		this.props.onDropRejected(rejectedFiles);
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
		const
			rotation = (this.state.image.rotation + 90) % 360;

		logTitle('ImageEditor: rotateImage');
		console.log(rotation);
		console.log('');

		this.setState(prevState => ({
			image: {
				...prevState.image,
				rotation
			}
		}));
	}

	zoomImage(zoom) {
		logTitle('ImageEditor: zoomImage');
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
		if (this.props.position) {
			return;
		}

		logTitle('ImageEditor: panImage');
		console.log(position);
		console.log('');

		this.setState(prevState => ({
			image: {
				...prevState.image,
				position
			}
		}));
	}

	updateImageAvatar(event) {
		event.preventDefault();

		logTitle('ImageEditor: updateImageAvatar');
		console.log('document.editor ref:');
		console.log(document.editor);

		let avatars = {
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

				newImg.src = url;

				resolve(newImg.src);
			}, fileType, 1);
		})

		.then(async scaled => {
			avatars.scaled = scaled;

			const attachment =
				await getAttachmentFromPreview(this.state.image.file.preview);

			avatars.type = await
				fileType(new Uint8Array(attachment)).mime;

			logTitle('ImageEditor: Image type');
			console.log(avatars.type);
			console.log('');

			logTitle('ImageEditor: Scaled image');
			console.log(avatars.scaled);
			console.log('');

			await this.setState(prevState => ({
				image: {
					...prevState.image,
					type: avatars.type
				}

			}), () => {
				const { file, ...rest } = this.state.image;
				this.props.onUpdateImage(avatars.scaled, rest);
			});
		})

		.catch(e => {
			this.props.onError('Processing Error', 'Error processing avatar images: ' + e.message);
		});

		console.log('');
	}

	loadPlaceholder() {
		this.setState(prevState => ({
			image: {
				...prevState.image,
				file: this.placeholder
			}
		}));
	}

	async resetImage() {
		let image, preview;

		const { defaultImage, defaultZoom, defaultRotation, defaultPosition,
			zoom, position, rotation } = this.props;

		if (this.props.image) {
			preview = this.props.image;

		} else if (defaultImage) {
			preview = defaultImage;

		} else {
			image = await generateCarlSagan();
			preview = image.src;
		}

		this.setState({
			image: {
				file: {preview},
				zoom: zoom ? zoom :
					defaultZoom ? defaultZoom : 0,
				rotation: rotation ? rotation :
					defaultRotation ? defaultRotation : 0,
				position: position ? position :
					defaultPosition ? defaultPosition : {x: 0.5, y: 0.5},
				type: 'image/jpg'
			}
		}, () => {
			logTitle('ImageEditor: resetImage');
			console.log(this.state.image);
			console.log('');
		});
	}

	componentDidMount() {
		this.resetImage();
	}

	render() {
		const
			{ zoom, rotation, position, file } = this.state.image,

			shouldDisableNewImage = this.props.image ? true : false,
			shouldDisableZoom = this.props.zoom ? true : false,
			shouldDisableRotation = this.props.rotation ? true : false,
			{ validAttachmentTypes, maxSize } = this.props,

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
				display: shouldDisableNewImage ? 'none' : 'auto',
				fontSize: '14px',
				position: 'absolute',
				textAlign: 'center',
				width: '208px',
				zIndex: '100'
			},
			overlayMaskStyles = {
				display: shouldDisableNewImage ? 'none' : 'auto',
				height: '208px',
				pointerEvents: 'none',
				position: 'absolute',
				top: '1px',
				width: '208px',
				zIndex: '99'
			},

			handleStyles = {
				border: 'solid 2px #e0e0e0',
				height: '17px',
				width: '17px',
				marginTop: '-5px',
				boxShadow: '0 0 0 2px #fafafa'
			},

			sliderWrapperStyles = {
				pointerEvents: shouldDisableZoom ? 'none' : 'auto',
				width: '50%',
			},

			image = file ? file.preview :
				this.props.image ? this.props.image : null;

		return (
			<form onSubmit={this.updateImageAvatar}>
				<Row>
					<div style={{position: 'relative', cursor: 'move'}}>
						<AvatarEditor
							ref={this.setEditorRef}
							image={image}
							width={188}
							height={188}
							border={10}
							borderRadius={100}
							color={[255, 255, 255, 1.0]}
							scale={1 + zoom/20}
							rotate={rotation}
							position={position}
							onPositionChange={this.panImage}
							onLoadFailure={this.loadPlaceholder} />

						<Dropzone
							onDrop={this.onDrop}
							onDropRejected={this.onDropRejected}
							ref={dropzoneRef}
							accept={validAttachmentTypes}
							maxSize={maxSize}
							disabled={shouldDisableNewImage}>

			  				{({getRootProps, getInputProps}) => (

								<div style={editorStyles} {...getRootProps()}>
									<div style={uploadOverlayStyles}
										onClick={this.triggerUpload}>

										<span className='noselect'>Upload</span>
									</div>

									<img style={overlayMaskStyles}
										src={Mask} alt='text mask' />
									<input {...getInputProps()} />
								</div>
							)}
						</Dropzone>
					</div>
				</Row>

				<Row>
					<div style={sliderWrapperStyles}>
						<Slider onChange={this.zoomImage}
							railStyle={{backgroundColor: '#e0e0e0', height: '7px'}}
							trackStyle={{backgroundColor: '#00c853', height: '7px'}}
							handleStyle={handleStyles}
							value={zoom} />
					</div>

					<RotateIcon onClick={this.rotateImage} disabled={shouldDisableRotation} />
					<TrashIcon onClick={this.resetImage} />
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

ImageEditor.propTypes = {
	defaultImage: PropTypes.string,
	defaultZoom: PropTypes.number,
	defaultRotation: PropTypes.number,
	defaultPosition: PropTypes.shape({
		x: PropTypes.number,
		y: PropTypes.number
	}),

	image: PropTypes.string,
	zoom: PropTypes.number,
	rotation: PropTypes.number,
	position: PropTypes.shape({
		x: PropTypes.number,
		y: PropTypes.number
	}),
	
	onUpdateImage: PropTypes.func,
	onError: PropTypes.func,

	validAttachmentTypes: PropTypes.array,
	maxSize: PropTypes.number,
	onDropRejected: PropTypes.func
};

export default ImageEditor;
