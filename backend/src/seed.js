// src/seed.js — run with: npm run db:seed
import 'dotenv/config';
import prisma from './lib/prisma.js';

const paintings = [
  {
    title: 'Golden Hour',
    description: 'A warm, meditative landscape capturing the last light of evening across the Nile Delta. Layered glazes of amber and gold create a luminous depth that shifts with the viewer\'s eye.',
    originalPrice: 1200,
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80'],
    dimensions: '80 × 100 cm',
    medium: 'Oil on canvas',
    year: 2024,
    featured: true,
  },
  {
    title: 'Still Life with Pomegranates',
    description: 'A contemporary take on the classical still life tradition. Rich crimson and deep burgundy tones set against a warm neutral ground.',
    originalPrice: 850,
    images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80'],
    dimensions: '60 × 70 cm',
    medium: 'Oil on linen',
    year: 2024,
    featured: true,
  },
  {
    title: 'Quiet Interior',
    description: 'Morning light filters through sheer curtains onto a pale room. A study in restraint and stillness.',
    originalPrice: 980,
    images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80'],
    dimensions: '70 × 70 cm',
    medium: 'Oil on canvas',
    year: 2023,
    featured: false,
  },
  {
    title: 'Garden Study No. 4',
    description: 'Loose, gestural marks describe a garden in high summer — lush, abundant, almost overwhelming in its beauty.',
    originalPrice: 650,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    dimensions: '50 × 70 cm',
    medium: 'Oil on panel',
    year: 2024,
    featured: false,
  },
  {
    title: 'Vessel',
    description: 'A solitary ceramic jug, rendered with quiet precision. The object becomes a meditation on form and presence.',
    originalPrice: 550,
    images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80'],
    dimensions: '40 × 55 cm',
    medium: 'Oil on linen',
    year: 2023,
    featured: true,
  },
];

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Seeding is not allowed in production. Set NODE_ENV to development or test.');
    process.exit(1);
  }
  console.info('🌱 Seeding database...');
  await prisma.painting.deleteMany({});
  for (const painting of paintings) {
    await prisma.painting.create({ data: painting });
  }
  console.info(`✅ Seeded ${paintings.length} paintings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
