package dev.fixfis.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

@DynamoDbBean
@Getter
@NoArgsConstructor
@Setter
public class Ocr {
    private String text;
}
