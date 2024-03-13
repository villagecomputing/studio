// prisma.ts

import { Prisma, PrismaClient as PrismaClientInit } from '@prisma/client';

export const PrismaClient = new PrismaClientInit();

export { Prisma };
export default PrismaClient;
