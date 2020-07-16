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

import java.util.ArrayList;

public class Feedback {
    // the user's rating of the restaurant
    private int restaurantRating;
    // the user's rating of how closely the selected restaurant matched their inputted parameters
    private int rrpRating;
    // the user's personal notes on the restaurant 
    private String notes;

    public Feedback(int restaurantRating, int rrpRating, String notes){
        this.restaurantRating = restaurantRating;
        this.rrpRating = rrpRating;
        this.notes = notes;
    }


    public int restaurantRating() {
        return this.restaurantRating;
    }

    public int rrpRating() {
        return this.rrpRating;
    }

    public String notes() {
        return this.notes;
    }
}