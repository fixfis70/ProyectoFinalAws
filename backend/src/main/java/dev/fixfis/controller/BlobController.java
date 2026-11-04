package dev.fixfis.controller;

import dev.fixfis.dto.BlobItemRequest;
import dev.fixfis.entity.BlobItem;
import dev.fixfis.entity.Comprobante;
import dev.fixfis.service.ComprobanteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/blobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BlobController {

    private final S3Client s3Client;

    @Value("${aws.bucket}")
    private String bucketName;
    private ComprobanteService service;

    @Autowired
    public BlobController(S3Client s3Client, ComprobanteService comprobanteService) {
        this.s3Client = s3Client;
        this.service = comprobanteService;
    }

    @PostMapping("/{idComprobante}")
    public BlobItem uploadBlob(
            @RequestBody BlobItemRequest request,
            @PathVariable String idComprobante
    ) {
        if (!valid(idComprobante) || !valid(request.base64()) || !valid(request.filename())) {
            throw new IllegalArgumentException("Invalid request");
        }

        Comprobante byId = service.findById(idComprobante);
        if (byId == null) {
            throw new IllegalArgumentException("Comprobante not found");
        }


        byte[] bytes = Base64.getDecoder().decode(request.base64());

        s3Client.putObject(b -> b
                        .bucket(bucketName)
                        .key(request.filename()),
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(bytes)
        );

        BlobItem blobItem = new BlobItem();
        blobItem.setPath("");
        blobItem.setFilename(request.filename());
        blobItem.setMimeType(request.mimeType());
        byId.setBlobItem(blobItem);
        service.save(byId);
        return blobItem;
    }

    @GetMapping("/{idComprobante}")
    public ResponseEntity<byte[]> blob(@PathVariable String idComprobante) {

        Comprobante byId = service.findById(idComprobante);

        if (byId == null) {
            throw new IllegalArgumentException("Comprobante not found");
        }

        BlobItem blobItem = byId.getBlobItem();
        if (blobItem == null) {
            throw new IllegalArgumentException("Blob not found");
        }


        var stream = s3Client.getObject(b -> b
                .bucket(bucketName)
                .key(blobItem.getPath() + blobItem.getFilename())
                .build()
        );
        try {
            byte[] bytes = stream.readAllBytes();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.parseMediaType(blobItem.getMimeType())
            );
            headers.setContentDisposition(
                    ContentDisposition.inline()
                            .filename(blobItem.getFilename())
                            .build()
            );

            return new ResponseEntity<>(
                    bytes,
                    headers,
                    HttpStatus.OK
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    static boolean valid(String s) {
        return s != null && !s.isBlank();
    }
}
