// src/seed.js — run with: npm run db:seed
import 'dotenv/config';
import prisma from './lib/prisma.js';

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Refusing to seed in production environment.');
  process.exit(1);
}

const paintings = [
  {
    title: 'Golden Hour',
    description: 'A warm, meditative landscape capturing the last light of evening across the Nile Delta. Layered glazes of amber and gold create a luminous depth that shifts with the viewer\'s eye.',
    originalPrice: 1200,
    originalAvailable: true,
    printPrice: 85,
    printAvailable: true,
    category: 'both',
    images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800'],
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
    images: ['https://images.unsplash.com/photo-1516617442634-75371039cb3a?w=800'],
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
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800'],
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
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'],
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
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    dimensions: '40 × 55 cm',
    medium: 'Oil on linen',
    year: 2023,
    featured: true,
    heroImage: true,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.$transaction(async (tx) => {
    await tx.painting.deleteMany();

    for (const painting of paintings) {
      await tx.painting.create({ data: painting });
    }
  });

  console.log(`✅ Seeded ${paintings.length} paintings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
