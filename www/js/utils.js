var UTILS = (function() {
  // Change straight quotes to curly and double hyphens to em-dashes.
  var smarten = function(a) {
    a = a.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
    a = a.replace(/'/g, "\u2019");                            // closing singles & apostrophes
    a = a.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
    a = a.replace(/"/g, "\u201d");                            // closing doubles
    a = a.replace(/--/g, "\u2014");                           // em-dashes
    a = a.replace(/ \u2014 /g, "\u2009\u2014\u2009");         // full spaces wrapping em dash
    return a;
  }

  var convertToSlug = function(text) {
      return text
          .toLowerCase()
          .replace(/[^\w ]+/g,'')
          .replace(/ +/g,'-');
  }

  var processText = function() {
      $text = $('.poster blockquote p, .source');
      $text.each(function() {
          var rawText = $.trim($(this).html());
          $(this).html(smarten(rawText)).find('br').remove();
      });
  }
  var adjustFontSize = function(size) {
      var fontSize = size.toString() + 'px';
      $poster.css('font-size', fontSize);
      if ($fontSize.val() !== size){
          $fontSize.val(size);
      };
  }

  return {
    'smarten': smarten,
    'convertToSlug': convertToSlug,
    'processText': processText,
    'adjustFontSize': adjustFontSize
  }
})();