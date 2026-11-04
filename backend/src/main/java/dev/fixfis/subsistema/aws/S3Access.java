package dev.fixfis.subsistema.aws;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

@Configuration
public class S3Access {
    @Bean
    public S3Client s3Client(AwsAccess awsAccess) {
        return S3Client.builder()
                .endpointOverride(awsAccess.getEndpoint())
                .credentialsProvider(awsAccess.getCredentialsProvider())
                .region(awsAccess.getRegion())

                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .build())
                .build();
    }
}
