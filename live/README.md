# scorm-templates

HTML templates with TetraLogical theming to be used for SCORM modules

## Usage

Copy the `index.html`, `css`, `js`, and `theme` folders and files to form the basis of the new SCORM module.

Content images can be added to any folder, but it is recommended to create a new folder such as `images` or `media` and avoid adding additional files to the main `css`, `js`, or `theme` folders.

## Development

The theme uses SCSS to simplify creation of slide variations. The latest generated CSS should be committed as `theme/css/core.css`. It can be generated with the following command:

``` bash
npm run scss
```

The followin will start a local server and watch the `core.scss` file for changes:

``` bash
npm run start
```

Direct changes should not be made to `theme/css/core.css` as these will be overwitten by any changes made to `_src/scss/core.scss`.