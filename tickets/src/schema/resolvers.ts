import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
    Query: { 
      // ticket: () => {
      //   return prisma.ticket.findById();
      // }
      ticket: async (_, { id }, { dataSources }) => {
        return dataSources.ticketAPI.getTicket(id);
      },
      allTickets: async (_, { id }, { dataSources }) => {
        return dataSources.ticketAPI.getTickets();
      },
      Tickets: async (_, { id }, { dataSources }) => {
        return dataSources.ticketAPI.getTickets();
      },
      allTickets: async (_, { id }, { dataSources }) => {
        return dataSources.ticketAPI.getTickets();
      },
    }
  };
  