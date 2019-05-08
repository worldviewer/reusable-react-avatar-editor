# Reusable Avatar Editor Component

Setting up an avatar editor for an app can be a lot of work: Not only does the user need an ability to zoom in and crop their uploaded image, but there should also be a system in place for generating random avatars for the users who've yet to set it up.  And since a lot of users may avoid that work, it's sort of important what these random avatars actually look like.

So, what I would like to have on hand is a reusable React component that I can easily drop into all of my projects which addresses these avatar editor needs.

I've set up a similar system before, but I've never turned it into a reusable component.  So, I will attempt to leverage reusable React patterns to provide the component consumer with options for styling the editor elements.

Once the component is working, as time permits, I will refactor the component with React Hooks, in order to observe the extent to which this new pattern simplifies the component code.

## The Original Implementation

The avatar editor component allows the user to choose between two different types of avatar: image or creature.  Since new creatures can be created with a set of random numbers, we can automatically assign creature avatars to new users - presumably without concern that the system will be flooded with a lot of identical avatars for new users.

<p align="center">
    <img width="50%" src="https://github.com/worldviewer/reusable-react-avatar-editor/blob/master/images/image-editor.png" />
</p>

<p align="center">
    <img width="50%" src="https://github.com/worldviewer/reusable-react-avatar-editor/blob/master/images/creature-editor.png" />
</p>

The project will bring together five existing React dependencies into one single React component:

- [React Avatar Editor](https://www.npmjs.com/package/react-avatar-editor)
- [SvgAvatar](https://www.npmjs.com/package/svg_avatar)
- [React Dropzone](https://www.npmjs.com/package/react-dropzone)
- [rc-slider](https://www.npmjs.com/package/rc-slider)
- [react-icons](https://www.npmjs.com/package/react-icons)

And to keep the component simple, I will restrict the UI for creature selection to simply a button that the user can press to generate a new random creature.

The first task is to just get this project working w the latest React components - which involves a little bit of work since there have been changes since I last touched this code (especially with React Dropzone).

Then, my next step will be to make sure that the code is broken up into logical components - that things are where people would expect to find them.  I will add in some default styling, and when the `Update` button is pressed, I'll display in my App wrapper the finished avatar.

Once that is done, then I will begin experimenting with various refactors.

## Uncontrolled Props

All props are optional.  Of the props that are supplied, there are two types: defaults (presets) and controlled.  Each feature can be independently preset or controlled.

Pre-setting a component feature allows the developer to initialize the editor with an (uncontrolled) state which the user can subsequently adjust, whereas setting any of the non-default props will force that particular feature into a controlled state which the user cannot subsequently adjust.

The following table demonstrates how to set default values:

| Prop              | Type    | Default          | Description                                                                        |
|-------------------|---------|------------------|------------------------------------------------------------------------------------|
| defaultImage      | element |                  | Load the editor with this image                                                    |
| defaultCreature   | object  |                  | Load the editor with this creature                                                 |
| defaultAvatarType | string  | `image`          | Set the editor to initially display this avatar type, either `creature` or `image` |
| defaultZoom       | number  | 1                | Set the editor to initially display image with this zoom level                     |
| defaultRotation   | number  | 0                | Set the editor to initially display image with this rotation (in degrees, 0 - 360) |
| defaultPosition   | object  | {x: 0.5, y: 0.5} | Set the editor to initially display image with this point as the center            |

## Controlled Props

When a prop is controlled, it will override any default prop that might also be applied, and that particular value will become set such that the user cannot change it.  For example, if the `image` prop is defined, then `dropZone` will be disabled, the UI for dropping a new image file into the avatar will disappear, and the image editor will initially display.  But, the user can still switch over to the creature editor.

If a `creature` prop is defined, the creature editor will initially display, and the `Change` button will be disabled.  But, the user can still toggle to the image editor.

If the `avatarType` prop is specified, then the user can no longer toggle to the other editor.

Pressing the `Update` button will output the results.  For creatures, this will be the creature data in object form (which must be rendered using `SvgCreature`).  For images, this will be the cropped, zoomed, positioned result at the original resolution.

## Note on XSS and SVG's

SVG's are XML, which means they can contain JavaScript, which makes them susceptible to XSS attacks.  I tried a number of approaches to sanitizing the SVG: The top three XSS sanitizers - `xss`, `xss-filters` and `dompurify` all corrupted the SVG.  `dompurify` seemed to come the closest insofar as it actually generated SVG - but the SVG was incorrect.

It turns out that Create React App 2.0 comes with an ability to generate components from SVG literals using the `svgr` library.  If I stored the creature SVG string in state, and then converted it with `svgr` in render - which is obviously not ideal - it did produce a React component code, but I still could not figure out how to persuade React to import the produced code as a React component.

FYI: Apparently, [it is safe](https://svg.digi.ninja/svg) to import SVG's as `<img src={Creature} alt='creature' />` where Creature has been loaded by Webpack.  But, this is not as good as getting `svgr` to work, since the latter approach would in theory [allow us to manipulate all of the SVG parts too](https://egghead.io/lessons/react-add-svgs-as-react-components-with-create-react-app-2-0).

I will have to look into this again later.

## The Refactor

### [Styled Components w Emotion](https://emotion.sh/docs/styled)

Styling has traditionally been a bit of an issue with React.  If the styles are shared, can I edit or delete them?  If the styles are inline, how do you apply media queries or pseudoclasses like hover states?  Emotion seems to solve all of these problems.
