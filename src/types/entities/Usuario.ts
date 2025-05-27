import type { Cliente } from './Cliente';
import type { Rol } from './enums/Rol';

export interface Usuario {
  idUsuario?: number;       // como Long en Java, usamos number en TS
  auth0Id?: string | null;
  username: string;
  cliente?: Cliente | null;
  rol: Rol; // "ADMIN", "DELIVERY", "CLIENTE", "CAJERO", "COCINERO"
  password?: string; // opcional, si no se maneja en el frontend  
  email?: string; // opcional, si no se maneja en el frontend
}
