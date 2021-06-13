import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const tickets = await prisma.ticket.findMany();

  res.send(tickets);
});

export { router as indexTicketRouter };
