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

import com.google.sps.data.Restaurant;

import java.lang.NullPointerException;
import java.util.List;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import java.util.Random;
import java.io.Serializable;


public final class Response implements java.io.Serializable {
    private Restaurant pick = null;
    private List<Restaurant> results;
    private String status;

    public Response(String status, List<Restaurant> results) {
        this.status = status;
        this.results = results;
    }

    public String getStatus() {
        return this.status;
    }

    public List<Restaurant> getResults() {
        return this.results;
    }

    public void pick() {
        if(results.size() > 0){
            int randIdx = (results.size() > 1) ? new Random().nextInt(results.size() - 1) : 0;
            this.pick = results.get(randIdx); 
            results.remove(randIdx);
        }
        if (results.size() == 0)
            status = "NO_REROLLS";
    }
 
    public String toString() {
        return (this.results).stream().map(n -> n.toString()).collect(Collectors.joining(","));
    }

    public void setPick(Restaurant restaurant) {
        this.pick = restaurant;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Restaurant getPick() {
        return this.pick;
    }
}
