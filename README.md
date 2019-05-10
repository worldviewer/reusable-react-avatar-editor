# Reusable Avatar Editor Component

Setting up an avatar editor for an app can be a lot of work: Not only does the user need an ability to zoom in and crop their uploaded image, but there should also be a system in place for generating random avatars for the users who've yet to set it up.  And since a lot of users may avoid that work, it's sort of important what these random avatars actually look like.

So, what I would like to have on hand is a reusable React component that I can easily drop into all of my projects which addresses these avatar editor needs.

I've set up a similar system before, but I've never turned it into a reusable component.  So, I will attempt to leverage reusable React patterns to provide the component consumer with options for styling the editor elements.

Once the component is working, as time permits, I will refactor the component with React Hooks, in order to observe the extent to which this new pattern simplifies the component code.

## It's Two Avatar Editors with a Toggle

The avatar editor component allows the user to choose between two different types of avatar: image or creature.  Since new creatures can be created with a set of random numbers, we can automatically assign creature avatars to new users - presumably without concern that the system will be flooded with a lot of identical avatars for new users.

<p align="center">
    <img width="50%" src="https://github.com/worldviewer/reusable-react-avatar-editor/blob/master/images/image-editor.png" />
</p>

<p align="center">
    <img width="50%" src="https://github.com/worldviewer/reusable-react-avatar-editor/blob/master/images/creature-editor.png" />
</p>

A wrapper has been added to the `AvatarEditor` component in order to demonstrate its usage:

<p align="center">
    <img width="50%" src="https://github.com/worldviewer/reusable-react-avatar-editor/blob/master/images/demo-snapshot.png" />
</p>

The project will bring together five existing React dependencies into one single React component:

- [React Avatar Editor](https://www.npmjs.com/package/react-avatar-editor)
- [SvgAvatar](https://www.npmjs.com/package/svg_avatar)
- [React Dropzone](https://www.npmjs.com/package/react-dropzone)
- [rc-slider](https://www.npmjs.com/package/rc-slider)
- [react-icons](https://www.npmjs.com/package/react-icons)

And to keep the component simple, I will restrict the UI for creature selection to simply a button that the user can press to generate a new random creature.

## Uncontrolled Component Props

All props are optional.  Of the props that are supplied, there are two types: defaults (presets) and controlled.  Each feature can be independently preset or controlled.

Pre-setting a component feature allows the developer to initialize the editor with an (uncontrolled) state which the user can subsequently adjust, whereas setting any of the non-default props will force that particular feature into a controlled state which the user cannot subsequently adjust.

The following table demonstrates how to set default values:

| Prop              | Type    | Default            | Description                                                                            |
|-------------------|---------|--------------------|----------------------------------------------------------------------------------------|
| defaultImage      | element |                    | Load the editor with this image                                                        |
| defaultCreature   | object  |                    | Load the editor with this creature                                                     |
| defaultAvatarType | string  | `image`            | Set the editor to initially display this avatar type, either `creature` or `image`     |
| defaultZoom       | number  | `1`                | Set the editor to initially display image with this zoom level                         |
| defaultRotation   | number  | `0`                | Set the editor to initially display image with this rotation (in degrees, `0` - `360`) |
| defaultPosition   | object  | `{x: 0.5, y: 0.5}` | Set the editor to initially display image with this point as the center                |

## Controlled Component Props

When a prop is controlled, it will override any default prop that might also be applied, and that particular value will become set such that the user cannot change it.  For example, if the `image` prop is defined, then `dropZone` will be disabled, the UI for dropping a new image file into the avatar will disappear, and the image editor will initially display.  But, the user can still switch over to the creature editor.

If a `creature` prop is defined, the creature editor will initially display, and the `Change` button will be disabled.  But, the user can still toggle to the image editor, and they can still choose to output an image avatar.

The `defaultAvatarType` prop sets the initial toggle state.  If the `avatarType` prop is specified, then in addition to that, the user also loses the ability to toggle to the other editor.

The following table demonstrates how to prevent the user from changing certain avatar editor inputs.  These are the controlled props:

| Prop       | Type    | Description                                                                 |
|------------|---------|-----------------------------------------------------------------------------|
| image      | element | Sets the image editor to this provided image, user cannot change            |
| creature   | object  | Sets the creature editor to this creature, user cannot change               |
| avatarType | string  | Sets the avatar type, toggle can no longer be used to switch avatar editors |
| zoom       | number  | Sets the zoom, image editor slider will no longer work                      |
| rotation   | number  | Sets the rotation, image editor rotation will no longer work                |
| position   | object  | Sets the position, the image in the image editor will no longer pan         |

## Other Props

| Prop                 | Type     | Default | Description                                                                                                                                                                                  |
|----------------------|----------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| validAttachmentTypes | array    |         | Optional array of mime type strings describing the filetypes which DropZone should accept.  See https://react-dropzone.js.org/#src for more info.  Violations will trigger `onDropRejected`. |
| maxSize              | number   |         | Optional maximum filesize for DropZone.  Violations will trigger `onDropRejected`.                                                                                                           |
| onDropRejected       | function |         | This is the callback fired by DropZone.  It sends a list of `rejectedFiles` as an argument.                                                                                                  |
| onError              | function |         | Any error produced by this component that is not triggered by DropZone will surface here.  It passes an error message string.                                                                |

Note that there are a number of additional props that can be applied to DropZone which I have not exposed in order to keep this component simple.

## Cross-Site Scripting (XSS) Attack Warning

If you didn't already know, now you do: SVG is XML, and XML can contain JavaScript, so generating SVG within the app from a string-based representation is considered treacherous since it provides a potential path for users to inject JavaScript into server backends from clients.  For this reason, Facebook uses syntax in React for this very situation which is designed to encourage developers to sanitize the input from cross-site scripting attacks, like so:

```
<svg viewBox="0 0 500 500" key='creature'
    dangerouslySetInnerHTML={{__html: creatureSVG}}
    style={creatureStyles} />
```

If a user was to somehow embed malicious JavaScript into these generated SVG's, and then upload those SVG's onto a server, then that code could subsequently run on clients that are connected to that server.

There are a number of XSS libraries which can remove XSS threats.  However, `xss` and `xss-filters` do not work with SVG's, and `dompurify` produces a broken creature.  There does not (?) yet appear to be an SVG parser which removes XSS attacks from SVG code.  But even if there was, shouldn't it exist on the backend, in a place where the code cannot be modified?  These are the types of issues which developers should think through when architecting their avatar system.

In other words, if you are integrating this component into a larger client-server architecture, it's probably not wise in a security sense to imagine that this SVG generator component can solve 100% of your avatar creation needs on just the client, without any server at all.  You'd be wise to create a simple parser on the server which only generates the SVG elements specified in `SvgAvatar/avatar_lib.json`.  The `@svgr/core` package already does something similar to this.

## Outputs

Pressing the `Update` button will output the results.  For creatures, this will be the creature data in object form (which must be rendered using `SvgCreature`).  For images, this will be (1) the cropped, zoomed, positioned result at the original resolution; and (2) the data (cropping, zoom and positioning) which was used to transform the original into the final avatar image.
