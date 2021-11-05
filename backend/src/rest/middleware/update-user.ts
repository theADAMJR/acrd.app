import { NextFunction, Request, Response } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.get('Authorization') as string;    
    const id = await deps.users.idFromBearerToken(token);    

    res.locals.user = await deps.users.getSelf(id);
  } finally {
    return next();
  }
}