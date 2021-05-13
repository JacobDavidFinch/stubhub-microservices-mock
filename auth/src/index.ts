import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.PG_URI) {
    throw new Error('PG_URI must be defined');
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
