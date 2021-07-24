export interface Usuario {
    nombre: string;
    uid: string;
}

export interface Producto {
    precio: number;
    cantidad:number;
    color:String;
    descripcion:String;
    genero:String;
    material:String;
    medidas:String;
    tiposMochila:String;
    calificacion: number;
    url: string;
    idFirebase: string;
}

export interface PedidoCarrito {
    id: string;
    usuario: Usuario;
    producto: ProductoPedido[];
    precioTotal: number
    estado: EstadoPedido

}


export interface ProductoPedido {
    producto: Producto;
    cantidad: number;
}
export type EstadoPedido = 'Empacando'|'Enviado' | 'En Camino' | 'Entregado' | 'En Proceso de Envio'