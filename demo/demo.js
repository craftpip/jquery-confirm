if (typeof jQuery == "undefined") {
    throw new Error("Documentation needs the jQuery library to function.")
}
;
$('body').scrollspy({
    target: '#my-nav',
    offset: 20
});
var bs = $('.footer').outerHeight() + 10;
$("#my-nav").sticky({topSpacing: 20, bottomSpacing: bs});
$("span.version").html(version || "");
$.fn.getCursorPosition = function () {
    var input = this.get(0);
    if (!input) return; // No (input) element found
    if ('selectionStart' in input) {
        // Standard-compliant browsers
        return input.selectionStart;
    } else if (document.selection) {
        // IE
        input.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return sel.text.length - selLen;
    }
}
function getCaretPosition(editableDiv) {
    var caretPos = 0,
        sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == editableDiv) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
            var tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}

$(document).ready(function () {
    prettyPrint();
    setTimeout(function () {
        return;
        $.confirm({
            title: 'Ahh, ad blockers',
            icon: 'fa fa-meh-o',
            content: "Ads aren't what you're here for. But ads help me support my work. So, please consider to add this domain to your blocker's whitelist. <br>I'd really appreciate it.",
            closeIcon: false,
            buttons: {
                dontCare: {
                    text: 'I dont care &gt;:(',
                }
            }
        })
    }, 1000);

    $('.change-format-css').click(function(){
        $('.change-format-css').addClass('active');
        $('.change-format-less').removeClass('active');
        $('.format-less').hide();
        $('.format-css').show();
    });
    $('.change-format-less').click(function(){
        $('.change-format-less').addClass('active');
        $('.change-format-css').removeClass('active');
        $('.format-css').hide();
        $('.format-less').show();
    });
});
$('.format-css').hide();

function rs() {
}
$(window).resize(function () {
    rs();
})
rs();