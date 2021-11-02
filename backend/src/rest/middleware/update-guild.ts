import { NextFunction, Request, Response } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  res.locals.guild = await deps.guilds.get(req.params.id);  
  return next();
}