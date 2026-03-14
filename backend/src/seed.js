// src/seed.js — run with: npm run db:seed
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const paintings = [
  {
    title: 'Golden Hour',
    description: 'A warm, meditative landscape capturing the last light of evening across the Nile Delta. Layered glazes of amber and gold create a luminous depth that shifts with the viewer\'s eye.',
    originalPrice: 1200,
    originalAvailable: true,
    printPrice: 85,
    printAvailable: true,
    category: 'both',
    images: ['https://via.placeholder.com/800x1000/c9a96e/ffffff?text=Golden+Hour'],
    dimensions: '80 × 100 cm',
    medium: 'Oil on canvas',
    year: 2024,
    featured: true,
  },
  {
    title: 'Still Life with Pomegranates',
    description: 'A contemporary take on the classical still life tradition. Rich crimson and deep burgundy tones set against a warm neutral ground.',
    originalPrice: 850,
    originalAvailable: true,
    printPrice: 65,
    printAvailable: true,
    category: 'both',
    images: ['https://via.placeholder.com/800x900/8b2635/ffffff?text=Pomegranates'],
    dimensions: '60 × 70 cm',
    medium: 'Oil on linen',
    year: 2024,
    featured: true,
  },
  {
    title: 'Quiet Interior',
    description: 'Morning light filters through sheer curtains onto a pale room. A study in restraint and stillness.',
    originalPrice: 980,
    originalAvailable: true,
    category: 'original',
    images: ['https://via.placeholder.com/800x800/d4c5b2/3d3530?text=Quiet+Interior'],
    dimensions: '70 × 70 cm',
    medium: 'Oil on canvas',
    year: 2023,
    featured: false,
  },
  {
    title: 'Garden Study No. 4',
    description: 'Loose, gestural marks describe a garden in high summer — lush, abundant, almost overwhelming in its beauty.',
    originalPrice: 650,
    originalAvailable: true,
    category: 'original',
    images: ['https://via.placeholder.com/800x1000/5a7a4a/ffffff?text=Garden+Study'],
    dimensions: '50 × 70 cm',
    medium: 'Oil on panel',
    year: 2024,
    featured: false,
  },
  {
    title: 'Vessel',
    description: 'A solitary ceramic jug, rendered with quiet precision. The object becomes a meditation on form and presence.',
    originalPrice: 550,
    originalAvailable: true,
    printPrice: 45,
    printAvailable: true,
    category: 'both',
    images: ['https://via.placeholder.com/600x800/b5a99e/ffffff?text=Vessel'],
    dimensions: '40 × 55 cm',
    medium: 'Oil on linen',
    year: 2023,
    featured: true,
    heroImage: true,
  },
];

async function main() {
  // Only seed if database is empty
  const count = await prisma.painting.count();
  if (count > 0) {
    console.log(`Database already has ${count} paintings, skipping seed.`);
    return;
  }

  console.log('🌱 Seeding database...');
  for (const painting of paintings) {
    await prisma.painting.create({ data: painting });
  }
  console.log(`✅ Seeded ${paintings.length} paintings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
