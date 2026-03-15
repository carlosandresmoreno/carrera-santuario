import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { MongoClient, ObjectId } from 'mongodb';
import emailjs from '@emailjs/nodejs';
import bootstrap from './src/main.server';

// ── MongoDB Config ────────────────────────────────────────────────────────
const MONGO_URI =
  process.env['MONGO_URI'] ||
  'mongodb+srv://carlos:Carlos2021%40@bork-idok.rcks2y4.mongodb.net/?appName=bork-idok';
const MONGO_DB_NAME = 'carrerasantuario';
const MONGO_COLLECTION_NAME = 'inscripciones';
const ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'] || 'Santuario2026@';

// ── Singleton MongoDB client ──────────────────────────────────────────────
let client: MongoClient | null = null;

async function getCollection() {
  try {
    if (!client) {
      console.log('⏳ Intentando conectar a MongoDB...');
      client = new MongoClient(MONGO_URI, {
        connectTimeoutMS: 8000,
        serverSelectionTimeoutMS: 8000,
      });
      await client.connect();
      console.log('✅ MongoDB conectado exitosamente');
    }
    return client.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME);
  } catch (error) {
    console.error('❌ Error de conexión MongoDB:', error);
    client = null; // Reiniciar para el siguiente intento
    throw error;
  }
}
// ── Email Config ──────────────────────────────────────────────────────────
const EMAILJS_KEYS = {
  publicKey: process.env['EMAILJS_PUBLIC_KEY'] || 'RRr88Nz56DOBz5hDk',
  privateKey: process.env['EMAILJS_PRIVATE_KEY'] || 'W2OjEjjCOOdY1npVEINYp',
};

const EMAILJS_SERVICE_ID =
  process.env['EMAILJS_SERVICE_ID'] || 'service_umc6ydr';
const EMAILJS_TEMPLATE_RECIBIDA =
  process.env['EMAILJS_TEMPLATE_RECIBIDA'] || 'template_52obge8';
const EMAILJS_TEMPLATE_CONFIRMADO =
  process.env['EMAILJS_TEMPLATE_CONFIRMADO'] || 'template_na03y06';

async function sendRegistrationReceivedEmail(inscripcion: any) {
  const qrUrl =
    'https://carrera-santuario-5k-10k.onrender.com/assets/paPagar.png';

  const templateParams = {
    to_email: inscripcion.correo,
    to_name: inscripcion.primerNombre,
    distancia: inscripcion.distancia === '10k' ? '120.000' : '85.000',
    qrUrl: qrUrl,
  };

  try {
    console.log(
      `⏳ Intentando enviar email de registro a: ${inscripcion.correo}...`,
    );
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_RECIBIDA,
      templateParams,
      EMAILJS_KEYS,
    );
    console.log(
      `✅ Email de registro enviado a: ${inscripcion.correo}`,
      response.status,
      response.text,
    );
  } catch (error: any) {
    console.error(
      '❌ Error enviando email de registro:',
      error.text || error.message || error,
    );
  }
}

async function sendConfirmationEmail(inscripcion: any) {
  const templateParams = {
    to_email: inscripcion.correo,
    to_name: inscripcion.primerNombre,
    distancia: inscripcion.distancia === '10k' ? '10K' : '5K',
    tallaCamiseta: inscripcion.tallaCamiseta,
  };

  try {
    console.log(
      `⏳ Intentando enviar email de confirmación a: ${inscripcion.correo}...`,
    );
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_CONFIRMADO,
      templateParams,
      EMAILJS_KEYS,
    );
    console.log(
      `✅ Email de confirmación enviado a: ${inscripcion.correo}`,
      response.status,
      response.text,
    );
  } catch (error: any) {
    console.error(
      '❌ Error enviando email de confirmación:',
      error.text || error.message || error,
    );
  }
}

// ── Express app ───────────────────────────────────────────────────────────
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // JSON body parser for API
  server.use(express.json());

  // ── API Routes ────────────────────────────────────────────────────────

  // Salud del servidor
  server.get('/api/health', async (req, res) => {
    try {
      await getCollection();
      res.json({ status: 'ok', db: 'connected', timestamp: new Date() });
    } catch (err: any) {
      res
        .status(500)
        .json({ status: 'error', db: 'disconnected', error: err.message });
    }
  });

  // Debug de rutas para Netlify
  server.get('/api/debug', (req, res) => {
    res.json({
      url: req.url,
      originalUrl: req.originalUrl,
      path: req.path,
      method: req.method,
      headers: req.headers,
      env: {
        hasMongo: !!process.env['MONGO_URI'],
        nodeVersion: process.version,
      },
    });
  });

  // POST /api/inscripciones — crear inscripción
  server.post('/api/inscripciones', async (req, res) => {
    try {
      const col = await getCollection();

      const existing = await col.findOne({
        numeroDocumento: req.body.numeroDocumento,
      });
      if (existing) {
        res.status(409).json({
          error: 'Ya existe una inscripción con este número de documento',
        });
        return;
      }

      const inscripcion = {
        ...req.body,
        estadoPago: 'pendiente',
        fechaInscripcion: new Date().toISOString(),
      };

      const result = await col.insertOne(inscripcion);

      // Enviar correo de registro recibido
      sendRegistrationReceivedEmail(inscripcion);

      res.status(201).json({
        message: 'Inscripción exitosa',
        id: result.insertedId,
      });
    } catch (err: any) {
      console.error('Error creando inscripción:', err);
      res.status(500).json({
        error: 'Error al registrar la inscripción',
        details: err.message,
      });
    }
  });

  // GET /api/inscripciones
  server.get('/api/inscripciones', async (req, res) => {
    try {
      const col = await getCollection();
      const { cedula, admin } = req.query;

      // Admin: listar todas
      if (admin === 'true') {
        const password = req.headers['x-admin-password'] as string;
        if (password !== ADMIN_PASSWORD) {
          res.status(401).json({ error: 'Contraseña incorrecta' });
          return;
        }
        const inscripciones = await col
          .find({})
          .sort({ fechaInscripcion: -1 })
          .toArray();
        res.json(inscripciones);
        return;
      }

      // Public: consultar por cédula
      if (cedula) {
        const inscripcion = await col.findOne({
          numeroDocumento: cedula as string,
        });
        if (!inscripcion) {
          res
            .status(404)
            .json({ error: 'No se encontró inscripción con ese documento' });
          return;
        }
        res.json({
          nombre: `${inscripcion['primerNombre']} ${inscripcion['primerApellido']}`,
          distancia: inscripcion['distancia'],
          tallaCamiseta: inscripcion['tallaCamiseta'],
          estadoPago: inscripcion['estadoPago'],
          fechaInscripcion: inscripcion['fechaInscripcion'],
        });
        return;
      }

      res.status(400).json({ error: 'Falta parámetro: cedula o admin' });
    } catch (err: any) {
      console.error('Error consultando inscripciones:', err);
      res.status(500).json({
        error: 'Error al consultar inscripciones',
        details: err.message,
      });
    }
  });

  // PATCH /api/inscripciones/:id — aprobar pago (admin)
  server.patch('/api/inscripciones/:id', async (req, res) => {
    try {
      const password = req.headers['x-admin-password'] as string;
      if (password !== ADMIN_PASSWORD) {
        res.status(401).json({ error: 'Contraseña incorrecta' });
        return;
      }

      const col = await getCollection();
      const inscripcion = await col.findOne({
        _id: new ObjectId(req.params['id']),
      });

      if (!inscripcion) {
        res.status(404).json({ error: 'Inscripción no encontrada' });
        return;
      }

      const result = await col.updateOne(
        { _id: new ObjectId(req.params['id']) },
        { $set: { estadoPago: req.body.estadoPago || 'aprobado' } },
      );

      if (req.body.estadoPago === 'aprobado' || !req.body.estadoPago) {
        // Enviar correo de confirmación de forma asíncrona
        sendConfirmationEmail(inscripcion);
      }

      if (result.matchedCount === 0) {
        res.status(404).json({ error: 'Inscripción no encontrada' });
        return;
      }

      res.json({ message: 'Estado actualizado' });
    } catch (err) {
      console.error('Error actualizando pago:', err);
      res.status(500).json({ error: 'Error al actualizar el pago' });
    }
  });

  // DELETE /api/inscripciones/:id — eliminar inscripción (admin)
  server.delete('/api/inscripciones/:id', async (req, res) => {
    try {
      const password = req.headers['x-admin-password'] as string;
      if (password !== ADMIN_PASSWORD) {
        res.status(401).json({ error: 'Contraseña incorrecta' });
        return;
      }

      const col = await getCollection();
      const result = await col.deleteOne({
        _id: new ObjectId(req.params['id']),
      });

      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Inscripción no encontrada' });
        return;
      }

      res.json({ message: 'Inscripción eliminada' });
    } catch (err) {
      console.error('Error eliminando inscripción:', err);
      res.status(500).json({ error: 'Error al eliminar la inscripción' });
    }
  });

  // Catch-all para rutas /api no encontradas
  server.all('/api/*', (req, res) => {
    res.status(404).json({
      error: 'Ruta API no encontrada',
      path: req.path,
      method: req.method,
    });
  });

  // ── Static files ──────────────────────────────────────────────────────
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    }),
  );

  // ── Angular SSR ───────────────────────────────────────────────────────
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
