import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  getDoc,
} from '@angular/fire/firestore';
import { from, Observable, map, switchMap, of, throwError } from 'rxjs';
import emailjs from '@emailjs/browser';

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
  telefono: string;
  ciudad: string;
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

export interface InscripcionAdmin extends InscripcionPayload {
  id: string;
  estadoPago: string;
  fechaInscripcion: string;
}

@Injectable({ providedIn: 'root' })
export class InscripcionService {
  private readonly firestore = inject(Firestore);
  private readonly collectionName = 'inscripciones';
  private readonly ADMIN_PASSWORD = 'Santuario2026@'; // Consistente con el server.ts anterior

  // EmailJS Config (extraído de server.ts)
  private readonly EMAILJS_SERVICE_ID = 'service_umc6ydr';
  private readonly EMAILJS_TEMPLATE_RECIBIDA = 'template_52obge8';
  private readonly EMAILJS_TEMPLATE_CONFIRMADO = 'template_na03y06';
  private readonly EMAILJS_PUBLIC_KEY = 'RRr88Nz56DOBz5hDk';

  constructor() {
    emailjs.init(this.EMAILJS_PUBLIC_KEY);
  }

  crear(data: InscripcionPayload): Observable<{ message: string; id: string }> {
    const colRef = collection(this.firestore, this.collectionName);

    // Verificar si ya existe
    const q = query(colRef, where('numeroDocumento', '==', data.numeroDocumento));

    return from(getDocs(q)).pipe(
      switchMap((snapshot) => {
        if (!snapshot.empty) {
          return throwError(() => ({
            error: { error: 'Ya existe una inscripción con este número de documento' },
          }));
        }

        const newDoc = {
          ...data,
          estadoPago: 'pendiente',
          fechaInscripcion: new Date().toISOString(),
        };

        return from(addDoc(colRef, newDoc)).pipe(
          map((docRef) => {
            // Enviar correo de registro recibido (asíncrono)
            this.sendRegistrationReceivedEmail(newDoc);
            return { message: 'Inscripción exitosa', id: docRef.id };
          })
        );
      })
    );
  }

  consultarEstado(cedula: string): Observable<InscripcionStatus> {
    const colRef = collection(this.firestore, this.collectionName);
    const q = query(colRef, where('numeroDocumento', '==', cedula));

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        if (snapshot.empty) {
          throw new Error('No se encontró inscripción con ese documento');
        }
        const data = snapshot.docs[0].data() as any;
        return {
          nombre: `${data.primerNombre} ${data.primerApellido}`,
          distancia: data.distancia,
          tallaCamiseta: data.tallaCamiseta,
          estadoPago: data.estadoPago,
          fechaInscripcion: data.fechaInscripcion,
        };
      })
    );
  }

  listarTodas(password: string): Observable<InscripcionAdmin[]> {
    if (password !== this.ADMIN_PASSWORD) {
      return throwError(() => new Error('Contraseña incorrecta'));
    }

    const colRef = collection(this.firestore, this.collectionName);
    const q = query(colRef, orderBy('fechaInscripcion', 'desc'));

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({
          ...(doc.data() as InscripcionPayload),
          id: doc.id,
          estadoPago: (doc.data() as any).estadoPago,
          fechaInscripcion: (doc.data() as any).fechaInscripcion,
        }))
      )
    );
  }

  aprobarPago(id: string, password: string): Observable<{ message: string }> {
    return this.actualizar(id, { estadoPago: 'aprobado' }, password);
  }

  actualizar(
    id: string,
    data: Partial<InscripcionAdmin>,
    password: string
  ): Observable<{ message: string }> {
    if (password !== this.ADMIN_PASSWORD) {
      return throwError(() => new Error('Contraseña incorrecta'));
    }

    const docRef = doc(this.firestore, this.collectionName, id);

    return from(getDoc(docRef)).pipe(
      switchMap((docSnap) => {
        if (!docSnap.exists()) {
          return throwError(() => new Error('Inscripción no encontrada'));
        }

        const oldData = docSnap.data();
        return from(updateDoc(docRef, data as any)).pipe(
          map(() => {
            // Si se aprueba el pago, enviar correo
            if (data.estadoPago === 'aprobado' && oldData['estadoPago'] !== 'aprobado') {
              this.sendConfirmationEmail({ ...oldData, ...data });
            }
            return { message: 'Estado actualizado' };
          })
        );
      })
    );
  }

  eliminar(id: string, password: string): Observable<{ message: string }> {
    if (password !== this.ADMIN_PASSWORD) {
      return throwError(() => new Error('Contraseña incorrecta'));
    }

    const docRef = doc(this.firestore, this.collectionName, id);
    return from(deleteDoc(docRef)).pipe(map(() => ({ message: 'Inscripción eliminada' })));
  }

  // ── Email Methods ────────────────────────────────────────────────────────

  sendRegistrationReceivedEmail(inscripcion: any): Promise<any> {
    const qrUrl = 'https://carrera-santuario-5k-10k.onrender.com/assets/paPagar.png';
    let precioNormal = inscripcion.distancia === '10k' ? 120000 : 105000;
    if (inscripcion.codigoDescuento && inscripcion.codigoDescuento.trim() !== '') {
      precioNormal = precioNormal * 0.85;
    }
    const precioFormateado = precioNormal.toLocaleString('es-CO');

    const templateParams = {
      to_email: inscripcion.correo,
      to_name: inscripcion.primerNombre,
      distancia: precioFormateado,
      qrUrl: qrUrl,
    };

    return emailjs
      .send(this.EMAILJS_SERVICE_ID, this.EMAILJS_TEMPLATE_RECIBIDA, templateParams)
      .then(() => {
        console.log('✅ Email de registro enviado');
      })
      .catch((err) => {
        console.error('❌ Error enviando email:', err);
        throw err;
      });
  }

  private sendConfirmationEmail(inscripcion: any) {
    const templateParams = {
      to_email: inscripcion.correo,
      to_name: inscripcion.primerNombre,
      distancia: inscripcion.distancia === '10k' ? '10K' : '5K',
      tallaCamiseta: inscripcion.tallaCamiseta,
    };

    emailjs
      .send(this.EMAILJS_SERVICE_ID, this.EMAILJS_TEMPLATE_CONFIRMADO, templateParams)
      .then(() => console.log('✅ Email de confirmación enviado'))
      .catch((err) => console.error('❌ Error enviando email de confirmación:', err));
  }
}
