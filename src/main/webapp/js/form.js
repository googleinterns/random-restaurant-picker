$("#randomize-form").submit(function(event) {
    const errorEl = document.getElementById("error");
    errorEl.classList.add("hidden");

    event.preventDefault();
    let url = $(this).attr("action");
    let lat = localStorage.getItem("lat");
    let lng = localStorage.getItem("lng");
    let userID = 0;
    if (localStorage.getItem("loggedIn")) {
        userID = localStorage.getItem("user");
    }
    let queryStr = $(this).serialize() + `&lat=${lat}&lng=${lng}&user=${userID}`;
    query(queryStr);
});

// Form underline element
$("input, textarea").blur(function() {
    if ($(this).val() != "") {
        $(this).addClass("active");
    } else {
        $(this).removeClass("active");
    }
});

//This file handles the formatting for the form on RRP Homepage
//This is done with a third-party formatting and styling package
(function($) {
    'use strict';
    /*==================================================================
        [ Daterangepicker ]*/
    try {
        $('.js-datepicker').daterangepicker({
            "singleDatePicker": true,
            "showDropdowns": true,
            "autoUpdateInput": false,
            locale: {
                format: 'DD/MM/YYYY'
            },
        });

        var myCalendar = $('.js-datepicker');
        var isClick = 0;

        $(window).on('click', function() {
            isClick = 0;
        });

        $(myCalendar).on('apply.daterangepicker', function(ev, picker) {
            isClick = 0;
            $(this).val(picker.startDate.format('MM/DD/YYYY'));

        });

        $('.js-btn-calendar').on('click', function(e) {
            e.stopPropagation();

            if (isClick === 1) isClick = 0;
            else if (isClick === 0) isClick = 1;

            if (isClick === 1) {
                myCalendar.focus();
            }
        });

        $(myCalendar).on('click', function(e) {
            e.stopPropagation();
            isClick = 1;
        });

        $('.daterangepicker').on('click', function(e) {
            e.stopPropagation();
        });


    } catch (er) { console.log(er); }
    /*[ Select 2 Config ]
        ===========================================================*/

    try {
        var selectSimple = $('.js-select-simple');

        selectSimple.each(function() {
            var that = $(this);
            var selectBox = that.find('select');
            var selectDropdown = that.find('.select-dropdown');
            selectBox.select2({
                dropdownParent: selectDropdown
            });
        });

    } catch (err) {
        console.log(err);
    }


})(jQuery);
