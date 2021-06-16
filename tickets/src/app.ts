import express from 'express';
import 'express-async-errors';
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers, ticketsAPI } = require('./schema');
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@sgtickets/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

export const server = async () => {
  const app = express();
  
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      moviesAPI: new ticketsAPI(),
    }),
  });
  
  await apolloServer.start();
  
  app.set('trust proxy', true);
  app.use(json());
  app.use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test',
    })
  );
  app.use(currentUser);
  
  app.use(createTicketRouter);
  app.use(showTicketRouter);
  app.use(indexTicketRouter);
  app.use(updateTicketRouter);
  
  app.all('*', async (req, res) => {
    throw new NotFoundError();
  });
  
  app.use(errorHandler);

  return {apolloServer, app}
}

