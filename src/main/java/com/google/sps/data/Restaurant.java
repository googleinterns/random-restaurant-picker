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

public final class Restaurant {
    private transient int weight = 0;
    private final String name;
    private final double rating;
    private final String businessStatus;
    private final int priceLevel;


    public Restaurant(int weight, String name, double rating, String businessStatus, int priceLevel) {
        this.weight = weight;
        this.name = name;
        this.rating = rating;
        this.businessStatus = businessStatus;
        this.priceLevel = priceLevel;
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

    public String price() {
        return this.priceLevel;
    }
}
