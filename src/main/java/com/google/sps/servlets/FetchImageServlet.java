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
import com.google.common.io.ByteStreams;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;


@WebServlet("/image")
public class FetchImageServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException{
        String decodedUrl = new URLDecoder().decode(request.getParameter("url"));
        String apiKey = (AccessSecret.getInstance()).getKey();
        String urlStr = decodedUrl + apiKey;
        
        URLConnection conn = new URL(urlStr).openConnection();
        conn.connect();

        OutputStream os = response.getOutputStream();
        InputStream is = conn.getInputStream();
        response.setContentType(conn.getContentType());
        ByteStreams.copy(is, os);
        os.close();
        is.close();
    }
}