// prisma.ts

import { PrismaClient as PrismaClientInit } from '@prisma/client';

export const PrismaClient = new PrismaClientInit();

export default PrismaClient;
