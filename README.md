<img src="http://blog.apps.npr.org/lunchbox/img/icon-lunchbox.svg" width="150" alt="Lunchbox">
=============

* [What is this?](#what-is-this)
* [Assumptions?](#assumptions)
* [What's in here?](#what-is-in-here)
* [Quick start](#quick-start)
* [Configuration](#configuration)
* [Deploy the desktop app](#deploy-the-desktop-app)
* [About](#about)

What is this?
-------------

**Lunchbox** is a suite of tools to create images intended for social media sharing. It includes:

* *Quotable*: Converts quoted text into a branded image.
* *Factlist*: Produces a branded image with a list of items.
* *Waterbug*: Creates a watermarked image with attribution.

Assumptions
-------------

**Lunchbox** is a customizable toolset deployable as a desktop app. The following instructions are meant for developers setting up and customizing the app for their organization. For end-users of the tools, see [usage guidelines](http://blog.apps.npr.org/lunchbox).

The following things are assumed to be true in this documentation.

* You are running OSX.
* You are using Python 2.7. (Probably the version that came OSX.)
* You have [virtualenv](https://pypi.python.org/pypi/virtualenv) and [virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper) installed and working.

What's in here?
-------------

* ``fabfile`` -- [Fabric](http://docs.fabfile.org/en/latest/) commands for automating setup and deployment.
* ``less`` -- Application styles and [Bootstrap](http://getbootstrap.com/css/) less files.
* ``templates`` -- HTML ([Jinja2](http://jinja.pocoo.org/docs/)) templates, to be compiled locally.
* ``www`` -- App assets and rendered files.
* ``Lunchbox Setup.exe`` -- Lunchbox Demo installer for Windows.
* ``Lunchbox.dmg`` -- Lunchbox Demo installer for OSX.
* ``app.py`` -- A [Flask](http://flask.pocoo.org/) app for rendering the project locally.
* ``app_config.py`` -- Configuration variables for the Flask app.
* ``package.json`` -- Node dependencies and scripts for building [Electron](https://github.com/atom/electron) app.
* ``packager-config.json`` -- Configuration for create installers with [Electron](https://github.com/atom/electron).
* ``render_utils.py`` -- Helper functions for baking out Flask app.
* ``requirements.txt`` -- Python requirements.
* ``static.py`` -- Routes for static files in Flask app.


Quick Start
-------------

Bootstrap the project by forking this repo and installing the following:

```
mkvirtualenv lunchbox
cd lunchbox
pip install -r requirements.txt
npm install
```

Then run the app:

```
fab app
```
Visit [localhost:8000](http://127.0.0.1:8000/) in your browser to see the app.

Configuration
-------------

You can skip configuration if you just want to [deploy Lunchbox](#deploy-the-desktop-app) and start using it with the application's default branding (or you can [download the Demo](http://blog.apps.npr.org/lunchbox/) ). Configuration options allow you to tailor the app to match your organization's branding and theme.

### Assets

If you are customizing the branding of the apps, you will probably want to use your organization's web fonts and logos.

For fonts, we provide a Jinja template at `templates/_fonts.html` using Typekit's [webfontloader](https://github.com/typekit/webfontloader) for loading fonts from Google, Typekit, or custom stylesheets. Then, the fonts will be available in the CSS and JavaScript in all of the apps.

For your organization's logos, you can provide SVGs or PNGs. Make sure that there is no whitespace around the logo so that the padding performs properly. You can place them anywhere in the `www` folder as long as you link them correctly when you [define your global variables](#define-your-global-variables), but we recommend `www/img`.

For Waterbug, you will want to have a white version and a black version of your logo so that you can choose the appropriate version for light and dark photos.

### Define global variables

There are two places where variables are defined, one place for Quotable and Factlist and one place for Waterbug.

#### Quotable/Factlist

For Quotable and Factlist, all configuration takes places in `less/variables.less`. You can define font families, establish the default background color/text color and define the logo used on the images.

Importantly, if you use a custom logo, you will also need to explicitly define the width and height of the logo in both square crop and 16:9 crop scenarios. The variables at the top of the file will do this:

```
@logo-path: url('../path/to/logo.svg');
@logo-sq-width: 145px;
@logo-sq-height: 48px;
@logo-16x9-width: 121px;
@logo-16x9-height: 40px;
```

Additionally, you can fine-tune various aspects of Quotable and Factlist using the app-specific variables also listed in the file. The defaults should work well out of the box, but your organization's logo or font may require tweaks.

#### Waterbug

Waterbug has a different configuration system because it cannot be controlled through CSS. To customize Waterbug, go to `www/js/waterbug-config.js` and customize the variables at the top of the file.

In this file, you can define the logos used and the sizes with which they render by editing the `logos` object.

```
var logos = {
    'name-of-logo': {
        whitePath: '../path/to/logo-white.svg', // path to white logo
        blackPath: '../path/to/logo-black.svg', // path to black logo
        w: 200, // width of logo
        h: 67, // height of logo
        display: 'Name of logo' // how the button toggle will appear in the UI
    },
    'name-of-second-logo': {
        whitePath: '../path/to/second-logo-white.svg',
        blackPath: '../path/to/second-logo-black.svg',
        w: 150,
        h: 51,
        display: 'Name of second logo'
    }
};
```

If you have more than one logo, the UI will automatically add toggle buttons so that you can switch between logos on the fly.

Additionally, You can change every property of the font rendering (font face, size, shadow, etc.) as well as the padding around all of the elements (`elementPadding`) in the image and the export width of the image (`canvasWidth`).

You will want to configure the copyright options for Waterbug based on the photo providers your news organization can use. This is defined in an large object that contains an object for each copyright option. The boolean values control the behavior of the form:

```
// copyright options
var orgName = 'Your News Organization';
var freelanceString = 'for ' + orgName;

var copyrightOptions = {
    'internal': {
        showPhotographer: true, // show the photographer input box
        showSource: false, // show the source input box
        photographerRequired: false, // require a photographer
        sourceRequired: false, // require a source
        source: orgName, // How the source should appear on the image, e.g. 'NPR'
        display: orgName, // How the option will appear in the dropdown menu
    },
    'freelance': {
        showPhotographer: true,
        showSource: false,
        photographerRequired: true,
        sourceRequired: false,
        source: freelanceString,
        display: 'Freelance'
    },
    'ap': {
        showPhotographer: true,
        showSource: false,
        photographerRequired: false,
        sourceRequired: false,
        source: 'AP',
        display: 'AP'
    },
    'getty': {
        showPhotographer: true,
        showSource: false,
        photographerRequired: false,
        sourceRequired: false,
        source: 'Getty Images',
        display: 'Getty'
    },
    'thirdParty': {
        showPhotographer: true,
        showSource: true,
        photographerRequired: false,
        sourceRequired: true,
        source: '',
        display: 'Third Party/Courtesy'
    }
}
```

The app will automatically add all of your copyright options to the dropdown menu. Also, it will perform form validation based on the boolean values above.

Finally, you can configure the application defaults. Ensure that the logo and image paths point to existing files:

```
// app load defaults
var currentCrop = 'twitter'; // default crop size
var currentLogo = 'lunchbox'; // default logo slug
var currentLogoColor = 'white'; // default logo color
var currentTextColor = 'white'; // default text color
var defaultImage = '../img/test-kitten.jpg'; // path to image to load as test image
var defaultLogo = logos[currentLogo]['whitePath'] // path to default logo
```

At the bottom of the form, you will notice a Sharing Guidelines section. To edit that section, you can just update the list in `templates/waterbug.html`.

### Multiple Themes

For Quotable and Factlist, you can provide up to three themes in addition to the default theme if your news organization requires different branding for different accounts (think [NPR](http://twitter.com/npr) vs. [NPR Music](http://twitter.com/nprmusic)).

In `less/variables.less`, you can define themes at the bottom of the file. For each theme, you can change the background color, text color, and logo:

```
@theme2-bg-color: #41474E;
@theme2-text-color: #dbe0e6;
@theme2-logo-path: url('../img/icon-socializr-white.svg');
@theme2-sq-logo-width: 145px;
@theme2-sq-logo-height: 48px;
@theme2-16x9-logo-width: 121px;
@theme2-16x9-logo-height: 40px;
```

In the form UI, you can change the display of the theme selection buttons in each app's HTML template (`templates/quotable.html`, `templates/factlist.html`). Be sure not to change the ID attribute of the button, as these IDs control the JavaScript that adds and removes classes on the image.

Deployment
===============
We support two separate deployment options: Amazon S3 and any fileserver that you can SSH into.


Deploy to Amazon S3
-------------------

For Amazon S3, ensure that you have your AWS Access Key ID and Secret Access Key stored as environment variables as such:

```
export AWS_ACCESS_KEY_ID="YOURACCESSKEYID"
export AWS_SECRET_ACCESS_KEY="YOURSECRETACCESSKEY"
```

Then, in `app_config.py`, change your staging and production S3 targets:

```
PRODUCTION_S3_BUCKET = 'your.bucket.org'
STAGING_S3_BUCKET = 'stage-your.bucket.org'
```

With these variables set, you can run `fab [production/staging] master deploy` to deploy Lunchbox to your S3 bucket.


Deploy to other file server
---------------------------

For other file servers, you can change the following app_config variables:

```
FILE_SERVER_USER = 'ubuntu' # set this to the user you use to SSH onto the server
FILE_SERVER = 'your.fileserver.org' # set this to either the hostname or IP address of your file server
FILE_SERVER_PATH = '~/www' # set this to the path that your server serves files to the web from
```

Then, you can run `fab fileserver master deploy`. This will `rsync` the rendered files to `FILE_SERVER_PATH/lunchbox`.


Known Issues
-------------

- Firefox compatibility with SVG: Firefox is not capable of rendering SVG logos with Quotable or Factlist.

About
-------------

Lunchbox consolidates [NPR](https://github.com/nprapps/)’s [Quotable](https://github.com/nprapps/quotable), [Factlist](https://github.com/nprapps/factlist) and [Waterbug](https://github.com/nprapps/waterbug), apps into a suite of tools for the newsroom.

It was worked on during the [OpenNews](http://opennews.org) Portland Code Convening on July 23-24, 2015.

Additional contributors:

- [Jason Emory Parker](https://github.com/postandcourier)
- [Ben Chartoff](https://github.com/bchartoff)
- [Chris Barna](https://github.com/ctbarna)
