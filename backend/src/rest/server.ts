import express from 'express';
import 'express-async-errors';
import Deps from '../utils/deps';
import { WebSocket } from '../ws/websocket';
import applyMiddleware from './functions/apply-middleware';
import applyRoutes from './functions/apply-routes';
import applyErrorHandling from './functions/apply-error-handling';

export class REST {
  constructor(private ws = Deps.get<WebSocket>(WebSocket)) {
    const app = express();
    const prefix = `/v2`;
    
    applyMiddleware(app);
    applyRoutes(app, prefix);
    applyErrorHandling(app, prefix);

    const port = process.env.PORT || 8080;
    const server = app.listen(port, async () => {
      log.info(`API is running on port ${port}`);
      await this.ws.init(server);
    });
  }
}
