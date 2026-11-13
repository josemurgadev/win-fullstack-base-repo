import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap } from 'rxjs/operators';
import { CLIENTE_SERVICE } from './services/cliente.service';
import { ClienteHttpService } from './services/cliente-http.service';
import { MockClienteService } from './services/cliente.mock';
import { Cliente } from './models/cliente.model';
import { UiInput } from '../../shared/ui-input';
import { UiBadge } from '../../shared/ui-badge';
import { formatHttpErrorMessage } from '../../core/utils/http-error';
import { environment } from '../../../environments/environment';

export const MIN_CARACTERES = 3;
export const LIMITE_RESULTADOS = 10;
export const DEBOUNCE_MS = 300;

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [ReactiveFormsModule, UiInput, UiBadge],
  providers: [
    {
      provide: CLIENTE_SERVICE,
      useClass: environment.useMock ? MockClienteService : ClienteHttpService
    }
  ],
  templateUrl: './clientes.page.html'
})
export class ClientesPage {
  private readonly service = inject(CLIENTE_SERVICE);

  protected readonly minCaracteres = MIN_CARACTERES;

  readonly termino = new FormControl('', { nonNullable: true });
  readonly resultados = signal<Cliente[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  /** Último término enviado al API (null = aún no se buscó con el término actual). */
  readonly terminoBuscado = signal<string | null>(null);
  readonly seleccionado = signal<Cliente | null>(null);

  constructor() {
    this.termino.valueChanges
      .pipe(
        map(valor => valor.trim()),
        debounceTime(DEBOUNCE_MS),
        distinctUntilChanged(),
        switchMap(q => {
          this.error.set(null);

          if (q.length < MIN_CARACTERES) {
            this.cargando.set(false);
            this.terminoBuscado.set(null);
            return of([] as Cliente[]);
          }

          this.cargando.set(true);
          return this.service.buscar(q, LIMITE_RESULTADOS).pipe(
            map(clientes => {
              this.terminoBuscado.set(q);
              return clientes;
            }),
            catchError(err => {
              this.error.set(formatHttpErrorMessage(err));
              return of([] as Cliente[]);
            }),
            finalize(() => this.cargando.set(false))
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe(clientes => this.resultados.set(clientes));
  }

  seleccionar(cliente: Cliente): void {
    this.seleccionado.set(cliente);
  }

  esSeleccionado(cliente: Cliente): boolean {
    return this.seleccionado()?.id === cliente.id;
  }

  toneSegmento(segmento: string): 'info' | 'pending' | 'success' | 'muted' {
    switch (segmento?.toUpperCase()) {
      case 'CORPORATIVO':
        return 'info';
      case 'PYME':
        return 'pending';
      case 'RESIDENCIAL':
        return 'success';
      default:
        return 'muted';
    }
  }
}
