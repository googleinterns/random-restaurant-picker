package com.google.sps.data;

import com.google.cloud.secretmanager.v1.AccessSecretVersionResponse;
import com.google.cloud.secretmanager.v1.SecretManagerServiceClient;
import com.google.cloud.secretmanager.v1.SecretVersionName;
import java.io.IOException;
import java.lang.Throwable;

public class AccessSecret {
  private String key = null;
  private static AccessSecret instance = new AccessSecret();

  private AccessSecret(){}

  private String accessSecretVersion() {
    final String projectId = "team-38-step-2020";
    final String secretId = "API_KEY";
    final String versionId = "2";
    return accessSecretVersion(projectId, secretId, versionId);
  }

  private String accessSecretVersion(String projectId, String secretId, String versionId) {
    try (SecretManagerServiceClient client = SecretManagerServiceClient.create()) {
      SecretVersionName secretVersionName = SecretVersionName.of(projectId, secretId, versionId);
      AccessSecretVersionResponse response = client.accessSecretVersion(secretVersionName);
      return response.getPayload().getData().toStringUtf8();
    } catch(IOException e){
        e.printStackTrace(System.out);
        return null;
    }
  }

  public String getKey() {
    if(this.key != null){
        return this.key;
    }
    this.key = accessSecretVersion();
    return this.key;
  }

  public static AccessSecret getInstance(){
      return instance;
  }
}