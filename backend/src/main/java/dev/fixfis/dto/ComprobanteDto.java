package dev.fixfis.dto;

import dev.fixfis.entity.TipoRegistro;

public record ComprobanteDto(
        String id,
        String detalles,
        String nombreUsuario,
        String sucursal,
        TipoRegistro tipoRegistro,
        BlobItemRequest blobItem
) {

}
