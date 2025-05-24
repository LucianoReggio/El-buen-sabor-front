import type { Cliente } from './Cliente';

export interface Usuario {
  idUsuario?: number;       // como Long en Java, usamos number en TS
  auth0Id?: string | null;
  username: string;
  cliente?: Cliente | null;
}
