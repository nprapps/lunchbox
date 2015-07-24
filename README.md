portland
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

TKTK APP NAME is a suite of tools to create images intended for social media sharing. This includes:

* *Quotable*: Creates a branded quoted text as an image
* *Factlist*: Creates a branded bulleted list of items as an image
* *Waterbug*: Creates a watermarked and attributed image

Assumptions 
-------------

TKTK APP NAME is a customizable suite that is deployable as a desktop app. The following instructions are meant for developers setting up and customizing the app for their organization. For end-users of the tools, see [usage guidelines](#).

The following things are assumed to be true in this documentation.

* You are running OSX.
* You are using Python 2.7. (Probably the version that came OSX.)
* You have [virtualenv](https://pypi.python.org/pypi/virtualenv) and [virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper) installed and working.

What's in here?
-------------

(how the repo is organized, what each folder contains)

* ``fabfile`` -- [Fabric](http://docs.fabfile.org/en/latest/) commands for automating setup and deployment.
* ``less`` -- [Bootstrap](http://getbootstrap.com/css/) and compressed app styles.
* ``templates`` -- HTML ([Jinja2](http://jinja.pocoo.org/docs/)) templates, to be compiled locally.
* ``www`` -- App assets and rendered files.
* ``app.py`` -- A [Flask](http://flask.pocoo.org/) app for rendering the project locally.
* ``app_config.py`` -- .
* ``package.json`` -- .
* ``render_utils.py`` -- .
* ``requirements.txt`` -- Python requirements.
* ``static.py`` -- .


Quick Start
-------------

Bootstrap the project by cloning this repo and installing the following:

```
mkvirtualenv TKTK APP NAME
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

You can skip configuration if you just want to [deploy the app](#deploy-the-desktop-app) and start using it. Configuration options allow you to tailor the app to match your organization's branding and theme.

- define global variables
- where to place assets
- how to format assets
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

This project consolidated [NPR](https://github.com/nprapps/)’s [Quotable](https://github.com/nprapps/quotable), [Waterbug](https://github.com/nprapps/waterbug), and [Factlist](https://github.com/nprapps/factlist) apps into a stand-alone desktop suite of social tools for the newsroom. 

It was worked on during the OpenNews Portland Code Convening on July 23-24, 2015.





