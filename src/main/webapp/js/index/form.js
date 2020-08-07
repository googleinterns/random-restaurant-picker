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
    if ((event.currentTarget).val() != "") {
        (event.currentTarget).addClass("active");
    } else {
        (event.currentTarget).removeClass("active");
    }
});
