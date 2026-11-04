
import { useState } from "react";
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    Paper
} from "@mui/material";

export interface ComprobanteReq {
    tipoRegistro: "BOLETA" | "FACTURA";
    nombreUsuario: string;
    sucursal: string;
    detalles: string;
    blobItem: {
        mimeType: string;
        filename: string;
        base64: string;
    };
}

interface Props {
    onSubmit: (data: ComprobanteReq) => void;
}

export default function ComprobanteForm({ onSubmit }: Props) {
    const [tipoRegistro, setTipoRegistro] =
        useState<"BOLETA" | "FACTURA">("FACTURA");

    const [nombreUsuario, setNombreUsuario] = useState("");
    const [sucursal, setSucursal] = useState("");
    const [detalles, setDetalles] = useState("");

    const [archivo, setArchivo] = useState<File | null>(null);
    const [base64, setBase64] = useState("");

    const [loading, setLoading] = useState(false);

    const handleFileChange = (file: File | null) => {
        if (!file) return;

        setArchivo(file);

        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            // Eliminamos el prefijo data:...;base64,
            setBase64(result.split(",")[1]);
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!archivo || !base64) {
            alert("Selecciona un archivo primero");
            return;
        }

        const data: ComprobanteReq = {
            tipoRegistro,
            nombreUsuario,
            sucursal,
            detalles,
            blobItem: {
                mimeType: archivo.type,
                filename: archivo.name,
                base64
            }
        };

        setLoading(true);

        try {
            onSubmit(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
            <h5>
                Registrar comprobante
            </h5>

            <Box
                component={"form"}
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                gap={2}
            >
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
                    disabled={loading || !archivo || !base64}
                >
                    Registrar comprobante
                </Button>
            </Box>
        </Paper>
    );
}
