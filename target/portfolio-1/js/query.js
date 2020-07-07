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

let queryArr;

function query() {
    const errorEl = document.getElementById("error");
    errorEl.classList.add('hidden');
    fetch(`/query`, { method: 'GET' })
        .then(response => response.json())
        .then((response) => {
            if (response.status === "OK") {
                queryArr = response.results;
                errorEl.classList.remove('error-banner');
                errorEl.classList.remove('hidden');
                errorEl.classList.add('success-banner');
                errorEl.innerText = "Success!";
                // test(JSON.stringify(response));
            } else if (response.status === "INVALID_REQUEST")
                throw 'Invalid request'
            else if (response.status === "ZERO_RESULTS")
                throw 'No results'
            else
                throw 'Unforeseen error'
        })
        .catch((error) => {
            errorEl.classList.remove('success-banner');
            errorEl.classList.remove('hidden');
            errorEl.classList.add('error-banner');
            errorEl.innerText = error;
        });
}

function get() {
    fetch(`/query`, { method: 'GET' })
    .then(response => response.json())
    .then((response) => {
        console.log(response);
    });
}
