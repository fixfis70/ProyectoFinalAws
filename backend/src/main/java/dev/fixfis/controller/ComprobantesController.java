package dev.fixfis.controller;

import dev.fixfis.dto.BlobItemRequest;
import dev.fixfis.dto.ComprobanteDto;
import dev.fixfis.entity.BlobItem;
import dev.fixfis.entity.Comprobante;
import dev.fixfis.entity.Ocr;
import dev.fixfis.service.ComprobanteService;
import dev.fixfis.service.TextractService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.time.Instant;
import java.util.Base64;
import java.util.List;

import static dev.fixfis.controller.BlobController.valid;

@RestController
@RequestMapping("/comprobantes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComprobantesController {

    private final ComprobanteService service;
    private final BlobController blobController;
    private final TextractService textractService;

    @PostMapping
    public Comprobante save(@RequestBody ComprobanteDto comprobanteDto) {
        Comprobante comprobante = new Comprobante();

        comprobante.setDetalles(comprobanteDto.detalles());
        comprobante.setNombreUsuario(comprobanteDto.nombreUsuario());
        comprobante.setSucursal(comprobanteDto.sucursal());
        comprobante.setTipoRegistro(comprobanteDto.tipoRegistro());

        comprobante.setFechaEmision(Instant.now());

        var blobItemRequest = comprobanteDto.blobItem();
        service.save(comprobante);

        if (blobItemRequest == null) {
            return comprobante;
        }
        if (!valid(blobItemRequest.filename()) || !valid(blobItemRequest.mimeType()) || !valid(blobItemRequest.base64())) {
            return comprobante;
        }

        BlobItem blobItem = blobController.uploadBlob(blobItemRequest, comprobante.getId());
        List<String> strings = textractService.extractText(blobItem);

        strings.forEach(System.out::println);

        Ocr ocr = new Ocr();

        StringBuilder sb = new StringBuilder();
        for (String string : strings) {
            sb.append(string).append("\n");
        }

        ocr.setText(sb.toString());
        comprobante.setBlobItem(blobItem);
        comprobante.setOcr(ocr);
        return service.save(comprobante);
    }



    @PutMapping
    public Comprobante update(@RequestBody ComprobanteDto comprobante) {
        if (comprobante.id() == null) {
            throw new IllegalArgumentException("Id must be provided");
        }

        Comprobante comprobanteDB = service.findById(comprobante.id());
        if (comprobanteDB == null) {
            throw new IllegalArgumentException("Comprobante not found");
        }

        comprobanteDB.setTipoRegistro(comprobante.tipoRegistro());
        comprobanteDB.setNombreUsuario(comprobante.nombreUsuario());
        comprobanteDB.setSucursal(comprobante.sucursal());
        comprobanteDB.setDetalles(comprobante.detalles());

        return service.save(comprobanteDB);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable String id) {
        service.deleteById(id);
    }

    @GetMapping("/{id}")
    public Comprobante findById(@PathVariable String id) {
        return service.findById(id);
    }

    @GetMapping
    public List<Comprobante> findAll() {
        return service.findAll();
    }



}
