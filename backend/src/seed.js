// src/seed.js — run with: npm run db:seed
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const paintings = [
  {
    title: 'Golden Hour',
    description: 'A warm, meditative landscape capturing the last light of evening across the Nile Delta. Layered glazes of amber and gold create a luminous depth that shifts with the viewer\'s eye.',
    price: 1200,
    images: ['https://via.placeholder.com/800x1000/c9a96e/ffffff?text=Golden+Hour'],
    dimensions: '80 × 100 cm',
    medium: 'Oil on canvas',
    year: 2024,
    featured: true,
  },
  {
    title: 'Still Life with Pomegranates',
    description: 'A contemporary take on the classical still life tradition. Rich crimson and deep burgundy tones set against a warm neutral ground.',
    price: 850,
    images: ['https://via.placeholder.com/800x900/8b2635/ffffff?text=Pomegranates'],
    dimensions: '60 × 70 cm',
    medium: 'Oil on linen',
    year: 2024,
    featured: true,
  },
  {
    title: 'Quiet Interior',
    description: 'Morning light filters through sheer curtains onto a pale room. A study in restraint and stillness.',
    price: 980,
    images: ['https://via.placeholder.com/800x800/d4c5b2/3d3530?text=Quiet+Interior'],
    dimensions: '70 × 70 cm',
    medium: 'Oil on canvas',
    year: 2023,
    featured: false,
  },
  {
    title: 'Garden Study No. 4',
    description: 'Loose, gestural marks describe a garden in high summer — lush, abundant, almost overwhelming in its beauty.',
    price: 650,
    images: ['https://via.placeholder.com/800x1000/5a7a4a/ffffff?text=Garden+Study'],
    dimensions: '50 × 70 cm',
    medium: 'Oil on panel',
    year: 2024,
    featured: false,
  },
  {
    title: 'Vessel',
    description: 'A solitary ceramic jug, rendered with quiet precision. The object becomes a meditation on form and presence.',
    price: 550,
    images: ['https://via.placeholder.com/600x800/b5a99e/ffffff?text=Vessel'],
    dimensions: '40 × 55 cm',
    medium: 'Oil on linen',
    year: 2023,
    featured: true,
  },
];

async function main() {
  console.log('🌱 Seeding database...');
  for (const painting of paintings) {
    await prisma.painting.upsert({
      where: { id: painting.title.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: painting,
    });
  }
  console.log(`✅ Seeded ${paintings.length} paintings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
