portland
=============

* [What is this?](#what-is-this)
* [Assumptions?](#assumptions)
* [What's in here?](#what-is-in-here)
* [Quick start](#quick-start)
* [Configuration](#configuration)
* [Run the project](#run-the-project)
* [Moar](#moar)

What is this?
-------------

(description of what the tool does and who it's for. Point to user guide for app usage (end-user focused content on github pages)


Assumptions 
-------------

(how it's going to be used, presumed expertise)


What's in here?
-------------

(how the repo is organized, what each folder contains)


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

Run the project
-------------

(on using Electron)

To build an electron app:

```
fab production build_electron
```

Compiled binaries are found in the `electron/` folder after you run this command.

Moar
-------------

This project consolidated [NPR](https://github.com/nprapps/)’s [Quotable](https://github.com/nprapps/quotable), [Waterbug](https://github.com/nprapps/waterbug), and [Factlist](https://github.com/nprapps/factlist) apps into a stand-alone desktop suite of social tools for the newsroom. 

It was worked on during the OpenNews Portland Code Convening on July 23-24, 2015.





