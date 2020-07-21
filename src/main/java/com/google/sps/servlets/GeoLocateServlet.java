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

import com.google.sps.data.AccessSecret;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;;

import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;

@WebServlet("/geolocate")
public class GeoLocateServlet extends HttpServlet {
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException{
        String apiKey = (new AccessSecret()).getKey();
        String urlStr = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + apiKey;
        
        HttpClient httpClient = new DefaultHttpClient();
        HttpPost httpPost = new HttpPost(urlStr);
        String json = "{'considerIp' : 'true'}";
        StringEntity entity = new StringEntity(json);
        httpPost.setEntity(entity);
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-type", "application/json");
        try{
            HttpResponse output = httpClient.execute(httpPost);
            String outputString = EntityUtils.toString(output.getEntity());
            JsonElement jsonElement = new JsonParser().parse(outputString);
            JsonObject responseJson = jsonElement.getAsJsonObject();
            response.getWriter().println(responseJson);
        }catch (IOException e) {
            e.printStackTrace();
        }
    }
}