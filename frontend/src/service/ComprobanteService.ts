import {api} from "./api.ts";



export interface ComprobanteRes {
    blobItem: {
        mimeType: string
        filename: string
        path:string
    }
    detalles:string
    fechaEmision: string
    id: number
    nombreUsuario:string
    ocr:string
    sucursal: string
    tipoRegistro: "BOLETA"|"FACTURA"
}

export interface ComprobanteReq {
    tipoRegistro: "BOLETA"|"FACTURA"
    nombreUsuario: string
    sucursal: string
    detalles: string
    blobItem: {
        mimeType: string
        filename: string
        base64:string
    }
}

export const getComprobantes = async (): Promise<ComprobanteRes[]> => {
    const response = await api.get<ComprobanteRes[]>("/comprobantes");
    return response.data;
};

//POST /comprobantes
export const postComprobante =  async (comprobante:ComprobanteReq): Promise<ComprobanteRes> => {
    const response = await api.post<ComprobanteRes>("/comprobantes", comprobante);

    return response.data;
};