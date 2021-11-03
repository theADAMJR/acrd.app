import { NextFunction, Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import { APIError } from '../modules/api-error';

export default (app: Application, prefix: string) => {
  app.all(`/assets/*`, (req, res, next) => next(new APIError(404)));
  app.all(`/${prefix}/*`, (req, res, next) => next(new APIError(404)));

  app.use(`/`, () => { throw new TypeError('Invalid API version number') });
  
  app.use((error: APIError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent)
      return next(error);

    const code = error.code || 400;      
    return res
      .status(code)
      .json({ message: error.message });
  });
}