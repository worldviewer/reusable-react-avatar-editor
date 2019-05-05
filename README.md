# Avatar Editor Component

Setting up an avatar editor for an app can be a lot of work: Not only does the user need an ability to zoom in and crop their uploaded image, but there should also be a system in place for generating random avatars for the users who've yet to set it up.  And since a lot of users may avoid that work, it's sort of important what these random avatars actually look like.

So, what I would like to have on hand is a reusable React component that I can easily drop into all of my projects which addresses these avatar editor needs.

I've set up a similar system before, but I've never turned it into a reusable component.  So, I will attempt to leverage reusable React patterns to provide the component consumer with options for styling the editor elements.

Once the component is working, as time permits, I will refactor the component with React Hooks, in order to observe the extent to which this new pattern simplifies the component code.

## The Original Implementation

The avatar editor component allows the user to choose between two different types of avatar: image or creature.  Since new creatures can be created with a set of random numbers, we can assign avatars to new users - presumably without concern that the system will be flooded with a lot of identical avatars for new users.

<p align="center">
    <img width="50%" src="https://github.com/worldviewer/reusable-react-avatar-editor/blob/master/images/image-editor.png" />
</p>

<p align="center">
    <img width="50%" src="https://github.com/worldviewer/reusable-react-avatar-editor/blob/master/images/creature-editor.png" />
</p>

The project will bring together three existing React dependencies into one single React component:

- [React Avatar Editor](https://www.npmjs.com/package/react-avatar-editor)
- [SvgAvatar](https://www.npmjs.com/package/svg_avatar)
- [React Dropzone](https://www.npmjs.com/package/react-dropzone)

And to keep the component simple, I will restrict the UI for creature selection to simply a button that the user can press to generate a new random creature.