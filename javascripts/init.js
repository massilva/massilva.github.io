(function ($) {
    'use strict';
    $(document).ready(function () {
        $('.button-collapse').sideNav();
        $('.parallax').parallax();

        particleground($('#index-banner')[0], {
          dotColor: '#5cbdaa',
          lineColor: '#5cbdaa'
        });

        var intro = $('#profile')[0];
        intro.style.marginTop = - intro.offsetHeight + 'px';
    }); // end of document ready
})(jQuery); // end of jQuery name space
