import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { MongoClient, ObjectId } from 'mongodb';
import bootstrap from './src/main.server';

// ── MongoDB Config ────────────────────────────────────────────────────────
const MONGO_URI =
  'mongodb+srv://carlos:Carlos2021%40@bork-idok.rcks2y4.mongodb.net/?appName=bork-idok';
const MONGO_DB_NAME = 'carrerasantuario';
const MONGO_COLLECTION_NAME = 'inscripciones';
const ADMIN_PASSWORD = 'Santuario2026@';

// ── Singleton MongoDB client ──────────────────────────────────────────────
let client: MongoClient | null = null;

async function getCollection() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('✅ MongoDB conectado');
  }
  return client.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME);
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

  // POST /api/inscripciones — crear inscripción
  server.post('/api/inscripciones', async (req, res) => {
    try {
      const col = await getCollection();

      const existing = await col.findOne({
        numeroDocumento: req.body.numeroDocumento,
      });
      if (existing) {
        res
          .status(409)
          .json({
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
      res.status(201).json({
        message: 'Inscripción exitosa',
        id: result.insertedId,
      });
    } catch (err) {
      console.error('Error creando inscripción:', err);
      res.status(500).json({ error: 'Error al registrar la inscripción' });
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
    } catch (err) {
      console.error('Error consultando inscripciones:', err);
      res.status(500).json({ error: 'Error al consultar inscripciones' });
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
      const result = await col.updateOne(
        { _id: new ObjectId(req.params['id']) },
        { $set: { estadoPago: req.body.estadoPago || 'aprobado' } },
      );

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
