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
    $fontSize.on('change', adjustFontSize);
    $kickerInput.on('keyup', onKickerKeyup);

    adjustFontSize(null, 32);
    processText();
    updateTimestamp();
    timestampInterval = setInterval(updateTimestamp, 1000);
    setupMediumEditor();

    $('[data-toggle="tooltip"]').tooltip();
}

/*
 * Change straight quotes to curly and double hyphens to em-dashes.
 */
var smarten = function(a) {
  a = a.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
  a = a.replace(/'/g, "\u2019");                            // closing singles & apostrophes
  a = a.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  a = a.replace(/"/g, "\u201d");                            // closing doubles
  a = a.replace(/--/g, "\u2014");                           // em-dashes
  a = a.replace(/ \u2014 /g, "\u2009\u2014\u2009");         // full spaces wrapping em dash
  return a;
}

/*
 * Convert a string to slug format
 */
var convertToSlug = function(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
}

/*
 * Cleanup whitespace and smart quotes on text inputs
 */
var processText = function() {
    $text = $('.poster blockquote p, .source');
    $text.each(function() {
        var rawText = $.trim($(this).html());
        $(this).html(smarten(rawText)).find('br').remove();
    });
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

    $('canvas').remove();
    processText();

    html2canvas($poster, {
      letterRendering: true,
      scale: 2,
      onrendered: function(canvas) {
        document.body.appendChild(canvas);
        window.oCanvas = document.getElementsByTagName("canvas");
        window.oCanvas = window.oCanvas[0];
        var strDataURI = window.oCanvas.toDataURL();

        var headline = $kicker.text().split(' ', 9);
        var filename = convertToSlug(headline.join(' '));

        var a = $("<a>").attr("href", strDataURI).attr("download", "factlist-" + filename + ".png").appendTo("body");

        a[0].click();

        a.remove();

        $('#download').attr('href', strDataURI).attr('target', '_blank');
        $('#download').trigger('click');
      }
    });
}

/*
 * Adjust the poster font size
 */
var adjustFontSize = function(e, size) {
    var newSize = size||$(this).val();

    var fontSize = newSize.toString() + 'px';
    $poster.css('font-size', fontSize);
    if ($fontSize.val() !== newSize){
        $fontSize.val(newSize);
    };
}

/*
 * Select a poster theme
 */
var onThemeClick = function(e) {
    $themeButtons.removeClass().addClass('btn btn-primary');
    $(this).addClass('active');
    $poster.removeClass('poster-theme1 poster-theme2 poster-theme3 poster-theme4')
                .addClass('poster-' + $(this).attr('id'));
}

/*
 * Select the poster aspect ratio
 */
var onAspectRatioClick = function(e) {
    $aspectRatioButtons.removeClass().addClass('btn btn-primary');
    $(this).addClass('active');
    $poster.removeClass('square sixteen-by-nine facebook-ratio twitter-ratio').addClass($(this).attr('id'));

    if ($poster.hasClass('sixteen-by-nine') || $poster.hasClass('facebook-ratio') || $poster.hasClass('twitter-ratio')) {
        $fontSize.attr('min', 24);
        $fontSize.val(24);
        adjustFontSize(null, 32);
    } else {
        $fontSize.attr('min', 32);
        $fontSize.val(42);
        adjustFontSize(null, 42);
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

/*
 * Update the kicker text
 */
var onKickerKeyup = function(e) {
    var inputText = $(this).val();
    $kicker.text(inputText);
}

/*
 * Bind a medium editor to the poster blockquote
 */
var setupMediumEditor = function(){
    var quoteEl = document.querySelectorAll('.poster blockquote');

    var quoteEditor = new MediumEditor(quoteEl, {
        disableToolbar: true,
        placeholder: ''
    });

    $factList.focus();
}

$(onDocumentLoad);
