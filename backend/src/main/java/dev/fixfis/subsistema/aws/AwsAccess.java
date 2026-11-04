package dev.fixfis.subsistema.aws;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;

import java.net.URI;

@Getter
@Component
public class AwsAccess {
    private final StaticCredentialsProvider credentialsProvider;
    private final Region region;
    private final URI endpoint;

    private AwsAccess(@Value("${aws.accessKeyId}") String accessKeyId,
                      @Value("${aws.secretKey}") String secretKey,
                      @Value("${aws.region}") String region,
                      @Value("${aws.endpoint}") String endpoint) {
        this.endpoint = URI.create(endpoint);
        this.region = Region.of(region);
        this.credentialsProvider = StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKeyId, secretKey));

    }
}
