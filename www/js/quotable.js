var $text = null;
var $save = null;
var $poster = null;
var $themeButtons = null;
var $aspectRatioButtons = null;
var $quote = null;
var $fontSize = null;
var $show = null;
var $attribution = null;
var $quote = null;
var $logoWrapper = null;
var quotes = [
    {
        "quote": "Your short quote goes here. Keep it under 100 characters. Someone else should edit it!",
        "attribution": "Susie Jones, NPR editor, on how to make NPR Quotables",
        "source": "ALL THINGS CONSIDERED",
        "size": 32
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
    $attribution = $('.source');
    $showCredit = $('.show-credit');
    $quote = $('#quote');
    $logoWrapper = $('.logo-wrapper');

    $save.on('click', saveImage);
    $themeButtons.on('click', onThemeButtonClick);
    $aspectRatioButtons.on('click', onAspectRatioButtonClick);
    $quote.on('click', onQuoteButtonClick);
    $fontSize.on('change', onFontSizeChange);
    $show.on('keyup', onSourceKeyup);
    $attribution.on('blur', onAttributionBlur);

    setupInitialState();
    setupMediumEditors();
}

var setupInitialState = function() {
    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    if (quote.size){
        UTILS.adjustFontSize(quote.size);
    }
    $('blockquote p').text(quote.quote);
    $attribution.html('&mdash;&thinsp;' + quote.attribution);
    if (quote.source){
        $show.val(quote.source);
        $showCredit.text(quote.source);
    }
    UTILS.processText()
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
        placeholder: 'Type your quote attribution here.'
    });
}

var saveImage = function() {
    // first check if the quote actually fits
    if (($attribution.offset().top + $attribution.height()) > $logoWrapper.offset().top) {
        alert("Your quote doesn't quite fit. Shorten the text or choose a smaller font-size.");
        return;
    }

    // don't print placeholder text if source is empty
    if ($attribution.text() === '') {
        alert("An attribution is required.");
        return;
    }

    // make sure source begins with em dash
    if (!$attribution.text().match(/^[\u2014]/g)) {
        $attribution.html('&mdash;&thinsp;' + $attribution.text());
    }

    UTILS.processText();

    var quote = $('blockquote').text().split(' ', 5);
    var filename = UTILS.convertToSlug(quote.join(' '));

    domtoimage.toBlob(document.querySelector('.poster'))
        .then(function(blob) {
            window.saveAs(blob, 'quote-' + filename + '.png');
        });
}

var onThemeButtonClick = function() {
    $themeButtons.removeClass().addClass('btn btn-primary');
    $(this).addClass('active');
    $poster
        .removeClass('poster-theme1 poster-theme2 poster-theme3 poster-theme4 poster-theme5')
        .addClass('poster-' + $(this).attr('id'));
}

var onAspectRatioButtonClick =  function() {
    $aspectRatioButtons.removeClass().addClass('btn btn-primary');
    $(this).addClass('active');
    $poster
        .removeClass('square sixteen-by-nine')
        .addClass($(this).attr('id'));

    if ($poster.hasClass('sixteen-by-nine')) {
        UTILS.adjustFontSize(32);
        $fontSize.val(32);
    } else {
        UTILS.adjustFontSize(90);
        $fontSize.val(90);
    }
}

var onQuoteButtonClick = function() {
    $(this).find('button').toggleClass('active');
    $poster.toggleClass('quote');
}

var onFontSizeChange = function() {
    UTILS.adjustFontSize($(this).val());
}

var onSourceKeyup = function() {
    var inputText = $(this).val();
    $showCredit.text(inputText);
}

var onAttributionBlur = function() {
    // make sure source begins with em dash after loosing focus
    if ($attribution.text().length >= 1 && !$attribution.text().match(/^[\u2014]/g)) {
        $attribution.html('&mdash;&thinsp;' + $attribution.text());
    } else {
        $attribution.html($attribution.text());
    }
}

$(onDocumentLoad);
