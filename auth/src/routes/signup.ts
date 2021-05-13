import { Password } from './../services/password';
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@sgtickets/common';

const router = express.Router();


router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const prisma = new PrismaClient() 
    const existingUser = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const hashedPw = await Password.toHash(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPw
      } 
    });

    console.log(user)
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
