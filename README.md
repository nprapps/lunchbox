# portland
OpenNews Portland Code Convening, July 23-24, 2015.

This project consolidates NPR’s [Quotable](https://github.com/nprapps/quotable), [Waterbug](https://github.com/nprapps/waterbug), and [Factlist](https://github.com/nprapps/factlist) apps into a as a stand-alone desktop suite of social tools for the newsroom. 

## Quick Start

The install process is just like any other app template-based project:

```
mkvirtualenv portland
pip install -r requirements.txt
npm install
```

To build an electron app:

```
fab production build_electron
```

Compiled binaries are found in the `electron/` folder after you run this command.