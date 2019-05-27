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
import {
    logTitle,
    getFileTypeFromPreview,
    getAttachmentFromPreview,
    generateCarlSagan
} from '../../libs/utils';
import fileType from '../../libs/file-type/index';
import readBlob from 'read-blob';

const
    dropzoneRef = createRef();

class ImageEditor extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.placeholder = CarlSagan;
    }

    onDrop = acceptedFiles => {
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

            this.props.changeImageProperty({
                key: 'file',
                value: file.preview
            });

        }).catch(e => {
            this.props.onError('File Drop Error', 'Error Adding File(s): ' + e.message);
        });
    }

    onDropRejected = rejectedFiles => {
        logTitle('ImageEditor: onDropRejected');

        this.props.onDropRejected(rejectedFiles);
    }

    triggerUpload = () => {
        if (typeof dropzoneRef === 'function') {
            dropzoneRef.open();
        }
    }

    setEditorRef = editor => {
        document.editor = editor;
    }

    rotateImage = () => {
        const
            rotation = (this.props.rotation + 90) % 360;

        logTitle('ImageEditor: rotateImage');
        console.log(rotation);
        console.log('');

        this.props.changeImageProperty({
            key: 'rotation',
            value: rotation
        });
    }

    zoomImage = zoom => {
        logTitle('ImageEditor: zoomImage');
        console.log(zoom);
        console.log('');

        this.props.changeImageProperty({
            key: 'zoom',
            value: zoom
        });
    }

    panImage = position => {
        if (this.props.position) {
            return;
        }

        logTitle('ImageEditor: panImage');
        console.log(position);
        console.log('');

        this.props.changeImageProperty({
            key: 'position',
            value: position
        });
    }

    getScaledAvatar = () =>
        new Promise((resolve, reject) =>
            document.editor.getImageScaledToCanvas().toBlob(blob => {
                const
                    newImg = document.createElement('img'),
                    url = URL.createObjectURL(blob);

                newImg.src = url;

                resolve(newImg.src);
            }, fileType, 1)
        );

    getFileType = preview =>
        getAttachmentFromPreview(preview)
            .then(image => ({
                image: preview,
                fileType: fileType(new Uint8Array(image)).mime
            }));

    updateImageAvatar = event => {
        event.preventDefault();

        logTitle('ImageEditor: updateImageAvatar');
        console.log('document.editor ref:');
        console.log(document.editor);

        this.getScaledAvatar()
            .then(preview => this.getFileType(preview))
            .then(async ({image, fileType}) => {

                logTitle('ImageEditor: Image type');
                console.log(fileType);
                console.log('');

                logTitle('ImageEditor: Scaled image');
                console.log(image);
                console.log('');

                await this.props.changeImageProperty({
                    key: 'type',
                    value: fileType
                });

                const {
                    zoom,
                    rotation,
                    position
                } = this.props;

                this.props.onUpdateImage(image, {zoom, rotation, position});
            })

            .catch(e => {
                this.props.onError('Processing Error',
                    'Error processing avatar images: ' + e.message);
            });

        console.log('');
    }

    loadPlaceholder = () => {
        this.props.changeImageProperty({key: 'file', value: this.placeholder});
    }

    resetImage = async () => {
        let image, preview;

        const {
            defaultImage,
            defaultZoom,
            defaultRotation,
            defaultPosition,

            forceZoom,
            forcePosition,
            forceRotation,
            forceImage,

            file,
            zoom,
            position,
            rotation
        } = this.props;

        if (forceImage) {
            preview = forceImage;

        } else if (file) {
            preview = file;

        } else if (defaultImage) {
            preview = defaultImage;

        } else {
            image = await generateCarlSagan();
            preview = image.src;
        }

        logTitle('ImageEditor: resetImage');

        this.props.changeImageProperty({
            key: 'file',
            value: preview
        });

        this.props.changeImageProperty({
            key: 'zoom',
            value: forceZoom ? forceZoom :
                zoom ? zoom :
                defaultZoom ? defaultZoom : 0
        });

        this.props.changeImageProperty({
            key: 'rotation',
            value: forceRotation ? forceRotation :
                rotation ? rotation :
                defaultRotation ? defaultRotation : 0
        });

        this.props.changeImageProperty({
            key: 'position',
            value: forcePosition ? forcePosition :
                position ? position :
                defaultPosition ? defaultPosition : { x: 0.5, y: 0.5 }
        });

        this.props.changeImageProperty({
            key: 'type',
            value: 'image/jpg'
        });
    }

    componentDidMount() {
        this.resetImage();
    }

    render = () => {
        const { zoom,
                rotation,
                position,
                file,
                validAttachmentTypes,
                maxSize,
                forceImage } = this.props,

            shouldDisableNewImage = this.props.forceImage ? true : false,
            shouldDisableZoom = this.props.forceZoom ? true : false,
            shouldDisableRotation = this.props.forceRotation ? true : false,

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

            image = file ? file :
                forceImage ? forceImage : null;

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

    forceImage: PropTypes.string,
    forceZoom: PropTypes.number,
    forceRotation: PropTypes.number,
    forcePosition: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),

    file: PropTypes.string,
    zoom: PropTypes.number,
    rotation: PropTypes.number,
    position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),

    changeImageProiperty: PropTypes.func,
    onUpdateImage: PropTypes.func,
    onError: PropTypes.func,

    validAttachmentTypes: PropTypes.array,
    maxSize: PropTypes.number,
    onDropRejected: PropTypes.func
};

export default ImageEditor;