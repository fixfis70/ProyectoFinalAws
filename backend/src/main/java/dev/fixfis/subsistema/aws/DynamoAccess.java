package dev.fixfis.subsistema.aws;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

@Configuration
public class DynamoAccess {

    @Bean
    public DynamoDbClient dynamoDbClient(AwsAccess awsAccess) {

        return DynamoDbClient.builder()
                .endpointOverride(awsAccess.getEndpoint())
                .credentialsProvider(awsAccess.getCredentialsProvider())
                .region(awsAccess.getRegion())
                .build();
    }

    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient(
            DynamoDbClient dynamoDbClient
    ){
        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(dynamoDbClient)
                .build();
    }
}
