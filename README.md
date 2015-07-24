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

TKTK APP NAME is a customizable suite that is deployable as a desktop app. Set-up and customization instructions are included below. For end-users of the tools, see [usage guidelines](#).

Assumptions 
-------------

(how it's going to be used, presumed expertise)

* 

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
(Bootstrap the project)

The install process is just like any other app template-based project:

```
mkvirtualenv portland
pip install -r requirements.txt
npm install
```

Run the project

```
fab app
```


Configuration
-------------

- define global variables
- where to place assets
- how to format assets
- further customizing the app (for more fine-point customizations, where to change things
- theming

Deploy the desktop app
-------------

(on using Electron)

To build an electron app:

```
fab production build_electron
```

Compiled binaries are found in the `electron/` folder after you run this command.

About
-------------

This project consolidated [NPR](https://github.com/nprapps/)’s [Quotable](https://github.com/nprapps/quotable), [Waterbug](https://github.com/nprapps/waterbug), and [Factlist](https://github.com/nprapps/factlist) apps into a stand-alone desktop suite of social tools for the newsroom. 

It was worked on during the OpenNews Portland Code Convening on July 23-24, 2015.





