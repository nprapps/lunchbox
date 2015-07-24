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

(description of what the tool does and who it's for. Point to user guide for app usage (end-user focused content on github pages)


Assumptions 
-------------

Building this app as a developer runs under the following assumptions:

* You are running OSX.
* You are using Python 2.7. (Probably the version that came OSX.)
* You have [virtualenv](https://pypi.python.org/pypi/virtualenv) and [virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper) installed and working.
* You have node.js installed (on OSX, `brew install node`).

For more details on the technology stack used, see our [development environment blog post](http://blog.apps.npr.org/2013/06/06/how-to-setup-a-developers-environment.html).

What's in here?
-------------

(how the repo is organized, what each folder contains)

* ``fabfile`` -- [Fabric](http://docs.fabfile.org/en/latest/) commands for automating setup and deployment.
* ``less`` -- App stylesheets and Bootstrap.
* ``templates`` -- HTML ([Jinja2](http://jinja.pocoo.org/docs/)) templates, to be compiled locally.
* ``www`` -- App assets and rendered files.
* ``app.py`` -- A [Flask](http://flask.pocoo.org/) app for rendering the project locally.
* ``app_config.py`` -- Configuration variables for the app.
* ``package.json`` -- Node requirements and scripts for building the electron app.
* ``render_utils.py`` -- Utilities for rendering the Flask app into flat files.
* ``requirements.txt`` -- Python requirements.
* ``static.py`` -- Static file routes for the Flask app.


Quick Start
-------------
Clone the repo and install requirements.

```
mkvirtualenv portland
pip install -r requirements.txt
npm install
```

Run the project locally:

```
fab app
```

Then, open a browser window and go to [127.0.0.1:8000](http://127.0.0.1:8000).

Build the electron app:

```
fab production build_electron
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





