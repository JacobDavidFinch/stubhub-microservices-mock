import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client'
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@sgtickets/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const prisma = new PrismaClient();
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        title: req.body.title, 
        price: req.body.price,
        version: ticket.version + 1
      },
    })

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: updatedTicket.id,
      title: updatedTicket.title,
      price: updatedTicket.price,
      userId: updatedTicket.userId,
      version: updatedTicket.version,
    });

    res.send(updatedTicket);
  }
);

export { router as updateTicketRouter };
