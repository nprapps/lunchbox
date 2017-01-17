var $text = null;
var $quotation = null;
var $annotation = null;
var $annotationAuthor = null;
var $annotationAuthorInput = null;
var $authorTitle = null;
//var annotationTitle = null;
var $annotationTitleInput = null;
var $save = null;
var $poster = null;
var $fontSize = null;
var $kicker = null;
var $kickerInput = null;
var $source = null;
var $logoWrapper = null;
var showCredit = null;
var $attributionInput = null;
var $quoteFontSizeDecrease = null;
var $quoteFontSizeIncrease = null;
var $annotationFontSizeDecrease = null;
var $annotationFontSizeIncrease = null;

var FONT_SIZE_CHANGE_FACTOR = 1

/*
 * Run on page load.
 */
var onDocumentLoad = function() {
    $text = $('.poster blockquote p, .show-credit, .annotation p');
    $quotation = $('.poster blockquote');
    $annotation = $('.poster .annotation');
    $annotationAuthor = $('.annotation-author .author');
    $annotationAuthorInput = $('#annotation-author');
    $authorTitle = $('.annotation-author .title');
    //$annotationTitle = $('.annotation-title .title');
    $annotationTitleInput = $('#annotation-title');
    $save = $('#save');
    $poster = $('.poster');
    $fontSize = $('#fontsize');
    $kicker = $('.kicker');
    $kickerInput = $('#kicker');
    $logoWrapper = $('.logo-wrapper');
    $showCredit = $('.show-credit');
    $attributionInput = $('#attribution');
    $quoteFontSizeDecrease = $('.font-size-adjust.quote .decrease');
    $quoteFontSizeIncrease = $('.font-size-adjust.quote .increase');
    $annotationFontSizeDecrease = $('.font-size-adjust.annotation .decrease');
    $annotationFontSizeIncrease = $('.font-size-adjust.annotation .increase');

    $save.on('click', saveImage);
    $fontSize.on('change', onFontSizeChange);
    $kickerInput.on('keyup', onKickerKeyup);
    $annotationAuthorInput.on('keyup', onAnnotationAuthorKeyup);
    $annotationTitleInput.on('keyup', onAnnotationTitleKeyup);
    $attributionInput.on('keyup', onAttributionKeyup);
    $quoteFontSizeDecrease.on('click', onFontSizeChangeClick);
    $quoteFontSizeIncrease.on('click', onFontSizeChangeClick);
    $annotationFontSizeDecrease.on('click', onFontSizeChangeClick);
    $annotationFontSizeIncrease.on('click', onFontSizeChangeClick);

    setupInitialState();
    setupMediumEditors();
}


var setupInitialState = function() {
    //UTILS.adjustFontSize(16);
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
        placeholder: 'Quote here',
        cleanPastedHTML: true
    });

    var annotationEditor = new MediumEditor(annotationEl, {
        toolbar: false,
        spellcheck: false,
        placeholder: 'Annotation here',
        cleanPastedHTML: true
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

var onAnnotationAuthorKeyup = function(){
  var inputText = $(this).val();
  $annotationAuthor.text(inputText);
}

var onAnnotationTitleKeyup = function(){
  var inputText = $(this).val();
  $authorTitle.text(inputText);
}

var onAttributionKeyup = function(){
  var inputText = $(this).val();
  $showCredit.text(inputText);
}

var onFontSizeChangeClick = function() {
    var $currentSize = $(this).siblings().filter('.current-size');
    var currentSize = parseInt($currentSize.text().split('px')[0]);
    var operator = $(this).attr('class');

    if ($(this).parent().hasClass('annotation')) {
        var adjustTarget = 'annotation';
    } else {
        var adjustTarget = 'quote';
    }

    if (operator === 'decrease') {
        var newSize = currentSize - FONT_SIZE_CHANGE_FACTOR;
    }
    else {
        var newSize = currentSize + FONT_SIZE_CHANGE_FACTOR;
    }
    $poster.find('.' + adjustTarget + ' p' ).css('font-size', newSize + 'px');
    $currentSize.text(newSize.toString() + 'px');
}

$(onDocumentLoad);
