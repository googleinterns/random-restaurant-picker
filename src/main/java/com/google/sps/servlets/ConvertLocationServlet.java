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

import com.google.sps.data.UrlOpener;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.sps.data.Response;
import com.google.sps.data.Restaurant;
import com.google.sps.data.User;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

@WebServlet("/convert")
public class ConvertLocationServlet extends HttpServlet {
    private UrlOpener urlOpener;

    public ConvertLocationServlet() {
        this.urlOpener = new UrlOpener();
    }    

    public ConvertLocationServlet(UrlOpener urlOpener) {
        this.urlOpener = urlOpener;
    }

    @Override
    // TODO: return a user-friendly error rather than throwing an exception
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        String lat = request.getParameter("lat");
        String lng = request.getParameter("lng");
        String apiKey = "AIzaSyDbEPugXWcqo1q6b-X_pd09a0Zaj3trDOw";
        String sURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&result_type=street_address&key=" + apiKey;

        JsonElement jsonElement = urlOpener.openUrl(sURL);
        JsonObject jsonObj = jsonElement.getAsJsonObject();
        response.getWriter().println(jsonObj.toString());
    }
}