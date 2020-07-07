package com.google.sps.data;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class weightRestaurantsServlet extends HttpServlet {
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.sendRedirect("/results.html");
    }

    private String determineWeight(String[] restaurants, int requestedPrice, int requestedRating, String requestedType) {

        HashMap<String, Integer> restaurantMap = new HashMap<>();
        int total = 0; 
        for (String restaurant : restaurants) {
            int score = 1;
            int priceLevel = restaurant.price_level;
            double ratingLevel = restaurant.rating;
            if (requestedPrice == 0 || requestedPrice == priceLevel) {
                score += 4;
            } else if (Math.abs(requestedPrice-priceLevel) <= 1) {
                score += 3;
            } else if (Math.abs(requestedPrice-priceLevel) <= 2) {
                score += 2;
            }

            if (requestedRating == 0 || requestedRating == ratingLevel) {
                score += 4;
            } else if (Math.abs(requestedRating-ratingLevel) <= 1) {
                score += 3;
            } else if (Math.abs(requestedRating-ratingLevel) <= 2) {
                score += 2;
            } else if (Math.abs(requestedRating-ratingLevel) <= 3) {
                score += 1;
            }

            // not sure below is helpful/accurate - might want to eliminate b/c will prob get taken care of w $$$
            if (requestedType == "No preference" || 
            (requestedType == "Fast Food" && restaurant.types.contains("meal_takeaway")) || 
            (requestedType == "Dine-in" && !restaurant.types.contains("meal_takeaway"))) {
                score += 2;
            }

            restaurantMap.set(restaurant, score);
            total += score;
        }
        int selected = (int) Math.floor(Math.random() * total);
        int curTotalScore = 0;
        // finds the correct restaurant by adding the next score of a restaurant to the 
        for (int i = 0; i < restaurants.length; i++) {
            curTotalScore = restaurantMap.get(restaurants[i-1]);
            int curScore = restaurantMap.get(restaurants[i]);
            if (curTotalScore <= selected && selected < curTotalScore + curScore) {
                return restaurants[i];
            }
            curTotalScore += curScore;
        }
    }
}