package dev.fixfis.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

@DynamoDbBean
@NoArgsConstructor
@Getter
@Setter
public class BlobItem {
    private String filename;
    private String mimeType;
    private String path;
}
