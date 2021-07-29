import express from 'express';
import applyMiddleware from './apply-middleware';
import applyRoutes from './apply-routes';

export class REST {
  public readonly app = express();

  public listen() {    
    applyMiddleware(this.app);
    applyRoutes(this.app);

    const port = process.env.API_PORT;
    return this.app.listen(port, () => console.log(`Connected to server on port ${port}`));
  }
}
