(function($) {
    window.onload = function() {
        $('#loading-modal').hide();
        $('#loading-modal-content').hide();
        $('body,html').css('overflow', 'visible');
    }

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    $("#menuDynamic").metisMenu();
})(jQuery);