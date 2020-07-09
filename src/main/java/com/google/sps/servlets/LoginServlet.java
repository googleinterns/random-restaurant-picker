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
import org.json.simple.JSONObject;
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
    JSONObject json = new JSONObject();
    String idTokenString = request.getParameter("id_token");
    try{
        GoogleIdToken idToken = verifier.verify(idTokenString);
        Payload payload = idToken.getPayload();

        // Print user identifier
        String userId = payload.getSubject();
        System.out.println("User ID: " + userId);

        // Get profile information from payload
        json.put("id", userId);
        json.put("email", payload.getEmail());
        json.put("emailVerified", Boolean.valueOf(payload.getEmailVerified()));
        json.put("name", (String) payload.get("name"));
        json.put("pictureUrl", (String) payload.get("picture"));
        json.put("locale", (String) payload.get("locale"));
        json.put("familyName", (String) payload.get("family_name"));
        json.put("givenName", (String) payload.get("given_name"));
    } catch(Exception e){
        System.out.println("Invalid ID token.");
    }
    response.getWriter().println(json);
  }
}