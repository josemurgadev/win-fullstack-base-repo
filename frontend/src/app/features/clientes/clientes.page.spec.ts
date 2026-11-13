import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClientesPage, DEBOUNCE_MS } from './clientes.page';
import { CLIENTE_SERVICE } from './services/cliente.service';
import { ClienteHttpService } from './services/cliente-http.service';
import { Cliente } from './models/cliente.model';

const esperar = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const CLIENTE: Cliente = {
  id: 1,
  tipoDocumento: 'RUC',
  numeroDocumento: '20556677881',
  razonSocial: 'WIN TELECOMUNICACIONES S.A.C.',
  segmento: 'CORPORATIVO',
  correo: 'contacto@win.pe'
};

describe('ClientesPage', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesPage],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
      .overrideComponent(ClientesPage, {
        set: { providers: [{ provide: CLIENTE_SERVICE, useClass: ClienteHttpService }] }
      })
      .compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('no llama al API con menos de 3 caracteres', async () => {
    const fixture = TestBed.createComponent(ClientesPage);
    fixture.detectChanges();

    fixture.componentInstance.termino.setValue('wi');
    await esperar(DEBOUNCE_MS + 50);

    httpTesting.expectNone(r => r.url.includes('/clientes/buscar'));
  });

  it('aplica debounce, consulta GET /clientes/buscar?q= y muestra la ficha al seleccionar', async () => {
    const fixture = TestBed.createComponent(ClientesPage);
    const page = fixture.componentInstance;
    fixture.detectChanges();

    page.termino.setValue('wi');
    page.termino.setValue('win');
    page.termino.setValue('win ');
    await esperar(DEBOUNCE_MS + 50);

    const req = httpTesting.expectOne(r => r.url.endsWith('/clientes/buscar'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe('win');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush([CLIENTE]);
    fixture.detectChanges();

    expect(page.resultados()).toEqual([CLIENTE]);

    const opcion = fixture.nativeElement.querySelector('ul button') as HTMLButtonElement;
    opcion.click();
    fixture.detectChanges();

    expect(page.seleccionado()).toEqual(CLIENTE);
    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('contacto@win.pe');
    expect(texto).toContain('20556677881');
  });

  it('muestra el mensaje de error del backend', async () => {
    const fixture = TestBed.createComponent(ClientesPage);
    const page = fixture.componentInstance;
    fixture.detectChanges();

    page.termino.setValue('abc');
    await esperar(DEBOUNCE_MS + 50);

    httpTesting
      .expectOne(r => r.url.endsWith('/clientes/buscar'))
      .flush({ error: 'El término debe tener al menos 3 caracteres.' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    expect(page.error()).toBe('El término debe tener al menos 3 caracteres.');
    expect(page.resultados()).toEqual([]);
  });
});
