var $text = null;
var $factList = null;
var $save = null;
var $poster = null;
var $themeButtons = null;
var $aspectRatioButtons = null;
var $fontSize = null;
var $timestamp = null;
var $timestampToggleButtons = null;
var $kicker = null;
var $kickerInput = null;
var $source = null;
var $logoWrapper = null;
var $updateTime = null;
var timestampInterval = null;

/*
 * Run on page load.
 */
var onDocumentLoad = function() {
    $text = $('.poster blockquote p, .source');
    $factList = $('.poster blockquote');
    $save = $('#save');
    $poster = $('.poster');
    $themeButtons = $('#theme .btn');
    $aspectRatioButtons = $('#aspect-ratio .btn');
    $fontSize = $('#fontsize');
    $timestamp = $('.timestamp');
    $timestampToggleButtons = $('#timestamp-toggle .btn');
    $kicker = $('.kicker');
    $kickerInput = $('#kicker');
    $logoWrapper = $('.logo-wrapper');
    $updateTime = $('#update-time');

    $save.on('click', saveImage);
    $themeButtons.on('click', onThemeClick);
    $aspectRatioButtons.on('click', onAspectRatioClick);
    $timestampToggleButtons.on('click', onTimestampToggleClick);
    $fontSize.on('change', onFontSizeChange);
    $kickerInput.on('keyup', onKickerKeyup);

    setupInitialState();
    setupMediumEditor();
}


var setupInitialState = function() {
    UTILS.adjustFontSize(32);
    UTILS.processText();
    updateTimestamp();
    timestampInterval = setInterval(updateTimestamp, 1000);
    $('[data-toggle="tooltip"]').tooltip();
}

/*
 * Bind a medium editor to the poster blockquote
 */
var setupMediumEditor = function(){
    var quoteEl = document.querySelectorAll('.poster blockquote');

    var quoteEditor = new MediumEditor(quoteEl, {
        toolbar: false,
        spellcheck: false,
        placeholder: ''
    });

    $factList.focus();
}

/*
 * Set the timestamp text to the current time
 */
var updateTimestamp = function() {
    var latestTime = moment().format('MMMM D, YYYY h:mm A');
    if (latestTime != $timestamp.text()) {
       $timestamp.text(latestTime);
    }
}

/*
 * Convert the poster HTML/CSS to canvas and export an image
 */
var saveImage = function() {
    // first check if the quote actually fits
    if (($factList.offset().top + $factList.height()) > $logoWrapper.offset().top) {
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

/*
 * Select a poster theme
 */
var onThemeClick = function(e) {
    $themeButtons.removeClass().addClass('btn btn-primary');
    $(this).addClass('active');
    $poster.removeClass('poster-theme1 poster-theme2 poster-theme3 poster-theme4 poster-theme5 poster-theme6')
                .addClass('poster-' + $(this).attr('id'));
}

/*
 * Select the poster aspect ratio
 */
var onAspectRatioClick = function(e) {
    $aspectRatioButtons.removeClass().addClass('btn btn-primary');
    $(this).addClass('active');
    $poster.removeClass('square sixteen-by-nine').addClass($(this).attr('id'));

    if ($poster.hasClass('sixteen-by-nine')) {
        $fontSize.attr('min', 24);
        $fontSize.val(24);
        UTILS.adjustFontSize(32);
    } else {
        $fontSize.attr('min', 32);
        $fontSize.val(42);
        UTILS.adjustFontSize(42);
    }
}

/*
 * Select the poster aspect ratio
 */
var onTimestampToggleClick = function(e) {
    $timestampToggleButtons.removeClass().addClass('btn btn-primary');
    $(this).addClass('active');
    if ($(this).attr('id') === 'show-timestamp') {
        $timestamp.show();
    } else {
        $timestamp.hide();
    }
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
