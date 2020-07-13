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

import java.io.Serializable;

public final class Restaurant implements java.io.Serializable {
    private transient int weight = 0;
    private final String name;
    private final double rating;
    private final String businessStatus;
    // private final Geometry geometry;
    // private final String icon;
    // private final String id;
    // private final OpeningHours opening_hours;
    // private final Photo[] photos;
    // private final String place_id;
    // private final PlusCode plus_code;
    // private final int price_level;
    // private final String reference;
    // private final String scope;
    // private final Type[] types;
    // private final int user_ratings_total;
    // private final String vicinity;

    public Restaurant(int weight, String name, double rating, String businessStatus) {
        this.weight = weight;
        this.name = name;
        this.rating = rating;
        this.businessStatus = businessStatus;
    }

    public int weight() {
        return this.weight;
    }

    public String name() {
        return this.name;
    }

    public double rating() {
        return this.rating;
    }

    public String businessStatus() {
        return this.businessStatus;
    }

    public String toString() {
        return this.name;
    }
}