import { Handler } from 'aws-lambda';
import { createNestApplication } from './bootstrap';

let cachedHandler: Handler;

export const handler: Handler = async (event, context) => {
  if (!cachedHandler) {
    const app = await createNestApplication();
    cachedHandler = app.getHttpAdapter().getInstance();
  }

  return cachedHandler(event, context);
};
