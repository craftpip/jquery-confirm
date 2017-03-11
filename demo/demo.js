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
        if (typeof google_jobrunner == 'undefined' && !localStorage['adsok']) {
            $.confirm({
                title: 'Hmmm, ad blocker',
                theme: 'material',
                content: "Ads aren't what you're here for. But ads help me support my work. So, please consider to add this domain to your blocker's whitelist.",
                closeIcon: false,
                buttons: {
                    done: {
                        text: 'Did it',
                        btnClass: 'btn-green',
                        action: function () {
                            $.alert('I really appreciate this. Thank you.', 'You\'re awesome');
                            setTimeout(function () {
                                location.reload();
                            }, 1000);
                        }
                    },
                    doNotAskAgain: {
                        text: 'Don\'t ask',
                        action: function () {
                            localStorage['adsok'] = true;
                        }
                    },
                    donate: {
                        text: 'Donate',
                        btnClass: 'btn-default',
                        action: function () {
                            window.open('https://www.paypal.me/bonifacepereira', '_blank');
                            localStorage['adsok'] = true;
                        }
                    }

                }
            });
        }
    }, 1000);

    $('.change-format-css').click(function () {
        $('.change-format-css').addClass('active');
        $('.change-format-less').removeClass('active');
        $('.format-less').hide();
        $('.format-css').show();
    });
    $('.change-format-less').click(function () {
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