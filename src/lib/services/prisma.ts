import { PrismaClient as PrismaClientInit } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClientInit();
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const PrismaClient = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = PrismaClient;
}

export default PrismaClient;
