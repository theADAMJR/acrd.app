import express from 'express';
import 'express-async-errors';
import applyMiddleware from './functions/apply-middleware';
import applyRoutes from './functions/apply-routes';
import applyErrorHandling from './functions/apply-error-handling';

export const app = express();

export class REST {
  constructor() {
    const prefix = `/v2`;
    
    applyMiddleware(app);
    applyRoutes(app, prefix);
    applyErrorHandling(app, prefix);

    const port = process.env.PORT || 8080;
    const server = app.listen(port, async () => {
      log.info(`API is running on port ${port}`);
      await deps.webSocket.init(server);
    });
  }
}
