import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/mock/mock-api';
import { ClienteService } from './cliente.service';
import { Cliente } from '../models/cliente.model';

type ClienteMock = Cliente & { activo: boolean };

@Injectable()
export class MockClienteService implements ClienteService {
  private readonly clientes: ClienteMock[] = [
    { id: 1, tipoDocumento: 'RUC', numeroDocumento: '20556677881', razonSocial: 'WIN TELECOMUNICACIONES S.A.C.', segmento: 'CORPORATIVO', correo: 'contacto@win.pe', activo: true },
    { id: 2, tipoDocumento: 'RUC', numeroDocumento: '20100047218', razonSocial: 'BANCO DE CREDITO DEL PERU', segmento: 'CORPORATIVO', correo: 'empresas@bcp.com.pe', activo: true },
    { id: 3, tipoDocumento: 'RUC', numeroDocumento: '20492145789', razonSocial: 'INVERSIONES TECNOLOGICAS LIMA SUR S.A.C.', segmento: 'PYME', correo: 'gerencia@inversur.pe', activo: true },
    { id: 4, tipoDocumento: 'DNI', numeroDocumento: '45892310', razonSocial: 'CARLOS ALBERTO MENESES ROJAS', segmento: 'RESIDENCIAL', correo: 'cmeneses@gmail.com', activo: true },
    { id: 5, tipoDocumento: 'DNI', numeroDocumento: '72341908', razonSocial: 'MARIA FERNANDA TORRES CASTILLO', segmento: 'RESIDENCIAL', correo: 'mftorres@outlook.com', activo: true },
    { id: 6, tipoDocumento: 'DNI', numeroDocumento: '41229876', razonSocial: 'JORGE LUIS VALDIVIA SALAZAR', segmento: 'RESIDENCIAL', correo: 'jvaldivia@yahoo.com', activo: true },
    { id: 7, tipoDocumento: 'RUC', numeroDocumento: '20601234991', razonSocial: 'CONSTRUCTORA Y SERVICIOS GENERALES ANDINA E.I.R.L.', segmento: 'PYME', correo: 'logistica@andina.pe', activo: true },
    { id: 8, tipoDocumento: 'DNI', numeroDocumento: '09881234', razonSocial: 'CLIENTE HISTORICO DADO DE BAJA', segmento: 'RESIDENCIAL', correo: 'baja@correo.com', activo: false }
  ];

  buscar(termino: string, limite: number): Observable<Cliente[]> {
    const q = termino.trim().toUpperCase();
    if (q.length < 3) {
      return mockError('El término debe tener al menos 3 caracteres.');
    }

    const resultado = this.clientes
      .filter(c => c.activo && (c.numeroDocumento.startsWith(q) || c.razonSocial.includes(q)))
      .sort((a, b) => a.razonSocial.localeCompare(b.razonSocial))
      .slice(0, limite)
      .map(({ activo, ...cliente }) => cliente);

    return mockResponse(resultado);
  }
}
