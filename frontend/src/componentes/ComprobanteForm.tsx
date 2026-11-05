
import {useEffect, useState} from "react";
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    Paper
} from "@mui/material";
import * as React from "react";
import type {ComprobanteReq} from "../service/ComprobanteService.ts";

interface Props {
    onSubmit: (data: ComprobanteReq) => void | Promise<void>;
    onClear?: () => void;
    content:ComprobanteReq | null;
}

export default function ComprobanteForm({ onSubmit, onClear, content }: Props) {
    const [tipoRegistro, setTipoRegistro] = useState<"BOLETA" | "FACTURA">("FACTURA");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [sucursal, setSucursal] = useState("");
    const [detalles, setDetalles] = useState("");
    const [id, setId] = useState<string|null>(null);

    const [archivo, setArchivo] = useState<File | null>(null);
    const [base64, setBase64] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setId(content?.id ?? null)
        setNombreUsuario(content ? content.nombreUsuario : "")
        setSucursal(content ? content.sucursal : "")
        setDetalles(content ? content.detalles : "")
        setTipoRegistro(content ? content.tipoRegistro : "FACTURA")
    }, [content]);

    const handleFileChange = (file: File | null) => {
        if (!file) return;

        setArchivo(file);

        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            setBase64(result.split(",")[1]);
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const editando = Boolean(id);

        // Al editar no hace falta volver a subir el archivo
        if (!editando && (!archivo || !base64)) {
            alert("Selecciona un archivo primero");
            return;
        }

        const data: ComprobanteReq = {
            tipoRegistro,
            nombreUsuario,
            sucursal,
            detalles,
            id: id ?? undefined,
            blobItem: archivo && base64
                ? {
                    mimeType: archivo.type,
                    filename: archivo.name,
                    base64
                }
                : null
        };

        setLoading(true);

        try {
            await onSubmit(data);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setId(null);
        setTipoRegistro("FACTURA");
        setNombreUsuario("");
        setSucursal("");
        setDetalles("");
        setArchivo(null);
        setBase64("");

        // Si el padre controla el contenido (modo edición), le avisamos
        onClear?.();
    };

    return (
        <Paper className="flex flex-col w-full justify-center m-auto">
            <Box
                component="form"
                className="flex flex-col gap-2 w-full"
                onSubmit={handleSubmit}
            >
                <TextField
                    label="Id"
                    value={id ?? ""}
                    onChange={e =>
                        setId(e.target.value)
                    }
                    disabled
                />

                <TextField
                    select
                    label="Tipo de comprobante"
                    value={tipoRegistro}
                    onChange={e =>
                        setTipoRegistro(e.target.value as "BOLETA" | "FACTURA")
                    }
                    required
                >
                    <MenuItem value="BOLETA">Boleta</MenuItem>
                    <MenuItem value="FACTURA">Factura</MenuItem>
                </TextField>

                <TextField
                    label="Nombre de usuario"
                    value={nombreUsuario}
                    onChange={e => setNombreUsuario(e.target.value)}
                    required
                />

                <TextField
                    label="Sucursal"
                    value={sucursal}
                    onChange={e => setSucursal(e.target.value)}
                    required
                />

                <TextField
                    label="Detalles"
                    value={detalles}
                    onChange={e => setDetalles(e.target.value)}
                    multiline
                    rows={3}
                />

                <Button
                    variant="outlined"
                    component="label"
                >
                    {archivo ? archivo.name : "Seleccionar comprobante"}

                    <input
                        hidden
                        type="file"
                        accept=".pdf,image/*"
                        onChange={e =>
                            handleFileChange(e.target.files?.[0] ?? null)
                        }
                    />
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || (!id && (!archivo || !base64))}
                >
                    {id ? "Guardar cambios" : "Registrar comprobante"}
                </Button>

                <Button
                    type="button"
                    variant="outlined"
                    onClick={handleClear}
                    disabled={loading}
                >
                    Limpiar
                </Button>
            </Box>
        </Paper>
    );
}
