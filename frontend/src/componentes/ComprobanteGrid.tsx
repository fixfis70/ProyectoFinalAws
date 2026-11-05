import { useEffect, useState } from "react";
import {
    getAllComprobantes,
    type ComprobanteRes as Comprobante
} from "../service/ComprobanteService.ts";

export default function ComprobantesGrid() {

    const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllComprobantes()
            .then(setComprobantes)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando...</p>;
    console.log("Comprobantes:")
    console.log(comprobantes);
    return (
        <div>
            <h1>Comprobantes</h1>

            {comprobantes.map(comprobante => (
                <p key={comprobante.id}>
                    {comprobante.nombreUsuario} - {comprobante.sucursal}
                </p>
            ))}
        </div>
    );
}