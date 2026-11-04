package dev.fixfis.service;

import dev.fixfis.entity.BlobItem;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.textract.TextractClient;
import software.amazon.awssdk.services.textract.model.*;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TextractService {

    @Value("${aws.bucket}")
    private String bucketName;

    private final TextractClient textractClient;

    public List<String> extractText(BlobItem blobItem) {

        var response = textractClient.detectDocumentText(
                DetectDocumentTextRequest.builder()
                        .document(Document.builder()
                                .s3Object(S3Object.builder()
                                        .bucket(bucketName)
                                        .name(blobItem.getPath()+blobItem.getFilename())
                                        .build())
                                .build())
                        .build()
        );

        return response.blocks().stream()
                .filter(block -> block.blockType() == BlockType.LINE)
                .map(Block::text)
                .toList();
    }
}