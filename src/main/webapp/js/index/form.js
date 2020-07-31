/* ==========================================================================
   SEARCH FORM
   ========================================================================== */
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
