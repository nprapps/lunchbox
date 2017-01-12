var $text = null;
var $quotation = null;
var $annotation = null;
var $annotationAuthor = null;
var $authorTitle = null;
var $save = null;
var $poster = null;
var $fontSize = null;
var $kicker = null;
var $kickerInput = null;
var $source = null;
var $logoWrapper = null;

/*
 * Run on page load.
 */
var onDocumentLoad = function() {
    $text = $('.poster blockquote p, .show-credit, .annotation p');
    $quotation = $('.poster blockquote');
    $annotation = $('.poster .annotation');
    $annotationAuthor = $('.annotation-author .author');
    $authorTitle = $('.annotation-author .title');
    $save = $('#save');
    $poster = $('.poster');
    $fontSize = $('#fontsize');
    $kicker = $('.kicker');
    $kickerInput = $('#kicker');
    $logoWrapper = $('.logo-wrapper');

    $save.on('click', saveImage);
    $fontSize.on('change', onFontSizeChange);
    $kickerInput.on('keyup', onKickerKeyup);

    setupInitialState();
    setupMediumEditors();
}


var setupInitialState = function() {
    UTILS.adjustFontSize(16);
    UTILS.processText();
}

/*
 * Bind a medium editor to the poster blockquote
 */
var setupMediumEditors = function(){
    var quoteEl = document.querySelectorAll('.poster blockquote');
    var annotationEl = document.querySelector('.poster .annotation');

    var quoteEditor = new MediumEditor(quoteEl, {
        toolbar: false,
        spellcheck: false,
        placeholder: ''
    });

    var annotationEditor = new MediumEditor(annotationEl, {
        toolbar: false,
        spellcheck: false,
        placeholder: ''
    });

    $quotation.focus();
}

/*
 * Convert the poster HTML/CSS to canvas and export an image
 */
var saveImage = function() {
    // first check if the quote actually fits
    if (($quotation.offset().top + $quotation.height()) > $logoWrapper.offset().top) {
        var tooTallMessage = "Your list is too long. Shorten the text or choose a smaller font-size.";
    }

    if ($kicker.width() > $poster.width()) {
        var tooWideMessage = "Your headline is too wide. Shorten the headline.";
    }

    if (tooTallMessage || tooWideMessage) {
          var alertMessage;
          if (tooTallMessage && tooWideMessage) {
              alertMessage = tooTallMessage + '\n' + tooWideMessage;
          } else {
              alertMessage = (tooTallMessage) ? tooTallMessage : tooWideMessage;
          }
          alert(alertMessage);
          return;
    }

    UTILS.processText();

    var headline = $kicker.text().split(' ', 9);
    var filename = UTILS.convertToSlug(headline.join(' '));

    domtoimage.toBlob(document.querySelector('.poster'))
        .then(function(blob) {
            window.saveAs(blob, 'factlist-' + filename + '.png');
        });
}

var onFontSizeChange = function() {
    UTILS.adjustFontSize($(this).val());
}

/*
 * Update the kicker text
 */
var onKickerKeyup = function(e) {
    var inputText = $(this).val();
    $kicker.text(inputText);
}

$(onDocumentLoad);
