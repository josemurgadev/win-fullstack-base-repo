import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

export interface ClienteService {
  buscar(termino: string, limite: number): Observable<Cliente[]>;
}

export const CLIENTE_SERVICE = new InjectionToken<ClienteService>('CLIENTE_SERVICE');
