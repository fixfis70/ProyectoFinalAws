package dev.fixfis.service;

import dev.fixfis.entity.Comprobante;
import dev.fixfis.subsistema.CRUD;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.UUID;

@Service
public class ComprobanteService implements CRUD<Comprobante, String> {
    private final DynamoDbTable<Comprobante> table;

    public ComprobanteService(
            DynamoDbEnhancedClient enhancedClient,
            @Value("${aws.dynamo}") String tableName
    ) {
        table = enhancedClient.table(
                tableName,
                TableSchema.fromBean(Comprobante.class)
        );
    }

    @Override
    public Comprobante save(Comprobante comprobante) {
        if (comprobante.getId() == null || comprobante.getId().isBlank()) {
            comprobante.setId(UUID.randomUUID().toString());
        }

        table.putItem(comprobante);
        return comprobante;
    }

    @Override
    public void deleteById(String pk) {
        table.deleteItem(
                Key.builder()
                        .partitionValue(pk)
                        .build()
        );
    }

    @Override
    public Comprobante findById(String pk) {
        return table.getItem(Key.builder()
                .partitionValue(pk)
                .build());
    }

    @Override
    public List<Comprobante> findAll() {
        return table.scan()
                .items()
                .stream()
                .toList();
    }
}
