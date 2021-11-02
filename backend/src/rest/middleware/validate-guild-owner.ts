import { NextFunction, Request, Response } from 'express';
import { APIError } from '../modules/api-error';

export default async (req: Request, res: Response, next: NextFunction) => {
  const userOwnsGuild = res.locals.guild.ownerId === res.locals.user.id;
  if (userOwnsGuild)
    return next();
  throw new APIError(401, 'You do not own this guild!');
}