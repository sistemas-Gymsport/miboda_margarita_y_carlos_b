/**
 * Seed inicial idempotente.
 * - Crea el administrador desde ADMIN_USERNAME / ADMIN_PASSWORD (hash bcrypt).
 * - Crea la boda inicial solo si aun no existe (no sobrescribe cambios del panel).
 * Uso: npm run seed   (SEED_RESET_ADMIN=true para restablecer la contrasena del admin)
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const bcrypt = require('bcryptjs');
const { DEFAULT_CONTENT, DEFAULT_SECTIONS, DEFAULT_THEME } = require('../src/utils/defaults');
const { zonedTimeToUtc } = require('../src/utils/timezone');

const { createPrismaClient } = require('../src/config/prisma');

const prisma = createPrismaClient();

async function seedAdmin() {
  const username = (process.env.ADMIN_USERNAME || '').trim();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!username || password.length < 8) {
    throw new Error('Define ADMIN_USERNAME y ADMIN_PASSWORD (minimo 8 caracteres) en .env');
  }

  const existing = await prisma.adminUser.findUnique({ where: { username } });
  if (existing && process.env.SEED_RESET_ADMIN !== 'true') {
    console.log(`Administrador "${username}" ya existe (sin cambios).`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash, role: 'ADMIN' },
  });
  console.log(`Administrador "${username}" ${existing ? 'actualizado' : 'creado'}.`);
}

async function seedWedding() {
  const existing = await prisma.wedding.findFirst();
  if (existing) {
    console.log('La boda ya existe (sin cambios).');
    return;
  }

  const eventDate = '2026-11-14';
  const eventTime = '13:30';
  const timezone = 'America/Mexico_City';

  await prisma.wedding.create({
    data: {
      partnerOne: 'Margarita',
      partnerTwo: 'Carlos',
      eventDate,
      eventTime,
      timezone,
      weddingDate: zonedTimeToUtc(eventDate, eventTime, timezone),
      content: DEFAULT_CONTENT,
      sections: DEFAULT_SECTIONS,
      introEnabled: true,
      seoTitle: 'Margarita & Carlos | 14 de noviembre de 2026',
      seoDescription: 'Nos casamos y queremos compartir este día contigo. Consulta todos los detalles de nuestra boda.',
      theme: { create: { ...DEFAULT_THEME } },
      locations: {
        create: [
          {
            type: 'CEREMONY',
            label: 'Ceremonia',
            name: 'Jardín Los Olivos',
            address: 'Av. de los Olivos 120, Querétaro, Qro.',
            date: 'Sábado 14 de noviembre',
            time: '13:30',
            description: 'Acompáñanos a dar el sí en una ceremonia íntima rodeada de naturaleza.',
            mapUrl: 'https://maps.google.com/?q=Queretaro',
            buttonText: 'Ver ubicación',
            sortOrder: 0,
          },
          {
            type: 'RECEPTION',
            label: 'Recepción',
            name: 'Hacienda San Gabriel',
            address: 'Camino Real 45, Querétaro, Qro.',
            date: 'Sábado 14 de noviembre',
            time: '15:00',
            description: 'Celebremos juntos con cena, brindis y baile hasta que la noche lo permita.',
            mapUrl: 'https://maps.google.com/?q=Queretaro',
            buttonText: 'Ver ubicación',
            sortOrder: 1,
          },
        ],
      },
      schedule: {
        create: [
          { title: 'Ceremonia', time: '13:30', description: 'El momento en que decimos sí.', icon: 'rings', sortOrder: 0 },
          { title: 'Recepción', time: '15:00', description: 'Coctel de bienvenida.', icon: 'glass', sortOrder: 1 },
          { title: 'Cena', time: '17:00', description: 'Compartamos la mesa.', icon: 'utensils', sortOrder: 2 },
          { title: 'Baile', time: '19:00', description: 'Que no pare la música.', icon: 'music', sortOrder: 3 },
        ],
      },
      giftRegistry: {
        create: {
          enabled: true,
          title: 'Mesa de regalos',
          description:
            'Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, hemos preparado una mesa de regalos.',
          url: '',
          buttonText: 'Ver mesa de regalos',
        },
      },
      whatsapp: {
        create: {
          enabled: true,
          countryCode: '52',
          phone: '',
          message: 'Confirmo asistencia a nombre de: ',
          buttonText: 'Confirmar asistencia',
          title: 'Confirma tu asistencia',
          description: 'Nos encantaría contar contigo. Por favor confírmanos tu asistencia por WhatsApp.',
          deadline: 'Antes del 31 de octubre',
        },
      },
      bankInfo: {
        create: {
          enabled: false,
          title: 'Datos bancarios',
          description: 'Si prefieres hacernos un regalo en efectivo, puedes utilizar los siguientes datos.',
        },
      },
    },
  });
  console.log('Boda inicial creada: Margarita & Carlos — 14 de noviembre de 2026.');
}

async function main() {
  await seedAdmin();
  await seedWedding();
}

main()
  .catch((error) => {
    console.error('Error en el seed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
