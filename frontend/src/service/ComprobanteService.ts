import {api} from "./api.ts";

export type TipoRegistro = "BOLETA" | "FACTURA"

// Server
export interface ComprobanteRes {
    blobItem: {
        mimeType: string
        filename: string
        path: string
    }
    detalles: string
    fechaEmision: string
    id: string
    nombreUsuario: string
    ocr: { text: string }
    sucursal: string
    tipoRegistro: TipoRegistro
}
// Cliente
export interface ComprobanteReq {
    tipoRegistro: TipoRegistro
    nombreUsuario: string
    sucursal: string
    detalles: string
    id?: string
    blobItem?: {
        mimeType: string
        filename: string
        base64: string
    } | null
}

export const getAllComprobantes = async (): Promise<ComprobanteRes[]> => {
    const response = await api.get<ComprobanteRes[]>("/comprobantes");
    return response.data;
};

// POST /comprobantes  ->  crea
// PUT  /comprobantes  ->  actualiza (requiere id)
export const saveComprobante = async (comprobante: ComprobanteReq): Promise<ComprobanteRes> => {
    const response = comprobante.id
        ? await api.put<ComprobanteRes>("/comprobantes", comprobante)
        : await api.post<ComprobanteRes>("/comprobantes", comprobante);

    return response.data;
};

// DELETE /comprobantes/{id}
export const delComprobante = async (id: string): Promise<void> => {
    await api.delete(`/comprobantes/${encodeURIComponent(id)}`);
};

export const getImgUrl = (idComprobante: string): string => {
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/?$/, "/");
    return `${baseUrl}blobs/${encodeURIComponent(idComprobante)}`;
};
