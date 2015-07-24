// widths and padding
var canvasWidth = 1000; // this will be the exported width of the image
var elementPadding = 40; // padding around the logo and credit text

// logo configuration
// the name of the logo object should match the value of the corresponding radio button in the HTML.
var logos = {
    'lunchbox': {
        whitePath: '../img/icon-lunchbox-white.svg', // path to white logo
        blackPath: '../img/icon-lunchbox-black.svg', // path to black logo
        w: 100, // width of logo
        h: 80, // height of logo
        display: 'Lunchbox'
    },
    'npr': {
        whitePath: '../assets/logo-npr-white.png',
        blackPath: '../assets/logo-npr-black.png',
        w: 150,
        h: 51,
        display: 'NPR'
    }
};

// logo opacity for colors
var whiteLogoAlpha = '0.8';
var blackLogoAlpha = '0.6';

// type
var fontWeight = 'normal'; // font weight for credit
var fontSize = '20pt'; // font size for credit
var fontFace = "Helvetica"; // font family for credit
var fontShadow = 'rgba(0,0,0,0.7)'; // font shadow for credit
var fontShadowOffsetX = 0; // font shadow offset x
var fontShadowOffsetY = 0; // font shadow offset y
var fontShadowBlur = 10; // font shadow blur

// copyright options
var orgName = 'Your News Organization';
var freelanceString = 'for ' + orgName;

var copyrightOptions = {
    'internal': {
        showPhotographer: true,
        showSource: false,
        photographerRequired: false,
        sourceRequired: false,
        source: orgName,
        display: orgName,        
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

// app load defaults
var currentCrop = 'twitter'; // default crop size
var currentLogo = 'lunchbox'; // default logo slug
var currentLogoColor = 'white'; // default logo color
var currentTextColor = 'white'; // default text color
var defaultImage = '../img/test-kitten.jpg'; // path to image to load as test image
var defaultLogo = logos[currentLogo]['whitePath'] // path to default logo