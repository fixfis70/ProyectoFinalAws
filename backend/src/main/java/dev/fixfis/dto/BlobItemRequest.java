package dev.fixfis.dto;

public record BlobItemRequest(
        String base64,
        String mimeType,
        String filename
) { }
