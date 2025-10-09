/*
 * Lightbox3 for Redmine 6 - Final Hybrid Version
 *
 * This version incorporates the correct selector (`a.thumbnail`) for Wiki pages
 */
$(document).ready(function() {

    // --- A smart function to process any link and decide if it needs a lightbox ---
    function applyLightbox(linkElement) {
        var $link = $(linkElement);
        var href = $link.attr('href');

        if (!href || $link.hasClass('delete') || $link.hasClass('icon-del')) {
            return;
        }

        var isImage = href.match(/\.(jpe?g|png|gif|bmp|webp)$/i);
        var isPdf = href.match(/\.pdf$/i);

        if (isImage) {
            $link.addClass('lightbox');
        } else if (isPdf) {
            $link.addClass('lightbox').attr('data-type', 'iframe');
        }
    }


    // --- Apply the logic to DIFFERENT sections of Redmine ---

    // 1. Main Attachment Block (top of issue, documents, files, etc.)
    $('div.attachments a').each(function() {
        applyLightbox(this);
    });

    // 2. Journal / Notes Section
    $('div.journal div.thumbnails a, div.journal ul.details a[href*="/attachments/"]:not(.icon-download)').each(function() {
        var $link = $(this);
        var wrongHref = $link.attr('href');
        var filename = $link.find('img').attr('title') || $link.text().trim();

        if (wrongHref && filename) {
            var attachmentId = wrongHref.split('/')[2];
            if ($.isNumeric(attachmentId)) {
                var correctHref = '/attachments/download/' + attachmentId + '/' + filename;
                $link.attr('href', correctHref);
                applyLightbox(this);
            }
        }
    });
    
    // 3. UPDATED - Wiki Embedded Thumbnails (Using the correct selector now)
    // This targets images embedded with the {{thumbnail()}} macro using the `a.thumbnail` class.
    $('div.wiki a.thumbnail').each(function() {
        var $link = $(this);
        var wrongHref = $link.attr('href');
        var $image = $link.find('img');
        
        // For these wiki thumbnails, the filename is in the 'alt' attribute.
        var filename = $image.attr('alt'); 

        if (wrongHref && filename) {
            var attachmentId = wrongHref.split('/')[2];
            if ($.isNumeric(attachmentId)) {
                // Rebuild the href to point to the correct download path
                var correctHref = '/attachments/download/' + attachmentId + '/' + filename;
                $link.attr('href', correctHref);
                
                // After fixing the link, process it to add the lightbox class.
                applyLightbox(this);
            }
        }
    });


    // --- Precautionary fix for the duplicate icon mystery ---
    $('div.journal ul.details li:contains("File")').each(function() {
        var $downloadIcons = $(this).find('a.icon-download');
        if ($downloadIcons.length > 1) {
            $downloadIcons.slice(1).remove();
        }
    });


    // --- INITIALIZE LIGHTBOX ---
    $('a.lightbox').fancybox({
        iframe: {
            preload: false
        }
    });

});
