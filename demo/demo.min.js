if (typeof jQuery == "undefined") {throw new Error("Documentation needs the jQuery library to function.")};
$('body').scrollspy({
    target: '#my-nav',
    offset: 100
});
var bs = $('.footer').outerHeight()+10;
$("#my-nav").sticky({topSpacing:20, bottomSpacing: bs});
$(document).ready(function () {
    prettyPrint();
    $("span.version").html(version || "");
});
function rs(){
    if($(window).width() > 992){
        $('#my-nav').show();
    }else{
        $('#my-nav').hide();
    }
}
$(window).resize(function(){
    rs();
})
rs();