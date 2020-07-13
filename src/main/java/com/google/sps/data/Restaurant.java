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

import com.google.sps.data.Photo;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public final class Restaurant implements java.io.Serializable {
    private transient int weight = 0;
    private final String name;
    private final double rating;
    @SerializedName(value = "businessStatus", alternate = "business_status")
    private final String businessStatus;
    @SerializedName(value = "price", alternate = "price_level")
    private final int price;
    private final Photo[] photos;

    public Restaurant(String name, double rating, String business_status, int price, Photo[] photos) {
        this.name = name;
        this.rating = rating;
        this.business_status = business_status;
        this.photos = photos;
        this.price = price;
    }

    public int getWeight() {
        return this.weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public String getName() {
        return this.name;
    }

    public double getRating() {
        return this.rating;
    }

    public String getBusinessStatus() {
        return this.businessStatus;
    }

    public String toString() {
        return this.name;
    }

    public String getPrice() {
        return this.price;
    }
}
