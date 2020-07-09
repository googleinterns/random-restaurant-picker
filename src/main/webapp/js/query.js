// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let responseJson;

function query() {
    const errorEl = document.getElementById("error");
    fetch(`/query`, { method: 'GET' })
        .then(response => response.json())
        .then((response) => {
            responseJson = response; // Debug
            if (response.status === "OK") {
                errorEl.classList.remove('error-banner');
                errorEl.classList.remove('hidden');
                errorEl.classList.add('success-banner');
                errorEl.innerText = response.pick;
                resultsPage(response.pick);
            } else if (response.status === "INVALID_REQUEST")
                throw 'Invalid request';
            else if (response.status === "ZERO_RESULTS")
                throw 'No results';
            else if (response.status === "NO_REROLLS")
                throw 'No re-rolls left';
            else
                throw 'Unforeseen error';
        })
        .catch((error) => {
            errorEl.classList.remove('success-banner');
            errorEl.classList.remove('hidden');
            errorEl.classList.add('error-banner');
            errorEl.innerText = error;
        });
}

$('#randomize-form').submit(function(e) {
    const errorEl = document.getElementById("error");
    errorEl.classList.add('hidden');

    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        success: function(response) {
            query();
        }
    });
});

$("input, textarea").blur(function() {
    if ($(this).val() != "") {
        $(this).addClass("active");
    } else {
        $(this).removeClass("active");
    }
})

function resultsPage(pick) {
    fetch(`../results.html`)
        .then(html => html.text())
        .then((html) => {
            document.getElementsByTagName('body')[0].innerHTML = html;
            const pickEl = document.getElementById("pick");
            pickEl.innerText = pick;
        });
}

function reroll() {
    const pickEl = document.getElementById("pick");
    fetch(`/query`, { method: 'GET' })
        .then(response => response.json())
        .then((response) => {
            responseJson = response; // Debug
            if (response.status === "OK") {
                pickEl.innerText = response.pick;
            } else if (response.status === "INVALID_REQUEST")
                throw 'Invalid request';
            else if (response.status === "ZERO_RESULTS")
                throw 'No results';
            else if (response.status === "NO_REROLLS")
                throw 'No re-rolls left';
            else
                throw 'Unforeseen error';
        })
        .catch((error) => {
            pickEl.innerText = error;
        });
}
