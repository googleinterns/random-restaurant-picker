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

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;

import java.util.Collections;
import com.google.api.client.extensions.appengine.http.UrlFetchTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    UrlFetchTransport transport = new UrlFetchTransport();
    JacksonFactory jacksonFactory = new JacksonFactory();
    GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jacksonFactory).setAudience(Collections.singletonList("758286654746-8e5tr4b5tr0gukbkdjpb6vj6upd9pl6l.apps.googleusercontent.com")).build();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html");
    response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
    String idTokenString = request.getParameter("id_token");
    JsonObject json = new JsonObject();
    try{
        GoogleIdToken idToken = verifier.verify(idTokenString);
        Payload payload = idToken.getPayload();
        String userId = payload.getSubject();
        json = new JsonParser().parse(payload.toString()).getAsJsonObject();
        System.out.println(json.toString());
    } catch(Exception e){
        System.out.println(e.getMessage());
    }

    response.getWriter().println(json);
  }
}