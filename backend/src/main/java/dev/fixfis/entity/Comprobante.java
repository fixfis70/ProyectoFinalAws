package dev.fixfis.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.time.Instant;

@DynamoDbBean
@NoArgsConstructor
@Getter
@Setter
public class Comprobante {
    private String id;
    private TipoRegistro tipoRegistro;
    private Instant fechaEmision;
    private String nombreUsuario;
    private String sucursal;
    private String detalles;
    private Ocr ocr;
    private BlobItem blobItem;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
