// DOM elements
var $source;
var $photographer;
var $save;
var $textColor;
var $logo;
var $crop;
var $logoColor;
var $imageLoader;
var $imageLink;
var $imageLinkButton;
var $canvas;
var canvas;
var $qualityQuestions;
var $copyrightHolder;
var $dragHelp;
var $filename;
var $fileinput;
var $customFilename;

// Constants
var IS_MOBILE = Modernizr.touch && Modernizr.mq('screen and max-width(700px)');
var MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// state
var scaledImageHeight;
var scaledImageWidth;
var previewScale = IS_MOBILE ? 0.32 : 0.64;
var dy = 0;
var dx = 0;
var image;
var imageFilename = 'image';
var currentCopyright;
var credit = 'Belal Khan/Flickr'
var shallowImage = false;


// JS objects
var ctx;
var img = new Image();
var logo = new Image();


var onDocumentLoad = function(e) {
    $source = $('#source');
    $photographer = $('#photographer');
    $canvas = $('#imageCanvas');
    canvas = $canvas[0];
    $imageLoader = $('#imageLoader');
    $imageLink = $('#imageLink');
    $imageLinkButton = $('#imageLinkButton');
    ctx = canvas.getContext('2d');
    $save = $('.save-btn');
    $textColor = $('input[name="textColor"]');
    $crop = $('input[name="crop"]');
    $logoColor = $('input[name="logoColor"]');
    $qualityQuestions = $('.quality-question');
    $copyrightHolder = $('.copyright-holder');
    $dragHelp = $('.drag-help');
    $filename = $('.fileinput-filename');
    $fileinput = $('.fileinput');
    $customFilename = $('.custom-filename');
    $logosWrapper = $('.logos-wrapper');

    img.src = defaultImage;
    img.onload = onImageLoad;
    logo.src = defaultLogo;
    logo.onload = renderCanvas;

    $photographer.on('keyup', renderCanvas);
    $source.on('keyup', renderCanvas);
    $imageLoader.on('change', handleImage);
    $imageLinkButton.on('click', handleImageLink);
    $save.on('click', onSaveClick);
    $textColor.on('change', onTextColorChange);
    $logoColor.on('change', onLogoColorChange);
    $crop.on('change', onCropChange);
    $canvas.on('mousedown touchstart', onDrag);
    $copyrightHolder.on('change', onCopyrightChange);
    $customFilename.on('click', function(e) {
        e.stopPropagation();
    })

    $("body").on("contextmenu", "canvas", function(e) {
        return false;
    });

    $imageLink.keypress(function(e) {
        if (e.keyCode == 13) {
            handleImageLink();
        }
    });

    // $imageLink.on('paste', handleImageLink);
    $(window).on('resize', resizeCanvas);
    resizeCanvas();
    buildForm();
}

var resizeCanvas = function() {
    var scale = $('.canvas-cell').width() / canvasWidth;
    $canvas.css({
        'webkitTransform': 'scale(' + scale + ')',
        'MozTransform': 'scale(' + scale + ')',
        'msTransform': 'scale(' + scale + ')',
        'OTransform': 'scale(' + scale + ')',
        'transform': 'scale(' + scale + ')'
    });
    renderCanvas();
}

var buildForm = function() {
    var copyrightKeys = Object.keys(copyrightOptions);
    var logoKeys = Object.keys(logos);

    for (var i = 0; i < copyrightKeys.length; i++) {
        var key = copyrightKeys[i];
        var display = copyrightOptions[key]['display'];
        $copyrightHolder.append('<option value="' + key + '">' + display + '</option>');
    }

    if (logoKeys.length > 1) {
        $logosWrapper.append('<div class="btn-group btn-group-justified btn-group-sm logos" data-toggle="buttons"></div>');
        var $logos = $('.logos');
        for (var j = 0; j < logoKeys.length; j++) {
            var key = logoKeys[j];
            var display = logos[key]['display']
            $logos.append('<label class="btn btn-primary"><input type="radio" name="logo" id="' + key + '" value="' + key + '">' + display + '</label>');

            if (key === currentLogo) {
                $('#' + key).attr('checked', true);
                $('#' + key).parent('.btn').addClass('active');
            }
        }
        $logo = $('input[name="logo"]');
        $logo.on('change', onLogoChange);
    } else {
        $logosWrapper.hide();
    }
}


/*
* Draw the image, then the logo, then the text
*/
var renderCanvas = function() {
    // canvas is always the same width
    canvas.width = canvasWidth;

    // if we're cropping, use the aspect ratio for the height
    if (currentCrop !== 'original') {
        canvas.height = canvasWidth / (16/9);
    }

    // clear the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // determine height of canvas and scaled image, then draw the image
    var imageAspect = img.width / img.height;

    if (currentCrop === 'original') {
        canvas.height = canvasWidth / imageAspect;
        scaledImageHeight = canvas.height;
        ctx.drawImage(
            img,
            0,
            0,
            canvasWidth,
            scaledImageHeight
        );
    } else {
        if (img.width / img.height > canvas.width / canvas.height) {
            shallowImage = true;

            scaledImageHeight = canvasWidth / imageAspect;
            scaledImageWidth = canvas.height * (img.width / img.height)
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                dx,
                dy,
                scaledImageWidth,
                canvas.height
            );
        } else {
            shallowImage = false;

            scaledImageHeight = canvasWidth / imageAspect;
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                dx,
                dy,
                canvasWidth,
                scaledImageHeight
            );
        }
    }

    // set alpha channel, draw the logo
    if (currentLogoColor === 'white') {
        ctx.globalAlpha = whiteLogoAlpha;
    } else {
        ctx.globalAlpha = blackLogoAlpha;
    }
    ctx.drawImage(
        logo,
        elementPadding,
        currentLogo === 'npr'? elementPadding : elementPadding - 14,
        logos[currentLogo]['w'],
        logos[currentLogo]['h']
    );

    // reset alpha channel so text is not translucent
    ctx.globalAlpha = "1";

    // draw the text
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillStyle = currentTextColor;
    ctx.font = fontWeight + ' ' + fontSize + ' ' + fontFace;

    if (currentTextColor === 'white') {
        ctx.shadowColor = fontShadow;
        ctx.shadowOffsetX = fontShadowOffsetX;
        ctx.shadowOffsetY = fontShadowOffsetY;
        ctx.shadowBlur = fontShadowBlur;
    }

    if (currentCopyright) {
        credit = buildCreditString();
    }

    var creditWidth = ctx.measureText(credit);
    ctx.fillText(
        credit,
        canvas.width - (creditWidth.width + elementPadding),
        canvas.height - elementPadding
    );

    validateForm();
}

/*
* Build the proper format for the credit based on current copyright
*/
var buildCreditString = function() {
    var creditString;
    var val = $copyrightHolder.val();

    if ($photographer.val() !== '') {
        if (copyrightOptions[val]['source']) {
            creditString = $photographer.val() + '/' + copyrightOptions[val]['source'];
        } else {
            creditString = $photographer.val() + '/' + $source.val();
        }
    } else {
        if (copyrightOptions[val]['source']) {
            creditString = copyrightOptions[val]['source'];
        } else {
            creditString = $source.val();
        }
    }

    if (copyrightOptions[val]['photographerRequired']) {
        if ($photographer.val() !== '') {
            $photographer.parents('.form-group').removeClass('has-warning');
        } else {
            $photographer.parents('.form-group').addClass('has-warning');
        }
    }

    if (copyrightOptions[val]['sourceRequired']) {
        if ($source.val() !== '') {
            $source.parents('.form-group').removeClass('has-warning');
        } else {
            $source.parents('.form-group').addClass('has-warning');
        }
    }

    return creditString;
}


/*
* Check to see if any required fields have not been
* filled out before enabling saving
*/
var validateForm = function() {
    if ($('.has-warning').length === 0 && currentCopyright) {
        $save.removeAttr('disabled');
        $("body").off("contextmenu", "canvas");
    } else {
        $save.attr('disabled', '');
        $("body").on("contextmenu", "canvas", function(e) {
            return false;
        });
    }
}

/*
* Handle dragging the image for crops when applicable
*/
var onDrag = function(e) {
    e.preventDefault();
    var originY = e.clientY||e.originalEvent.targetTouches[0].clientY;
    originY = originY/previewScale;

    var originX = e.clientX||e.originalEvent.targetTouches[0].clientX;
    originX = originX/previewScale;

    var startY = dy;
    var startX = dx;

    if (currentCrop === 'original') {
        return;
    }

    function update(e) {
        var dragY = e.clientY||e.originalEvent.targetTouches[0].clientY;
        dragY = dragY/previewScale;

        var dragX = e.clientX||e.originalEvent.targetTouches[0].clientX;
        dragX = dragX/previewScale;

        if (shallowImage === false) {
            if (Math.abs(dragY - originY) > 1) {
                dy = startY - (originY - dragY);

                // Prevent dragging image below upper bound
                if (dy > 0) {
                    dy = 0;
                    return;
                }

                // Prevent dragging image above lower bound
                if (dy < canvas.height - scaledImageHeight) {
                    dy = canvas.height - scaledImageHeight;
                    return;
                }
                renderCanvas();
            }
        } else {
            if (Math.abs(dragX - originX) > 1) {
                dx = startX - (originX - dragX);

                // Prevent dragging image below left bound
                if (dx > 0) {
                    dx = 0;
                    return;
                }

                // Prevent dragging image above right bound
                if (dx < canvas.width - scaledImageWidth) {
                    dx = canvas.width - scaledImageWidth;
                    return;
                }
                renderCanvas();
            }
        }


    }

    // Perform drag sequence:
    $(document).on('mousemove.drag touchmove', _.debounce(update, 5, true))
        .on('mouseup.drag touchend', function(e) {
            $(document).off('mouseup.drag touchmove mousemove.drag');
            update(e);
        });
}

/*
* Take an image from file input and load it
*/
var handleImage = function(e) {
    var reader = new FileReader();
    reader.onload = function(e){
        // reset dy value
        dy = 0;
        dx = 0;

        image = e.target.result;
        imageFilename = $('.fileinput-filename').text().split('.')[0];
        img.src = image;
        $customFilename.text(imageFilename);
        $customFilename.parents('.form-group').addClass('has-file');
        $imageLink.val('');
        $imageLink.parents('.form-group').removeClass('has-file');
    }
    reader.readAsDataURL(e.target.files[0]);
}


/*
* Load a remote  image
*/
var handleImageLink = function(e) {
    var requestStatus =
    // Test if image URL returns a 200
    $.ajax({
        url: $imageLink.val(),
        success: function(data, status, xhr) {
            var responseType = xhr.getResponseHeader('content-type').toLowerCase();

            // if content type is jpeg, gif or png, load the image into the canvas
            if (MIME_TYPES.indexOf(responseType) >= 0) {
                // reset dy value
                dy = 0;
                dx = 0;

                $fileinput.fileinput('clear');
                $imageLink.parents('.form-group').addClass('has-file').removeClass('has-error');
                $imageLink.parents('.input-group').next().text('Click to edit name');

                img.src = $imageLink.val();
                img.crossOrigin = "anonymous"

                var filename = $imageLink.val().split('/');
                imageFilename = filename[filename.length - 1].split('.')[0];

                $imageLink.val(imageFilename);

            // otherwise, display an error
            } else {
                $imageLink.parents('.form-group').addClass('has-error');
                $imageLink.parents('.input-group').next().text('Not a valid image URL');
                return;
            }
        },
        error: function(data) {
            $imageLink.parents('.form-group').addClass('has-error');
            $imageLink.parents('.input-group').next().text('Not a valid image URL');
        }
    });
}

/*
* Set dragging status based on image aspect ratio and render canvas
*/
var onImageLoad = function(e) {
    renderCanvas();
    onCropChange();
}

/*
* Load the logo based on radio buttons
*/
var loadLogo = function() {
    if (currentLogoColor === 'white') {
        logo.src = logos[currentLogo]['whitePath'];
    } else {
        logo.src = logos[currentLogo]['blackPath'];
    }
}

/*
* Download the image on save click
*/
var onSaveClick = function(e) {
    e.preventDefault();

    /// create an "off-screen" anchor tag
    var link = document.createElement('a'),
        e;


    /// the key here is to set the download attribute of the a tag
    if ($customFilename.text()) {
        imageFilename = $customFilename.text();
    }

    if ($imageLink.val() !== "") {
        var filename = $imageLink.val().split('/');
        imageFilename = filename[filename.length - 1].split('.')[0];
    }

    link.download =  'twitterbug-' + imageFilename + '.png';

    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    link.href = canvas.toDataURL();
    link.target = "_blank";

    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {

        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);

        link.dispatchEvent(e);

    } else if (link.fireEvent) {
        link.fireEvent("onclick");
    }
}

/*
* Handle logo radio button clicks
*/
var onLogoColorChange = function(e) {
    currentLogoColor = $(this).val();

    loadLogo();
    renderCanvas();
}

/*
* Handle text color radio button clicks
*/
var onTextColorChange = function(e) {
    currentTextColor = $(this).val();
    renderCanvas();
}

/*
* Handle logo radio button clicks
*/
var onLogoChange = function(e) {
    currentLogo = $(this).val();

    loadLogo();
    renderCanvas();
}

/*
* Handle crop radio button clicks
*/
var onCropChange = function() {
    currentCrop = $crop.filter(':checked').val();

    if (currentCrop !== 'original') {
        var dragClass = shallowImage ? 'is-draggable shallow' : 'is-draggable';
        $canvas.addClass(dragClass);
        $dragHelp.show();
    } else {
        $canvas.removeClass('is-draggable shallow');
        $dragHelp.hide();
    }
    renderCanvas();
}

/*
* Show the appropriate fields based on the chosen copyright
*/
var onCopyrightChange = function() {
    currentCopyright = $copyrightHolder.val();
    $photographer.parents('.form-group').removeClass('has-warning');
    $source.parents('.form-group').removeClass('has-warning');

    if (copyrightOptions[currentCopyright]) {
        if (copyrightOptions[currentCopyright]['showPhotographer']) {
            $photographer.parents('.form-group').slideDown();
            if (copyrightOptions[currentCopyright]['photographerRequired']) {
                $photographer.parents('.form-group').addClass('has-warning required');
            } else {
                $photographer.parents('.form-group').removeClass('required')
            }
        } else {
            $photographer.parents('.form-group').slideUp();
        }

        if (copyrightOptions[currentCopyright]['showSource']) {
            $source.parents('.form-group').slideDown();
            if (copyrightOptions[currentCopyright]['sourceRequired']) {
                $source.parents('.form-group').addClass('has-warning required');
            } else {
                $source.parents('.form-group').removeClass('required')
            }
        } else {
            $source.parents('.form-group').slideUp();
        }
    } else {
        $photographer.parents('.form-group').slideUp();
        $source.parents('.form-group').slideUp();
        credit = '';
    }

    // if (currentCopyright === 'npr') {
    //     $photographer.parents('.form-group').removeClass('required').slideDown();
    //     $source.parents('.form-group').slideUp();
    // } else if (currentCopyright === 'freelance') {
    //     $photographer.parents('.form-group').slideDown();
    //     $source.parents('.form-group').slideUp();
    //     $photographer.parents('.form-group').addClass('has-warning required');
    // } else if (currentCopyright === 'ap' || currentCopyright === 'getty') {
    //     $photographer.parents('.form-group').removeClass('required').slideDown();
    //     $source.parents('.form-group')
    //         .slideUp()
    //         .removeClass('has-warning required');

    // } else if (currentCopyright === 'third-party') {
    //     $photographer.parents('.form-group').removeClass('required').slideDown();
    //     $source.parents('.form-group').slideDown();
    //     $source.parents('.form-group').addClass('has-warning required');
    // } else {
    //     credit = '';
    //     $photographer.parents('.form-group').slideUp();
    //     $source.parents('.form-group')
    //         .slideUp()
    //         .parents('.form-group').removeClass('has-warning required');
    // }
    renderCanvas();
}

$(onDocumentLoad);
