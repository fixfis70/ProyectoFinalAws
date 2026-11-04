package dev.fixfis.subsistema.aws;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.textract.TextractClient;

@Configuration
public class TexTractAccess {
    @Bean
    public TextractClient textractClient(AwsAccess awsAccess) {
        return TextractClient.builder()
                .endpointOverride(awsAccess.getEndpoint())
                .credentialsProvider(awsAccess.getCredentialsProvider())
                .region(awsAccess.getRegion())
                .build();
    }
}
