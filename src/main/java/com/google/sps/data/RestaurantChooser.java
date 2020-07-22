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

import com.google.sps.data.Response;
import com.google.sps.data.Restaurant;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Random;

public final class RestaurantChooser {
    public static void chooseRestaurant(Response response, int requestedPrice){
        if(response.getResults().size() == 0){
            response.setStatus("ZERO_RESULTS");
            return;
        }
        HashMap<String, Integer> restaurantScores = new HashMap<>();
        int score; 
        int total = 0;
        for(Restaurant restaurant : response.getResults()){
            score = 1;
            if(requestedPrice == 0 || requestedPrice == restaurant.getPrice())
                score += 50;
            else if(Math.abs(requestedPrice - restaurant.getPrice()) <= 1)
                score += 25;
            else if(Math.abs(requestedPrice - restaurant.getPrice()) <= 2)
                score += 12;
            else if(Math.abs(requestedPrice - restaurant.getPrice()) <= 3)
                score += 6;
            restaurantScores.put(restaurant.getName(), score);
            total += score;
        }
        int selectedNum = new Random().nextInt(total);
        int value = 0;
        for(String key : restaurantScores.keySet()){
            value += restaurantScores.get(key);
            if(selectedNum <= value){
                response.setPick(response.getResults().stream().filter(p -> p.getName().equals(key)).findFirst().orElse(null));
                response.getResults().remove(response.getPick());
                if(response.getResults().size() == 0)
                    response.setStatus("ZERO_RESULTS");
                return;
            }
        }
    }
}
