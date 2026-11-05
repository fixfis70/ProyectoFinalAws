import ComprobanteForm from "./componentes/ComprobanteForm.tsx";
import {useEffect, useState} from "react";
import {
    type ComprobanteReq,
    type ComprobanteRes,
    delComprobante,
    getAllComprobantes,
    getImgUrl,
    saveComprobante
} from "./service/ComprobanteService.ts";

import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from "@mui/material";

function App() {

    const [contentForm, setContentForm] = useState<ComprobanteReq | null>(null)

    const [comprobantes, setComprobantes] = useState<ComprobanteRes[]>([]);
    const [loading, setLoading] = useState(true);
    const [select, setSelect] = useState<ComprobanteRes | null>(null)
    const [entity, setEntity] = useState<ComprobanteReq | null>(null)
    const [formVersion, setFormVersion] = useState(0)

    const refrescar = async () => {
        try {
            setComprobantes(await getAllComprobantes());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllComprobantes()
            .then(setComprobantes)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const guardar = async (data: ComprobanteReq) => {
        const editando = Boolean(data.id);

        try {
            await saveComprobante(data);
            await refrescar();
            setEntity(null);

            // Limpia el formulario cuando se registra uno nuevo
            if (!editando) setFormVersion(v => v + 1);
        } catch (error) {
            console.error(error);
            alert(editando ? "No se pudo actualizar el comprobante" : "No se pudo registrar el comprobante");
        }
    };

    const eliminar = async (row: ComprobanteRes) => {
        if (!window.confirm(`¿Eliminar el comprobante de ${row.nombreUsuario || "sin nombre"}?`)) return;

        try {
            await delComprobante(row.id);
            await refrescar();
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el comprobante");
        }
    };

    const abrirImg = (idComprobante: ComprobanteRes) => {
        window.open(getImgUrl(idComprobante.id), "_blank");
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="flex flex-col max-w-200 gap-3">

            <Typography
                variant={"h5"}
            >
                Registrar comprobante
            </Typography>
            {/*FORMULARIO*/}
            <ComprobanteForm
                key={entity?.id ?? `nuevo-${formVersion}`}
                onSubmit={guardar}
                onClear={() => {
                    setEntity(null);
                    setFormVersion(v => v + 1);
                }}
                content={entity}
            />

            {/*TABLA*/}
            <TableContainer
                component={"div"}
            >
                <Table className={"min-w-162.5"}>
                    {/*    encabezado*/}
                    <TableHead>
                        <TableRow>
                            <TableCell>TipoRegistro</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Sucursal</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    {/*    Cuerpo*/}
                    <TableBody>
                        {comprobantes.map((row: ComprobanteRes) => (
                            <TableRow
                                key={row.id}
                            >
                                <TableCell>{row.tipoRegistro??null}</TableCell>
                                <TableCell>{row.nombreUsuario??" - "}</TableCell>
                                <TableCell>{row.sucursal??" - "}</TableCell>
                                <TableCell>
                                    <div>
                                        <Button
                                            onClick={() =>setSelect(row)}
                                        >
                                            Ver
                                        </Button>
                                        <Button
                                            disabled = {!row.ocr}
                                            onClick={() =>abrirImg(row)}
                                        >
                                            IMG
                                        </Button>
                                        <Button
                                            onClick={() =>setEntity({
                                                detalles: row.detalles,
                                                blobItem: null,
                                                nombreUsuario: row.nombreUsuario,
                                                sucursal: row.sucursal,
                                                tipoRegistro: row.tipoRegistro,
                                                id: row.id
                                            })}
                                        >
                                            editar
                                        </Button>
                                        <Button
                                            onClick={() => eliminar(row)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/*DIALOGO*/}
            <Dialog
                open={select !== null}
                onClose={() => setSelect(null)}
            >
                <DialogTitle>
                    Detalle, Comprobante y OCR
                </DialogTitle>
                <DialogContent
                    className=""
                >
                    <div className="grid grid-flow-col grid-rows-3 gap-4 w-full h-full">
                        <div className="col-span-2 bg-red-50">
                            <Typography variant={"h6"}>Detalle</Typography>
                            <Typography>{select?.detalles}</Typography>
                        </div>
                        <div className="col-span-2 row-span-2 bg-current/20">
                            <Typography variant={"h6"}>OCR</Typography>
                            <Typography variant={"subtitle1"}>{select?.ocr?JSON.stringify(select.ocr):"Sin OCR"}</Typography>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default App
