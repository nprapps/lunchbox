var $text = null;
var $save = null;
var $poster = null;
var $themeButtons = null;
var $aspectRatioButtons = null;
var $quote = null;
var $fontSize = null;
var $show = null;
var $source = null;
var $quote = null;
var $logoWrapper = null;
var quotes = [
    {
        "quote": "I'd been drinking.",
        "source": "Dennis Rodman"
    },
    {
        "quote": "I've made a huge mistake.",
        "source": "G.O.B."
    },
    {
        "quote": "Yes, I have smoked crack cocaine",
        "source": "Toronto Mayor Rob Ford",
        "size": 65
    },
    {
        "quote": "Annyong.",
        "source": "Annyong",
        "size": 90
    },
    {
        "quote": "STEVE HOLT!",
        "source": "Steve Holt",
        "size": 65
    },
    {
        "quote": "Whoa, whoa, whoa. There's still plenty of meat on that bone. Now you take this home, throw it in a pot, add some broth, a potato. Baby, you've got a stew going.",
        "source": "Carl Weathers",
        "size": 40
    }
];

var onDocumentLoad = function() {
    $text = $('.poster blockquote p, .source');
    $save = $('#save');
    $poster = $('.poster');
    $themeButtons = $('#theme .btn');
    $aspectRatioButtons = $('#aspect-ratio .btn');
    $fontSize = $('#fontsize');
    $show = $('#show');
    $source = $('.source');
    $showCredit = $('.show-credit');
    $quote = $('#quote');
    $logoWrapper = $('.logo-wrapper');

    $save.on('click', saveImage);
    $themeButtons.on('click', onThemeButtonClick);
    $aspectRatioButtons.on('click', onAspectRatioButtonClick);
    $quote.on('click', onQuoteButtonClick);
    $fontSize.on('change', onFontSizeChange);
    $show.on('keyup', onAttributionKeyup);

    setupInitialState();
    setupMediumEditors();
}

var setupInitialState = function() {
    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    if (quote.size){
        adjustFontSize(quote.size);
    }
    $('blockquote p').text(quote.quote);
    $source.html('&mdash;&thinsp;' + quote.source);
    processText();
}

var setupMediumEditors = function() {
    var quoteEl = document.querySelectorAll('.poster blockquote');
    var sourceEl = document.querySelectorAll('.source');

    var quoteEditor = new MediumEditor(quoteEl, {
        toolbar: false,
        spellcheck: false,
        placeholder: 'Type your quote here'
    });

    var sourceEditor = new MediumEditor(sourceEl, {
        toolbar: false,
        spellcheck: false,
        placeholder: 'Type your quote source here'
    });
}

var saveImage = function() {
    // first check if the quote actually fits
    if (($source.offset().top + $source.height()) > $logoWrapper.offset().top) {
        alert("Your quote doesn't quite fit. Shorten the text or choose a smaller font-size.");
        return;
    }

    // don't print placeholder text if source is empty
    if ($source.text() === '') {
        alert("A source is required.");
        return;
    }

    // make sure source begins with em dash
    if (!$source.text().match(/^[\u2014]/g)) {
        $source.html('&mdash;&thinsp;' + $source.text());
    }

    $('canvas').remove();
    processText();

    var quote = $('blockquote').text().split(' ', 5);
    var filename = convertToSlug(quote.join(' '));

    domtoimage.toBlob(document.querySelector('.poster'))
        .then(function(blob) {
            window.saveAs(blob, 'quote-' + filename + '.png');
        });
}

var onCanvasRender = function(canvas) {
    document.body.appendChild(canvas);
    window.oCanvas = document.getElementsByTagName("canvas");
    window.oCanvas = window.oCanvas[0];
    var strDataURI = window.oCanvas.toDataURL();

    var quote = $('blockquote').text().split(' ', 5);
    var filename = convertToSlug(quote.join(' '));

    var a = $("<a>").attr("href", strDataURI).attr("download", "quote-" + filename + ".png").appendTo("body");

    a[0].click();

    a.remove();

    $('#download').attr('href', strDataURI).attr('target', '_blank');
    $('#download').trigger('click');
}

function adjustFontSize(size) {
    var fontSize = size.toString() + 'px';
    $poster.css('font-size', fontSize);
    if ($fontSize.val() !== size){
        $fontSize.val(size);
    };
}

var onThemeButtonClick = function() {
    $themeButtons.removeClass().addClass('btn btn-primary');
    $(this).addClass('active');
    $poster
        .removeClass('poster-theme1 poster-theme2 poster-theme3 poster-theme4')
        .addClass('poster-' + $(this).attr('id'));
}

var onAspectRatioButtonClick =  function() {
    $aspectRatioButtons.removeClass().addClass('btn btn-primary');
    $(this).addClass('active');
    $poster
        .removeClass('square sixteen-by-nine')
        .addClass($(this).attr('id'));

    if ($poster.hasClass('sixteen-by-nine')) {
        adjustFontSize(32);
        $fontSize.val(32);
    } else {
        adjustFontSize(90);
        $fontSize.val(90);
    }
}

var onQuoteButtonClick = function() {
    $(this).find('button').toggleClass('active');
    $poster.toggleClass('quote');
}

var onFontSizeChange = function() {
    adjustFontSize($(this).val());
}

var onAttributionKeyup = function() {
    var inputText = $(this).val();
    $showCredit.text(inputText);
}

// Change straight quotes to curly and double hyphens to em-dashes.
function smarten(a) {
  a = a.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
  a = a.replace(/'/g, "\u2019");                            // closing singles & apostrophes
  a = a.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  a = a.replace(/"/g, "\u201d");                            // closing doubles
  a = a.replace(/--/g, "\u2014");                           // em-dashes
  a = a.replace(/ \u2014 /g, "\u2009\u2014\u2009");         // full spaces wrapping em dash
  return a;
}

function convertToSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
}

function processText() {
    $text = $('.poster blockquote p, .source');
    $text.each(function() {
        var rawText = $.trim($(this).html());
        $(this).html(smarten(rawText)).find('br').remove();
    });
}

$(onDocumentLoad);
