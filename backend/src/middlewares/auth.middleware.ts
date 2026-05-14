import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido.' });
    return;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    res.status(401).json({ message: 'Token com formato inválido.' });
    return;
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).json({ message: 'Token mal formatado.' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'secret';

  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      res.status(401).json({ message: 'Token inválido.' });
      return;
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    return next();
  });
};
