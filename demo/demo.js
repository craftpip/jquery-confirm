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