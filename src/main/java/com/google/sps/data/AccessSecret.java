import com.google.cloud.secretmanager.v1.AccessSecretVersionResponse;
import com.google.cloud.secretmanager.v1.SecretManagerServiceClient;
import com.google.cloud.secretmanager.v1.SecretVersionName;
import java.io.IOException;

public class AccessSecret {

  public String accessSecretVersion() throws IOException {
    String projectId = "team-38-step-2020";
    String secretId = "API_KEY";
    String versionId = "1";
    return accessSecretVersion(projectId, secretId, versionId);
  }

  public String accessSecretVersion(String projectId, String secretId, String versionId)
      throws IOException {
    try (SecretManagerServiceClient client = SecretManagerServiceClient.create()) {
      SecretVersionName secretVersionName = SecretVersionName.of(projectId, secretId, versionId);
      AccessSecretVersionResponse response = client.accessSecretVersion(secretVersionName);
      return response.getPayload().getData().toStringUtf8();
    }
  }
}