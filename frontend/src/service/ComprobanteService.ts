import {api} from "./api.ts";

export type TipoRegistro ="BOLETA"|"FACTURA"

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
    tipoRegistro:TipoRegistro
}

export interface ComprobanteReq {
    tipoRegistro: TipoRegistro
    nombreUsuario: string
    sucursal: string
    detalles: string
    blobItem: {
        mimeType: string
        filename: string
        base64:string
    }
}

export const getAllComprobantes = async (): Promise<ComprobanteRes[]> => {
    const response = await api.get<ComprobanteRes[]>("/comprobantes");
    return response.data;
};

//POST /comprobantes
export const postComprobante =  async (comprobante:ComprobanteReq): Promise<ComprobanteRes> => {
    const response = await api.post<ComprobanteRes>("/comprobantes", comprobante);

    return response.data;
};

export const putComprobante =  async (comprobante:ComprobanteReq): Promise<ComprobanteRes> => {
    const response = await api.put<ComprobanteRes>("/comprobantes", comprobante);
    return response.data;
};

export const delComprobante =  async (id:string) => {
    await api.delete<ComprobanteRes>(`/comprobantes${id}`);
};

export const getImg = async (): File =>{

}
