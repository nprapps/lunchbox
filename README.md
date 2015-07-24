Lunchbox
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

* *Quotable*: Converts quoted text into a branded image
* *Factlist*: Produces a branded image with a list of items.
* *Waterbug*: Creates a watermarked image with attribution.

Assumptions 
-------------

**Lunchbox** is a customizable toolset deployable as a desktop app. The following instructions are meant for developers setting up and customizing the app for their organization. For end-users of the tools, see [usage guidelines](#).

The following things are assumed to be true in this documentation.

* You are running OSX.
* You are using Python 2.7. (Probably the version that came OSX.)
* You have [virtualenv](https://pypi.python.org/pypi/virtualenv) and [virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper) installed and working.

What's in here?
-------------

(how the repo is organized, what each folder contains)

* ``fabfile`` -- [Fabric](http://docs.fabfile.org/en/latest/) commands for automating setup and deployment.
* ``less`` -- Application styles and [Bootstrap](http://getbootstrap.com/css/) less files.
* ``templates`` -- HTML ([Jinja2](http://jinja.pocoo.org/docs/)) templates, to be compiled locally.
* ``www`` -- App assets and rendered files.
* ``app.py`` -- A [Flask](http://flask.pocoo.org/) app for rendering the project locally.
* ``app_config.py`` -- Configuration variables for the Flask app.
* ``package.json`` -- Node dependencies and scripts for building [Electron](https://github.com/atom/electron) app.
* ``render_utils.py`` -- Helper functions for baking out Flask app.
* ``requirements.txt`` -- Python requirements.
* ``static.py`` -- Routes for static files in Flask app.


Quick Start
-------------

Bootstrap the project by cloning this repo and installing the following:

```
mkvirtualenv lunchbox
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

You can skip configuration if you just want to [deploy Lunchbox](#deploy-the-desktop-app) and start using it. Configuration options allow you to tailor the app to match your organization's branding and theme.

### Assets

If you are customizing the branding of the apps, you will probably want to use your organization's web fonts and logos.

For fonts, we provide a Jinja template at `templates/_fonts.html` using Typekit's [webfontloader](https://github.com/typekit/webfontloader) for loading fonts from Google, Typekit, or custom stylesheets. Then, the fonts will be available in the CSS and JavaScript in all of the apps.

For your organization's logos, you can provide SVGs or PNGs. Make sure that there is no whitespace around the logo so that the padding performs properly. You can place them anywhere in the `www` folder as long as you link them correctly when you [define your global variables](#define-your-global-variables), but we recommend `www/img`.

For Waterbug, you will want to have a white version and a black version of your logo so that you can choose the appropriate version for light and dark photos.

### Define global variables

There are two places where variables are defined. For Quotable and Factlist, all configuration takes places in `less/variables.less`. You can define font families, establish the default background color/text color and define the logo used on the images. 

Importantly, if you use a custom logo, you will also need to explicitly define the width and height of the logo in both square crop and 16x9 crop scenarios. The variables at the top of the file will do this: 

```
@logo-path: url('../path/to/logo.svg');
@logo-sq-width: 145px;
@logo-sq-height: 48px;
@logo-16x9-width: 121px;
@logo-16x9-height: 40px;
```

Additionally, you can fine-tune various aspects of Quotable and Factlist using the app-specific variables also listed in the file. The defaults should work well out of the box, but your organization's logo or font may require tweaks.

Waterbug has a different configuration system because it cannot be controlled through CSS. To customize Waterbug, go to `www/js/waterbug.js` and customize the variables at the top of the file. 

In this file, you can define the logos used and the sizes with which they render by editing the `logos` object. Note that each logo's individual object must match the value of its corresponding radio button in `templates/waterbug.html`:

```
var logos = {
    'name-of-logo': {
        whitePath: '../path/to/logo-white.svg', // path to white logo
        blackPath: '../path/to/logo-black.svg', // path to black logo
        w: 200, // width of logo
        h: 67, // height of logo
    },
    'name-of-second-logo': {
        whitePath: '../path/to/second-logo-white.svg',
        blackPath: '../path/to/second-logo-white.svg',
        w: 150,
        h: 51
    }
};
```

Additionally, you can change every property of the font rendering (font face, size, shadow, etc.) as well as the padding around all of the elements in the image. 

- further customizing the app (for more fine-point customizations, where to change things
- theming
- changing desktop app icon

Deploy the desktop app
-------------

The project uses [Electron](https://github.com/atom/electron) to create desktop apps for OSX, Windows and Linux.

To build an electron app:

```
fab production build_electron
```

Compiled binaries for each platform are found in the `electron/` folder after you run this command.

About
-------------

Lunchbox consolidates [NPR](https://github.com/nprapps/)’s [Quotable](https://github.com/nprapps/quotable), [Waterbug](https://github.com/nprapps/waterbug), and [Factlist](https://github.com/nprapps/factlist) apps into a stand-alone desktop suite of social tools for the newsroom. 

It was worked on during the OpenNews Portland Code Convening on July 23-24, 2015.





