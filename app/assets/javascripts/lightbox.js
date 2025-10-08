/*
 * Lightbox3 for Redmine 6 - The Truly Final Version
 *
 * This script is the definitive solution based on all previous debugging sessions.
 * It works without ERB overrides and handles all known contexts (main attachments,
 * journal attachments, images, and PDFs).
 */
$(document).ready(function() {

    // --- A smart function to process any link and decide if it needs a lightbox ---
    function applyLightbox(linkElement) {
        var $link = $(linkElement);
        var href = $link.attr('href');

        // Ignore links that we know shouldn't have a lightbox (like delete buttons)
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
    // This targets all links inside the main attachments block.
    $('div.attachments a').each(function() {
        applyLightbox(this);
    });

    // 2. Journal / Notes Section - a special case with broken links
    // It has two types of links that need fixing before applying lightbox.

    // 2a. Journal Thumbnails & Filename links
    $('div.journal div.thumbnails a, div.journal ul.details a[href*="/attachments/"]:not(.icon-download)').each(function() {
        var $link = $(this);
        var wrongHref = $link.attr('href'); // e.g., /attachments/8
        var filename = $link.find('img').attr('title') || $link.text().trim();

        if (wrongHref && filename) {
            var attachmentId = wrongHref.split('/')[2];
            if ($.isNumeric(attachmentId)) {
                // First, rewrite the broken href to the correct download path
                var correctHref = '/attachments/download/' + attachmentId + '/' + filename;
                $link.attr('href', correctHref);
                // After fixing the link, process it to see if it needs a lightbox
                applyLightbox(this);
            }
        }
    });


    // --- Precautionary fix for the duplicate icon mystery ---
    // This will clean up any duplicate download icons, regardless of their source.
    $('div.journal ul.details li:contains("File")').each(function() {
        var $downloadIcons = $(this).find('a.icon-download');
        if ($downloadIcons.length > 1) {
            $downloadIcons.slice(1).remove();
        }
    });


    // --- INITIALIZE LIGHTBOX ---
    // Finally, after all links have been corrected and classes applied, initialize fancybox.
    $('a.lightbox').fancybox({
        iframe: {
            preload: false // Recommended setting for PDFs
        }
    });

});
