import * as express from 'express';
import { AppMiddleware } from './app.middleware';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const handler = require('./index').handler;

describe('App Module', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use((req, res, next) => {
      const nest = new AppMiddleware(app).use(req, res, next);
      nest
        .then(() => {
          next();
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          next();
        });
    });
  });

  it('should return 200 and OK!', async () => {
    const response = (await handler(
      {
        httpMethod: 'GET',
        path: '/health',
      },
      null,
    )) as { statusCode: number; body: string };
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('OK');
  });
  it('should return 404!', async () => {
    const response = (await handler(
      {
        httpMethod: 'GET',
        path: '/not_existing',
      },
      null,
    )) as { statusCode: number; body: string };
    expect(response.statusCode).toEqual(404);
  });
});
