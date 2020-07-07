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

package com.google.sps.servlets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.Gson;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.ArrayList;

@WebServlet("/query")
public class Query extends HttpServlet {

    private String resultsJson;

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.getWriter().println(resultsJson);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String lat = "-33.8670522";
        String lon = "151.1957362";
        String radius = request.getParameter("radius");
        String type = "restaurant";
        String searchTerms = request.getParameter("searchTerms");
        String apiKey = "AIzaSyBL_9GfCUu7DGDvHdtlM8CaAywE2bVFVJc";
        String sURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lon + "&radius=" + radius + "&type=" + type + "&keyword=" + searchTerms + "&key=" + apiKey;

        URL url = new URL(sURL);
        URLConnection requestURL = url.openConnection();
        requestURL.connect();

        JsonParser jp = new JsonParser();
        JsonElement jsonElement = jp.parse(new InputStreamReader((InputStream) requestURL.getContent()));
        JsonObject jsonObj = jsonElement.getAsJsonObject();
        resultsJson = jsonObj.toString();
    }
}
