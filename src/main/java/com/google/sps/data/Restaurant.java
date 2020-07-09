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

public final class Restaurant {
    private int weight = 0;

    @Expose
    private final String name;
    @Expose
    private final double rating;
    @Expose
    private final String business_status;
    // private final Geometry geometry;
    // private final String icon;
    // private final String id;
    // private final OpeningHours opening_hours;
    // // private final Photo[] photos;
    // private final String place_id;
    // private final PlusCode plus_code;
    // private final int price_level;
    // private final String reference;
    // private final String scope;
    // private final Type[] types;
    // private final int user_ratings_total;
    // private final String vicinity;

    public Restaurant(String name, double rating, String business_status) {
        this.name = name;
        this.rating = rating;
        this.business_status = business_status;
    }

    public int weight() {
        return weight;
    }

    public String name() {
        return name;
    }

    public double rating() {
        return rating;
    }

    public String business_status() {
        return business_status;
    }

    public String toString() {
        return name;
    }
}
