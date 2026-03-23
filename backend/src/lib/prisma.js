import { PrismaClient } from '@prisma/client';

// Use a global singleton in development to prevent multiple instances
// during hot reloads (nodemon). In production, a single module-level
// instance is safe since the process doesn't restart between requests.
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
