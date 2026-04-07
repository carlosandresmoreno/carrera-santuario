import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InscripcionPayload {
  correo: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  tipoDocumento: string;
  numeroDocumento: string;
  genero: string;
  eps: string;
  contactoEmergencia: string;
  tallaCamiseta: string;
  distancia: string;
  codigoDescuento?: string;
}

export interface InscripcionStatus {
  nombre: string;
  distancia: string;
  tallaCamiseta: string;
  estadoPago: string;
  fechaInscripcion: string;
}

export interface InscripcionAdmin {
  _id: string;
  correo: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  tipoDocumento: string;
  numeroDocumento: string;
  genero: string;
  eps: string;
  contactoEmergencia: string;
  tallaCamiseta: string;
  distancia: string;
  estadoPago: string;
  fechaInscripcion: string;
  codigoDescuento?: string;
}

@Injectable({ providedIn: 'root' })
export class InscripcionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/inscripciones';

  crear(data: InscripcionPayload): Observable<{ message: string; id: string }> {
    return this.http.post<{ message: string; id: string }>(this.baseUrl, data);
  }

  consultarEstado(cedula: string): Observable<InscripcionStatus> {
    return this.http.get<InscripcionStatus>(this.baseUrl, {
      params: { cedula },
    });
  }

  listarTodas(password: string): Observable<InscripcionAdmin[]> {
    return this.http.get<InscripcionAdmin[]>(this.baseUrl, {
      params: { admin: 'true' },
      headers: new HttpHeaders({ 'x-admin-password': password }),
    });
  }

  aprobarPago(id: string, password: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/${id}`,
      { estadoPago: 'aprobado' },
      { headers: new HttpHeaders({ 'x-admin-password': password }) },
    );
  }

  eliminar(id: string, password: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({ 'x-admin-password': password }),
    });
  }
}
