export interface Articulo {
  idArticulo: number;
  denominacion: string;
  precioVenta: number;
  unidadMedida: UnidadMedida;
  imagenes: Imagen[];
  categoria: Categoria;
  detallesPedido?: DetallePedido[];
  promociones?: Promocion[];
}
