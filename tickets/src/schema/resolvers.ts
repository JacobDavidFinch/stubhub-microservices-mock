import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
    Query: { 
      ticket: () => {
        return prisma.ticket.findById();
      }
    }
  };
  