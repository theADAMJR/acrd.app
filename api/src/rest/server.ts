import express from 'express';
import { temp } from '../../../utils/src/utils/temp';

export class REST {
  public readonly app = express();

  public listen() {
    const port = process.env.API_PORT;
    return this.app.listen(port, () => console.log(`Connected to server on port ${port}`));
  }
  
  public serve() {
    const prefix = process.env.API_PREFIX;
    this.app.get(`${prefix}/messages`, (req, res) => res.json(temp.messages));
    this.app.get(`${prefix}/users`, (req, res) => res.json(temp.users));
  }
}
