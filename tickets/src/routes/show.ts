import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '@sgtickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();
const prisma = new PrismaClient()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await prisma.ticket.findUnique({
    where: {
      email
    }
  });

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
