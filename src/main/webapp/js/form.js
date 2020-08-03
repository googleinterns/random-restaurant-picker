/* ==========================================================================
   SEARCH FORM
   ========================================================================== */
$("#randomize-form").submit((event) => {
    const errorEl = document.getElementById("error");
    errorEl.classList.add("hidden");

    event.preventDefault();
    let url = (event.currentTarget).action;
    let lat = localStorage.getItem("lat");
    let lng = localStorage.getItem("lng");
    let userID = 0;
    if (localStorage.getItem("loggedIn")) {
        userID = localStorage.getItem("user");
    }
    let queryStr = new URLSearchParams(new FormData(event.currentTarget)).toString() + `&lat=${lat}&lng=${lng}&user=${userID}`;
    query(queryStr);
});

// Form underline element
$("input, textarea").blur(() => {
    if ($(this).val() != "") {
        $(this).addClass("active");
    } else {
        $(this).removeClass("active");
    }
});

/* ==========================================================================
   SELECT 2 (THIRD-PARTY)
   ========================================================================== */
(($) => {
    'use strict';
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
