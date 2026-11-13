import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteService } from './cliente.service';
import { Cliente } from '../models/cliente.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ClienteHttpService implements ClienteService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/clientes`;

  buscar(termino: string, limite: number): Observable<Cliente[]> {
    const params = new HttpParams().set('q', termino).set('limit', limite);
    return this.http.get<Cliente[]>(`${this.endpoint}/buscar`, { params });
  }
}
