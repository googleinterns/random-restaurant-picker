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

package com.google.sps.data;

import com.google.gson.annotations.Expose;

import com.google.sps.data.Restaurant;

import java.lang.NullPointerException;
import java.util.List;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import java.util.Random;

public final class Response {
    @Expose (serialize = true)
    private String pick = null;
    @Expose
    private List<Restaurant> results;
    @Expose
    private String status;

    public Response(String status, List<Restaurant> results) {
        this.status = status;
        this.results = results;
    }

    public String status() {
        return status;
    }

    public List<Restaurant> results() {
        return results;
    }

    public void pick() {
        if (results.size() == 0)
            throw new NullPointerException("results array not initialized");
        Random rd = new Random();
        int randNum = rd.nextInt(results.size()-1);
        this.pick = results.get(randNum).name();
        results.remove(randNum);
        if (results.size() == 0)
            status = "NO_REROLLS";
    }

    public String toString() {
        return (this.results).stream()
        .map(n -> n.toString())
        .collect(Collectors.joining( "," ) );
    }
}
